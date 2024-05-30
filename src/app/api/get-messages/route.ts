import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { connectToDb } from "@/lib/dbConnect";
import userModel from "@/models/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export const GET = async (req: NextRequest) => {
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
    const userId = new mongoose.Types.ObjectId(user._id);
    const res = await userModel.aggregate([
      {
        $match: { _id: userId },
      },
      {
        $unwind: "$messages",
      },
      {
        $sort: {
          "messages.createdAt": -1,
        },
      },
      {
        $group: {
          _id: "$_id",
          messages: {
            $push: "$messages",
          },
        },
      },
    ]);
    if (!res || res.length === 0) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 401 }
      );
    }
    return NextResponse.json(
      {
        messages: res[0].messages,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error while reading messages", error);
    return NextResponse.json(
      {
        messages: "Some error occured",
        success: false,
      },
      { status: 500 }
    );
  }
};
