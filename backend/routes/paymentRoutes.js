const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

// Setup your nodemailer Gmail transporter (assuming env variables set)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,       // your Gmail
    pass: process.env.GMAIL_APP_PASSWORD // app password
  }
});

// Verify Razorpay webhook signature
function verifySignature(body, signature) {
  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest('hex');
  return expectedSignature === signature;
}

router.post('/razorpay/webhook', express.json(), async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const bodyString = JSON.stringify(req.body);

  if (!verifySignature(bodyString, signature)) {
    return res.status(400).json({ message: 'Invalid signature' });
  }

  const event = req.body.event;
  if (event === 'payment.captured') {
    try {
      const paymentEntity = req.body.payload.payment.entity;
      const notes = paymentEntity.notes || {};

      // Extract email and registrationId from notes
      const email = notes.email;
      const registrationId = notes.registrationId;
      const fullName = notes.fullName || 'Participant';

      if (!email) {
        return res.status(400).json({ message: 'Email not found in payment notes' });
      }

      // Compose email
      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Registration Confirmation',
        text: `Hello ${fullName},

Your payment with registration ID ${registrationId} has been successfully received.

Thank you for registering!

Best regards,
Your Team`
      };

      await transporter.sendMail(mailOptions);

      return res.json({ message: 'Email sent successfully' });
    } catch (err) {
      console.error('Error handling payment.captured webhook:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // For other events, just respond OK
  return res.json({ message: 'Webhook received' });
});

module.exports = router;
