package controllers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"rentflow-api/middleware"
	"rentflow-api/models"
	"rentflow-api/services"
)

func RentFlowCarRealtimeSocket(c *gin.Context) {
	app := services.RentFlowCarNormalizeAppName(firstNonBlank(
		c.Query("app"),
		c.GetHeader(services.RentFlowCarAppHeaderName),
	))

	filter := services.RentFlowCarRealtimeClientFilter{
		App:         app,
		Marketplace: rentFlowIsMarketplaceRequest(c),
	}

	if user, ok := middleware.CurrentRentFlowCarUser(c); ok {
		filter.UserID = user.ID
		filter.UserEmail = user.Email
	}

	switch app {
	case services.RentFlowCarAppAdmin:
		if _, ok := middleware.CurrentRentFlowCarPlatformAdmin(c); ok {
			break
		}
		user, ok := middleware.CurrentRentFlowCarUser(c)
		if !ok || !services.IsRentFlowCarPlatformAdmin(user) {
			rentFlowError(c, http.StatusUnauthorized, "กรุณาเข้าสู่ระบบผู้ดูแลก่อน")
			return
		}
	case services.RentFlowCarAppPartner:
		tenant, err := rentFlowCurrentUserTenant(c)
		if err != nil {
			rentFlowError(c, http.StatusUnauthorized, "กรุณาเข้าสู่ระบบ Partner ก่อน")
			return
		}
		filter.TenantID = tenant.ID
	default:
		if tenant, err := rentFlowTenantFromRequest(c, false); err == nil && tenant != nil {
			filter.TenantID = tenant.ID
		}
	}

	if err := services.RentFlowCarServeRealtime(c.Writer, c.Request, filter); err != nil {
		return
	}
}

func firstNonBlank(values ...string) string {
	for _, value := range values {
		if strings.TrimSpace(value) != "" {
			return value
		}
	}
	return ""
}

func rentFlowPublishBookingRealtime(eventType string, booking models.RentFlowCarBooking) {
	userID := ""
	if booking.UserID != nil {
		userID = *booking.UserID
	}
	services.RentFlowCarPublishRealtime(services.RentFlowCarRealtimeEvent{
		Type:      eventType,
		TenantID:  booking.TenantID,
		UserID:    userID,
		UserEmail: booking.CustomerEmail,
		EntityID:  booking.ID,
		Data: gin.H{
			"id":          booking.ID,
			"bookingCode": booking.BookingCode,
			"carId":       booking.CarID,
			"status":      booking.Status,
		},
	})
	rentFlowPublishCarRealtime(booking.TenantID, booking.CarID, services.RentFlowCarRealtimeEventAvailabilityChange)
}

func rentFlowPublishPaymentRealtime(eventType string, payment models.RentFlowCarPayment) {
	services.RentFlowCarPublishRealtime(services.RentFlowCarRealtimeEvent{
		Type:     eventType,
		TenantID: payment.TenantID,
		EntityID: payment.ID,
		Data: gin.H{
			"id":        payment.ID,
			"bookingId": payment.BookingID,
			"status":    payment.Status,
			"amount":    payment.Amount,
		},
	})
}

func rentFlowPublishCarRealtime(tenantID, carID, eventType string) {
	if strings.TrimSpace(eventType) == "" {
		eventType = services.RentFlowCarRealtimeEventCarChanged
	}
	services.RentFlowCarPublishRealtime(services.RentFlowCarRealtimeEvent{
		Type:     eventType,
		TenantID: tenantID,
		EntityID: carID,
		Data: gin.H{
			"carId": carID,
		},
	})
}

func rentFlowPublishCarStatusRealtime(tenantID string, car models.RentFlowCarCar) {
	unitCount := rentFlowCarUnitCount(car)
	availableUnits := unitCount
	if strings.TrimSpace(strings.ToLower(car.Status)) != "available" || !car.IsAvailable {
		availableUnits = 0
	}

	services.RentFlowCarPublishRealtime(services.RentFlowCarRealtimeEvent{
		Type:     services.RentFlowCarRealtimeEventCarStatusChanged,
		TenantID: tenantID,
		EntityID: car.ID,
		Data: gin.H{
			"carId":              car.ID,
			"status":             car.Status,
			"availabilityStatus": car.Status,
			"isAvailable":        car.IsAvailable && availableUnits > 0,
			"unitCount":          unitCount,
			"availableUnits":     availableUnits,
		},
	})
}

func rentFlowPublishSupportRealtime(tenantID, ticketID, eventType string) {
	services.RentFlowCarPublishRealtime(services.RentFlowCarRealtimeEvent{
		Type:     eventType,
		TenantID: tenantID,
		EntityID: ticketID,
		Data: gin.H{
			"ticketId": ticketID,
		},
	})
}

func rentFlowPublishEntityRealtime(tenantID, entityID, eventType, entity string) {
	services.RentFlowCarPublishRealtime(services.RentFlowCarRealtimeEvent{
		Type:     eventType,
		TenantID: tenantID,
		EntityID: entityID,
		Data: gin.H{
			"id":     entityID,
			"entity": entity,
		},
	})
}
