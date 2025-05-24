import dotenv from 'dotenv';
import nodemailer from "nodemailer";

dotenv.config();

// Create a transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

let sendMail = async ({ email, type, payload }) => {
    let subject;
    let html;

        switch (type) {
        case 1:
            subject = "Email Verification";
            html = html1(payload);
            break;
        case 2:
            subject = "Forgot Password";
            html = html2(payload);
            break;
        case 3:
            subject = "Account Deletion Request";
            html = html3(payload);
            break;
        case 4:
            subject = "New Package Submitted";
            html = html4(payload);
            break;
        case 5:
            subject = "Package Update Notification";
            html = html5(payload);
            break;
        default:
            subject = "Notification";
            html = "<p>No content</p>";
    }

    const mailOptions = {
        from: 'devrajeshthapa@gmail.com',
        to: email,
        subject,
        html,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            // console.log('Error:', error);
        } else {
            // console.log('Email sent:', info.response);
        }
    });
}

function html1({ otp, firstName, lastName }) {
    return `
<html>
<body>
    <div>
        <strong>Dear ${firstName} ${lastName},</strong>
        <p>Use the following One-Time Password (OTP) to complete your account registration. This code is valid for 3 minutes.</p>
        <div><strong>OTP code:</strong> ${otp}</div>
        <p>If you did not request this code, please ignore this email.</p>
        <div>
            <strong>Sincerely,</strong>
            <br />
            Order Instant
        </div>
        <br />
        <div style="color: #999; text-align: center;">
            &copy; 2025 Instant Order. All rights reserved.
        </div>
    </div>
</body>
</html>
    `;
}

function html2({ otp, firstName, lastName }) {
    return `
<html>
<body>
    <div>
        <strong>Dear ${firstName} ${lastName},</strong>
        <p>We received a request to reset your password. Use the following One-Time Password (OTP) to proceed. This code is valid for 3 minutes.</p>
        <div><strong>OTP code:</strong> ${otp}</div>
        <p>If you did not request a password reset, please ignore this email or contact support immediately.</p>
        <div>
            <strong>Sincerely,</strong>
            <br />
            Order Instant
        </div>
        <br />
        <div style="color: #999; text-align: center;">
            &copy; 2025 Instant Order. All rights reserved.
        </div>
    </div>
</body>
</html>
    `;
}

function html3({ otp, firstName, lastName }) {
    return `
<html>
<body>
    <div>
        <strong>Dear ${firstName} ${lastName},</strong>
        <p>We received a request to delete your account. Use the OTP below to confirm. This code is valid for 3 minutes.</p>
        <div><strong>OTP code:</strong> ${otp}</div>
        <p>If you did not request a password reset, please ignore this email or contact support immediately.</p>
        <div>
            <strong>Sincerely,</strong>
            <br />
            Order Instant
        </div>
        <br />
        <div style="color: #999; text-align: center;">
            &copy; 2025 Instant Order. All rights reserved.
        </div>
    </div>
</body>
</html>
    `;
}

function html4({ senderFullName, receiverFullName, packageType, packageId }) {
  return `
    <html>
    <body style="font-family: Arial, sans-serif;">
      <h2 style="color: #333;">📦 New Package Submission</h2>
      <p>A new package has been submitted through the system. Below are the details:</p>
      <ul style="line-height: 1.6;">
        <li><strong>Sender:</strong> ${senderFullName}</li>
        <li><strong>Receiver:</strong> ${receiverFullName}</li>
        <li><strong>Package Type:</strong> ${packageType}</li>
        <li><strong>Package ID:</strong> ${packageId}</li>
      </ul>
      <p style="margin-top: 20px;">Please log into the admin portal to review and process this package.</p>
      <br/>
      <p>— <em>Order Instant System</em></p>
    </body>
    </html>
  `;
}

function html5({ fullName, status, packageId }) {
  const intro = `<p>👋 <strong>Dear ${fullName},</strong></p>`;
  const footer = `
    <p>If you have any questions, feel free to contact our support team.</p>
    <p>Thank you for choosing <strong>Order Instant</strong>!</p>
    <br/>
    <p style="color: #999; font-size: 12px;">&copy; 2025 Order Instant. All rights reserved.</p>
  `;

  let message = "";

  switch (status) {
    case "processing":
      message = `<p>Your package (ID: <strong>${packageId}</strong>) has been received and is currently being processed.</p>`;
      break;
    case "picked up":
      message = `<p>Your package (ID: <strong>${packageId}</strong>) has been picked up and is now on its way.</p>`;
      break;
    case "departed":
      message = `<p>Your package (ID: <strong>${packageId}</strong>) has departed from our facility and is en route to its destination.</p>`;
      break;
    case "delivered":
      message = `<p>We’re pleased to inform you that your package (ID: <strong>${packageId}</strong>) has been successfully delivered.</p>`;
      break;
    case "cancelled":
      message = `<p>Unfortunately, your package (ID: <strong>${packageId}</strong>) has been cancelled. Please contact support if this was unexpected.</p>`;
      break;
    default:
      message = `<p>There has been an update regarding your package (ID: <strong>${packageId}</strong>). Current status: <strong>${status}</strong>.</p>`;
  }

  return `<html><body style="font-family: Arial, sans-serif;">${intro}${message}${footer}</body></html>`;
}



export default sendMail;
