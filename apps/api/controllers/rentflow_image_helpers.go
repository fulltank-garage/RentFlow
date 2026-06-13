package controllers

import (
	"encoding/base64"
	"errors"
	"io"
	"mime/multipart"
	"net/http"
	"net/url"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"rentflow-api/config"
	"rentflow-api/models"
)

func rentFlowUserAvatarURL(user models.RentFlowUser) string {
	if len(user.AvatarBlob) == 0 || strings.TrimSpace(user.AvatarMimeType) == "" {
		return ""
	}
	return "/users/" + url.PathEscape(user.ID) + "/avatar?v=" + url.QueryEscape(user.UpdatedAt.UTC().Format(time.RFC3339Nano))
}

func rentFlowTenantLogoURL(tenant models.RentFlowTenant) string {
	if len(tenant.LogoBlob) == 0 || strings.TrimSpace(tenant.LogoMimeType) == "" {
		return ""
	}
	return "/tenants/" + url.PathEscape(tenant.DomainSlug) + "/logo?v=" + url.QueryEscape(tenant.UpdatedAt.UTC().Format(time.RFC3339Nano))
}

func rentFlowTenantPromoImageURL(tenant models.RentFlowTenant) string {
	if len(tenant.PromoImageBlob) == 0 || strings.TrimSpace(tenant.PromoImageMimeType) == "" {
		return ""
	}
	return "/tenants/" + url.PathEscape(tenant.DomainSlug) + "/promo-image?v=" + url.QueryEscape(tenant.UpdatedAt.UTC().Format(time.RFC3339Nano))
}

func rentFlowTenantLineOAQRCodeURL(tenant models.RentFlowTenant) string {
	if len(tenant.LineOAQRBlob) == 0 || strings.TrimSpace(tenant.LineOAQRMimeType) == "" {
		return ""
	}
	return "/tenants/" + url.PathEscape(tenant.DomainSlug) + "/line-oa-qr?v=" + url.QueryEscape(tenant.UpdatedAt.UTC().Format(time.RFC3339Nano))
}

func rentFlowTenantPromoImageURLByImage(tenant models.RentFlowTenant, image models.RentFlowTenantPromoImage) string {
	if len(image.Blob) == 0 || strings.TrimSpace(image.MimeType) == "" {
		return ""
	}
	version := image.UpdatedAt.UTC().Format(time.RFC3339Nano)
	if image.UpdatedAt.IsZero() {
		version = strconv.Itoa(image.DisplayOrder)
	}
	return "/tenants/" + url.PathEscape(tenant.DomainSlug) + "/promo-images/" + url.PathEscape(image.ID) + "?v=" + url.QueryEscape(version)
}

func rentFlowTenantPromoImageURLs(tenant models.RentFlowTenant) []string {
	var images []models.RentFlowTenantPromoImage
	if err := config.DB.
		Where("tenant_id = ?", tenant.ID).
		Order("display_order ASC, created_at ASC").
		Find(&images).Error; err == nil && len(images) > 0 {
		urls := make([]string, 0, len(images))
		for _, image := range images {
			if imageURL := rentFlowTenantPromoImageURLByImage(tenant, image); imageURL != "" {
				urls = append(urls, imageURL)
			}
		}
		if len(urls) > 0 {
			return urls
		}
	}

	if fallback := rentFlowTenantPromoImageURL(tenant); fallback != "" {
		return []string{fallback}
	}
	return []string{}
}

func rentFlowPlatformImageURL(setting models.RentFlowPlatformSetting) string {
	if len(setting.ImageBlob) == 0 || strings.TrimSpace(setting.ImageMimeType) == "" {
		return ""
	}
	return "/platform/settings/marketplace-promo-image?v=" + url.QueryEscape(setting.UpdatedAt.UTC().Format(time.RFC3339Nano))
}

func rentFlowPaymentSlipURL(payment models.RentFlowPayment) string {
	if len(payment.SlipBlob) == 0 || strings.TrimSpace(payment.SlipMimeType) == "" {
		return ""
	}
	return "/payment-slips/" + url.PathEscape(payment.ID) + "?v=" + url.QueryEscape(payment.UpdatedAt.UTC().Format(time.RFC3339Nano))
}

