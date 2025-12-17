// ============================================
// Formatting Utilities
// ============================================

/**
 * Format a number with commas (e.g., 1,234,567)
 */
export function formatNumber(num: number): string {
	return num.toLocaleString('en-US');
}

/**
 * Format a duration in seconds to human readable (e.g., "5m 30s")
 */
export function formatDuration(seconds: number): string {
	if (seconds < 60) {
		return `${seconds}s`;
	}
	
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	
	if (minutes < 60) {
		return remainingSeconds > 0
			? `${minutes}m ${remainingSeconds}s`
			: `${minutes}m`;
	}
	
	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;
	
	if (hours < 24) {
		return remainingMinutes > 0
			? `${hours}h ${remainingMinutes}m`
			: `${hours}h`;
	}
	
	const days = Math.floor(hours / 24);
	const remainingHours = hours % 24;
	
	return remainingHours > 0
		? `${days}d ${remainingHours}h`
		: `${days}d`;
}

/**
 * Format minutes to human readable (e.g., "2h 30m")
 */
export function formatMinutes(minutes: number): string {
	return formatDuration(minutes * 60);
}

/**
 * Format a date to relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
	const now = new Date();
	const target = typeof date === 'string' ? new Date(date) : date;
	const diffMs = now.getTime() - target.getTime();
	const diffSeconds = Math.floor(diffMs / 1000);
	
	if (diffSeconds < 60) {
		return 'just now';
	}
	
	const diffMinutes = Math.floor(diffSeconds / 60);
	if (diffMinutes < 60) {
		return `${diffMinutes}m ago`;
	}
	
	const diffHours = Math.floor(diffMinutes / 60);
	if (diffHours < 24) {
		return `${diffHours}h ago`;
	}
	
	const diffDays = Math.floor(diffHours / 24);
	if (diffDays < 7) {
		return `${diffDays}d ago`;
	}
	
	if (diffDays < 30) {
		const weeks = Math.floor(diffDays / 7);
		return `${weeks}w ago`;
	}
	
	if (diffDays < 365) {
		const months = Math.floor(diffDays / 30);
		return `${months}mo ago`;
	}
	
	const years = Math.floor(diffDays / 365);
	return `${years}y ago`;
}

/**
 * Format a date to locale string (e.g., "Dec 17, 2024")
 */
export function formatDate(date: Date | string): string {
	const target = typeof date === 'string' ? new Date(date) : date;
	return target.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
}

/**
 * Format XP with suffix (e.g., "1.2k", "3.5M")
 */
export function formatXP(xp: number): string {
	if (xp < 1000) {
		return String(xp);
	}
	if (xp < 1000000) {
		return `${(xp / 1000).toFixed(1).replace(/\.0$/, '')}k`;
	}
	return `${(xp / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
}

/**
 * Format percentage (e.g., "85%")
 */
export function formatPercentage(value: number, decimals = 0): string {
	return `${value.toFixed(decimals)}%`;
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert slug to title case (e.g., "for-loop" -> "For Loop")
 */
export function slugToTitle(slug: string): string {
	return slug
		.split('-')
		.map(word => capitalize(word))
		.join(' ');
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
	if (str.length <= maxLength) return str;
	return str.slice(0, maxLength - 3) + '...';
}

/**
 * Pluralize a word (simple version)
 */
export function pluralize(count: number, singular: string, plural?: string): string {
	const pluralForm = plural || `${singular}s`;
	return count === 1 ? singular : pluralForm;
}

/**
 * Format count with label (e.g., "5 exercises", "1 primitive")
 */
export function formatCount(count: number, singular: string, plural?: string): string {
	return `${formatNumber(count)} ${pluralize(count, singular, plural)}`;
}

