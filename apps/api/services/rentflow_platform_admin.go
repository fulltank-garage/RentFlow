package services

import (
	"crypto/subtle"
	"log"
	"os"
	"strings"

	"rentflow-api/config"
	"rentflow-api/models"
)

type RentFlowPlatformAdminIdentity struct {
	Username  string `json:"username"`
	Email     string `json:"email"`
	Name      string `json:"name"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
}

func RentFlowPlatformAdminEmail() string {
	return strings.TrimSpace(strings.ToLower(os.Getenv("RENTFLOW_SUPER_ADMIN_EMAIL")))
}

func RentFlowPlatformAdminUsername() string {
	return strings.TrimSpace(strings.ToLower(os.Getenv("RENTFLOW_SUPER_ADMIN_USERNAME")))
}

func RentFlowPlatformAdminPassword() string {
	return strings.TrimSpace(os.Getenv("RENTFLOW_SUPER_ADMIN_PASSWORD"))
}

func RentFlowPlatformAdminIdentityFromEnv() (RentFlowPlatformAdminIdentity, bool) {
	email := RentFlowPlatformAdminEmail()
	username := RentFlowPlatformAdminUsername()
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

	identity := RentFlowPlatformAdminIdentity{
		Username:  username,
		Email:     email,
		Name:      name,
		FirstName: firstName,
		LastName:  lastName,
	}
	return identity, username != "" || email != ""
}

func ValidateRentFlowPlatformAdminCredentials(username, password string) (RentFlowPlatformAdminIdentity, bool) {
	identity, configured := RentFlowPlatformAdminIdentityFromEnv()
	adminPassword := RentFlowPlatformAdminPassword()
	if !configured || adminPassword == "" {
		return RentFlowPlatformAdminIdentity{}, false
	}

	normalizedUsername := strings.TrimSpace(strings.ToLower(username))
	usernameMatches := (identity.Email != "" && normalizedUsername == identity.Email) ||
		(identity.Username != "" && normalizedUsername == identity.Username)
	passwordMatches := subtle.ConstantTimeCompare([]byte(strings.TrimSpace(password)), []byte(adminPassword)) == 1
	if !usernameMatches || !passwordMatches {
		return RentFlowPlatformAdminIdentity{}, false
	}
	return identity, true
}

func IsRentFlowPlatformAdminSession(session *RentFlowSession) bool {
	if session == nil {
		return false
	}
	if RentFlowNormalizeAppName(session.App) != RentFlowAppAdmin || session.ActorType != RentFlowActorPlatformAdmin {
		return false
	}

	identity, configured := RentFlowPlatformAdminIdentityFromEnv()
	if !configured {
		return false
	}

	sessionEmail := strings.TrimSpace(strings.ToLower(session.AdminEmail))
	sessionUsername := strings.TrimSpace(strings.ToLower(session.AdminUsername))
	return (identity.Email != "" && sessionEmail == identity.Email) ||
		(identity.Username != "" && sessionUsername == identity.Username)
}

func IsRentFlowPlatformAdmin(user *models.RentFlowUser) bool {
	if user == nil {
		return false
	}

	adminEmail := RentFlowPlatformAdminEmail()
	adminUsername := RentFlowPlatformAdminUsername()
	userEmail := strings.TrimSpace(strings.ToLower(user.Email))
	userUsername := strings.TrimSpace(strings.ToLower(user.Username))

	if (adminEmail != "" && userEmail == adminEmail) ||
		(adminUsername != "" && userUsername == adminUsername) {
		return true
	}

	if config.DB == nil {
		return false
	}

	var member models.RentFlowPlatformMember
	err := config.DB.
		Where("status = ?", "active").
		Where("user_id = ? OR LOWER(email) = ?", user.ID, userEmail).
		First(&member).Error
	return err == nil
}

func RentFlowPlatformAdminConfigured() bool {
	if RentFlowPlatformAdminEmail() != "" || RentFlowPlatformAdminUsername() != "" {
		return true
	}
	if config.DB == nil {
		return false
	}
	var count int64
	if err := config.DB.Model(&models.RentFlowPlatformMember{}).
		Where("status = ?", "active").
		Count(&count).Error; err != nil {
		return false
	}
	return count > 0
}

func EnsureRentFlowPlatformAdmin() {
	if _, ok := RentFlowPlatformAdminIdentityFromEnv(); !ok {
		log.Println("ยังไม่ได้กำหนด RENTFLOW_SUPER_ADMIN_EMAIL หรือ RENTFLOW_SUPER_ADMIN_USERNAME")
		return
	}
	if RentFlowPlatformAdminPassword() == "" {
		log.Println("ยังไม่ได้กำหนด RENTFLOW_SUPER_ADMIN_PASSWORD")
	}
}
