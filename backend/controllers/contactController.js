import nodemailer from 'nodemailer'
import dotenv from 'dotenv';
dotenv.config();

// In-memory rate limiting store
// In production, you'd want to use Redis or a database
const rateLimitStore = new Map()

// Rate limit configuration
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5 // Max 5 submissions per 15 minutes per IP

// Clean up old rate limit entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, data] of rateLimitStore.entries()) {
    if (now - data.windowStart > RATE_LIMIT_WINDOW_MS) {
      rateLimitStore.delete(key)
    }
  }
}, 60000) // Clean up every minute

/**
 * HTML escape function to prevent XSS attacks
 * @param {string} str - The string to escape
 * @returns {string} - The escaped string
 */
const escapeHtml = (str) => {
  const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }
  return str.replace(/[&<>"']/g, char => htmlEscapes[char])
}

/**
 * Check if the request is rate limited
 * @param {string} ip - The client IP address
 * @returns {object} - { limited: boolean, remaining: number, resetTime: number }
 */
const checkRateLimit = (ip) => {
  const now = Date.now()
  const record = rateLimitStore.get(ip)

  if (!record || now - record.windowStart > RATE_LIMIT_WINDOW_MS) {
    // New window
    rateLimitStore.set(ip, {
      windowStart: now,
      count: 1
    })
    return { limited: false, remaining: MAX_REQUESTS_PER_WINDOW - 1, resetTime: now + RATE_LIMIT_WINDOW_MS }
  }

  // Existing window
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    const resetTime = record.windowStart + RATE_LIMIT_WINDOW_MS
    return { limited: true, remaining: 0, resetTime }
  }

  record.count++
  return { limited: false, remaining: MAX_REQUESTS_PER_WINDOW - record.count, resetTime: record.windowStart + RATE_LIMIT_WINDOW_MS }
}

/**
 * Create email transporter
 * This uses environment variables for configuration
 * In production, set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
 */
const createTransporter = () => {
  // Check if SMTP credentials are configured
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
  }
  
  // Return null if no SMTP is configured - we'll handle this gracefully
  return null
}

class ContactController {
  /**
   * Handle contact form submission
   */
  async submitContactForm(req, res) {
    try {
      const { name, email, message, website } = req.body
      
      // Honeypot check - if website field is filled, it's likely a bot
      // This field is hidden from real users but bots tend to fill all fields
      if (website && website.trim() !== '') {
        // Silently reject bot submissions with a fake success response
        // This makes it harder for bots to know they've been detected
        console.log('Bot submission detected via honeypot field')
        return res.status(200).json({ 
          success: true, 
          message: 'Thank you for your message. We will get back to you soon.' 
        })
      }

      // Get client IP for rate limiting
      const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || 
                       req.headers['x-real-ip'] || 
                       req.socket?.remoteAddress || 
                       'unknown'

      // Check rate limit
      const rateLimitResult = checkRateLimit(clientIp)
      if (rateLimitResult.limited) {
        const resetMinutes = Math.ceil((rateLimitResult.resetTime - Date.now()) / 60000)
        return res.status(429).json({ 
          error: 'Too many submissions. Please try again later.',
          retryAfter: resetMinutes
        })
      }

      // Validate required fields
      if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Name is required' })
      }
      
      if (!email || !email.trim()) {
        return res.status(400).json({ error: 'Email is required' })
      }
      
      if (!message || !message.trim()) {
        return res.status(400).json({ error: 'Message is required' })
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({ error: 'Please enter a valid email address' })
      }

      // Sanitize inputs and escape HTML for XSS prevention
      const sanitizedName = escapeHtml(name.trim().substring(0, 100))
      const sanitizedEmail = escapeHtml(email.trim().substring(0, 254))
      const sanitizedMessage = escapeHtml(message.trim().substring(0, 5000))

      // Create email content
      const emailContent = {
        from: process.env.SMTP_FROM || 'noreply@warriorcoming.com',
        to: 'info@warriorcoming.com',
        replyTo: sanitizedEmail,
        subject: `Contact Form Submission from ${sanitizedName}`,
        text: `
Name: ${sanitizedName}
Email: ${sanitizedEmail}

Message:
${sanitizedMessage}

---
This message was sent from the Warrior Coming contact form.
        `,
        html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #1a1a1a; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9f9f9; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #555; }
    .message { background-color: white; padding: 15px; border-left: 4px solid #6fa8dc; margin-top: 10px; }
    .footer { text-align: center; padding: 15px; color: #888; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Contact Form Submission</h2>
    </div>
    <div class="content">
      <div class="field">
        <span class="label">Name:</span> ${sanitizedName}
      </div>
      <div class="field">
        <span class="label">Email:</span> <a href="mailto:${sanitizedEmail}">${sanitizedEmail}</a>
      </div>
      <div class="field">
        <span class="label">Message:</span>
        <div class="message">${sanitizedMessage.replace(/\n/g, '<br>')}</div>
      </div>
    </div>
    <div class="footer">
      This message was sent from the Warrior Coming contact form.
    </div>
  </div>
</body>
</html>
        `
      }

      // Attempt to send email
      const transporter = createTransporter()
      
      if (transporter) {
        try {
          await transporter.sendMail(emailContent)
          console.log(`Contact form email sent successfully from ${sanitizedEmail}`)
        } catch (emailError) {
          console.error('Failed to send contact form email:', emailError.message)
          // Even if email fails, we return success to user
          // In production, you might want to queue the email for retry or log to database
        }
      } else {
        // No SMTP configured - log the message for manual handling
        console.log('=== Contact Form Submission (SMTP not configured) ===')
        console.log(`Name: ${sanitizedName}`)
        console.log(`Email: ${sanitizedEmail}`)
        console.log(`Message: ${sanitizedMessage}`)
        console.log('=====================================================')
      }

      // Return success response
      res.status(200).json({ 
        success: true, 
        message: 'Thank you for your message. We will get back to you soon.',
        remaining: rateLimitResult.remaining
      })

    } catch (error) {
      console.error('Contact form error:', error)
      res.status(500).json({ error: 'Failed to send message. Please try again later.' })
    }
  }
}

export default new ContactController()
