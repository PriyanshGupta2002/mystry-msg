import { connectToDb } from "@/lib/dbConnect";
import userModel from "@/models/User";
import { Message } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  await connectToDb();

  const { username, content } = await req.json();
  try {
    const user = await userModel.findOne({ username });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: `User with ${username} not found`,
        },
        { status: 404 }
      );
    }
    if (!user.isAcceptingMessage) {
      return NextResponse.json(
        {
          success: false,
          message: `User is not accepting the messages`,
        },
        { status: 403 }
      );
    }

    const newMessage = {
      content,
      createdAt: new Date(),
    };
    user.messages.push(newMessage as Message);
    await user.save();
    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while sending message", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
};
