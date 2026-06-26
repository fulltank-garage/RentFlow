package controllers

import (
	"encoding/csv"
	"encoding/json"
	"errors"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"rentflow-api/config"
	"rentflow-api/middleware"
	"rentflow-api/models"
	"rentflow-api/services"
)

func RentFlowCarPartnerGetBookings(c *gin.Context) {
	tenant, ok := rentFlowRequireOwnerTenant(c)
	if !ok {
		return
	}

	var bookings []models.RentFlowCarBooking
	query := config.DB.Where("tenant_id = ?", tenant.ID)
	if status := strings.TrimSpace(c.Query("status")); status != "" && status != "all" {
		query = query.Where("status = ?", status)
	}
	if err := query.Order("created_at DESC").Find(&bookings).Error; err != nil {
		rentFlowError(c, http.StatusInternalServerError, "ไม่สามารถดึงข้อมูลการจองได้")
		return
	}

	carNames := rentFlowPartnerCarNames(tenant.ID)
	items := make([]gin.H, 0, len(bookings))
	for _, booking := range bookings {
		items = append(items, rentFlowPartnerBookingResponse(booking, carNames[booking.CarID]))
	}
	rentFlowSuccess(c, http.StatusOK, "ดึงข้อมูลการจองสำเร็จ", gin.H{"items": items, "total": len(items)})
}

func RentFlowCarPartnerUpdateBookingStatus(c *gin.Context) {
	tenant, ok := rentFlowRequireOwnerTenant(c)
	if !ok {
		return
	}

	var payload struct {
		Status string `json:"status"`
		Note   string `json:"note"`
	}
	if err := c.ShouldBindJSON(&payload); err != nil {
		rentFlowError(c, http.StatusBadRequest, "ข้อมูลสถานะการจองไม่ถูกต้อง")
		return
	}
	status := rentFlowNormalizeBookingStatus(payload.Status)
	if status == "" {
		rentFlowError(c, http.StatusBadRequest, "สถานะการจองไม่ถูกต้อง")
		return
	}

	var booking models.RentFlowCarBooking
	if err := config.DB.Where("tenant_id = ? AND (id = ? OR booking_code = ?)", tenant.ID, c.Param("bookingId"), c.Param("bookingId")).First(&booking).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			rentFlowError(c, http.StatusNotFound, "ไม่พบรายการจอง")
			return
		}
		rentFlowError(c, http.StatusInternalServerError, "ไม่สามารถค้นหาการจองได้")
		return
	}

	updates := map[string]interface{}{"status": status, "updated_at": time.Now()}
	if strings.TrimSpace(payload.Note) != "" {
		updates["note"] = strings.TrimSpace(payload.Note)
	}
	if err := config.DB.Model(&models.RentFlowCarBooking{}).Where("tenant_id = ? AND id = ?", tenant.ID, booking.ID).Updates(updates).Error; err != nil {
		rentFlowError(c, http.StatusInternalServerError, "ไม่สามารถอัปเดตการจองได้")
		return
	}
	booking.Status = status
	if note := strings.TrimSpace(payload.Note); note != "" {
		booking.Note = note
	}
	if status == "active" || status == "review" || status == "completed" || status == "cancelled" {
		changed, car, err := rentFlowSyncCarOperationalStatusTx(config.DB, tenant.ID, booking.CarID)
		if err != nil {
			rentFlowError(c, http.StatusInternalServerError, "ไม่สามารถอัปเดตสถานะรถได้")
			return
		}
		if changed {
			rentFlowPublishCarStatusRealtime(tenant.ID, car)
		}
	}
	rentFlowAudit(c, tenant.ID, "booking.update_status", "booking", booking.ID, "status="+status)
	rentFlowCreateNotification(tenant.ID, booking.UserID, booking.CustomerEmail, "อัปเดตสถานะการจอง", "การจอง "+booking.BookingCode+" เปลี่ยนสถานะเป็น "+status)

	services.CacheDeleteByPrefix(config.Ctx, services.RentFlowCarCarsCachePrefix())
	rentFlowPublishBookingRealtime(services.RentFlowCarRealtimeEventBookingUpdated, booking)
	rentFlowSuccess(c, http.StatusOK, "อัปเดตการจองสำเร็จ", rentFlowPartnerBookingResponse(booking, rentFlowPartnerCarNames(tenant.ID)[booking.CarID]))
}

func RentFlowCarPartnerGetBookingOperations(c *gin.Context) {
	tenant, ok := rentFlowRequireOwnerTenant(c)
	if !ok {
		return
	}

	booking, ok := rentFlowPartnerLoadBooking(c, tenant.ID, c.Param("bookingId"))
	if !ok {
		return
	}

	var operations []models.RentFlowCarBookingOperation
	if err := config.DB.Where("tenant_id = ? AND booking_id = ?", tenant.ID, booking.ID).Order("created_at ASC").Find(&operations).Error; err != nil {
		rentFlowError(c, http.StatusInternalServerError, "ไม่สามารถดึงประวัติงานรถได้")
		return
	}
	rentFlowSuccess(c, http.StatusOK, "ดึงประวัติงานรถสำเร็จ", gin.H{"items": rentFlowBookingOperationResponses(operations), "total": len(operations)})
}

