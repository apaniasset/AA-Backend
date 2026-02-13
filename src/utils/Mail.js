import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Professional Mail Utility (Similar to Laravel's Mail facade)
 */
class Mail {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: process.env.MAIL_PORT == 465, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        });
    }

    /**
     * Send an email
     * @param {Object} options - { to, subject, html, text, from }
     */
    async send({ to, subject, html, text, from }) {
        try {
            const mailOptions = {
                from: from || `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
                to,
                subject,
                text: text || '',
                html: html || '',
            };

            const info = await this.transporter.sendMail(mailOptions);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('Mail Send Error:', error);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }
}

// Export a singleton instance
export default new Mail();
