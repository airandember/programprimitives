// Package providers defines interfaces for payment providers
package providers

import (
	"context"
	"time"
)

// Tier represents a subscription tier
type Tier string

const (
	TierFree    Tier = "free"
	TierPremium Tier = "premium"
	TierPro     Tier = "pro"
)

// Status represents subscription status
type Status string

const (
	StatusActive    Status = "active"
	StatusCancelled Status = "cancelled"
	StatusPastDue   Status = "past_due"
	StatusTrialing  Status = "trialing"
)

// BillingCycle represents billing frequency
type BillingCycle string

const (
	CycleMonthly BillingCycle = "monthly"
	CycleYearly  BillingCycle = "yearly"
)

// Subscription represents a user's subscription
type Subscription struct {
	ID                     string       `json:"id"`
	UserID                 string       `json:"userId"`
	Tier                   Tier         `json:"tier"`
	Status                 Status       `json:"status"`
	BillingCycle           BillingCycle `json:"billingCycle"`
	CurrentPeriodStart     time.Time    `json:"currentPeriodStart"`
	CurrentPeriodEnd       time.Time    `json:"currentPeriodEnd"`
	Provider               string       `json:"provider"`
	ProviderCustomerID     string       `json:"providerCustomerId,omitempty"`
	ProviderSubscriptionID string       `json:"providerSubscriptionId,omitempty"`
	CreatedAt              time.Time    `json:"createdAt"`
	UpdatedAt              time.Time    `json:"updatedAt"`
	CancelledAt            *time.Time   `json:"cancelledAt,omitempty"`
}

// CheckoutParams for creating a checkout session
type CheckoutParams struct {
	UserID       string       `json:"userId"`
	Email        string       `json:"email"`
	Tier         Tier         `json:"tier"`
	BillingCycle BillingCycle `json:"billingCycle"`
	SuccessURL   string       `json:"successUrl"`
	CancelURL    string       `json:"cancelUrl"`
}

// CheckoutSession result from creating checkout
type CheckoutSession struct {
	ID          string `json:"id"`
	URL         string `json:"url"`
	Provider    string `json:"provider"`
	ExpiresAt   time.Time `json:"expiresAt"`
}

// PortalSession for customer billing management
type PortalSession struct {
	URL       string    `json:"url"`
	ExpiresAt time.Time `json:"expiresAt"`
}

// WebhookEvent from payment provider
type WebhookEvent struct {
	ID        string                 `json:"id"`
	Type      string                 `json:"type"`
	Provider  string                 `json:"provider"`
	Data      map[string]interface{} `json:"data"`
	CreatedAt time.Time              `json:"createdAt"`
}

// Provider interface for payment providers
// Implement this interface for each provider (Stripe, Paddle, etc.)
type Provider interface {
	// Name returns the provider name
	Name() string

	// CreateCheckoutSession creates a checkout session for subscription
	CreateCheckoutSession(ctx context.Context, params CheckoutParams) (*CheckoutSession, error)

	// GetSubscription retrieves subscription details
	GetSubscription(ctx context.Context, subscriptionID string) (*Subscription, error)

	// CancelSubscription cancels a subscription
	CancelSubscription(ctx context.Context, subscriptionID string) error

	// ResumeSubscription resumes a cancelled subscription
	ResumeSubscription(ctx context.Context, subscriptionID string) error

	// CreatePortalSession creates a billing portal session
	CreatePortalSession(ctx context.Context, customerID string) (*PortalSession, error)

	// VerifyWebhook verifies webhook signature
	VerifyWebhook(payload []byte, signature string) bool

	// HandleWebhook processes a webhook event
	HandleWebhook(ctx context.Context, event WebhookEvent) error
}

// MockProvider is a mock implementation for development
type MockProvider struct{}

func NewMockProvider() *MockProvider {
	return &MockProvider{}
}

func (m *MockProvider) Name() string {
	return "mock"
}

func (m *MockProvider) CreateCheckoutSession(ctx context.Context, params CheckoutParams) (*CheckoutSession, error) {
	return &CheckoutSession{
		ID:        "mock_cs_" + params.UserID,
		URL:       "/checkout/success?mock=true",
		Provider:  "mock",
		ExpiresAt: time.Now().Add(24 * time.Hour),
	}, nil
}

func (m *MockProvider) GetSubscription(ctx context.Context, subscriptionID string) (*Subscription, error) {
	return &Subscription{
		ID:                 subscriptionID,
		UserID:             "mock_user",
		Tier:               TierPremium,
		Status:             StatusActive,
		BillingCycle:       CycleYearly,
		CurrentPeriodStart: time.Now().AddDate(0, -1, 0),
		CurrentPeriodEnd:   time.Now().AddDate(0, 11, 0),
		Provider:           "mock",
		CreatedAt:          time.Now().AddDate(0, -1, 0),
		UpdatedAt:          time.Now(),
	}, nil
}

func (m *MockProvider) CancelSubscription(ctx context.Context, subscriptionID string) error {
	return nil
}

func (m *MockProvider) ResumeSubscription(ctx context.Context, subscriptionID string) error {
	return nil
}

func (m *MockProvider) CreatePortalSession(ctx context.Context, customerID string) (*PortalSession, error) {
	return &PortalSession{
		URL:       "/billing?mock=true",
		ExpiresAt: time.Now().Add(1 * time.Hour),
	}, nil
}

func (m *MockProvider) VerifyWebhook(payload []byte, signature string) bool {
	return true // Always verify in mock
}

func (m *MockProvider) HandleWebhook(ctx context.Context, event WebhookEvent) error {
	return nil
}

