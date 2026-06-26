package controllers

import (
	"encoding/json"
	"errors"
	"net/http"
	"path/filepath"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
	"rentflow-api/config"
	"rentflow-api/models"
	"rentflow-api/services"
)

func RentFlowCarGetStorefrontPage(c *gin.Context) {
	scope := "tenant"
	tenantID := ""
	if rentFlowIsMarketplaceRequest(c) {
		scope = "marketplace"
	} else {
		tenant, ok := rentFlowRequireTenant(c)
		if !ok {
			return
		}
		tenantID = tenant.ID
	}
	page := rentFlowStorefrontPageName(c.Query("page"))
	item, err := rentFlowLoadStorefrontPage(scope, tenantID, page)
	if err != nil {
		rentFlowError(c, http.StatusInternalServerError, "ไม่สามารถดึงหน้าร้านได้")
		return
	}
	rentFlowSuccess(c, http.StatusOK, "ดึงหน้าร้านสำเร็จ", rentFlowStorefrontPageResponse(item))
}

func RentFlowCarPartnerGetStorefrontPage(c *gin.Context) {
	tenant, ok := rentFlowRequireOwnerTenant(c)
	if !ok {
		return
	}
	item, err := rentFlowLoadStorefrontPage("tenant", tenant.ID, rentFlowStorefrontPageName(c.Query("page")))
	if err != nil {
		rentFlowError(c, http.StatusInternalServerError, "ไม่สามารถดึงหน้าร้านได้")
		return
	}
	rentFlowSuccess(c, http.StatusOK, "ดึงหน้าร้านสำเร็จ", rentFlowStorefrontPageResponse(item))
}

func RentFlowCarPartnerUpdateStorefrontPage(c *gin.Context) {
	tenant, ok := rentFlowRequireOwnerTenant(c)
	if !ok {
		return
	}
	rentFlowUpsertStorefrontPage(c, "tenant", tenant.ID)
}

func RentFlowCarPartnerUploadStorefrontBlockImage(c *gin.Context) {
	tenant, ok := rentFlowRequireOwnerTenant(c)
	if !ok {
		return
	}

	form, err := c.MultipartForm()
	if err != nil {
		rentFlowError(c, http.StatusBadRequest, "ข้อมูลรูปภาพไม่ถูกต้อง")
		return
	}
	files := rentFlowUploadedImageFiles(form)
	if len(files) == 0 {
		rentFlowError(c, http.StatusBadRequest, "กรุณาเลือกรูปภาพ")
		return
	}

	blob, mimeType, err := rentFlowImageBlobFromUpload(files[0])
	if err != nil {
		rentFlowError(c, http.StatusBadRequest, err.Error())
		return
	}

	image := models.RentFlowCarStorefrontBlockImage{
		ID:       services.NewID("sfbimg"),
		TenantID: tenant.ID,
		FileName: filepath.Base(strings.TrimSpace(files[0].Filename)),
		MimeType: mimeType,
		Blob:     blob,
	}
	if err := config.DB.Create(&image).Error; err != nil {
		rentFlowError(c, http.StatusInternalServerError, "ไม่สามารถบันทึกรูปภาพได้")
		return
	}

	rentFlowAudit(c, tenant.ID, "storefront_block_image.upload", "storefront_block_image", image.ID, "")
	rentFlowPublishCarRealtime(tenant.ID, "", services.RentFlowCarRealtimeEventTenantUpdated)
	rentFlowSuccess(c, http.StatusOK, "อัปโหลดรูปภาพสำเร็จ", rentFlowStorefrontBlockImageResponse(tenant, image))
}

func RentFlowCarGetStorefrontBlockImage(c *gin.Context) {
	slug := rentFlowNormalizeDomainSlug(c.Param("tenantSlug"))
	imageID := strings.TrimSpace(c.Param("imageId"))
	if slug == "" || imageID == "" {
		rentFlowError(c, http.StatusNotFound, "ไม่พบรูปภาพ")
		return
	}

	var tenant models.RentFlowCarTenant
	if err := config.DB.Where("status = ? AND domain_slug = ?", "active", slug).First(&tenant).Error; err != nil {
		rentFlowError(c, http.StatusNotFound, "ไม่พบรูปภาพ")
		return
	}

	var image models.RentFlowCarStorefrontBlockImage
	if err := config.DB.Where("tenant_id = ? AND id = ?", tenant.ID, imageID).First(&image).Error; err != nil {
		rentFlowError(c, http.StatusNotFound, "ไม่พบรูปภาพ")
		return
	}
	if len(image.Blob) == 0 || strings.TrimSpace(image.MimeType) == "" {
		rentFlowError(c, http.StatusNotFound, "ไม่พบรูปภาพ")
		return
	}

	rentFlowSendImageBlob(c, image.MimeType, image.Blob)
}

func RentFlowCarAdminGetStorefrontPage(c *gin.Context) {
	if !rentFlowRequirePlatformAdmin(c) {
		return
	}
	item, err := rentFlowLoadStorefrontPage("marketplace", "", rentFlowStorefrontPageName(c.Query("page")))
	if err != nil {
		rentFlowError(c, http.StatusInternalServerError, "ไม่สามารถดึงหน้าเว็บรวมได้")
		return
	}
	rentFlowSuccess(c, http.StatusOK, "ดึงหน้าเว็บรวมสำเร็จ", rentFlowStorefrontPageResponse(item))
}

func RentFlowCarAdminUpdateStorefrontPage(c *gin.Context) {
	if !rentFlowRequirePlatformAdmin(c) {
		return
	}
	rentFlowUpsertStorefrontPage(c, "marketplace", "")
}

