package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"rentflow-api/config"
	"rentflow-api/models"
	"rentflow-api/services"
)

const (
	rentFlowSessionKey       = "rentflow.session"
	rentFlowUserKey          = "rentflow.user"
	rentFlowPlatformAdminKey = "rentflow.platformAdmin"
)

func AttachRentFlowCarSession() gin.HandlerFunc {
	return func(c *gin.Context) {
		token := rentFlowSessionTokenFromRequest(c)
		if token == "" {
			authHeader := c.GetHeader("Authorization")
			if strings.HasPrefix(authHeader, "Bearer ") {
				token = strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer "))
			}
		}

		if token == "" {
			c.Next()
			return
		}

		session, err := services.GetSession(config.Ctx, token)
		if err != nil || session == nil {
			c.Next()
			return
		}

		if services.IsRentFlowCarPlatformAdminSession(session) {
			c.Set(rentFlowSessionKey, *session)
			c.Set(rentFlowPlatformAdminKey, *session)
			c.Next()
			return
		}

		var user models.RentFlowCarUser
		if err := config.DB.Where("id = ?", session.UserID).First(&user).Error; err != nil {
			_ = services.DeleteSession(config.Ctx, token)
			c.Next()
			return
		}
		if strings.EqualFold(user.Status, "locked") || strings.EqualFold(user.Status, "disabled") {
			_ = services.DeleteSession(config.Ctx, token)
			c.Next()
			return
		}

		c.Set(rentFlowSessionKey, *session)
		c.Set(rentFlowUserKey, user)
		c.Next()
	}
}

func rentFlowSessionTokenFromRequest(c *gin.Context) string {
	cookieName := rentFlowSessionCookieNameFromRequest(c)
	if token, err := c.Cookie(cookieName); err == nil && strings.TrimSpace(token) != "" {
		return strings.TrimSpace(token)
	}
	return ""
}

func rentFlowSessionCookieNameFromRequest(c *gin.Context) string {
	app := strings.TrimSpace(c.Query("app"))
	if app == "" {
		app = strings.TrimSpace(c.GetHeader(services.RentFlowCarAppHeaderName))
	}
	if app == "" {
		path := c.Request.URL.Path
		switch {
		case strings.HasPrefix(path, "/platform"):
			app = services.RentFlowCarAppAdmin
		case strings.HasPrefix(path, "/partner"), path == "/tenants/me":
			app = services.RentFlowCarAppPartner
		default:
			app = services.RentFlowCarAppStorefront
		}
	}

	return services.RentFlowCarSessionCookieNameForApp(app)
}

func RequireRentFlowCarSession() gin.HandlerFunc {
	return func(c *gin.Context) {
		if _, ok := c.Get(rentFlowUserKey); ok {
			c.Next()
			return
		}
		if _, ok := c.Get(rentFlowPlatformAdminKey); ok {
			c.Next()
			return
		}

		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "กรุณาเข้าสู่ระบบก่อน",
		})
		c.Abort()
	}
}

func CurrentRentFlowCarUser(c *gin.Context) (*models.RentFlowCarUser, bool) {
	value, ok := c.Get(rentFlowUserKey)
	if !ok {
		return nil, false
	}

	user, ok := value.(models.RentFlowCarUser)
	if !ok {
		return nil, false
	}
	return &user, true
}

func CurrentRentFlowCarPlatformAdmin(c *gin.Context) (*services.RentFlowCarSession, bool) {
	value, ok := c.Get(rentFlowPlatformAdminKey)
	if !ok {
		return nil, false
	}

	session, ok := value.(services.RentFlowCarSession)
	if !ok || !services.IsRentFlowCarPlatformAdminSession(&session) {
		return nil, false
	}
	return &session, true
}
