"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { login } from "@/hooks/auth";
import SEO from "@/components/seo";
const formSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

const Login = () => {
  const router = useRouter();
  const { setToken, setUser } = useAuthStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      const { user, token, message } = await login(
        values.email,
        values.password
      );
      setUser(user);
      setToken(token);
      toast.success(message || "Login successful");
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
    <div className="flex items-center justify-center flex-col min-h-screen px-6 md:px-12 lg:px-24 bg-gradient-to-b from-amber-50 to-amber-100">
      <SEO
        title="Login | DastKari"
        description="Login to your account to access your orders, wishlist, and more!"
      />
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif tracking-wide text-amber-900 mb-2">
        Welcome Back to{" "}
        <span className="text-[#DEB887]" style={{ fontFamily: 'Noto Nastaliq Urdu' }}>
          دستکاری
        </span>
      </h1>
      <div className="mt-6 w-full max-w-[500px] bg-white p-8 rounded-lg shadow-lg border border-amber-200">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-amber-900">Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
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
            <div className="flex flex-col space-y-2">
              <Link
                href="/login/forgot-password"
                className="text-sm text-amber-700 hover:text-amber-900 transition duration-200"
              >
                Forgot password?
              </Link>
              <Link
                href="/register"
                className="text-sm text-amber-700 hover:text-amber-900 transition duration-200"
              >
                Don't have an account? Sign up
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full bg-[#8B4513] hover:bg-[#6B3410] text-[#E8DED1] transition duration-300 py-3"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
