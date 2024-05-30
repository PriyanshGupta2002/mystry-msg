import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { connectToDb } from "@/lib/dbConnect";
import userModel from "@/models/User";
import { User } from "next-auth";
export const POST = async (req: NextRequest) => {
  await connectToDb();
  try {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !session.user) {
      return NextResponse.json(
        {
          message: "Unauthorized",
          success: false,
        },
        { status: 401 }
      );
    }

    const { isAcceptingMessage } = await req.json();
    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      {
        isAcceptingMessage,
      },
      { new: true }
    );
    if (!updatedUser) {
      return NextResponse.json(
        {
          message: "Failed to update user",
          success: false,
        },
        { status: 401 }
      );
    }
    return NextResponse.json(
      {
        message: "Message acceptance status updated successfully",
        success: true,
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in user status", error);
    return NextResponse.json(
      {
        message: "Failed to update status",
        success: false,
      },
      { status: 500 }
    );
  }
};

export const GET = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    if (!session || !session.user) {
      return NextResponse.json(
        {
          message: "Unauthorized",
          success: false,
        },
        { status: 401 }
      );
    }
    const dbUser = await userModel.findById(user._id);
    if (!dbUser) {
      return NextResponse.json(
        {
          message: "Failed to find the user",
          success: false,
        },
        { status: 404 }
      );
    }
    const status = dbUser.isAcceptingMessage;
    return NextResponse.json(
      {
        isAcceptingMessages: status,
        success: true,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error in getting is accepting message status api", error);
    return NextResponse.json(
      {
        message: "Some error occured",
        success: false,
      },
      { status: 500 }
    );
  }
};
