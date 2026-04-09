const nodemailer = require('nodemailer');

// Create reusable transporter using values from .env
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for port 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Use app password for Gmail
    },
  });
};

/**
 * Send the Microsoft Teams meeting link to the student.
 */
const sendMeetingLinkEmail = async ({ studentEmail, studentName, meetingLink, sessionTime, mentorName }) => {
  const transporter = createTransporter();

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8"/>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #f3f4f6; margin: 0; padding: 0; }
        .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 36px 40px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.3px; }
        .header p { color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 14px; }
        .body { padding: 36px 40px; }
        .greeting { font-size: 18px; font-weight: 600; color: #1e293b; margin-bottom: 12px; }
        .message { font-size: 15px; color: #475569; line-height: 1.7; margin-bottom: 28px; }
        .info-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px 24px; margin-bottom: 28px; }
        .info-box p { margin: 4px 0; font-size: 14px; color: #64748b; }
        .info-box strong { color: #1e293b; }
        .join-btn { display: block; text-align: center; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-size: 16px; font-weight: 700; margin-bottom: 20px; letter-spacing: 0.2px; }
        .link-fallback { font-size: 12px; color: #94a3b8; text-align: center; word-break: break-all; }
        .link-fallback a { color: #6366f1; }
        .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 40px; text-align: center; font-size: 12px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <h1>🎓 Your Mentorship Session Has Started</h1>
          <p>You have an upcoming session waiting for you</p>
        </div>
        <div class="body">
          <p class="greeting">Hello ${studentName},</p>
          <p class="message">
            Your mentorship session has started. Your mentor <strong>${mentorName || 'your mentor'}</strong> is ready and waiting for you. 
            Please join as soon as possible using the Microsoft Teams link below.
          </p>

          <div class="info-box">
            <p>📅 <strong>Session Time:</strong> ${sessionTime || 'Now'}</p>
            <p>👨‍🏫 <strong>Mentor:</strong> ${mentorName || 'Your Mentor'}</p>
            <p>🔗 <strong>Platform:</strong> Microsoft Teams</p>
          </div>

          <a href="${meetingLink}" class="join-btn" target="_blank">
            Join Microsoft Teams Meeting →
          </a>

          <p class="link-fallback">
            If the button doesn't work, copy and paste this link into your browser:<br/>
            <a href="${meetingLink}">${meetingLink}</a>
          </p>
        </div>
        <div class="footer">
          Mentorship Platform &bull; This is an automated notification. Please do not reply to this email.
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: `"Mentorship Platform" <${process.env.EMAIL_USER}>`,
    to: studentEmail,
    subject: 'Your Mentorship Session – Join via Microsoft Teams',
    html: htmlBody,
    text: `Hello ${studentName},\n\nYour mentorship session has started.\n\nJoin the session using this Microsoft Teams link:\n${meetingLink}\n\nTime: ${sessionTime || 'Now'}\n\nJoin as soon as possible.\n\nRegards,\nMentorship Platform`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendMeetingLinkEmail };
