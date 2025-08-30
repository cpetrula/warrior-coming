import express from 'express'
import blogController from '../controllers/blogController.js'

const router = express.Router()

// Get all blogs
router.get('/', blogController.getAllBlogs)

// Get blog by ID
router.get('/:id', blogController.getBlogById)

// Create new blog
router.post('/', blogController.createBlog)

// Update existing blog
router.put('/:id', blogController.updateBlog)

// Update blog order
router.patch('/reorder', blogController.reorderBlogs)

// Delete blog
router.delete('/:id', blogController.deleteBlog)

export default router