func RentFlowCarPartnerCreateBookingOperation(c *gin.Context) {
	tenant, ok := rentFlowRequireOwnerTenant(c)
	if !ok {
		return
	}
	user, _ := middleware.CurrentRentFlowCarUser(c)

	booking, ok := rentFlowPartnerLoadBooking(c, tenant.ID, c.Param("bookingId"))
	if !ok {
		return
	}

	var payload struct {
		Type          string   `json:"type"`
		Checklist     []string `json:"checklist"`
		ChecklistJSON string   `json:"checklistJson"`
		Odometer      int64    `json:"odometer"`
		FuelLevel     string   `json:"fuelLevel"`
		DamageNote    string   `json:"damageNote"`
		FineAmount    int64    `json:"fineAmount"`
		StaffNote     string   `json:"staffNote"`
		NextStatus    string   `json:"nextStatus"`
	}
	if err := c.ShouldBindJSON(&payload); err != nil {
		rentFlowError(c, http.StatusBadRequest, "ข้อมูลงานรถไม่ถูกต้อง")
		return
	}

	operationType := rentFlowNormalizeBookingOperationType(payload.Type)
	if operationType == "" {
		rentFlowError(c, http.StatusBadRequest, "ประเภทงานรถไม่ถูกต้อง")
		return
	}
	checklistJSON := strings.TrimSpace(payload.ChecklistJSON)
	if checklistJSON == "" && len(payload.Checklist) > 0 {
		if raw, err := json.Marshal(payload.Checklist); err == nil {
			checklistJSON = string(raw)
		}
	}

	operation := models.RentFlowCarBookingOperation{
		ID:            services.NewID("bop"),
		TenantID:      tenant.ID,
		BookingID:     booking.ID,
		Type:          operationType,
		ChecklistJSON: checklistJSON,
		Odometer:      payload.Odometer,
		FuelLevel:     strings.TrimSpace(payload.FuelLevel),
		DamageNote:    strings.TrimSpace(payload.DamageNote),
		FineAmount:    payload.FineAmount,
		StaffNote:     strings.TrimSpace(payload.StaffNote),
		CreatedBy:     user.ID,
	}

	nextStatus := rentFlowNormalizeBookingStatus(payload.NextStatus)
	if nextStatus == "" {
		nextStatus = rentFlowBookingStatusForOperation(operationType, booking.Status)
	}

	carStatusChanged := false
	var statusCar models.RentFlowCarCar
	if err := config.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&operation).Error; err != nil {
			return err
		}
		if nextStatus != "" && nextStatus != booking.Status {
			if err := tx.Model(&models.RentFlowCarBooking{}).Where("tenant_id = ? AND id = ?", tenant.ID, booking.ID).Updates(map[string]interface{}{
				"status":     nextStatus,
				"updated_at": time.Now(),
			}).Error; err != nil {
				return err
			}
			booking.Status = nextStatus
		}
		if nextStatus == "active" || nextStatus == "review" || nextStatus == "completed" || nextStatus == "cancelled" {
			changed, car, err := rentFlowSyncCarOperationalStatusTx(tx, tenant.ID, booking.CarID)
			if err != nil {
				return err
			}
			carStatusChanged = changed
			statusCar = car
		}
		return nil
	}); err != nil {
		rentFlowError(c, http.StatusInternalServerError, "ไม่สามารถบันทึกงานรถได้")
		return
	}

	rentFlowAudit(c, tenant.ID, "booking.operation.create", "booking_operation", operation.ID, operationType)
	services.CacheDeleteByPrefix(config.Ctx, services.RentFlowCarCarsCachePrefix())
	rentFlowPublishBookingRealtime(services.RentFlowCarRealtimeEventBookingUpdated, booking)
	rentFlowPublishCarRealtime(tenant.ID, booking.CarID, services.RentFlowCarRealtimeEventAvailabilityChange)
	if carStatusChanged {
		rentFlowPublishCarStatusRealtime(tenant.ID, statusCar)
	}
	rentFlowSuccess(c, http.StatusCreated, "บันทึกงานรถสำเร็จ", gin.H{
		"operation": rentFlowBookingOperationResponse(operation),
		"booking":   rentFlowPartnerBookingResponse(booking, rentFlowPartnerCarNames(tenant.ID)[booking.CarID]),
	})
}

func rentFlowSyncCarOperationalStatusTx(tx *gorm.DB, tenantID, carID string) (bool, models.RentFlowCarCar, error) {
	if strings.TrimSpace(carID) == "" {
		return false, models.RentFlowCarCar{}, nil
	}

	var car models.RentFlowCarCar
	if err := tx.Where("tenant_id = ? AND id = ?", tenantID, carID).First(&car).Error; err != nil {
		return false, models.RentFlowCarCar{}, err
	}

	currentStatus := strings.TrimSpace(strings.ToLower(car.Status))
	if currentStatus == "maintenance" || currentStatus == "hidden" {
		return false, car, nil
	}

	var activeCount int64
	if err := tx.Model(&models.RentFlowCarBooking{}).
		Where("tenant_id = ? AND car_id = ?", tenantID, carID).
		Where("status IN ?", []string{"active", "review"}).
		Count(&activeCount).Error; err != nil {
		return false, models.RentFlowCarCar{}, err
	}

	status := "available"
	isAvailable := true
	if activeCount >= int64(rentFlowCarUnitCount(car)) {
		status = "rented"
		isAvailable = false
	}

	changed := car.Status != status || car.IsAvailable != isAvailable
	if err := tx.Model(&models.RentFlowCarCar{}).Where("tenant_id = ? AND id = ?", tenantID, carID).Updates(map[string]interface{}{
		"status":       status,
		"is_available": isAvailable,
		"updated_at":   time.Now(),
	}).Error; err != nil {
		return false, models.RentFlowCarCar{}, err
	}

	car.Status = status
	car.IsAvailable = isAvailable
	return changed, car, nil
}

