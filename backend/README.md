# Backend MVC Structure

This backend follows the Model-View-Controller (MVC) architectural pattern for better code organization and maintainability.

## Directory Structure

```
backend/
├── server.js              # Main server setup and application entry point
├── config/                 # Configuration files
│   └── multer.js          # File upload configuration (multer setup)
├── models/                 # Data models and business logic
│   └── Sermon.js          # Sermon data model with CRUD operations
├── controllers/            # Request handlers and business logic
│   └── sermonController.js # Sermon API endpoint handlers
└── routes/                 # Route definitions
    └── sermons.js         # Sermon route definitions
```

## MVC Components

### Models (`models/`)
- **Sermon.js**: Handles all data operations for sermons
  - In-memory storage management
  - CRUD operations (Create, Read, Update, Delete)
  - Data validation and business rules
  - File management for sermon attachments

### Views
- API responses (JSON format)
- Static file serving for frontend assets
- No traditional views since this is an API server

### Controllers (`controllers/`)
- **sermonController.js**: Handles HTTP requests and responses
  - Request validation
  - Business logic coordination
  - Error handling
  - Response formatting

### Routes (`routes/`)
- **sermons.js**: Route definitions for sermon endpoints
  - URL pattern definitions
  - Middleware application (file uploads)
  - Controller method mapping

### Configuration (`config/`)
- **multer.js**: File upload configuration
  - Storage settings
  - File size limits
  - Upload directory management

## API Endpoints

All sermon endpoints are prefixed with `/api/sermons`:

- `GET /api/sermons` - Get all sermons
- `GET /api/sermons/:id` - Get sermon by ID
- `POST /api/sermons` - Create new sermon (with file upload)
- `PATCH /api/sermons/reorder` - Update sermon order
- `DELETE /api/sermons/:id` - Delete sermon

## Running the Server

From the project root:
```bash
npm install              # Install dependencies
cd backend
node server.js          # Start the server
```

The server will run on `http://localhost:3000`

## Benefits of This Structure

1. **Separation of Concerns**: Each component has a specific responsibility
2. **Maintainability**: Easier to locate and modify specific functionality
3. **Testability**: Individual components can be tested in isolation
4. **Scalability**: Easy to add new models, controllers, and routes
5. **Reusability**: Components can be reused across different parts of the application