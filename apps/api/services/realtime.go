package services

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"rentflow-api/config"
)

const (
	RentFlowCarRealtimeEventBookingCreated     = "booking.created"
	RentFlowCarRealtimeEventBookingUpdated     = "booking.updated"
	RentFlowCarRealtimeEventBookingCancelled   = "booking.cancelled"
	RentFlowCarRealtimeEventPaymentCreated     = "payment.created"
	RentFlowCarRealtimeEventPaymentUpdated     = "payment.updated"
	RentFlowCarRealtimeEventNotificationNew    = "notification.new"
	RentFlowCarRealtimeEventReviewCreated      = "review.created"
	RentFlowCarRealtimeEventCarChanged         = "car.changed"
	RentFlowCarRealtimeEventCarStatusChanged   = "car.status.changed"
	RentFlowCarRealtimeEventBranchChanged      = "branch.changed"
	RentFlowCarRealtimeEventAddonChanged       = "addon.changed"
	RentFlowCarRealtimeEventPromotionChanged   = "promotion.changed"
	RentFlowCarRealtimeEventLeadChanged        = "lead.changed"
	RentFlowCarRealtimeEventMemberChanged      = "member.changed"
	RentFlowCarRealtimeEventAvailabilityChange = "availability.changed"
	RentFlowCarRealtimeEventSupportChanged     = "support.changed"
	RentFlowCarRealtimeEventTenantUpdated      = "tenant.updated"
	rentFlowRealtimeRedisChannel               = "rentflow:realtime:events"
)

type RentFlowCarRealtimeEvent struct {
	Type      string      `json:"type"`
	TenantID  string      `json:"tenantId,omitempty"`
	UserID    string      `json:"userId,omitempty"`
	UserEmail string      `json:"userEmail,omitempty"`
	EntityID  string      `json:"entityId,omitempty"`
	Data      interface{} `json:"data,omitempty"`
	CreatedAt time.Time   `json:"createdAt"`
	SourceID  string      `json:"sourceId,omitempty"`
}

type RentFlowCarRealtimeClientFilter struct {
	App         string
	TenantID    string
	UserID      string
	UserEmail   string
	Marketplace bool
}

type rentFlowRealtimeClient struct {
	hub    *rentFlowRealtimeHub
	conn   *websocket.Conn
	send   chan []byte
	filter RentFlowCarRealtimeClientFilter
}

type rentFlowRealtimeHub struct {
	mu      sync.RWMutex
	clients map[*rentFlowRealtimeClient]struct{}
}

var (
	rentFlowRealtime = &rentFlowRealtimeHub{
		clients: make(map[*rentFlowRealtimeClient]struct{}),
	}
	rentFlowRealtimeNodeID   = NewID("node")
	rentFlowRealtimeUpgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}
)

func StartRentFlowCarRealtimeRedisBridge(ctx context.Context) {
	if config.RDB == nil {
		log.Println("Realtime ใช้โหมดในเครื่อง เพราะ Redis ยังไม่ได้เชื่อมต่อ")
		return
	}

	pubsub := config.RDB.Subscribe(ctx, rentFlowRealtimeRedisChannel)
	if _, err := pubsub.Receive(ctx); err != nil {
		log.Println("เริ่ม Redis Pub/Sub สำหรับ realtime ไม่สำเร็จ:", err)
		_ = pubsub.Close()
		return
	}

	log.Println("Realtime เชื่อมกับ Redis Pub/Sub แล้ว")

	go func() {
		defer pubsub.Close()
		channel := pubsub.Channel()
		for message := range channel {
			var event RentFlowCarRealtimeEvent
			if err := json.Unmarshal([]byte(message.Payload), &event); err != nil {
				log.Println("อ่านข้อความ realtime จาก Redis ไม่สำเร็จ:", err)
				continue
			}
			if event.SourceID == rentFlowRealtimeNodeID {
				continue
			}
			rentFlowRealtime.broadcast(event)
		}
	}()
}

func RentFlowCarPublishRealtime(event RentFlowCarRealtimeEvent) {
	if strings.TrimSpace(event.Type) == "" {
		return
	}
	if event.CreatedAt.IsZero() {
		event.CreatedAt = time.Now()
	}
	if strings.TrimSpace(event.SourceID) == "" {
		event.SourceID = rentFlowRealtimeNodeID
	}
	rentFlowRealtime.broadcast(event)

	if config.RDB == nil {
		return
	}
	payload, err := json.Marshal(event)
	if err != nil {
		log.Println("แปลงข้อความ realtime สำหรับ Redis ไม่สำเร็จ:", err)
		return
	}
	if err := config.RDB.Publish(config.Ctx, rentFlowRealtimeRedisChannel, payload).Err(); err != nil {
		log.Println("ส่งข้อความ realtime ไป Redis ไม่สำเร็จ:", err)
	}
}

