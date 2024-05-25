// import dbConnect
//import userModel
//install bycrptjs
//import sendverficationEmail
//declare function definition POST
//make database connection
//hanlde try catch
// accept fields from request.json() in try block
//check if username exists and also verified
//if user exists then send false in the response status: 400
//existing user using email
//if user does not exists
import dbConnect from "@/lib/dbConnect";
import UserModel, { User } from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmails } from "@/helpers/sendVerificationEmails";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    const userExistsAndVerified = await UserModel.findOne({
      username: username,
      isVerified: true,
    });

    if (userExistsAndVerified) {
      return Response.json(
        {
          success: false,
          message: "User already exists",
        },
        {
          status: 400,
        }
      );
    }
    const existingUserByEmail = await UserModel.findOne({
      email: email,
    });
    const verifyCode = Math.floor(10000 + Math.random() * 9000000).toString();

    if (existingUserByEmail) {
      return Response.json(
        {
          success: false,
          message: "User already exists",
        },
        {
          status: 400,
        }
      );
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setMinutes(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username: username,
        email: email,
        password: hashedPassword,
        verifyCode: verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }
    const emailResponse = await sendVerificationEmails(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User created",
      },
      {
        status: 201,
      }
    );
  } catch (e) {
    console.error("Error in sign-up POST", e);
    return Response.json(
      {
        success: false,
        message: "Failed to create user",
      },
      {
        status: 500,
      }
    );
  }
}
