const portfolioData = require('../src/content/portfolioData.json');

const RESEND_API_URL = process.env.RESEND_API_URL || 'https://api.resend.com/emails';

const readJsonBody = (req) => {
  if (typeof req.body === 'object' && req.body !== null) {
    return req.body;
  }

  if (typeof req.body === 'string' && req.body.trim()) {
    try {
      return JSON.parse(req.body);
    } catch {
      return null;
    }
  }

  return null;
};

const escapeHtml = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const emailClient = {
  apiKey: process.env.RESEND_API_KEY,
  from: process.env.EMAIL_FROM || 'Portfolio <onboarding@resend.dev>',
  to: process.env.EMAIL_TO
};

const sendEmail = async (mailOptions) => {
  try {
    if (!emailClient.apiKey) {
      console.warn('⚠️  Email service not initialized, skipping email');
      return null;
    }

    const payload = {
      from: mailOptions.from || emailClient.from,
      to: emailClient.to,
      subject: mailOptions.subject,
      html: mailOptions.html,
      text: mailOptions.text,
      reply_to: mailOptions.replyTo,
    };

    const response = await fetch(RESEND_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${emailClient.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Resend API error: ${response.status} ${errorBody}`);
    }

    const info = await response.json();
    console.log('✓ Email sent:', info.id);
    return info;
  } catch (error) {
    console.error('✗ Email sending failed:', error.message);
    return null;
  }
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = readJsonBody(req);
  if (!body) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  const { name, email, subject, message } = body;
  const fields = {};

  if (!name?.trim()) fields.name = 'Name is required.';
  if (!email?.trim()) fields.email = 'Email is required.';
  if (!subject?.trim()) fields.subject = 'Subject is required.';
  if (!message?.trim()) fields.message = 'Message is required.';

  if (Object.keys(fields).length > 0) {
    return res.status(400).json({ error: 'Validation failed', fields });
  }

  const toEmail = process.env.CONTACT_TO_EMAIL || portfolioData?.about?.email;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>';

  if (!toEmail) {
    return res.status(500).json({ error: 'CONTACT_TO_EMAIL is not configured.' });
  }

  const info = await sendEmail({
    from: fromEmail,
    to: [toEmail],
    subject: `Portfolio contact: ${subject}`,
    replyTo: email,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Subject: ${subject}`,
      '',
      message,
    ].join('\n'),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6">
        <h2>New portfolio contact submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
      </div>
    `,
  });

  if (!info) {
    return res.status(502).json({ error: 'Failed to send email via Resend.' });
  }

  return res.status(200).json({ success: true });
};