func RentFlowCarServeRealtime(w http.ResponseWriter, r *http.Request, filter RentFlowCarRealtimeClientFilter) error {
	filter.App = RentFlowCarNormalizeAppName(filter.App)
	filter.UserEmail = strings.TrimSpace(strings.ToLower(filter.UserEmail))
	conn, err := rentFlowRealtimeUpgrader.Upgrade(w, r, nil)
	if err != nil {
		return err
	}

	client := &rentFlowRealtimeClient{
		hub:    rentFlowRealtime,
		conn:   conn,
		send:   make(chan []byte, 32),
		filter: filter,
	}
	client.hub.register(client)

	go client.writePump()
	go client.readPump()
	return nil
}

func (h *rentFlowRealtimeHub) register(client *rentFlowRealtimeClient) {
	h.mu.Lock()
	h.clients[client] = struct{}{}
	h.mu.Unlock()
	client.enqueue(RentFlowCarRealtimeEvent{
		Type:      "connection.ready",
		TenantID:  client.filter.TenantID,
		UserID:    client.filter.UserID,
		UserEmail: client.filter.UserEmail,
		CreatedAt: time.Now(),
		Data: map[string]interface{}{
			"app":         client.filter.App,
			"marketplace": client.filter.Marketplace,
		},
	})
}

func (h *rentFlowRealtimeHub) unregister(client *rentFlowRealtimeClient) {
	h.mu.Lock()
	if _, ok := h.clients[client]; ok {
		delete(h.clients, client)
		close(client.send)
	}
	h.mu.Unlock()
}

func (h *rentFlowRealtimeHub) broadcast(event RentFlowCarRealtimeEvent) {
	payload, err := json.Marshal(event)
	if err != nil {
		return
	}

	h.mu.RLock()
	clients := make([]*rentFlowRealtimeClient, 0, len(h.clients))
	for client := range h.clients {
		clients = append(clients, client)
	}
	h.mu.RUnlock()

	for _, client := range clients {
		if rentFlowRealtimeMatches(client.filter, event) {
			client.enqueueBytes(payload)
		}
	}
}

func rentFlowRealtimeMatches(filter RentFlowCarRealtimeClientFilter, event RentFlowCarRealtimeEvent) bool {
	switch RentFlowCarNormalizeAppName(filter.App) {
	case RentFlowCarAppAdmin:
		return true
	case RentFlowCarAppPartner:
		return filter.TenantID != "" && filter.TenantID == event.TenantID
	default:
		if filter.UserID != "" && filter.UserID == event.UserID {
			return true
		}
		if filter.UserEmail != "" && strings.EqualFold(filter.UserEmail, event.UserEmail) {
			return true
		}
		if filter.TenantID != "" && filter.TenantID == event.TenantID {
			return true
		}
		if filter.Marketplace {
			return rentFlowRealtimeIsMarketplaceEvent(event.Type)
		}
		return false
	}
}

func rentFlowRealtimeIsMarketplaceEvent(eventType string) bool {
	switch eventType {
	case RentFlowCarRealtimeEventBookingCreated,
		RentFlowCarRealtimeEventBookingUpdated,
		RentFlowCarRealtimeEventBookingCancelled,
		RentFlowCarRealtimeEventReviewCreated,
		RentFlowCarRealtimeEventCarChanged,
		RentFlowCarRealtimeEventCarStatusChanged,
		RentFlowCarRealtimeEventBranchChanged,
		RentFlowCarRealtimeEventAddonChanged,
		RentFlowCarRealtimeEventPromotionChanged,
		RentFlowCarRealtimeEventAvailabilityChange,
		RentFlowCarRealtimeEventTenantUpdated:
		return true
	default:
		return false
	}
}

func (client *rentFlowRealtimeClient) enqueue(event RentFlowCarRealtimeEvent) {
	payload, err := json.Marshal(event)
	if err != nil {
		return
	}
	client.enqueueBytes(payload)
}

func (client *rentFlowRealtimeClient) enqueueBytes(payload []byte) {
	select {
	case client.send <- payload:
	default:
		client.hub.unregister(client)
	}
}

func (client *rentFlowRealtimeClient) readPump() {
	defer func() {
		client.hub.unregister(client)
		_ = client.conn.Close()
	}()

	client.conn.SetReadLimit(512)
	_ = client.conn.SetReadDeadline(time.Now().Add(60 * time.Second))
	client.conn.SetPongHandler(func(string) error {
		_ = client.conn.SetReadDeadline(time.Now().Add(60 * time.Second))
		return nil
	})

	for {
		if _, _, err := client.conn.NextReader(); err != nil {
			break
		}
	}
}

func (client *rentFlowRealtimeClient) writePump() {
	ticker := time.NewTicker(25 * time.Second)
	defer func() {
		ticker.Stop()
		_ = client.conn.Close()
	}()

	for {
		select {
		case payload, ok := <-client.send:
			_ = client.conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if !ok {
				_ = client.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}
			if err := client.conn.WriteMessage(websocket.TextMessage, payload); err != nil {
				return
			}
		case <-ticker.C:
			_ = client.conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if err := client.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
