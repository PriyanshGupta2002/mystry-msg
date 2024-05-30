import { connectToDb } from "@/lib/dbConnect";
import userModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  await connectToDb();

  try {
    const { verificationCode, username } = await req.json();
    if (!verificationCode || !username) {
      return NextResponse.json(
        {
          success: false,
          message: "Verification code or username is missing",
        },
        { status: 400 }
      );
    }

    const user = await userModel.findOne({
      verifyCode: verificationCode,
      username,
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "No user found",
          success: false,
        },
        { status: 404 }
      );
    }
    if (user.isVerified) {
      return NextResponse.json(
        {
          message: "User is already verified",
          success: false,
        },
        { status: 400 }
      );
    }
    const isCodeValid = user.verifyCode === verificationCode;
    const isCodeNotExpired = new Date(user.verifyExpiry) > new Date();
    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return NextResponse.json(
        {
          message: "User verified successfully",
          success: true,
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return NextResponse.json(
        {
          message: "Your code is expired.Please signup again",
          success: false,
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        {
          message: "Your code is invalid",
          success: false,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.log("Error in verification code", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
};
