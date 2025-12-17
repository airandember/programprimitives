// ============================================
// CORE BRAID - Main Exports
// ============================================
// 
// This is the foundation braid providing shared types,
// validation, API client, and utilities for all other braids.
//
// Usage in frontend:
//   import { type User, type Primitive } from '@braids/core';
//   import { registerSchema, loginSchema } from '@braids/core/validation';
//   import { api, ApiError } from '@braids/core/api';
//   import { formatDuration, debounce } from '@braids/core/utils';
//
// ============================================

// Types
export * from './types';

// Constants
export * from './constants';

// Note: Validation, API, and Utils should be imported directly
// from their subpaths for better tree-shaking:
//   import { ... } from '@braids/core/validation';
//   import { ... } from '@braids/core/api';
//   import { ... } from '@braids/core/utils';

