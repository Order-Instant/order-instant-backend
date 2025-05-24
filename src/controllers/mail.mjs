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
    <p>📦 <strong>New Package Submitted</strong></p>
    <p><strong>Sender:</strong> ${senderFullName}</p>
    <p><strong>Receiver:</strong> ${receiverFullName}</p>
    <p><strong>Type:</strong> ${packageType}</p>
    <p><strong>Package ID:</strong> ${packageId}</p>
  `;
}

function html5({ fullName, status, packageId }) {
  return `
    <p>👋 <strong>Dear ${fullName},</strong></p>
    <p>Your package (ID: ${packageId}) has been <strong>${status}</strong>.</p>
    <p>Thank you for using Order Instant!</p>
  `;
}


export default sendMail;
