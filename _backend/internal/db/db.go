// Package db provides database initialization and utilities
package db

import (
	"database/sql"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strings"

	_ "github.com/mattn/go-sqlite3"
)

// Initialize creates and opens the SQLite database
func Initialize(dbPath string) (*sql.DB, error) {
	// Ensure directory exists
	dir := filepath.Dir(dbPath)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return nil, fmt.Errorf("failed to create database directory: %w", err)
	}

	// Open database with WAL mode for better concurrent access
	db, err := sql.Open("sqlite3", dbPath+"?_journal_mode=WAL&_busy_timeout=5000&_foreign_keys=ON")
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	// Test connection
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	// Set connection pool settings
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(5)

	log.Printf("✅ Database initialized: %s", dbPath)
	return db, nil
}

// RunMigrations executes all SQL migration files in order
func RunMigrations(db *sql.DB, migrationsDir string) error {
	// Create migrations tracking table
	_, err := db.Exec(`
		CREATE TABLE IF NOT EXISTS _migrations (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			filename TEXT NOT NULL UNIQUE,
			applied_at TEXT NOT NULL DEFAULT (datetime('now'))
		)
	`)
	if err != nil {
		return fmt.Errorf("failed to create migrations table: %w", err)
	}

	// Get list of migration files
	files, err := ioutil.ReadDir(migrationsDir)
	if err != nil {
		log.Printf("⚠️  Migrations directory not found: %s", migrationsDir)
		return nil
	}

	// Sort files by name (they should be numbered like 001_*, 002_*, etc.)
	var migrationFiles []string
	for _, f := range files {
		if !f.IsDir() && strings.HasSuffix(f.Name(), ".sql") {
			migrationFiles = append(migrationFiles, f.Name())
		}
	}
	sort.Strings(migrationFiles)

	// Apply each migration if not already applied
	for _, filename := range migrationFiles {
		// Check if already applied
		var count int
		err := db.QueryRow("SELECT COUNT(*) FROM _migrations WHERE filename = ?", filename).Scan(&count)
		if err != nil {
			return fmt.Errorf("failed to check migration status: %w", err)
		}

		if count > 0 {
			log.Printf("⏭️  Skipping migration (already applied): %s", filename)
			continue
		}

		// Read and execute migration
		content, err := ioutil.ReadFile(filepath.Join(migrationsDir, filename))
		if err != nil {
			return fmt.Errorf("failed to read migration %s: %w", filename, err)
		}

		log.Printf("▶️  Applying migration: %s", filename)
		
		// Execute migration in a transaction
		tx, err := db.Begin()
		if err != nil {
			return fmt.Errorf("failed to begin transaction: %w", err)
		}

		// Split by semicolons and execute each statement
		statements := strings.Split(string(content), ";")
		executedCount := 0
		for i, stmt := range statements {
			// Strip leading comment lines and whitespace
			stmt = stripSQLComments(stmt)
			if stmt == "" {
				continue
			}
			
			log.Printf("   📝 Executing statement %d: %s...", i+1, truncate(stmt, 60))
			
			if _, err := tx.Exec(stmt); err != nil {
				// Handle idempotent errors gracefully (duplicate columns, etc.)
				errStr := err.Error()
				if strings.Contains(errStr, "duplicate column") ||
					strings.Contains(errStr, "already exists") ||
					strings.Contains(errStr, "UNIQUE constraint failed: _migrations") {
					log.Printf("   ⚠️  Skipping (already exists): statement %d", i+1)
					continue
				}
				tx.Rollback()
				return fmt.Errorf("failed to execute migration %s (statement %d): %w\nStatement: %s", filename, i+1, err, truncate(stmt, 100))
			}
			executedCount++
		}
		
		if executedCount == 0 {
			tx.Rollback()
			return fmt.Errorf("migration %s has no executable statements", filename)
		}

		// Record migration
		if _, err := tx.Exec("INSERT INTO _migrations (filename) VALUES (?)", filename); err != nil {
			tx.Rollback()
			return fmt.Errorf("failed to record migration: %w", err)
		}

		if err := tx.Commit(); err != nil {
			return fmt.Errorf("failed to commit migration: %w", err)
		}

		log.Printf("✅ Applied migration: %s", filename)
	}

	return nil
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

// stripSQLComments removes leading SQL comment lines from a statement
// This fixes the bug where statements starting with -- comments were skipped entirely
func stripSQLComments(stmt string) string {
	lines := strings.Split(stmt, "\n")
	result := []string{}
	
	for _, line := range lines {
		trimmed := strings.TrimSpace(line)
		// Skip empty lines and full comment lines at the start
		if trimmed == "" || strings.HasPrefix(trimmed, "--") {
			// Only skip if we haven't found any SQL yet
			if len(result) == 0 {
				continue
			}
		}
		result = append(result, line)
	}
	
	return strings.TrimSpace(strings.Join(result, "\n"))
}

// truncate shortens a string for logging
func truncate(s string, maxLen int) string {
	// Replace newlines with spaces for cleaner logging
	s = strings.ReplaceAll(s, "\n", " ")
	s = strings.ReplaceAll(s, "\t", " ")
	// Collapse multiple spaces
	for strings.Contains(s, "  ") {
		s = strings.ReplaceAll(s, "  ", " ")
	}
	s = strings.TrimSpace(s)
	
	if len(s) <= maxLen {
		return s
	}
	return s[:maxLen] + "..."
}
