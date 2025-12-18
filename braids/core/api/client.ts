// ============================================
// API Client - Fetch wrapper with auth & retry
// ============================================

import type { ApiResponse } from '../types/api';
import { ApiError, createApiErrorFromResponse } from './errors';
import { ErrorCodes } from '../types/api';

/**
 * API client configuration
 */
export interface ApiClientConfig {
	baseUrl: string;
	timeout?: number;
	headers?: Record<string, string>;
	onUnauthorized?: () => void;
}

/**
 * Request configuration
 */
export interface RequestConfig {
	headers?: Record<string, string>;
	timeout?: number;
	signal?: AbortSignal;
	skipAuth?: boolean;
}

/**
 * API Client class
 */
export class ApiClient {
	private baseUrl: string;
	private defaultTimeout: number;
	private defaultHeaders: Record<string, string>;
	private onUnauthorized?: () => void;

	constructor(config: ApiClientConfig) {
		this.baseUrl = config.baseUrl.replace(/\/$/, ''); // Remove trailing slash
		this.defaultTimeout = config.timeout ?? 30000;
		this.defaultHeaders = {
			'Content-Type': 'application/json',
			...config.headers,
		};
		this.onUnauthorized = config.onUnauthorized;
	}

	/**
	 * Make a request
	 */
	private async request<T>(
		method: string,
		path: string,
		body?: unknown,
		config?: RequestConfig
	): Promise<T> {
		const url = `${this.baseUrl}${path}`;
		const timeout = config?.timeout ?? this.defaultTimeout;

		// Create abort controller for timeout
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), timeout);

		// Merge signals if one was provided
		const signal = config?.signal
			? this.mergeAbortSignals(config.signal, controller.signal)
			: controller.signal;

		try {
			const response = await fetch(url, {
				method,
				headers: {
					...this.defaultHeaders,
					...config?.headers,
				},
				body: body ? JSON.stringify(body) : undefined,
				credentials: 'include', // Include cookies for auth
				signal,
			});

			clearTimeout(timeoutId);

			// Handle non-OK responses
			if (!response.ok) {
				const error = await createApiErrorFromResponse(response);

				// Call unauthorized handler if 401
				if (response.status === 401 && this.onUnauthorized) {
					this.onUnauthorized();
				}

				throw error;
			}

			// Handle empty responses
			const contentType = response.headers.get('content-type');
			if (!contentType || !contentType.includes('application/json')) {
				return {} as T;
			}

			const data: ApiResponse<T> = await response.json();

			// Handle API-level errors
			if (data.success === false && data.error) {
				throw new ApiError(
					data.error.message,
					data.error.code as typeof ErrorCodes[keyof typeof ErrorCodes],
					response.status,
					data.error.details
				);
			}

			return data.data as T;
		} catch (error) {
			clearTimeout(timeoutId);

			// Handle abort errors
			if (error instanceof Error && error.name === 'AbortError') {
				throw new ApiError(
					'Request timed out',
					ErrorCodes.INTERNAL_ERROR,
					408
				);
			}

			// Handle network errors
			if (error instanceof TypeError && error.message.includes('fetch')) {
				throw new ApiError(
					'Network error. Please check your connection',
					ErrorCodes.INTERNAL_ERROR,
					0
				);
			}

			throw error;
		}
	}

	/**
	 * Merge multiple abort signals
	 */
	private mergeAbortSignals(...signals: AbortSignal[]): AbortSignal {
		const controller = new AbortController();
		for (const signal of signals) {
			if (signal.aborted) {
				controller.abort();
				break;
			}
			signal.addEventListener('abort', () => controller.abort(), { once: true });
		}
		return controller.signal;
	}

	/**
	 * GET request
	 */
	async get<T>(path: string, config?: RequestConfig): Promise<T> {
		return this.request<T>('GET', path, undefined, config);
	}

	/**
	 * POST request
	 */
	async post<T>(path: string, body?: unknown, config?: RequestConfig): Promise<T> {
		return this.request<T>('POST', path, body, config);
	}

	/**
	 * PUT request
	 */
	async put<T>(path: string, body?: unknown, config?: RequestConfig): Promise<T> {
		return this.request<T>('PUT', path, body, config);
	}

	/**
	 * PATCH request
	 */
	async patch<T>(path: string, body?: unknown, config?: RequestConfig): Promise<T> {
		return this.request<T>('PATCH', path, body, config);
	}

	/**
	 * DELETE request
	 */
	async delete<T>(path: string, config?: RequestConfig): Promise<T> {
		return this.request<T>('DELETE', path, undefined, config);
	}

	/**
	 * Build query string from params object
	 */
	static buildQuery(params: Record<string, unknown>): string {
		const searchParams = new URLSearchParams();
		for (const [key, value] of Object.entries(params)) {
			if (value !== undefined && value !== null && value !== '') {
				searchParams.append(key, String(value));
			}
		}
		const query = searchParams.toString();
		return query ? `?${query}` : '';
	}
}

/**
 * Default API client instance
 * Will be configured in the frontend with the actual base URL
 */
export const api = new ApiClient({
	baseUrl: '/api',
	timeout: 30000,
	onUnauthorized: () => {
		// This will be overridden in the frontend to redirect to login
		console.warn('Unauthorized - session may have expired');
	},
});