func rentFlowUpsertStorefrontPage(c *gin.Context, scope, tenantID string) {
	var payload struct {
		Page        string      `json:"page"`
		Theme       interface{} `json:"theme"`
		ThemeJSON   string      `json:"themeJson"`
		Blocks      interface{} `json:"blocks"`
		BlocksJSON  string      `json:"blocksJson"`
		IsPublished *bool       `json:"isPublished"`
	}
	if err := c.ShouldBindJSON(&payload); err != nil {
		rentFlowError(c, http.StatusBadRequest, "ข้อมูลหน้าร้านไม่ถูกต้อง")
		return
	}

	themeJSON, ok := rentFlowJSONFromPayload(payload.Theme, payload.ThemeJSON)
	if !ok {
		rentFlowError(c, http.StatusBadRequest, "ธีมหน้าร้านไม่ถูกต้อง")
		return
	}
	blocksJSON, ok := rentFlowJSONFromPayload(payload.Blocks, payload.BlocksJSON)
	if !ok {
		rentFlowError(c, http.StatusBadRequest, "บล็อกหน้าร้านไม่ถูกต้อง")
		return
	}
	isPublished := true
	if payload.IsPublished != nil {
		isPublished = *payload.IsPublished
	}
	now := time.Now()
	page := rentFlowStorefrontPageName(payload.Page)

	item, err := rentFlowLoadStorefrontPage(scope, tenantID, page)
	if err != nil {
		rentFlowError(c, http.StatusInternalServerError, "ไม่สามารถตรวจสอบหน้าร้านได้")
		return
	}
	if item.ID == "" {
		item.ID = services.NewID("sfp")
		item.Scope = scope
		item.TenantID = tenantID
		item.Page = page
	}
	item.ThemeJSON = themeJSON
	item.BlocksJSON = blocksJSON
	item.IsPublished = isPublished
	if isPublished {
		item.PublishedAt = &now
	}

	if err := config.DB.Save(&item).Error; err != nil {
		rentFlowError(c, http.StatusInternalServerError, "ไม่สามารถบันทึกหน้าร้านได้")
		return
	}
	services.CacheDeleteByPrefix(config.Ctx, services.RentFlowCarCarsCachePrefix())
	rentFlowAudit(c, tenantID, "storefront_page.update", "storefront_page", item.ID, scope+"|"+page)
	if tenantID != "" {
		rentFlowPublishCarRealtime(tenantID, "", services.RentFlowCarRealtimeEventTenantUpdated)
	}
	rentFlowSuccess(c, http.StatusOK, "บันทึกหน้าร้านสำเร็จ", rentFlowStorefrontPageResponse(item))
}

func rentFlowLoadStorefrontPage(scope, tenantID, page string) (models.RentFlowCarStorefrontPage, error) {
	var item models.RentFlowCarStorefrontPage
	query := config.DB.Where("scope = ? AND page = ?", scope, page)
	if scope == "tenant" {
		query = query.Where("tenant_id = ?", tenantID)
	} else {
		query = query.Where("tenant_id = ''")
	}
	err := query.First(&item).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return models.RentFlowCarStorefrontPage{
			Scope:       scope,
			TenantID:    tenantID,
			Page:        page,
			ThemeJSON:   "{}",
			BlocksJSON:  "[]",
			IsPublished: true,
		}, nil
	}
	return item, err
}

func rentFlowStorefrontPageName(value string) string {
	value = strings.TrimSpace(strings.ToLower(value))
	if value == "" {
		return "home"
	}
	return value
}

func rentFlowJSONFromPayload(value interface{}, raw string) (string, bool) {
	raw = strings.TrimSpace(raw)
	if raw != "" {
		var parsed interface{}
		if err := json.Unmarshal([]byte(raw), &parsed); err != nil {
			return "", false
		}
		return raw, true
	}
	if value == nil {
		return "", true
	}
	encoded, err := json.Marshal(value)
	if err != nil {
		return "", false
	}
	return string(encoded), true
}

func rentFlowStorefrontPageResponse(item models.RentFlowCarStorefrontPage) gin.H {
	var theme interface{} = gin.H{}
	var blocks interface{} = []interface{}{}
	if strings.TrimSpace(item.ThemeJSON) != "" {
		_ = json.Unmarshal([]byte(item.ThemeJSON), &theme)
	}
	if strings.TrimSpace(item.BlocksJSON) != "" {
		_ = json.Unmarshal([]byte(item.BlocksJSON), &blocks)
	}
	return gin.H{
		"id":          item.ID,
		"tenantId":    item.TenantID,
		"scope":       item.Scope,
		"page":        item.Page,
		"theme":       theme,
		"blocks":      blocks,
		"isPublished": item.IsPublished,
		"publishedAt": item.PublishedAt,
		"createdAt":   item.CreatedAt,
		"updatedAt":   item.UpdatedAt,
	}
}

func rentFlowStorefrontBlockImageURL(tenant *models.RentFlowCarTenant, imageID string) string {
	if tenant == nil || tenant.DomainSlug == "" || strings.TrimSpace(imageID) == "" {
		return ""
	}
	return "/tenants/" + tenant.DomainSlug + "/storefront-images/" + imageID
}

func rentFlowStorefrontBlockImageResponse(tenant *models.RentFlowCarTenant, image models.RentFlowCarStorefrontBlockImage) gin.H {
	return gin.H{
		"id":        image.ID,
		"tenantId":  image.TenantID,
		"imageUrl":  rentFlowStorefrontBlockImageURL(tenant, image.ID),
		"fileName":  image.FileName,
		"mimeType":  image.MimeType,
		"size":      len(image.Blob),
		"createdAt": image.CreatedAt,
		"updatedAt": image.UpdatedAt,
	}
}
