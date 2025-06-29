import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

export class OTPHandler {
  private otp: number;
  private email: string;

  constructor(email: string) {
    this.email = email;
    this.otp = this.generateOTP();
  }

  private generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  public getOTP = () => this.otp;

  public sendOTP = () => {
    sendEmail(
      this.email,
      `
      <div style="
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          padding: 2rem;
          background-color: #f6f6f6;
          border: 1px solid #e5e5e5;
          border-radius: 1rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      ">
        <h1 style="text-align: center; font-size: 2rem; margin-bottom: 1rem;">Samvaad</h1>
        <p style="text-align: center; font-size: 1.5rem;">Your OTP is <span style="font-weight: bold;">${this.otp}</span></p>
      </div>
      `,
      "OTP Verification"
    );
  };
}

export function sendEmail(emailTo: string, msg: string, subject: string) {
  const mailOptions = {
    from: process.env.EMAIL,
    to: emailTo,
    subject,
    html: msg,
  };

  transporter.sendMail(mailOptions, (error, _) => {
    if (error) {
      console.error("Email sending error:", error);
      throw new Error(error.message);
    }
  });
}
