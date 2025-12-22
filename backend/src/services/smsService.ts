/**
 * SMS Notification Service using Twilio
 */

export class SMSService {
  private twilioAccountSid: string;
  private twilioAuthToken: string;
  private fromNumber: string;

  constructor() {
    this.twilioAccountSid = process.env.TWILIO_ACCOUNT_SID || '';
    this.twilioAuthToken = process.env.TWILIO_AUTH_TOKEN || '';
    this.fromNumber = process.env.TWILIO_PHONE_NUMBER || '';
  }

  /**
   * Send SMS notification
   */
  async sendSMS(toNumber: string, message: string): Promise<{ success: boolean; sid?: string; error?: string }> {
    try {
      if (!this.twilioAccountSid || !this.twilioAuthToken) {
        console.warn('⚠️  Twilio credentials not configured, skipping SMS');
        return { success: true }; // Don't fail if SMS not configured
      }

      const auth = Buffer.from(`${this.twilioAccountSid}:${this.twilioAuthToken}`).toString('base64');

      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.twilioAccountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: this.fromNumber,
          To: toNumber,
          Body: message,
        }).toString(),
      });

      const data = await response.json() as { sid?: string; error_message?: string };

      if (response.ok && data.sid) {
        console.log('✅ SMS sent:', data.sid);
        return { success: true, sid: data.sid };
      } else {
        console.error('❌ SMS failed:', data.error_message);
        return { success: false, error: data.error_message };
      }
    } catch (error) {
      console.error('❌ SMS service error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Send payment confirmation SMS to seller
   */
  async sendPaymentConfirmationSMS(sellerPhone: string, amount: number, buyerName: string): Promise<void> {
    const message = `SWIFTLINE: Payment of KES ${amount} from ${buyerName} secured in escrow. Funds will be released upon delivery confirmation. Reply CONFIRM when shipped.`;
    await this.sendSMS(sellerPhone, message);
  }

  /**
   * Send delivery OTP to buyer
   */
  async sendDeliveryOTP(buyerPhone: string, otp: string, buyerName: string): Promise<void> {
    const message = `SWIFTLINE: Your delivery OTP is ${otp}. Seller will request this before releasing the item. Do not share with anyone.`;
    await this.sendSMS(buyerPhone, message);
  }

  /**
   * Send payment release notification
   */
  async sendPaymentReleasedSMS(sellerPhone: string, amount: number): Promise<void> {
    const message = `SWIFTLINE: Payment of KES ${amount} has been released to your M-Pesa account. Check your phone for the transaction.`;
    await this.sendSMS(sellerPhone, message);
  }
}

export const smsService = new SMSService();
