import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";
import { Verification } from "next/dist/lib/metadata/types/metadata-types";

export async function sendVerificationEmails(email:string, username: string, verifyCode: string): Promise<ApiResponse> {
  try {
  await resend.emails.send({
    from:'onboarding@resend.dev',
    to:email,
    subject:"Mystry message | Verification Code",
    react: VerificationEmail({username, otp:verifyCode})
  })
    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (error) {
    console.error("Error sending verification email", error);

    return {
      success: false,
      message: 'Failed to send verification email',
    };
  }
}