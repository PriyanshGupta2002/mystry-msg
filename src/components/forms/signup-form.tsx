"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUpSchema } from "@/schemas/signupSchema";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { ApiResponse } from "@/types/ApiResponse";
import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

const SignupForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const BASE_URL = process.env.BASE_URL;

  const [username, setUsername] = useState<string>("");
  const [usernameMessage, setUsernameMessage] = useState<string>();
  const [isCheckingUserName, setIsCheckingUserName] = useState<boolean>(false);
  const debounced = useDebounceCallback(setUsername, 500);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = useCallback(
    async (values: z.infer<typeof signUpSchema>) => {
      try {
        const { data } = await axios.post<ApiResponse>("/api/sign-up", values);
        toast({
          title: "Success",
          description: data.message,
        });
        router.replace(`/verify/${username}`);
      } catch (error) {
        console.error("Error while creating signup", error);
        const axiosErorr = error as AxiosError<ApiResponse>;
        const errorMessage = axiosErorr.response?.data.message;
        toast({
          title: "Signup failed",
          variant: "destructive",
          description: errorMessage,
        });
      }
    },
    [router, toast, username]
  );

  useEffect(() => {
    const checkUserNameUnique = async () => {
      if (username) {
        setIsCheckingUserName(true);
        setUsernameMessage("");
        try {
          const { data } = await axios.get(
            `/api/check-username-unique?username=${username}`
          );

          setUsernameMessage(data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          console.log(axiosError);
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error Checking username"
          );
        } finally {
          setIsCheckingUserName(false);
        }
      } else {
        setIsCheckingUserName(false);
        setUsernameMessage("");
      }
    };
    checkUserNameUnique();
  }, [BASE_URL, username]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className=" text-sm space-y-6 w-full  rounded-md"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="johndoe"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    debounced(e.target.value);
                  }}
                />
              </FormControl>

              {isCheckingUserName && (
                <Loader className="animate-spin w-5 h-5" />
              )}

              {usernameMessage && (
                <p
                  className={`text-sm ${
                    usernameMessage === "Username is available"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {usernameMessage}
                </p>
              )}

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="johndoe@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="*******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size={"sm"}
          disabled={isSubmitting}
          className="disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader className="h-5 w-5 text-center animate-spin duration-150 ease-linear" />
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;
