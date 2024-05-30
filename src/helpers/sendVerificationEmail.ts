import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export const sendVerificationEmail = async (
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> => {
  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "MystryMessage Verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    if (error) {
      return {
        message: `Failed to send verification code due to ${error.message}`,
        success: false,
      };
    }
    return { message: "Verification code sent successfully", success: true };
  } catch (emailError) {
    console.log("Error sending verification error", emailError);
    return {
      message: "Please try again! Email verification failed",
      success: false,
    };
  }
};
