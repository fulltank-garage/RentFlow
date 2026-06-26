package services

import (
	"crypto/subtle"
	"log"
	"os"
	"strings"

	"rentflow-api/config"
	"rentflow-api/models"
)

type RentFlowCarPlatformAdminIdentity struct {
	Username  string `json:"username"`
	Email     string `json:"email"`
	Name      string `json:"name"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

func RentFlowCarPlatformAdminEmail() string {
	return strings.TrimSpace(strings.ToLower(os.Getenv("RENTFLOW_SUPER_ADMIN_EMAIL")))
}

func RentFlowCarPlatformAdminUsername() string {
	return strings.TrimSpace(strings.ToLower(os.Getenv("RENTFLOW_SUPER_ADMIN_USERNAME")))
}

func RentFlowCarPlatformAdminPassword() string {
	return strings.TrimSpace(os.Getenv("RENTFLOW_SUPER_ADMIN_PASSWORD"))
}

func RentFlowCarPlatformAdminIdentityFromEnv() (RentFlowCarPlatformAdminIdentity, bool) {
	email := RentFlowCarPlatformAdminEmail()
	username := RentFlowCarPlatformAdminUsername()
	if username == "" {
		username = email
	}
	if email == "" {
		email = username
	}

	firstName := strings.TrimSpace(os.Getenv("RENTFLOW_SUPER_ADMIN_FIRST_NAME"))
	if firstName == "" {
		firstName = "Platform"
	}
	lastName := strings.TrimSpace(os.Getenv("RENTFLOW_SUPER_ADMIN_LAST_NAME"))
	if lastName == "" {
		lastName = "Admin"
	}
	name := strings.TrimSpace(firstName + " " + lastName)

	identity := RentFlowCarPlatformAdminIdentity{
		Username:  username,
		Email:     email,
		Name:      name,
		FirstName: firstName,
		LastName:  lastName,
	}
	return identity, username != "" || email != ""
}

func ValidateRentFlowCarPlatformAdminCredentials(username, password string) (RentFlowCarPlatformAdminIdentity, bool) {
	identity, configured := RentFlowCarPlatformAdminIdentityFromEnv()
	adminPassword := RentFlowCarPlatformAdminPassword()
	if !configured || adminPassword == "" {
		return RentFlowCarPlatformAdminIdentity{}, false
	}

	normalizedUsername := strings.TrimSpace(strings.ToLower(username))
	usernameMatches := (identity.Email != "" && normalizedUsername == identity.Email) ||
		(identity.Username != "" && normalizedUsername == identity.Username)
	passwordMatches := subtle.ConstantTimeCompare([]byte(strings.TrimSpace(password)), []byte(adminPassword)) == 1
	if !usernameMatches || !passwordMatches {
		return RentFlowCarPlatformAdminIdentity{}, false
	}
	return identity, true
}

func IsRentFlowCarPlatformAdminSession(session *RentFlowCarSession) bool {
	if session == nil {
		return false
	}
	if RentFlowCarNormalizeAppName(session.App) != RentFlowCarAppAdmin || session.ActorType != RentFlowCarActorPlatformAdmin {
		return false
	}

	identity, configured := RentFlowCarPlatformAdminIdentityFromEnv()
	if !configured {
		return false
	}

	sessionEmail := strings.TrimSpace(strings.ToLower(session.AdminEmail))
	sessionUsername := strings.TrimSpace(strings.ToLower(session.AdminUsername))
	return (identity.Email != "" && sessionEmail == identity.Email) ||
		(identity.Username != "" && sessionUsername == identity.Username)
}

func IsRentFlowCarPlatformAdmin(user *models.RentFlowCarUser) bool {
	if user == nil {
		return false
	}

	adminEmail := RentFlowCarPlatformAdminEmail()
	adminUsername := RentFlowCarPlatformAdminUsername()
	userEmail := strings.TrimSpace(strings.ToLower(user.Email))
	userUsername := strings.TrimSpace(strings.ToLower(user.Username))

	if (adminEmail != "" && userEmail == adminEmail) ||
		(adminUsername != "" && userUsername == adminUsername) {
		return true
	}

	if config.DB == nil {
		return false
	}

	var member models.RentFlowCarPlatformMember
	err := config.DB.
		Where("status = ?", "active").
		Where("user_id = ? OR LOWER(email) = ?", user.ID, userEmail).
		First(&member).Error
	return err == nil
}

func RentFlowCarPlatformAdminConfigured() bool {
	if RentFlowCarPlatformAdminEmail() != "" || RentFlowCarPlatformAdminUsername() != "" {
		return true
	}
	if config.DB == nil {
		return false
	}
	var count int64
	if err := config.DB.Model(&models.RentFlowCarPlatformMember{}).
		Where("status = ?", "active").
		Count(&count).Error; err != nil {
		return false
	}
	return count > 0
}

func EnsureRentFlowCarPlatformAdmin() {
	if _, ok := RentFlowCarPlatformAdminIdentityFromEnv(); !ok {
		log.Println("ยังไม่ได้กำหนด RENTFLOW_SUPER_ADMIN_EMAIL หรือ RENTFLOW_SUPER_ADMIN_USERNAME")
		return
	}
	if RentFlowCarPlatformAdminPassword() == "" {
		log.Println("ยังไม่ได้กำหนด RENTFLOW_SUPER_ADMIN_PASSWORD")
	}
}
