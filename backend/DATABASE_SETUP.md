# MySQL Database Setup

This document describes how to set up the MySQL database for the Warrior Coming application.

## Prerequisites

- MySQL Server 5.7 or higher
- Node.js with npm

## Database Configuration

The application uses the following database configuration:

- **Database Name**: `warriorc_db`
- **Host**: localhost (configurable via `DB_HOST` environment variable)
- **Port**: 3306 (configurable via `DB_PORT` environment variable)
- **Username**: root (configurable via `DB_USER` environment variable)
- **Password**: empty (configurable via `DB_PASSWORD` environment variable)

## Setup Instructions

1. **Install MySQL Server** (if not already installed)
   
2. **Start MySQL Service**
   ```bash
   # On Ubuntu/Debian
   sudo service mysql start
   
   # On macOS with Homebrew
   brew services start mysql
   
   # On Windows
   net start mysql
   ```

3. **Run the database setup script**
   ```bash
   cd backend
   node setup-db.js
   ```

4. **Set environment variables** (optional)
   Create a `.env` file in the backend directory:
   ```bash
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_PORT=3306
   DB_NAME=warriorc_db
   ```

## Database Schema

The application creates the following table:

### `sermons` table
- `id` - Primary key (auto-increment)
- `title` - Sermon title (VARCHAR 255, NOT NULL)
- `date` - Sermon date (DATE, NOT NULL)
- `description` - Sermon description (TEXT)
- `audio_file` - Audio file name (VARCHAR 255, NOT NULL)
- `image_file` - Image file name (VARCHAR 255)
- `notes_file` - Sermon notes PDF file name (VARCHAR 255)
- `sermon_order` - Display order (INT, default 0)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## Manual Setup

If you prefer to set up the database manually:

1. Connect to MySQL:
   ```bash
   mysql -u root -p
   ```

2. Run the SQL commands from `sql/schema.sql`:
   ```sql
   CREATE DATABASE IF NOT EXISTS warriorc_db;
   USE warriorc_db;
   -- (rest of the schema)
   ```

## Troubleshooting

### Connection Issues
- Verify MySQL is running
- Check credentials and host/port settings
- Ensure the user has necessary permissions

### Permission Issues
```sql
-- Grant permissions to user
GRANT ALL PRIVILEGES ON warriorc_db.* TO 'username'@'localhost';
FLUSH PRIVILEGES;
```

### Reset Database
To completely reset the database:
```sql
DROP DATABASE IF EXISTS warriorc_db;
```
Then run the setup script again.