func rentFlowUserResponse(user models.RentFlowUser) gin.H {
	return gin.H{
		"id":        user.ID,
		"username":  user.Username,
		"firstName": user.FirstName,
		"lastName":  user.LastName,
		"name":      user.Name,
		"email":     user.Email,
		"phone":     user.Phone,
		"avatarUrl": rentFlowUserAvatarURL(user),
		"createdAt": user.CreatedAt,
		"updatedAt": user.UpdatedAt,
	}
}

func rentFlowDecodeDataURLImage(source string) ([]byte, string, error) {
	if !strings.HasPrefix(source, "data:") {
		return nil, "", errors.New("ข้อมูลรูปภาพไม่ถูกต้อง")
	}

	commaIndex := strings.Index(source, ",")
	if commaIndex < 0 {
		return nil, "", errors.New("ข้อมูลรูปภาพไม่ถูกต้อง")
	}

	meta := source[:commaIndex]
	data := source[commaIndex+1:]
	if !strings.Contains(meta, ";base64") {
		return nil, "", errors.New("รูปภาพต้องอยู่ในรูปแบบ base64")
	}
	declaredMimeType := strings.TrimPrefix(strings.Split(strings.TrimPrefix(meta, "data:"), ";")[0], " ")

	decoded, err := base64.StdEncoding.DecodeString(data)
	if err != nil {
		return nil, "", errors.New("ไม่สามารถอ่านข้อมูลรูปภาพได้")
	}

	return rentFlowValidateImageBlob(decoded, declaredMimeType, "")
}

func rentFlowFetchRemoteImage(source string) ([]byte, string, error) {
	parsed, err := url.Parse(strings.TrimSpace(source))
	if err != nil || (parsed.Scheme != "http" && parsed.Scheme != "https") {
		return nil, "", errors.New("ข้อมูลรูปภาพไม่ถูกต้อง")
	}

	client := &http.Client{Timeout: 12 * time.Second}
	request, err := http.NewRequest(http.MethodGet, parsed.String(), nil)
	if err != nil {
		return nil, "", errors.New("ไม่สามารถดาวน์โหลดรูปภาพได้")
	}
	request.Header.Set("User-Agent", "RentFlow-Api/1.0")

	response, err := client.Do(request)
	if err != nil {
		return nil, "", errors.New("ไม่สามารถดาวน์โหลดรูปภาพได้")
	}
	defer response.Body.Close()

	if response.StatusCode < 200 || response.StatusCode >= 300 {
		return nil, "", errors.New("ไม่สามารถดาวน์โหลดรูปภาพได้")
	}

	blob, err := io.ReadAll(io.LimitReader(response.Body, rentFlowMaxCarImageBytes+1))
	if err != nil {
		return nil, "", errors.New("ไม่สามารถอ่านรูปภาพได้")
	}

	return rentFlowValidateImageBlob(blob, response.Header.Get("Content-Type"), parsed.Path)
}

func rentFlowNormalizeImageMimeType(value string) string {
	mimeType := strings.ToLower(strings.TrimSpace(strings.Split(value, ";")[0]))
	if mimeType == "image/jpg" {
		return "image/jpeg"
	}
	return mimeType
}

func rentFlowMimeTypeFromImageExtension(fileName string) string {
	switch strings.ToLower(filepath.Ext(fileName)) {
	case ".jpg", ".jpeg":
		return "image/jpeg"
	case ".png":
		return "image/png"
	case ".webp":
		return "image/webp"
	case ".gif":
		return "image/gif"
	default:
		return ""
	}
}

