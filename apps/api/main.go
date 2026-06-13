package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"rentflow-api/config"
	"rentflow-api/routes"
	"rentflow-api/services"
)

func main() {
	if err := godotenv.Load(".env"); err != nil {
		log.Println("ไม่พบไฟล์ .env กำลังอ่านค่าจากสภาพแวดล้อมของระบบแทน")
	}

	config.ConnectDatabase()

	config.ConnectRedis()
	if config.RDB == nil {
		log.Println("Redis ยังไม่ได้เชื่อมต่อ")
	} else {
		log.Println("Redis เชื่อมต่อแล้ว")
	}
	services.StartRentFlowRealtimeRedisBridge(config.Ctx)

	services.EnsureRentFlowPlatformAdmin()
	services.CacheDeleteByPrefix(config.Ctx, services.RentFlowCarsCachePrefix())

	gin.SetMode(gin.ReleaseMode)
	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	routes.SetupRoutes(router)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	router.Run(":" + port)
}
