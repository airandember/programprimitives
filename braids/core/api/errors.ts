// ============================================
// API Error Handling
// ============================================

import { ErrorCodes, type ErrorCode } from '../types/api';

/**
 * Custom API Error class
 */
export class ApiError extends Error {
	public readonly code: ErrorCode;
	public readonly status: number;
	public readonly details?: Record<string, string[]>;

	constructor(
		message: string,
		code: ErrorCode = ErrorCodes.INTERNAL_ERROR,
		status: number = 500,
		details?: Record<string, string[]>
	) {
		super(message);
		this.name = 'ApiError';
		this.code = code;
		this.status = status;
		this.details = details;

		// Maintains proper stack trace in V8
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, ApiError);
		}
	}

	/**
	 * Check if error is a specific code
	 */
	is(code: ErrorCode): boolean {
		return this.code === code;
	}

	/**
	 * Check if error is authentication related
	 */
	isAuthError(): boolean {
		return (
			this.code === ErrorCodes.UNAUTHORIZED ||
			this.code === ErrorCodes.INVALID_CREDENTIALS ||
			this.code === ErrorCodes.SESSION_EXPIRED ||
			this.code === ErrorCodes.INVALID_TOKEN
		);
	}

	/**
	 * Check if error is validation related
	 */
	isValidationError(): boolean {
		return this.code === ErrorCodes.VALIDATION_ERROR;
	}

	/**
	 * Get field-specific error message
	 */
	getFieldError(field: string): string | undefined {
		return this.details?.[field]?.[0];
	}

	/**
	 * Get all field errors as flat object
	 */
	getFieldErrors(): Record<string, string> {
		if (!this.details) return {};
		return Object.fromEntries(
			Object.entries(this.details).map(([key, errors]) => [key, errors[0]])
		);
	}

	/**
	 * Convert to JSON for logging
	 */
	toJSON() {
		return {
			name: this.name,
			message: this.message,
			code: this.code,
			status: this.status,
			details: this.details,
		};
	}
}

/**
 * Type guard for ApiError
 */
export function isApiError(error: unknown): error is ApiError {
	return error instanceof ApiError;
}

/**
 * Create ApiError from response
 */
export async function createApiErrorFromResponse(response: Response): Promise<ApiError> {
	let message = 'An unexpected error occurred';
	let code: ErrorCode = ErrorCodes.INTERNAL_ERROR;
	let details: Record<string, string[]> | undefined;

	try {
		const data = await response.json();
		if (data.error) {
			message = data.error.message || message;
			code = data.error.code || code;
			details = data.error.details;
		}
	} catch {
		// Response wasn't JSON, use status text
		message = response.statusText || message;
	}

	// Map HTTP status to error codes if not provided
	if (code === ErrorCodes.INTERNAL_ERROR) {
		switch (response.status) {
			case 400:
				code = ErrorCodes.VALIDATION_ERROR;
				break;
			case 401:
				code = ErrorCodes.UNAUTHORIZED;
				break;
			case 403:
				code = ErrorCodes.FORBIDDEN;
				break;
			case 404:
				code = ErrorCodes.NOT_FOUND;
				break;
		}
	}

	return new ApiError(message, code, response.status, details);
}

/**
 * Handle API error with user-friendly message
 */
export function handleApiError(error: unknown): string {
	if (isApiError(error)) {
		// Return user-friendly messages for known errors
		switch (error.code) {
			case ErrorCodes.UNAUTHORIZED:
				return 'Please log in to continue';
			case ErrorCodes.INVALID_CREDENTIALS:
				return 'Invalid email or password';
			case ErrorCodes.EMAIL_TAKEN:
				return 'This email is already registered';
			case ErrorCodes.SESSION_EXPIRED:
				return 'Your session has expired. Please log in again';
			case ErrorCodes.NOT_FOUND:
				return 'The requested resource was not found';
			case ErrorCodes.FORBIDDEN:
				return 'You do not have permission to perform this action';
			case ErrorCodes.VALIDATION_ERROR:
				return error.message || 'Please check your input and try again';
			case ErrorCodes.SUBSCRIPTION_REQUIRED:
				return 'This feature requires a subscription';
			case ErrorCodes.EXECUTION_TIMEOUT:
				return 'Code execution timed out. Check for infinite loops';
			case ErrorCodes.EXECUTION_ERROR:
				return 'Error running your code. Check the output for details';
			default:
				return error.message || 'Something went wrong. Please try again';
		}
	}

	if (error instanceof Error) {
		// Network errors
		if (error.message.includes('fetch')) {
			return 'Unable to connect to the server. Please check your connection';
		}
		return error.message;
	}

	return 'An unexpected error occurred';
}

/**
 * Error messages for common scenarios
 */
export const ErrorMessages = {
	NETWORK_ERROR: 'Unable to connect to the server. Please check your connection',
	UNKNOWN_ERROR: 'Something went wrong. Please try again',
	SESSION_EXPIRED: 'Your session has expired. Please log in again',
	RATE_LIMITED: 'Too many requests. Please wait a moment and try again',
} as const;

