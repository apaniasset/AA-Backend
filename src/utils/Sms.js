import dotenv from 'dotenv';
import Logger from './Logger.js';

dotenv.config();

/**
 * Professional SMS Utility
 * Centralizes all SMS/OTP sending logic.
 * You can plug in your real API credentials here (Twilio, MSG91, etc.)
 */
class Sms {
    /**
     * Send OTP to a mobile number
     * @param {string} phone - Mobile number
     * @param {string} otp - The OTP to send
     */
    async sendOTP(phone, otp) {
        try {
            // LOGIC FOR REAL SMS GATEWAY GOES HERE:
            // ---------------------------------------------------------
            // Example for MSG91 / Twilio / Other:
            /*
            await axios.get(`https://api.sms-provider.com/send`, {
                params: {
                    apiKey: process.env.SMS_API_KEY,
                    to: phone,
                    message: `Your ApniAsset OTP is ${otp}`
                }
            });
            */
            // ---------------------------------------------------------

            // For now, we simulate the success and log it to terminal
            Logger.info(`[SMS SENT] To: ${phone} | Message: Your ApniAsset OTP is ${otp}`);

            return { success: true, provider: 'Simulated' };
        } catch (error) {
            Logger.error(`SMS Send Error: ${error.message}`);
            throw new Error(`Failed to send SMS: ${error.message}`);
        }
    }

    /**
     * Send general notification SMS
     */
    async sendNotification(phone, message) {
        Logger.info(`[SMS NOTIFICATION] To: ${phone} | Message: ${message}`);
        return { success: true };
    }
}

export default new Sms();
