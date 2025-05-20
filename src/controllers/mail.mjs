import nodemailer from "nodemailer";

// Create a transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'devrajeshthapa@gmail.com',
        pass: 'jfnstesonxbyatpp'
    }
});

let sendMail = async ({ email, type, payload }) => {
    let subject;
    let html;

    switch (type) {
        case 1:
            subject = "Account Registration";
            html = html1(payload);
            break;
        // add other cases if needed
        default:
            subject = "Notification";
            html = "<p>No content</p>";
    }

    const mailOptions = {
        from: 'devrajeshthapa@gmail.com',
        to: email,
        subject: subject,
        html: html,  // use html property here
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

function html1({ otp }) {
    return `
<html>
<body>
    <div class="container">
        <p>Dear user,</p>
        <p>Use the following One-Time Password (OTP) to complete your verification. This code is valid for 3 minutes.</p>
        <div class="otp-code">OTP code: ${otp}</div>
        <p>If you did not request this code, please ignore this email.</p>
        <div class="footer">
            &copy; 2025 Instant Order. All rights reserved.
        </div>
    </div>
</body>
</html>
    `;
}

export default sendMail;