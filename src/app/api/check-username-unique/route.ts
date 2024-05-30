import { connectToDb } from "@/lib/dbConnect";
import userModel from "@/models/User";
import { userNameValidation } from "@/schemas/signupSchema";
import { NextResponse } from "next/server";
import { z } from "zod";

const usernameQuerySchema = z.object({
  username: userNameValidation,
});
export const GET = async (req: Request) => {
  await connectToDb();

  try {
    const { searchParams } = new URL(req.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    const result = usernameQuerySchema.safeParse(queryParam);
    console.log(result);
    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];

      return NextResponse.json(
        {
          success: false,
          message:
            usernameError.length > 0
              ? usernameError.join(",")
              : "Invalid Query Parameters",
        },
        { status: 400 }
      );
    }

    console.log(result.data.username);
    const isUsernameTaken = await userModel.findOne({
      username: queryParam.username,
      isVerified: true,
    });
    if (isUsernameTaken) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 401 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: `Username is available`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 }
    );
  }
};
