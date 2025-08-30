import Blog from '../models/Blog.js'

class BlogController {
  /**
   * Get all blogs
   */
  async getAllBlogs(req, res) {
    try {
      const blogs = await Blog.getAll()
      res.json(blogs)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch blogs' })
    }
  }

  /**
   * Get blog by ID
   */
  async getBlogById(req, res) {
    try {
      const blog = await Blog.getById(req.params.id)
      if (!blog) {
        return res.status(404).json({ error: 'Blog not found' })
      }
      res.json(blog)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch blog' })
    }
  }

  /**
   * Create new blog
   */
  async createBlog(req, res) {
    try {
      const { title, date, content } = req.body
      
      if (!title || !date || !content) {
        return res.status(400).json({ error: 'Title, date, and content are required' })
      }

      const blogData = {
        title,
        date,
        content
      }

      const newBlog = await Blog.create(blogData)
      res.status(201).json(newBlog)
    } catch (error) {
      res.status(500).json({ error: 'Failed to create blog' })
    }
  }

  /**
   * Update existing blog
   */
  async updateBlog(req, res) {
    try {
      const { id } = req.params
      const { title, date, content } = req.body
      
      if (!title || !date || !content) {
        return res.status(400).json({ error: 'Title, date, and content are required' })
      }

      const updateData = {
        title,
        date,
        content
      }

      const updatedBlog = await Blog.update(id, updateData)
      
      if (!updatedBlog) {
        return res.status(404).json({ error: 'Blog not found' })
      }

      res.json(updatedBlog)
    } catch (error) {
      res.status(500).json({ error: 'Failed to update blog' })
    }
  }

  /**
   * Update blog order
   */
  async reorderBlogs(req, res) {
    try {
      const { blogIds } = req.body
      
      if (!Array.isArray(blogIds)) {
        return res.status(400).json({ error: 'Blog IDs must be an array' })
      }

      await Blog.reorder(blogIds)
      res.json({ message: 'Blogs reordered successfully' })
    } catch (error) {
      res.status(500).json({ error: 'Failed to reorder blogs' })
    }
  }

  /**
   * Delete blog
   */
  async deleteBlog(req, res) {
    try {
      const { id } = req.params
      
      const deletedBlog = await Blog.delete(id)
      
      if (!deletedBlog) {
        return res.status(404).json({ error: 'Blog not found' })
      }

      res.json({ message: 'Blog deleted successfully' })
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete blog' })
    }
  }
}

export default new BlogController()