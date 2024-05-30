import SignupForm from "@/components/forms/signup-form";
import Link from "next/link";
import React from "react";

const SignupPage = () => {
  return (
    <div className="flex items-center gap-3 min-h-screen justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystry Message
          </h1>
          <p className="mb-4 text-sm">
            Signup to start your anonymous adventure
          </p>
        </div>

        <SignupForm />
        <div className="text-center">
          Already a member?{" "}
          <Link className="underline text-blue-500" href={`/sign-in`}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
