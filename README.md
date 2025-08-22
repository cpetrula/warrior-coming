# warrior-coming

A web application for managing and displaying sermon content with audio playback capabilities.

## Features

- **Sermon Management**: Upload, edit, and organize sermons with audio files, optional images, and PDF notes
- **Audio Player**: Built-in audio player with playback controls
- **Admin Interface**: Administrative dashboard for content management with PDF notes support
- **MySQL Database**: Persistent storage using MySQL database

## Setup

### Prerequisites

- Node.js (v16 or higher)
- MySQL Server (v5.7 or higher)
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd warrior-coming
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd frontend && npm install
   ```

3. **Set up MySQL database**
   ```bash
   cd backend
   node setup-db.js
   ```
   
   For detailed database setup instructions, see [backend/DATABASE_SETUP.md](backend/DATABASE_SETUP.md)

4. **Build and start the application**
   ```bash
   # Build frontend
   cd frontend && npm run build
   
   # Start backend server
   cd ../backend && node server.js
   ```

5. **Access the application**
   - Main application: http://localhost:3000
   - Admin interface: http://localhost:3000/admin

## Configuration

Database settings can be configured using environment variables:

- `DB_HOST` - Database host (default: localhost)
- `DB_USER` - Database username (default: root)  
- `DB_PASSWORD` - Database password (default: empty)
- `DB_NAME` - Database name (default: warriorc_db)
- `DB_PORT` - Database port (default: 3306)

## Project Structure

- `frontend/` - Vue.js frontend application
- `backend/` - Node.js/Express backend API
  - `models/` - Database models
  - `controllers/` - API controllers
  - `routes/` - API routes
  - `config/` - Configuration files
  - `sql/` - Database schema files