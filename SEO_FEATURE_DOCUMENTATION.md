# SEO Title and Meta Description Feature

## Overview
This feature allows administrators to set custom SEO-optimized titles and meta descriptions for individual sermon and music pages to improve search engine optimization.

## Features
- **Custom SEO Titles**: Override the default page title with an SEO-optimized version
- **Custom Meta Descriptions**: Provide search-engine-friendly descriptions (recommended: 150-160 characters)
- **Fallback Support**: If no SEO values are set, the system uses regular titles and descriptions
- **Dynamic Updates**: Page metadata updates automatically when users navigate between items

## Database Changes

### New Columns
Two new columns have been added to both `sermons` and `music` tables:
- `seo_title` (VARCHAR 255, nullable)
- `seo_description` (TEXT, nullable)

### Running Migrations
To apply the database changes, run the migration script:

```bash
cd backend
node run-migrations.js
```

The script will:
- Connect to your MySQL database
- Run all migration files in order
- Skip any already-applied migrations
- Provide clear success/error messages

## Admin Interface

### Creating/Editing Sermons
1. Navigate to Admin → Sermons tab
2. In the sermon form, you'll find two new optional fields:
   - **SEO Title**: Custom title for search results
   - **SEO Meta Description**: Brief description for search results (150-160 chars recommended)
3. Fill these fields if you want custom SEO values
4. Leave them empty to use the regular title and description

### Creating/Editing Music
1. Navigate to Admin → Music tab
2. Similar to sermons, you'll find:
   - **SEO Title**: Custom title for search results
   - **SEO Meta Description**: Brief description for search results
3. Fill or leave empty as needed

## How It Works

### Frontend Behavior
When a user visits a sermon or music page:
1. The page title updates to: `[SEO Title or Regular Title] - Warrior Coming`
2. The meta description updates to the SEO description or falls back to the regular description
3. If no description is available, the meta tag content is set to empty

### Example
For a sermon titled "The Power of Prayer" with:
- SEO Title: "Discover the Power of Prayer | Biblical Teaching"
- SEO Description: "Learn about the transformative power of prayer through biblical examples and practical guidance for your spiritual journey."

The page will show:
- Document Title: "Discover the Power of Prayer | Biblical Teaching - Warrior Coming"
- Meta Description: "Learn about the transformative power of prayer..."

## API Endpoints

### Sermons
- `GET /api/sermons` - Returns all sermons including SEO fields
- `GET /api/sermons/:id` - Returns a specific sermon including SEO fields
- `POST /api/sermons` - Create sermon (accepts seoTitle and seoDescription)
- `PUT /api/sermons/:id` - Update sermon (accepts seoTitle and seoDescription)

### Music
- `GET /api/music` - Returns all music including SEO fields
- `GET /api/music/:id` - Returns a specific music item including SEO fields
- `POST /api/music` - Create music (accepts seoTitle and seoDescription)
- `PUT /api/music/:id` - Update music (accepts seoTitle and seoDescription)

## Best Practices

### SEO Title Guidelines
- Keep it under 60 characters
- Include primary keywords
- Make it compelling and clickable
- Avoid keyword stuffing

### SEO Description Guidelines
- Aim for 150-160 characters
- Include a clear call-to-action
- Use natural language
- Include relevant keywords naturally
- Accurately describe the content

## Technical Details

### Files Modified
**Backend:**
- `backend/models/Sermon.js` - Added SEO field handling
- `backend/models/Music.js` - Added SEO field handling
- `backend/controllers/sermonController.js` - Added SEO field processing
- `backend/controllers/musicController.js` - Added SEO field processing
- `backend/sql/migrations/004_add_seo_fields_sermons.sql` - Sermon table migration
- `backend/sql/migrations/005_add_seo_fields_music.sql` - Music table migration
- `backend/run-migrations.js` - Migration runner script

**Frontend:**
- `frontend/src/views/Admin.vue` - Added SEO input fields
- `frontend/src/views/Sermons.vue` - Dynamic metadata updates
- `frontend/src/views/Music.vue` - Dynamic metadata updates
- `frontend/src/utils/seo.ts` - Shared metadata utility function

### TypeScript Interfaces
```typescript
interface Sermon {
  // ... existing fields
  seoTitle?: string
  seoDescription?: string
}

interface Music {
  // ... existing fields
  seoTitle?: string
  seoDescription?: string
}
```

## Troubleshooting

### Migrations Won't Run
- Ensure MySQL is running
- Check database credentials in environment variables
- Verify the database exists
- Check file permissions on migration files

### SEO Fields Not Showing in Admin
- Clear browser cache
- Rebuild frontend: `cd frontend && npm run build`
- Restart the server

### Meta Tags Not Updating
- Check browser developer console for errors
- Verify the sermon/music has been saved with SEO values
- Check that the API is returning the SEO fields

## Rollback
If you need to rollback the changes:

```sql
USE warriorc_db;
ALTER TABLE sermons DROP COLUMN IF EXISTS seo_title;
ALTER TABLE sermons DROP COLUMN IF EXISTS seo_description;
ALTER TABLE music DROP COLUMN IF EXISTS seo_title;
ALTER TABLE music DROP COLUMN IF EXISTS seo_description;
```

## Future Enhancements
Potential improvements for future versions:
- Character counters for optimal lengths
- SEO preview snippet
- Bulk SEO editing
- SEO analytics integration
- Schema.org structured data