func RentFlowCarPartnerGetPayments(c *gin.Context) {
	tenant, ok := rentFlowRequireOwnerTenant(c)
	if !ok {
		return
	}

	var payments []models.RentFlowCarPayment
	query := config.DB.Where("tenant_id = ?", tenant.ID)
	if status := strings.TrimSpace(c.Query("status")); status != "" && status != "all" {
		query = query.Where("status = ?", status)
	}
	if err := query.Order("created_at DESC").Find(&payments).Error; err != nil {
		rentFlowError(c, http.StatusInternalServerError, "ไม่สามารถดึงข้อมูลชำระเงินได้")
		return
	}

	bookingByID := rentFlowPartnerBookingsByID(tenant.ID)
	items := make([]gin.H, 0, len(payments))
	for _, payment := range payments {
		items = append(items, rentFlowPartnerPaymentResponse(payment, bookingByID[payment.BookingID]))
	}
	rentFlowSuccess(c, http.StatusOK, "ดึงข้อมูลชำระเงินสำเร็จ", gin.H{"items": items, "total": len(items)})
}

func RentFlowCarPartnerVerifyPayment(c *gin.Context) {
	rentFlowPartnerUpdatePayment(c, "paid", "payment.verify")
}

func RentFlowCarPartnerRefundPayment(c *gin.Context) {
	rentFlowPartnerUpdatePayment(c, "refunded", "payment.refund")
}

func RentFlowCarPartnerSettlePayment(c *gin.Context) {
	rentFlowPartnerUpdatePayment(c, "paid", "payment.settle")
}

func rentFlowPartnerUpdatePayment(c *gin.Context, status, action string) {
	tenant, ok := rentFlowRequireOwnerTenant(c)
	if !ok {
		return
	}
	user, _ := middleware.CurrentRentFlowCarUser(c)

	var payload struct {
		SlipURL      string `json:"slipUrl"`
		RefundAmount int64  `json:"refundAmount"`
		Note         string `json:"note"`
	}
	_ = c.ShouldBindJSON(&payload)

	var payment models.RentFlowCarPayment
	if err := config.DB.Where("tenant_id = ? AND id = ?", tenant.ID, c.Param("paymentId")).First(&payment).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			rentFlowError(c, http.StatusNotFound, "ไม่พบรายการชำระเงิน")
			return
		}
		rentFlowError(c, http.StatusInternalServerError, "ไม่สามารถค้นหาการชำระเงินได้")
		return
	}

	now := time.Now()
	updates := map[string]interface{}{"updated_at": now}
	switch action {
	case "payment.verify":
		updates["status"] = status
		updates["verified_by"] = user.ID
		updates["verified_at"] = &now
	case "payment.refund":
		updates["refund_status"] = "refunded"
		updates["refund_amount"] = payload.RefundAmount
		if payload.RefundAmount <= 0 || payload.RefundAmount > payment.Amount {
			updates["refund_amount"] = payment.Amount
		}
	case "payment.settle":
		updates["payout_status"] = "settled"
		updates["settled_at"] = &now
	}

	if err := config.DB.Model(&models.RentFlowCarPayment{}).Where("tenant_id = ? AND id = ?", tenant.ID, payment.ID).Updates(updates).Error; err != nil {
		rentFlowError(c, http.StatusInternalServerError, "ไม่สามารถอัปเดตการชำระเงินได้")
		return
	}
	rentFlowAudit(c, tenant.ID, action, "payment", payment.ID, strings.TrimSpace(payload.Note))
	if updatedPayment, err := rentFlowPaymentByID(tenant.ID, payment.ID); err == nil {
		rentFlowPublishPaymentRealtime(services.RentFlowCarRealtimeEventPaymentUpdated, updatedPayment)
	} else {
		rentFlowPublishPaymentRealtime(services.RentFlowCarRealtimeEventPaymentUpdated, payment)
	}
	rentFlowSuccess(c, http.StatusOK, "อัปเดตการชำระเงินสำเร็จ", nil)
}

