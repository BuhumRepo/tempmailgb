-- TempMail D1 Database Schema

-- Emails table - stores generated temporary email addresses
CREATE TABLE IF NOT EXISTS emails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  address TEXT UNIQUE NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

-- Inbox table - stores received emails
CREATE TABLE IF NOT EXISTS inbox (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email_address TEXT NOT NULL,
  from_address TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  read INTEGER DEFAULT 0,
  FOREIGN KEY (email_address) REFERENCES emails(address) ON DELETE CASCADE
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_email_address ON inbox(email_address);
CREATE INDEX IF NOT EXISTS idx_expires ON emails(expires_at);
CREATE INDEX IF NOT EXISTS idx_timestamp ON inbox(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_read ON inbox(read);
