"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { register } from "@/hooks/auth";
import useAuthStore from "@/store/authStore";
import SEO from "@/components/seo";

const formSchema = z
  .object({
    name: z
      .string()
      .min(3, { message: "Name must be at least 3 characters long" }),
    email: z.string().email(),
    phone: z
      .string()
      .min(10, { message: "Phone number must be at least 10 characters long" }),
    address: z
      .string()
      .min(10, { message: "Address must be at least 10 characters long" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Register = () => {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const { user, token, message } = await register(values);
      setUser(user);
      setToken(token);
      toast.success(message || "Registered successfully");
      router.push("/");
    } catch (error: any) {
      if (error.response.status === 500)
        toast.error(
          "An error occurred while processing your request. Please try again later."
        );
      else toast.error(error.response.data.message);
    } finally {
      setIsSubmitting(false);
      form.reset();
    }
  }

  return (
    <div className="flex items-center justify-center flex-col min-h-screen pt-32 py-10 px-6 md:px-12 lg:px-24 bg-gradient-to-b from-amber-50 to-amber-100">
      <SEO
        title="Register | DastKari"
        description="Create your account with DastKari to access exclusive heritage pieces and more!"
      />
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif tracking-wide text-amber-900 mb-2">
        Join{" "}
        <span
          className="text-[#DEB887]"
          style={{ fontFamily: "Noto Nastaliq Urdu" }}
        >
          دستکاری
        </span>
      </h1>
      <div className="mt-6 w-full max-w-[500px] bg-white p-8 rounded-lg shadow-lg border border-amber-200">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-900">Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-900">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-900">Phone</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-900">Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-900">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-900">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      {...field}
                      className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-600" />
                </FormItem>
              )}
            />

            <Link
              href="/login"
              className="block text-sm text-amber-700 hover:text-amber-900 transition duration-200"
            >
              Already have an account? Sign in
            </Link>

            <Button
              type="submit"
              className="w-full bg-[#8B4513] hover:bg-[#6B3410] text-[#E8DED1] transition duration-300 py-3"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Register;