func RentFlowCarPartnerGetCustomers(c *gin.Context) {
	tenant, ok := rentFlowRequireOwnerTenant(c)
	if !ok {
		return
	}

	var bookings []models.RentFlowCarBooking
	if err := config.DB.Where("tenant_id = ?", tenant.ID).Order("created_at DESC").Find(&bookings).Error; err != nil {
		rentFlowError(c, http.StatusInternalServerError, "ไม่สามารถดึงข้อมูลลูกค้าได้")
		return
	}

	customerMap := map[string]gin.H{}
	for _, booking := range bookings {
		key := strings.TrimSpace(strings.ToLower(booking.CustomerEmail))
		if key == "" {
			key = booking.CustomerPhone
		}
		row, ok := customerMap[key]
		if !ok {
			row = gin.H{
				"name":          booking.CustomerName,
				"email":         booking.CustomerEmail,
				"phone":         booking.CustomerPhone,
				"bookings":      0,
				"totalAmount":   int64(0),
				"lastBookingAt": booking.CreatedAt,
			}
			customerMap[key] = row
		}
		row["bookings"] = row["bookings"].(int) + 1
		row["totalAmount"] = row["totalAmount"].(int64) + booking.TotalAmount
		if booking.CreatedAt.After(row["lastBookingAt"].(time.Time)) {
			row["lastBookingAt"] = booking.CreatedAt
		}
	}

	items := make([]gin.H, 0, len(customerMap))
	for _, row := range customerMap {
		items = append(items, row)
	}
	sort.Slice(items, func(i, j int) bool {
		return items[i]["totalAmount"].(int64) > items[j]["totalAmount"].(int64)
	})
	rentFlowSuccess(c, http.StatusOK, "ดึงข้อมูลลูกค้าสำเร็จ", gin.H{"items": items, "total": len(items)})
}

func RentFlowCarPartnerGetReports(c *gin.Context) {
	tenant, ok := rentFlowRequireOwnerTenant(c)
	if !ok {
		return
	}

	var cars []models.RentFlowCarCar
	var branches []models.RentFlowCarBranch
	var bookings []models.RentFlowCarBooking
	var payments []models.RentFlowCarPayment
	var reviews []models.RentFlowCarReview
	_ = config.DB.Where("tenant_id = ?", tenant.ID).Find(&cars).Error
	_ = config.DB.Where("tenant_id = ?", tenant.ID).Find(&branches).Error
	_ = config.DB.Where("tenant_id = ?", tenant.ID).Find(&bookings).Error
	_ = config.DB.Where("tenant_id = ?", tenant.ID).Find(&payments).Error
	_ = config.DB.Where("tenant_id = ?", tenant.ID).Find(&reviews).Error

	rentFlowSuccess(c, http.StatusOK, "ดึงรายงานสำเร็จ", rentFlowBuildPartnerDashboard(tenant, cars, branches, bookings, payments, reviews))
}

func RentFlowCarPartnerExportReports(c *gin.Context) {
	tenant, ok := rentFlowRequireOwnerTenant(c)
	if !ok {
		return
	}

	query := config.DB.Where("tenant_id = ?", tenant.ID)
	if from, err := services.ParseDateTime(c.Query("from")); err == nil {
		query = query.Where("created_at >= ?", from)
	}
	if to, err := services.ParseDateTime(c.Query("to")); err == nil {
		query = query.Where("created_at <= ?", to)
	}

	var bookings []models.RentFlowCarBooking
	if err := query.Order("created_at DESC").Find(&bookings).Error; err != nil {
		rentFlowError(c, http.StatusInternalServerError, "ไม่สามารถส่งออกรายงานได้")
		return
	}

	carNames := rentFlowPartnerCarNames(tenant.ID)
	fileName := "rentflow-report-" + time.Now().Format("20060102-150405") + ".csv"
	c.Header("Content-Type", "text/csv; charset=utf-8")
	c.Header("Content-Disposition", "attachment; filename="+fileName)
	writer := csv.NewWriter(c.Writer)
	_ = writer.Write([]string{"รหัสการจอง", "รถ", "สถานะ", "ชื่อลูกค้า", "เบอร์โทร", "วันรับรถ", "วันคืนรถ", "ยอดรวม"})
	for _, booking := range bookings {
		_ = writer.Write([]string{
			booking.BookingCode,
			carNames[booking.CarID],
			booking.Status,
			booking.CustomerName,
			booking.CustomerPhone,
			booking.PickupDate.Format("02/01/2006 15:04"),
			booking.ReturnDate.Format("02/01/2006 15:04"),
			strconv.FormatInt(booking.TotalAmount, 10),
		})
	}
	writer.Flush()
}

func RentFlowCarPartnerGetCalendar(c *gin.Context) {
	tenant, ok := rentFlowRequireOwnerTenant(c)
	if !ok {
		return
	}
	var bookings []models.RentFlowCarBooking
	var blocks []models.RentFlowCarAvailabilityBlock
	if err := config.DB.Where("tenant_id = ?", tenant.ID).Order("pickup_date ASC").Find(&bookings).Error; err != nil {
		rentFlowError(c, http.StatusInternalServerError, "ไม่สามารถดึงปฏิทินได้")
		return
	}
	if err := config.DB.Where("tenant_id = ?", tenant.ID).Order("start_date ASC").Find(&blocks).Error; err != nil {
		rentFlowError(c, http.StatusInternalServerError, "ไม่สามารถดึงวันปิดรับจองได้")
		return
	}
	carNames := rentFlowPartnerCarNames(tenant.ID)
	items := make([]gin.H, 0, len(bookings))
	for _, booking := range bookings {
		items = append(items, rentFlowPartnerBookingResponse(booking, carNames[booking.CarID]))
	}
	rentFlowSuccess(c, http.StatusOK, "ดึงปฏิทินสำเร็จ", gin.H{"bookings": items, "blocks": blocks})
}

