package config

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"rentflow-api/models"
)

var DB *gorm.DB

func ConnectDatabase() {
	if err := godotenv.Load(); err != nil {
		log.Println("ไม่พบไฟล์ .env กำลังใช้ค่าจากสภาพแวดล้อมของระบบแทน")
	}

	dsn := fmt.Sprintf(
		"host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Bangkok",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("เชื่อมต่อฐานข้อมูลไม่สำเร็จ:", err)
	}

	DB = db

	db.AutoMigrate(
		&models.RentFlowCarUser{},
		&models.RentFlowCarTenant{},
		&models.RentFlowCarTenantPromoImage{},
		&models.RentFlowCarPlatformSetting{},
		&models.RentFlowCarBranch{},
		&models.RentFlowCarCar{},
		&models.RentFlowCarCarImage{},
		&models.RentFlowCarBooking{},
		&models.RentFlowCarPayment{},
		&models.RentFlowCarNotification{},
		&models.RentFlowCarMessageLog{},
		&models.RentFlowCarReview{},
		&models.RentFlowCarTenantMember{},
		&models.RentFlowCarCustomDomain{},
		&models.RentFlowCarAuditLog{},
		&models.RentFlowCarAvailabilityBlock{},
		&models.RentFlowCarPromotion{},
		&models.RentFlowCarAddon{},
		&models.RentFlowCarLead{},
		&models.RentFlowCarLineChannel{},
		&models.RentFlowCarSupportTicket{},
		&models.RentFlowCarSupportMessage{},
		&models.RentFlowCarBookingOperation{},
		&models.RentFlowCarStorefrontPage{},
		&models.RentFlowCarStorefrontBlockImage{},
		&models.RentFlowCarPlatformInvoice{},
		&models.RentFlowCarPlatformMember{},
		&models.RentFlowCarSessionAudit{},
	)

	ensureRentFlowTenantPromptPayColumns(db)
	ensureRentFlowTenantBankAccountColumns(db)
}

func ensureRentFlowTenantPromptPayColumns(db *gorm.DB) {
	if !db.Migrator().HasColumn(&models.RentFlowCarTenant{}, "prompt_pay_id") {
		if err := db.Migrator().AddColumn(&models.RentFlowCarTenant{}, "PromptPayID"); err != nil {
			log.Println("ไม่สามารถเพิ่มคอลัมน์ prompt_pay_id:", err)
		}
	}
	if !db.Migrator().HasColumn(&models.RentFlowCarTenant{}, "prompt_pay_type") {
		if err := db.Migrator().AddColumn(&models.RentFlowCarTenant{}, "PromptPayType"); err != nil {
			log.Println("ไม่สามารถเพิ่มคอลัมน์ prompt_pay_type:", err)
		}
	}
}

func ensureRentFlowTenantBankAccountColumns(db *gorm.DB) {
	if !db.Migrator().HasColumn(&models.RentFlowCarTenant{}, "bank_name") {
		if err := db.Migrator().AddColumn(&models.RentFlowCarTenant{}, "BankName"); err != nil {
			log.Println("ไม่สามารถเพิ่มคอลัมน์ bank_name:", err)
		}
	}
	if !db.Migrator().HasColumn(&models.RentFlowCarTenant{}, "bank_account_name") {
		if err := db.Migrator().AddColumn(&models.RentFlowCarTenant{}, "BankAccountName"); err != nil {
			log.Println("ไม่สามารถเพิ่มคอลัมน์ bank_account_name:", err)
		}
	}
	if !db.Migrator().HasColumn(&models.RentFlowCarTenant{}, "bank_account_number") {
		if err := db.Migrator().AddColumn(&models.RentFlowCarTenant{}, "BankAccountNumber"); err != nil {
			log.Println("ไม่สามารถเพิ่มคอลัมน์ bank_account_number:", err)
		}
	}
}
