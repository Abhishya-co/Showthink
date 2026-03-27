import express from 'express';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Contact Form
  app.post('/api/contact', async (req, res) => {
    const { name, email, phone, service, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Configure Nodemailer
    // NOTE: User must provide GMAIL_USER and GMAIL_PASS in environment variables
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS, // Use an App Password for Gmail
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER || 'contact-form@showthink.com',
      to: 'senking251@gmail.com', // User's email
      subject: `New Contact Form Submission from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Service: ${service}
        Message: ${message}
      `,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    };

    try {
      if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
        console.warn('GMAIL_USER or GMAIL_PASS not set. Email not sent.');
        return res.status(200).json({ 
          success: true, 
          message: 'Message received (Email not sent because credentials are not configured)' 
        });
      }

      await transporter.sendMail(mailOptions);
      res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  });

  // API Route for Hostinger Domain Check
  app.get('/api/domain/check', async (req, res) => {
    const { domain } = req.query;

    if (!domain || typeof domain !== 'string') {
      return res.status(400).json({ error: 'Domain name is required' });
    }

    const token = process.env.HOSTINGER_API_TOKEN;

    if (!token) {
      console.warn('HOSTINGER_API_TOKEN not set. Using simulated response.');
      // Fallback to simulation if no token is provided
      const isAvailable = Math.random() > 0.3;
      return res.json({
        available: isAvailable,
        price: isAvailable ? '999' : null,
        currency: 'INR',
        simulated: true
      });
    }

    try {
      // Hostinger API call
      // Note: This is a common pattern for registrar APIs. 
      // Adjust the URL/headers if the specific Hostinger endpoint differs.
      const response = await fetch(`https://api.hostinger.com/v1/domains/check?domain=${domain}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Hostinger API responded with ${response.status}`);
      }

      const data = await response.json();
      
      // Assuming Hostinger returns something like { available: true, price: 10.99, ... }
      res.json({
        available: data.available,
        price: data.price || '999',
        currency: data.currency || 'INR',
        simulated: false
      });
    } catch (error) {
      console.error('Hostinger API Error:', error);
      res.status(500).json({ error: 'Failed to check domain availability via Hostinger' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