func RentFlowCarPartnerCreateAvailabilityBlock(c *gin.Context) {
	tenant, ok := rentFlowRequireOwnerTenant(c)
	if !ok {
		return
	}
	var payload struct {
		CarID       string `json:"carId"`
		BranchID    string `json:"branchId"`
		StartDate   string `json:"startDate"`
		EndDate     string `json:"endDate"`
		BlockType   string `json:"blockType"`
		BufferHours int    `json:"bufferHours"`
		Reason      string `json:"reason"`
		Note        string `json:"note"`
	}
	if err := c.ShouldBindJSON(&payload); err != nil {
		rentFlowError(c, http.StatusBadRequest, "ข้อมูลวันปิดรับจองไม่ถูกต้อง")
		return
	}
	startDate, err := services.ParseDateTime(payload.StartDate)
	if err != nil {
		rentFlowError(c, http.StatusBadRequest, "วันเริ่มต้นไม่ถูกต้อง")
		return
	}
	endDate, err := services.ParseDateTime(payload.EndDate)
	if err != nil || !endDate.After(startDate) {
		rentFlowError(c, http.StatusBadRequest, "วันสิ้นสุดไม่ถูกต้อง")
		return
	}
	reason := strings.TrimSpace(payload.Reason)
	if reason == "" {
		reason = "maintenance"
	}
	block := models.RentFlowCarAvailabilityBlock{
		ID:          services.NewID("blk"),
		TenantID:    tenant.ID,
		CarID:       strings.TrimSpace(payload.CarID),
		BranchID:    strings.TrimSpace(payload.BranchID),
		StartDate:   startDate,
		EndDate:     endDate,
		BlockType:   rentFlowNormalizeAvailabilityBlockType(payload.BlockType),
		BufferHours: payload.BufferHours,
		Reason:      reason,
		Note:        strings.TrimSpace(payload.Note),
	}
	if err := config.DB.Create(&block).Error; err != nil {
		rentFlowError(c, http.StatusInternalServerError, "ไม่สามารถบันทึกวันปิดรับจองได้")
		return
	}
	rentFlowAudit(c, tenant.ID, "availability_block.create", "availability_block", block.ID, block.Reason)
	services.CacheDeleteByPrefix(config.Ctx, services.RentFlowCarCarsCachePrefix())
	rentFlowPublishCarRealtime(tenant.ID, block.CarID, services.RentFlowCarRealtimeEventAvailabilityChange)
	rentFlowSuccess(c, http.StatusCreated, "บันทึกวันปิดรับจองสำเร็จ", block)
}

func RentFlowCarPartnerDeleteAvailabilityBlock(c *gin.Context) {
	tenant, ok := rentFlowRequireOwnerTenant(c)
	if !ok {
		return
	}
	result := config.DB.Where("tenant_id = ? AND id = ?", tenant.ID, c.Param("blockId")).Delete(&models.RentFlowCarAvailabilityBlock{})
	if result.Error != nil {
		rentFlowError(c, http.StatusInternalServerError, "ไม่สามารถลบวันปิดรับจองได้")
		return
	}
	if result.RowsAffected == 0 {
		rentFlowError(c, http.StatusNotFound, "ไม่พบวันปิดรับจอง")
		return
	}
	rentFlowAudit(c, tenant.ID, "availability_block.delete", "availability_block", c.Param("blockId"), "")
	services.CacheDeleteByPrefix(config.Ctx, services.RentFlowCarCarsCachePrefix())
	rentFlowPublishCarRealtime(tenant.ID, "", services.RentFlowCarRealtimeEventAvailabilityChange)
	rentFlowSuccess(c, http.StatusOK, "ลบวันปิดรับจองสำเร็จ", nil)
}

func RentFlowCarPartnerListDomains(c *gin.Context) {
	tenant, ok := rentFlowRequireOwnerTenant(c)
	if !ok {
		return
	}
	var domains []models.RentFlowCarCustomDomain
	if err := config.DB.Where("tenant_id = ?", tenant.ID).Order("created_at DESC").Find(&domains).Error; err != nil {
		rentFlowError(c, http.StatusInternalServerError, "ไม่สามารถดึงโดเมนได้")
		return
	}
	rentFlowSuccess(c, http.StatusOK, "ดึงโดเมนสำเร็จ", gin.H{"items": domains, "total": len(domains)})
}

func RentFlowCarPartnerCreateDomain(c *gin.Context) {
	tenant, ok := rentFlowRequireOwnerTenant(c)
	if !ok {
		return
	}
	var payload struct {
		Domain string `json:"domain"`
	}
	if err := c.ShouldBindJSON(&payload); err != nil {
		rentFlowError(c, http.StatusBadRequest, "ข้อมูลโดเมนไม่ถูกต้อง")
		return
	}
	domain := strings.Trim(strings.ToLower(payload.Domain), ". ")
	if domain == "" || strings.Contains(domain, "/") {
		rentFlowError(c, http.StatusBadRequest, "ชื่อโดเมนไม่ถูกต้อง")
		return
	}
	item := models.RentFlowCarCustomDomain{
		ID:              services.NewID("dom"),
		TenantID:        tenant.ID,
		Domain:          domain,
		Status:          "pending",
		VerificationTXT: "rentflow-verify=" + services.NewID("verify"),
	}
	if err := config.DB.Create(&item).Error; err != nil {
		rentFlowError(c, http.StatusConflict, "โดเมนนี้ถูกใช้งานแล้วหรือบันทึกไม่ได้")
		return
	}
	rentFlowAudit(c, tenant.ID, "domain.create", "domain", item.ID, domain)
	rentFlowSuccess(c, http.StatusCreated, "เพิ่มโดเมนสำเร็จ", item)
}