func rentFlowLooksLikeImageMimeType(blob []byte, mimeType string) bool {
	switch rentFlowNormalizeImageMimeType(mimeType) {
	case "image/jpeg":
		return len(blob) >= 3 && blob[0] == 0xff && blob[1] == 0xd8 && blob[2] == 0xff
	case "image/png":
		return len(blob) >= 8 &&
			blob[0] == 0x89 &&
			blob[1] == 0x50 &&
			blob[2] == 0x4e &&
			blob[3] == 0x47 &&
			blob[4] == 0x0d &&
			blob[5] == 0x0a &&
			blob[6] == 0x1a &&
			blob[7] == 0x0a
	case "image/webp":
		return len(blob) >= 12 &&
			string(blob[0:4]) == "RIFF" &&
			string(blob[8:12]) == "WEBP"
	case "image/gif":
		return len(blob) >= 6 &&
			(string(blob[0:6]) == "GIF87a" || string(blob[0:6]) == "GIF89a")
	default:
		return false
	}
}

func rentFlowValidateImageBlob(blob []byte, hints ...string) ([]byte, string, error) {
	if len(blob) == 0 {
		return nil, "", errors.New("ไฟล์รูปภาพว่างเปล่า")
	}
	if len(blob) > rentFlowMaxCarImageBytes {
		return nil, "", errors.New("ไฟล์รูปภาพต้องมีขนาดไม่เกิน 5MB")
	}

	detectedMimeType := rentFlowNormalizeImageMimeType(http.DetectContentType(blob))
	if _, ok := rentFlowAllowedImageTypes[detectedMimeType]; ok {
		return blob, detectedMimeType, nil
	}

	for _, hint := range hints {
		candidates := []string{
			rentFlowNormalizeImageMimeType(hint),
			rentFlowMimeTypeFromImageExtension(hint),
		}
		for _, candidate := range candidates {
			if _, ok := rentFlowAllowedImageTypes[candidate]; ok &&
				rentFlowLooksLikeImageMimeType(blob, candidate) {
				return blob, candidate, nil
			}
		}
	}

	return nil, "", errors.New("รองรับเฉพาะไฟล์ JPG, PNG, WEBP หรือ GIF")
}

func rentFlowImageBlobFromSource(raw *string) ([]byte, string, error) {
	if raw == nil {
		return nil, "", nil
	}

	source := strings.TrimSpace(*raw)
	if source == "" {
		return []byte{}, "", nil
	}

	if strings.HasPrefix(source, "data:") {
		return rentFlowDecodeDataURLImage(source)
	}

	return rentFlowFetchRemoteImage(source)
}

func rentFlowImageBlobFromUpload(fileHeader *multipart.FileHeader) ([]byte, string, error) {
	if fileHeader == nil {
		return nil, "", nil
	}

	file, err := fileHeader.Open()
	if err != nil {
		return nil, "", errors.New("ไม่สามารถอ่านไฟล์รูปภาพได้")
	}
	defer file.Close()

	blob, err := io.ReadAll(io.LimitReader(file, rentFlowMaxCarImageBytes+1))
	if err != nil {
		return nil, "", errors.New("ไม่สามารถอ่านไฟล์รูปภาพได้")
	}

	return rentFlowValidateImageBlob(blob, fileHeader.Header.Get("Content-Type"), fileHeader.Filename)
}

func rentFlowImageETag(c *gin.Context, blob []byte) string {
	version := strings.TrimSpace(c.Query("v"))
	if version == "" {
		version = strconv.Itoa(len(blob))
	}
	version = strings.NewReplacer(`"`, "", `\`, "", " ", "-").Replace(version)
	return `W/"rf-image-` + strconv.Itoa(len(blob)) + `-` + version + `"`
}

func rentFlowSendImageBlob(c *gin.Context, mimeType string, blob []byte) {
	etag := rentFlowImageETag(c, blob)
	c.Header("Cache-Control", "public, max-age=31536000, immutable")
	c.Header("ETag", etag)
	c.Header("Content-Length", strconv.Itoa(len(blob)))
	c.Header("X-Content-Type-Options", "nosniff")
	if c.GetHeader("If-None-Match") == etag {
		c.Status(http.StatusNotModified)
		return
	}
	c.Data(http.StatusOK, mimeType, blob)
}
