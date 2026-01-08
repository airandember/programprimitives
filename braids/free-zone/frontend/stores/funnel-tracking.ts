// ============================================
// Funnel Tracking Store - Analytics for conversion optimization
// ============================================

import { writable, get } from 'svelte/store';
import { browser } from '$app/environment';

// ============================================
// Types
// ============================================

export type FunnelEventType = 'view' | 'click' | 'dismiss' | 'convert' | 'hover';

export type FunnelName = 
	| 'try_signup'           // Free trial → signup
	| 'lesson_gate'          // Locked lesson → signup
	| 'premium_exercise'     // Premium exercise → upgrade
	| 'limit_reached'        // Hit free limit → upgrade
	| 'header_cta'           // Header upgrade button
	| 'pricing_page'         // Pricing page interaction
	| 'achievement_lock'     // Locked achievements → upgrade
	| 'progress_gate'        // Progress tracking → signup
	| 'feature_preview'      // Feature preview → upgrade
	| 'exit_intent';         // Exit intent popup

export type TouchPoint =
	// Try flow
	| 'try_page_view'
	| 'try_exercise_start'
	| 'try_exercise_complete_1'
	| 'try_exercise_complete_2'
	| 'try_exercise_complete_3'
	| 'try_limit_modal'
	| 'try_signup_cta'
	// Lesson flow
	| 'lesson_locked_view'
	| 'lesson_signup_modal'
	| 'lesson_complete_upsell'
	// Premium exercise flow
	| 'premium_exercise_click'
	| 'premium_exercise_modal'
	// General
	| 'header_upgrade_btn'
	| 'pricing_view'
	| 'pricing_plan_click'
	| 'signup_start'
	| 'signup_complete'
	| 'subscribe_start'
	| 'subscribe_complete';

export interface FunnelEvent {
	eventType: FunnelEventType;
	funnelName: FunnelName;
	touchpoint: TouchPoint | string;
	sourcePage?: string;
	exerciseId?: string;
	lessonId?: string;
	primitiveId?: string;
	metadata?: Record<string, any>;
}

interface FunnelSession {
	sessionId: string;
	events: FunnelEvent[];
	firstTouchpoint?: string;
	lastTouchpoint?: string;
	touchpointCount: number;
}

// ============================================
// Session ID Management
// ============================================

function getSessionId(): string {
	if (!browser) return 'ssr';
	
	const key = 'pp_funnel_session';
	let sessionId = sessionStorage.getItem(key);
	
	if (!sessionId) {
		sessionId = 'fs_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
		sessionStorage.setItem(key, sessionId);
	}
	
	return sessionId;
}

// ============================================
// Device Detection
// ============================================

function getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
	if (!browser) return 'desktop';
	
	const ua = navigator.userAgent;
	if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
		return 'tablet';
	}
	if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
		return 'mobile';
	}
	return 'desktop';
}

function getBrowser(): string {
	if (!browser) return 'unknown';
	
	const ua = navigator.userAgent;
	if (ua.includes('Chrome')) return 'chrome';
	if (ua.includes('Firefox')) return 'firefox';
	if (ua.includes('Safari')) return 'safari';
	if (ua.includes('Edge')) return 'edge';
	return 'other';
}

// ============================================
// Store
// ============================================

function createFunnelStore() {
	const { subscribe, update } = writable<FunnelSession>({
		sessionId: '',
		events: [],
		touchpointCount: 0,
	});

	// Initialize session ID on client
	if (browser) {
		update(state => ({ ...state, sessionId: getSessionId() }));
	}

	return {
		subscribe,

		/**
		 * Track a funnel event
		 */
		track: async (event: FunnelEvent) => {
			const sessionId = getSessionId();
			const now = new Date().toISOString();

			// Update local state
			update(state => {
				const isFirstTouch = state.touchpointCount === 0;
				return {
					...state,
					events: [...state.events, event],
					firstTouchpoint: isFirstTouch ? event.touchpoint : state.firstTouchpoint,
					lastTouchpoint: event.touchpoint,
					touchpointCount: state.touchpointCount + 1,
				};
			});

			// Send to API (fire and forget)
			if (browser) {
				try {
					await fetch('/api/funnel/track', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							sessionId,
							...event,
							sourcePage: event.sourcePage || window.location.pathname,
							deviceType: getDeviceType(),
							browser: getBrowser(),
							timestamp: now,
						}),
					});
				} catch (e) {
					// Silent fail - don't break UX for analytics
					console.debug('Funnel tracking failed:', e);
				}
			}
		},

		/**
		 * Track when user views an upgrade prompt
		 */
		trackView: (funnelName: FunnelName, touchpoint: TouchPoint | string, meta?: Record<string, any>) => {
			return get({ subscribe }).sessionId && createFunnelStore().track({
				eventType: 'view',
				funnelName,
				touchpoint,
				metadata: meta,
			});
		},

		/**
		 * Track when user clicks an upgrade CTA
		 */
		trackClick: (funnelName: FunnelName, touchpoint: TouchPoint | string, meta?: Record<string, any>) => {
			return createFunnelStore().track({
				eventType: 'click',
				funnelName,
				touchpoint,
				metadata: meta,
			});
		},

		/**
		 * Track when user dismisses a prompt
		 */
		trackDismiss: (funnelName: FunnelName, touchpoint: TouchPoint | string, meta?: Record<string, any>) => {
			return createFunnelStore().track({
				eventType: 'dismiss',
				funnelName,
				touchpoint,
				metadata: meta,
			});
		},

		/**
		 * Get session for attribution
		 */
		getSessionData: () => {
			return get({ subscribe });
		},
	};
}

export const funnelTracking = createFunnelStore();

// ============================================
// Convenience Functions
// ============================================

/** Track try flow events */
export function trackTryEvent(touchpoint: TouchPoint, exerciseId?: string) {
	funnelTracking.track({
		eventType: 'view',
		funnelName: 'try_signup',
		touchpoint,
		exerciseId,
	});
}

/** Track lesson gate events */
export function trackLessonGate(touchpoint: TouchPoint, lessonId: string, primitiveId: string) {
	funnelTracking.track({
		eventType: 'view',
		funnelName: 'lesson_gate',
		touchpoint,
		lessonId,
		primitiveId,
	});
}

/** Track premium feature click */
export function trackPremiumClick(feature: string, sourcePage: string) {
	funnelTracking.track({
		eventType: 'click',
		funnelName: 'premium_exercise',
		touchpoint: 'premium_exercise_click',
		sourcePage,
		metadata: { feature },
	});
}

/** Track conversion (signup/subscribe) */
export function trackConversion(type: 'signup' | 'subscribe', plan?: string) {
	funnelTracking.track({
		eventType: 'convert',
		funnelName: type === 'signup' ? 'try_signup' : 'pricing_page',
		touchpoint: type === 'signup' ? 'signup_complete' : 'subscribe_complete',
		metadata: { plan },
	});
}