func RentFlowCarPartnerVerifyDomain(c *gin.Context) {
	tenant, ok := rentFlowRequireOwnerTenant(c)
	if !ok {
		return
	}
	now := time.Now()
	result := config.DB.Model(&models.RentFlowCarCustomDomain{}).
		Where("tenant_id = ? AND id = ?", tenant.ID, c.Param("domainId")).
		Updates(map[string]interface{}{"status": "verified", "verified_at": &now, "updated_at": now})
	if result.Error != nil {
		rentFlowError(c, http.StatusInternalServerError, "ไม่สามารถยืนยันโดเมนได้")
		return
	}
	if result.RowsAffected == 0 {
		rentFlowError(c, http.StatusNotFound, "ไม่พบโดเมน")
		return
	}
	rentFlowAudit(c, tenant.ID, "domain.verify", "domain", c.Param("domainId"), "")
	rentFlowSuccess(c, http.StatusOK, "ยืนยันโดเมนสำเร็จ", nil)
}

func RentFlowCarPartnerDeleteDomain(c *gin.Context) {
	tenant, ok := rentFlowRequireOwnerTenant(c)
	if !ok {
		return
	}
	result := config.DB.Where("tenant_id = ? AND id = ?", tenant.ID, c.Param("domainId")).Delete(&models.RentFlowCarCustomDomain{})
	if result.Error != nil {
		rentFlowError(c, http.StatusInternalServerError, "ไม่สามารถลบโดเมนได้")
		return
	}
	if result.RowsAffected == 0 {
		rentFlowError(c, http.StatusNotFound, "ไม่พบโดเมน")
		return
	}
	rentFlowAudit(c, tenant.ID, "domain.delete", "domain", c.Param("domainId"), "")
	rentFlowSuccess(c, http.StatusOK, "ลบโดเมนสำเร็จ", nil)
}

func RentFlowCarPartnerGetAuditLogs(c *gin.Context) {
	tenant, ok := rentFlowRequireOwnerTenant(c)
	if !ok {
		return
	}
	var logs []models.RentFlowCarAuditLog
	if err := config.DB.Where("tenant_id = ?", tenant.ID).Order("created_at DESC").Limit(100).Find(&logs).Error; err != nil {
		rentFlowError(c, http.StatusInternalServerError, "ไม่สามารถดึงประวัติการใช้งานได้")
		return
	}
	rentFlowSuccess(c, http.StatusOK, "ดึงประวัติการใช้งานสำเร็จ", gin.H{"items": logs, "total": len(logs)})
}

func RentFlowCarAdminListTenants(c *gin.Context) {
	if !rentFlowRequirePlatformAdmin(c) {
		return
	}
	items, err := rentFlowPlatformTenantItems()
	if err != nil {
		rentFlowError(c, http.StatusInternalServerError, "ไม่สามารถดึงข้อมูลร้านได้")
		return
	}
	rentFlowSuccess(c, http.StatusOK, "ดึงข้อมูลร้านสำเร็จ", gin.H{"items": items, "total": len(items)})
}

