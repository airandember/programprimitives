// ============================================
// Supported Languages
// ============================================

import type { Language, LanguageInfo } from '../types/user';

export const Languages: Record<Language, LanguageInfo> = {
	javascript: {
		id: 'javascript',
		name: 'JavaScript',
		icon: '🟨',
		fileExtension: '.js',
		monacoLanguage: 'javascript',
	},
	typescript: {
		id: 'typescript',
		name: 'TypeScript',
		icon: '🔷',
		fileExtension: '.ts',
		monacoLanguage: 'typescript',
	},
	python: {
		id: 'python',
		name: 'Python',
		icon: '🐍',
		fileExtension: '.py',
		monacoLanguage: 'python',
	},
	go: {
		id: 'go',
		name: 'Go',
		icon: '🔵',
		fileExtension: '.go',
		monacoLanguage: 'go',
	},
	cpp: {
		id: 'cpp',
		name: 'C++',
		icon: '⚙️',
		fileExtension: '.cpp',
		monacoLanguage: 'cpp',
	},
	html: {
		id: 'html',
		name: 'HTML',
		icon: '🌐',
		fileExtension: '.html',
		monacoLanguage: 'html',
	},
	css: {
		id: 'css',
		name: 'CSS',
		icon: '🎨',
		fileExtension: '.css',
		monacoLanguage: 'css',
	},
};

export const LanguageList = Object.values(Languages);

export const DefaultLanguage: Language = 'javascript';

/**
 * Languages available per subscription tier
 */
export const LanguagesByTier = {
	free: ['javascript'] as Language[],
	learner: ['javascript', 'python', 'go'] as Language[],
	pro: ['javascript', 'typescript', 'python', 'go', 'cpp', 'html', 'css'] as Language[],
	team: ['javascript', 'typescript', 'python', 'go', 'cpp', 'html', 'css'] as Language[],
};

