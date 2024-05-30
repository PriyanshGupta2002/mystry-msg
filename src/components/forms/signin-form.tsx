"use client";
"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { useState } from "react";
import { useDebounceValue } from "usehooks-ts";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signinSchema";

const SigninForm = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [username, setUsername] = useState<string>("");
  const [usernameMessage, setUsernameMessage] = useState<string>("");
  const [isCheckingUserName, setIsCheckingUserName] = useState<boolean>(false);
  const [debouncedValue, setValue] = useDebounceValue(username, 500);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  return <div>SigninForm</div>;
};

export default SigninForm;