func RentFlowCarAdminUpdateTenantStatus(c *gin.Context) {
	if !rentFlowRequirePlatformAdmin(c) {
		return
	}
	var payload struct {
		Status           string `json:"status"`
		BookingMode      string `json:"bookingMode"`
		ChatThresholdTHB *int64 `json:"chatThresholdTHB"`
		Plan             string `json:"plan"`
		Reason           string `json:"reason"`
	}
	if err := c.ShouldBindJSON(&payload); err != nil {
		rentFlowError(c, http.StatusBadRequest, "ข้อมูลร้านไม่ถูกต้อง")
		return
	}

	var tenant models.RentFlowCarTenant
	if err := config.DB.Where("id = ?", c.Param("tenantId")).First(&tenant).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			rentFlowError(c, http.StatusNotFound, "ไม่พบร้านที่ต้องการอัปเดต")
			return
		}
		rentFlowError(c, http.StatusInternalServerError, "ไม่สามารถค้นหาข้อมูลร้านได้")
		return
	}

	status := strings.TrimSpace(payload.Status)
	if status == "" {
		status = tenant.Status
	}
	if status != "active" && status != "suspended" && status != "pending" && status != "rejected" {
		rentFlowError(c, http.StatusBadRequest, "สถานะร้านไม่ถูกต้อง")
		return
	}

	bookingMode := rentFlowNormalizeBookingMode(tenant.BookingMode)
	if strings.TrimSpace(payload.BookingMode) != "" {
		bookingMode = rentFlowNormalizeBookingMode(payload.BookingMode)
	}

	now := time.Now()
	plan := tenant.Plan
	if strings.TrimSpace(payload.Plan) != "" {
		plan = rentFlowNormalizePlatformPartnerPlan(payload.Plan)
	}
	chatThresholdTHB := tenant.ChatThresholdTHB
	if payload.ChatThresholdTHB != nil {
		chatThresholdTHB = max(*payload.ChatThresholdTHB, int64(0))
	}
	updates := map[string]interface{}{
		"status":             status,
		"booking_mode":       bookingMode,
		"chat_threshold_thb": chatThresholdTHB,
		"plan":               plan,
		"lifecycle_reason":   strings.TrimSpace(payload.Reason),
		"updated_at":         now,
	}
	switch status {
	case "active":
		updates["approved_at"] = &now
		updates["suspended_at"] = nil
		updates["rejected_at"] = nil
	case "suspended":
		updates["suspended_at"] = &now
	case "rejected":
		updates["rejected_at"] = &now
	}
	if err := config.DB.Model(&models.RentFlowCarTenant{}).Where("id = ?", tenant.ID).Updates(updates).Error; err != nil {
		rentFlowError(c, http.StatusInternalServerError, "ไม่สามารถอัปเดตร้านได้")
		return
	}

	tenant.Status = status
	tenant.BookingMode = bookingMode
	tenant.ChatThresholdTHB = chatThresholdTHB
	tenant.Plan = plan
	tenant.LifecycleReason = strings.TrimSpace(payload.Reason)
	tenant.UpdatedAt = now
	services.CacheDeleteByPrefix(config.Ctx, services.RentFlowCarCarsCachePrefix())
	rentFlowAudit(c, tenant.ID, "platform.tenant_settings", "tenant", tenant.ID, status+"|"+bookingMode)
	services.RentFlowCarPublishRealtime(services.RentFlowCarRealtimeEvent{
		Type:     services.RentFlowCarRealtimeEventTenantUpdated,
		TenantID: tenant.ID,
		EntityID: tenant.ID,
		Data: gin.H{
			"id":               tenant.ID,
			"status":           tenant.Status,
			"bookingMode":      tenant.BookingMode,
			"chatThresholdTHB": tenant.ChatThresholdTHB,
			"domainSlug":       tenant.DomainSlug,
		},
	})
	rentFlowSuccess(c, http.StatusOK, "อัปเดตร้านสำเร็จ", gin.H{
		"tenant": gin.H{
			"id":               tenant.ID,
			"shopName":         tenant.ShopName,
			"domainSlug":       tenant.DomainSlug,
			"publicDomain":     tenant.PublicDomain,
			"status":           tenant.Status,
			"bookingMode":      rentFlowNormalizeBookingMode(tenant.BookingMode),
			"chatThresholdTHB": tenant.ChatThresholdTHB,
			"plan":             tenant.Plan,
			"lifecycleReason":  tenant.LifecycleReason,
			"updatedAt":        tenant.UpdatedAt,
		},
	})
}

func rentFlowPaymentByID(tenantID, paymentID string) (models.RentFlowCarPayment, error) {
	var payment models.RentFlowCarPayment
	err := config.DB.Where("tenant_id = ? AND id = ?", tenantID, paymentID).First(&payment).Error
	return payment, err
}

func rentFlowNormalizeBookingStatus(status string) string {
	switch strings.TrimSpace(strings.ToLower(status)) {
	case "pending", "confirmed", "paid", "active", "completed", "cancelled", "review":
		return strings.TrimSpace(strings.ToLower(status))
	default:
		return ""
	}
}

func rentFlowPartnerLoadBooking(c *gin.Context, tenantID, id string) (models.RentFlowCarBooking, bool) {
	var booking models.RentFlowCarBooking
	if err := config.DB.Where("tenant_id = ? AND (id = ? OR booking_code = ?)", tenantID, id, id).First(&booking).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			rentFlowError(c, http.StatusNotFound, "ไม่พบรายการจอง")
			return models.RentFlowCarBooking{}, false
		}
		rentFlowError(c, http.StatusInternalServerError, "ไม่สามารถค้นหาการจองได้")
		return models.RentFlowCarBooking{}, false
	}
	return booking, true
}

func rentFlowNormalizeBookingOperationType(value string) string {
	switch strings.TrimSpace(strings.ToLower(value)) {
	case "inspection", "handover", "return", "damage", "fine", "note":
		return strings.TrimSpace(strings.ToLower(value))
	default:
		return ""
	}
}

func rentFlowNormalizeAvailabilityBlockType(value string) string {
	switch strings.TrimSpace(strings.ToLower(value)) {
	case "maintenance", "buffer", "manual", "holiday", "inspection":
		return strings.TrimSpace(strings.ToLower(value))
	default:
		return "maintenance"
	}
}

func rentFlowBookingStatusForOperation(operationType, currentStatus string) string {
	switch operationType {
	case "handover":
		return "active"
	case "return":
		return "completed"
	case "damage", "fine":
		return "review"
	default:
		return currentStatus
	}
}

func rentFlowBookingOperationResponses(items []models.RentFlowCarBookingOperation) []gin.H {
	result := make([]gin.H, 0, len(items))
	for _, item := range items {
		result = append(result, rentFlowBookingOperationResponse(item))
	}
	return result
}

func rentFlowBookingOperationResponse(item models.RentFlowCarBookingOperation) gin.H {
	var checklist []string
	if strings.TrimSpace(item.ChecklistJSON) != "" {
		_ = json.Unmarshal([]byte(item.ChecklistJSON), &checklist)
	}
	return gin.H{
		"id":         item.ID,
		"tenantId":   item.TenantID,
		"bookingId":  item.BookingID,
		"type":       item.Type,
		"checklist":  checklist,
		"odometer":   item.Odometer,
		"fuelLevel":  item.FuelLevel,
		"damageNote": item.DamageNote,
		"fineAmount": item.FineAmount,
		"staffNote":  item.StaffNote,
		"createdBy":  item.CreatedBy,
		"createdAt":  item.CreatedAt,
		"updatedAt":  item.UpdatedAt,
	}
}

