# Multiple Sermon Images Feature

This document describes the new multiple images functionality added to the sermon management system.

## Overview

The application now supports uploading and managing multiple images per sermon, in addition to the existing single image field. Users can:

- Upload up to 10 additional images when creating a sermon
- Add more images to existing sermons 
- View and delete individual images
- Maintain backwards compatibility with the existing single image field

## Database Changes

### New Table: `sermon_images`

```sql
CREATE TABLE IF NOT EXISTS sermon_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sermon_id INT NOT NULL,
  image_file VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sermon_id) REFERENCES sermons(id) ON DELETE CASCADE,
  INDEX idx_sermon_id (sermon_id)
);
```

- **Foreign Key Relationship**: Images are automatically deleted when the parent sermon is deleted
- **Indexed**: Fast lookups by sermon_id

## API Endpoints

### New Endpoints

1. **POST /api/sermons/:id/images**
   - Add multiple images to an existing sermon
   - Accepts `imageFiles` field with up to 10 images

2. **GET /api/sermons/:id/images**
   - Get all images for a specific sermon
   - Returns array of image objects with id, sermonId, imageFile, createdAt

3. **DELETE /api/sermons/images/:imageId**
   - Delete a specific image by its ID
   - Removes both database record and physical file

### Updated Endpoints

1. **POST /api/sermons**
   - Now accepts optional `imageFiles` field for multiple images during creation
   - Maintains backward compatibility with `imageFile` field

2. **PUT /api/sermons/:id**
   - Now accepts optional `imageFiles` field for adding images during update
   - Maintains backward compatibility with `imageFile` field

3. **GET /api/sermons** and **GET /api/sermons/:id**
   - Now includes `images` array in sermon objects
   - Each image has: id, sermonId, imageFile, createdAt

## Frontend Changes

### Create Sermon Form

- **New Field**: "Additional Images" file upload (supports multiple selection)
- **Limit**: Up to 10 images can be selected
- **Feedback**: Shows count of selected images

### Sermon List Display

- **Image Preview**: Shows up to 3 image thumbnails
- **Overflow Indicator**: Shows "+N" when more than 3 images exist
- **Fallback**: Falls back to legacy single image if no multiple images exist

### Edit Sermon Dialog

- **Current Images Grid**: Displays all existing additional images
- **Individual Delete**: Each image has a delete button
- **Add More Images**: File upload to add additional images
- **Visual Feedback**: Shows count of newly selected images

## Backend Implementation

### New Model: `SermonImage`

```javascript
// Key methods:
- getBySermonId(sermonId)     // Get all images for a sermon
- addImages(sermonId, files)  // Add multiple images
- deleteImage(imageId)        // Delete specific image
- deleteAllBySermonId(id)     // Delete all images for sermon
```

### Updated Model: `Sermon`

```javascript
// New methods:
- addImages(sermonId, files)      // Wrapper for SermonImage.addImages
- deleteSermonImage(imageId)      // Wrapper for SermonImage.deleteImage  
- getSermonImages(sermonId)       // Wrapper for SermonImage.getBySermonId

// Updated methods:
- getAll()          // Now includes images array
- getById(id)       // Now includes images array  
- create(data)      // Now handles imageFiles parameter
- delete(id)        // Now deletes all associated images
```

## File Upload Configuration

- **Multiple Images**: Up to 10 files per request
- **File Size Limit**: 10MB per image file
- **Supported Formats**: All image/* MIME types
- **Storage**: Files stored in uploads directory with unique filenames

## Backwards Compatibility

The implementation maintains full backwards compatibility:

- Existing `image_file` column remains unchanged
- Legacy single image upload still works
- Existing sermons continue to display correctly
- API responses include both legacy and new image fields

## Usage Examples

### Creating a Sermon with Multiple Images

```javascript
const formData = new FormData()
formData.append('title', 'My Sermon')
formData.append('date', '2024-01-01')
formData.append('audioFile', audioFile)

// Legacy single image (optional)
formData.append('imageFile', primaryImage)

// Multiple additional images (optional)
images.forEach(image => {
  formData.append('imageFiles', image)
})

await axios.post('/api/sermons', formData)
```

### Adding Images to Existing Sermon

```javascript
const formData = new FormData()
images.forEach(image => {
  formData.append('imageFiles', image)
})

await axios.post(`/api/sermons/${sermonId}/images`, formData)
```

### Deleting a Specific Image

```javascript
await axios.delete(`/api/sermons/images/${imageId}`)
```

## Migration Notes

- **Database Migration**: Run the migration script to create the `sermon_images` table
- **No Data Loss**: Existing sermons and images are not affected
- **Gradual Adoption**: Users can start using multiple images immediately or continue with single images