// Package handlers provides HTTP handlers for subscription management
package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/programprimitives/api/braids/subscription/backend/providers"
)

// Handler for subscription operations
type Handler struct {
	provider providers.Provider
}

// NewHandler creates a new subscription handler
func NewHandler() *Handler {
	return &Handler{
		provider: providers.NewMockProvider(),
	}
}

// SetProvider allows changing the payment provider
func (h *Handler) SetProvider(p providers.Provider) {
	h.provider = p
}

// GetSubscriptionResponse for API
type GetSubscriptionResponse struct {
	Subscription *providers.Subscription `json:"subscription"`
}

// CheckoutRequest for creating checkout
type CheckoutRequest struct {
	Tier         string `json:"tier"`
	BillingCycle string `json:"billingCycle"`
	SuccessURL   string `json:"successUrl"`
	CancelURL    string `json:"cancelUrl"`
}

// CheckoutResponse from checkout creation
type CheckoutResponse struct {
	CheckoutURL string `json:"checkoutUrl"`
	SessionID   string `json:"sessionId"`
}

// HandleGetSubscription returns current subscription
func (h *Handler) HandleGetSubscription(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// TODO: Get user from auth context
	userID := r.URL.Query().Get("userId")
	if userID == "" {
		userID = "demo-user"
	}

	// For demo, return a mock subscription
	sub := &providers.Subscription{
		ID:                 "sub_demo",
		UserID:             userID,
		Tier:               providers.TierPremium,
		Status:             providers.StatusActive,
		BillingCycle:       providers.CycleYearly,
		CurrentPeriodStart: time.Now().AddDate(0, -1, 0),
		CurrentPeriodEnd:   time.Now().AddDate(0, 11, 0),
		Provider:           h.provider.Name(),
		CreatedAt:          time.Now().AddDate(0, -1, 0),
		UpdatedAt:          time.Now(),
	}

	writeJSON(w, http.StatusOK, GetSubscriptionResponse{Subscription: sub})
}

// HandleCreateCheckout creates a checkout session
func (h *Handler) HandleCreateCheckout(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req CheckoutRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// Validate tier
	tier := providers.Tier(req.Tier)
	if tier != providers.TierPremium && tier != providers.TierPro {
		http.Error(w, "Invalid tier", http.StatusBadRequest)
		return
	}

	// Validate billing cycle
	cycle := providers.BillingCycle(req.BillingCycle)
	if cycle != providers.CycleMonthly && cycle != providers.CycleYearly {
		http.Error(w, "Invalid billing cycle", http.StatusBadRequest)
		return
	}

	// TODO: Get user from auth context
	params := providers.CheckoutParams{
		UserID:       "demo-user",
		Email:        "demo@example.com",
		Tier:         tier,
		BillingCycle: cycle,
		SuccessURL:   req.SuccessURL,
		CancelURL:    req.CancelURL,
	}

	session, err := h.provider.CreateCheckoutSession(r.Context(), params)
	if err != nil {
		http.Error(w, "Failed to create checkout", http.StatusInternalServerError)
		return
	}

	writeJSON(w, http.StatusOK, CheckoutResponse{
		CheckoutURL: session.URL,
		SessionID:   session.ID,
	})
}

// HandleCancelSubscription cancels the subscription
func (h *Handler) HandleCancelSubscription(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// TODO: Get subscription ID from user's current subscription
	subscriptionID := "sub_demo"

	if err := h.provider.CancelSubscription(r.Context(), subscriptionID); err != nil {
		http.Error(w, "Failed to cancel subscription", http.StatusInternalServerError)
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{"status": "cancelled"})
}

// HandleResumeSubscription resumes a cancelled subscription
func (h *Handler) HandleResumeSubscription(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// TODO: Get subscription ID from user's current subscription
	subscriptionID := "sub_demo"

	if err := h.provider.ResumeSubscription(r.Context(), subscriptionID); err != nil {
		http.Error(w, "Failed to resume subscription", http.StatusInternalServerError)
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{"status": "active"})
}

// HandleGetPortal returns a billing portal URL
func (h *Handler) HandleGetPortal(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// TODO: Get customer ID from user's subscription
	customerID := "cus_demo"

	session, err := h.provider.CreatePortalSession(r.Context(), customerID)
	if err != nil {
		http.Error(w, "Failed to create portal session", http.StatusInternalServerError)
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{"url": session.URL})
}

// HandleWebhook processes webhook events from payment provider
func (h *Handler) HandleWebhook(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Read body
	// In production, verify signature before processing
	
	// For now, just acknowledge
	writeJSON(w, http.StatusOK, map[string]string{"received": "true"})
}

func writeJSON(w http.ResponseWriter, status int, v interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}