func rentFlowPartnerCarNames(tenantID string) map[string]string {
	var cars []models.RentFlowCarCar
	_ = config.DB.Where("tenant_id = ?", tenantID).Find(&cars).Error
	result := map[string]string{}
	for _, car := range cars {
		result[car.ID] = car.Name
	}
	return result
}

func rentFlowPartnerBookingsByID(tenantID string) map[string]models.RentFlowCarBooking {
	var bookings []models.RentFlowCarBooking
	_ = config.DB.Where("tenant_id = ?", tenantID).Find(&bookings).Error
	result := map[string]models.RentFlowCarBooking{}
	for _, booking := range bookings {
		result[booking.ID] = booking
	}
	return result
}

func rentFlowPartnerBookingResponse(booking models.RentFlowCarBooking, carName string) gin.H {
	return gin.H{
		"id":             booking.ID,
		"tenantId":       booking.TenantID,
		"bookingCode":    booking.BookingCode,
		"carId":          booking.CarID,
		"carName":        carName,
		"status":         booking.Status,
		"pickupDate":     booking.PickupDate,
		"returnDate":     booking.ReturnDate,
		"pickupLocation": booking.PickupLocation,
		"returnLocation": booking.ReturnLocation,
		"pickupMethod":   booking.PickupMethod,
		"returnMethod":   booking.ReturnMethod,
		"totalDays":      booking.TotalDays,
		"totalAmount":    booking.TotalAmount,
		"customerName":   booking.CustomerName,
		"customerEmail":  booking.CustomerEmail,
		"customerPhone":  booking.CustomerPhone,
		"note":           booking.Note,
		"createdAt":      booking.CreatedAt,
		"updatedAt":      booking.UpdatedAt,
	}
}

func rentFlowPartnerPaymentResponse(payment models.RentFlowCarPayment, booking models.RentFlowCarBooking) gin.H {
	return gin.H{
		"id":               payment.ID,
		"tenantId":         payment.TenantID,
		"bookingId":        payment.BookingID,
		"bookingCode":      booking.BookingCode,
		"customerName":     booking.CustomerName,
		"method":           payment.Method,
		"status":           payment.Status,
		"amount":           payment.Amount,
		"transactionId":    payment.TransactionID,
		"paymentUrl":       payment.PaymentURL,
		"qrCodeUrl":        payment.QRCodeURL,
		"processor":        payment.Processor,
		"cardLast4":        payment.CardLast4,
		"cardHolder":       payment.CardHolder,
		"processedAt":      payment.ProcessedAt,
		"failureReason":    payment.FailureReason,
		"slipUrl":          rentFlowPaymentSlipURL(payment),
		"verifiedBy":       payment.VerifiedBy,
		"verifiedAt":       payment.VerifiedAt,
		"refundStatus":     payment.RefundStatus,
		"refundAmount":     payment.RefundAmount,
		"payoutStatus":     payment.PayoutStatus,
		"settledAt":        payment.SettledAt,
		"settlementPeriod": payment.SettlementPeriod,
		"settlementNote":   payment.SettlementNote,
		"createdAt":        payment.CreatedAt,
		"updatedAt":        payment.UpdatedAt,
	}
}

func rentFlowAudit(c *gin.Context, tenantID, action, entity, entityID, detail string) {
	actorID := rentFlowCurrentActorID(c)
	actorEmail := rentFlowCurrentActorEmail(c)
	log := models.RentFlowCarAuditLog{
		ID:         services.NewID("aud"),
		TenantID:   tenantID,
		ActorID:    actorID,
		ActorEmail: actorEmail,
		Action:     action,
		Entity:     entity,
		EntityID:   entityID,
		Detail:     strings.TrimSpace(detail),
		IP:         c.ClientIP(),
		UserAgent:  c.Request.UserAgent(),
	}
	_ = config.DB.Create(&log).Error
}

func rentFlowRequirePlatformAdmin(c *gin.Context) bool {
	if _, ok := middleware.CurrentRentFlowCarPlatformAdmin(c); ok {
		return true
	}
	user, ok := middleware.CurrentRentFlowCarUser(c)
	if !ok {
		rentFlowError(c, http.StatusUnauthorized, "กรุณาเข้าสู่ระบบก่อน")
		return false
	}
	if !services.IsRentFlowCarPlatformAdmin(user) {
		rentFlowError(c, http.StatusForbidden, "ไม่มีสิทธิ์จัดการระบบกลาง")
		return false
	}
	return true
}

func rentFlowCurrentActorID(c *gin.Context) string {
	if user, ok := middleware.CurrentRentFlowCarUser(c); ok {
		return user.ID
	}
	if _, ok := middleware.CurrentRentFlowCarPlatformAdmin(c); ok {
		return "platform_admin"
	}
	return ""
}

func rentFlowCurrentActorEmail(c *gin.Context) string {
	if user, ok := middleware.CurrentRentFlowCarUser(c); ok {
		return user.Email
	}
	if admin, ok := middleware.CurrentRentFlowCarPlatformAdmin(c); ok {
		return admin.AdminEmail
	}
	return ""
}
