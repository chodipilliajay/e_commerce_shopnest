import nodemailer from 'nodemailer';

export const sendEmail = async ({ email, subject, message, html }) => {
    const transporter = nodemailer.createTransport({
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    await transporter.sendMail({
        from: `ShopNest <${process.env.SMTP_MAIL}>`,
        to: email,
        subject,
        text: message,
        html,
    });
};
