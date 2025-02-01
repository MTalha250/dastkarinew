"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import SEO from "@/components/seo";
import AuthCode from "react-auth-code-input";

const formSchema = z
  .object({
    email: z.string().email(),
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

const ForgotPassword = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [receivedCode, setReceivedCode] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add your code sending logic here
    setStep(2);
  };

  const handleVerifyCode = async () => {
    // Add your code verification logic here
    setStep(3);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Add your password reset submission logic here
  }

  return (
    <div className="flex items-center justify-center flex-col min-h-screen px-6 md:px-12 lg:px-24 bg-gradient-to-b from-amber-50 to-amber-100">
      <SEO
        title="Reset Password | DastKari"
        description="Reset your DastKari account password"
      />
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif tracking-wide text-amber-900 mb-2">
        Reset Password{" "}
        <span className="text-[#DEB887]" style={{ fontFamily: 'Noto Nastaliq Urdu' }}>
          دستکاری
        </span>
      </h1>
      <div className="mt-6 w-full max-w-[500px] bg-white p-8 rounded-lg shadow-lg border border-amber-200">
        {step === 1 && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-amber-900 mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                placeholder="Enter your email"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#8B4513] hover:bg-[#6B3410] text-[#E8DED1] transition duration-300 py-3"
            >
              Send Code
            </Button>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="flex justify-center items-center flex-col">
              <p className="text-center mb-3 text-amber-900">Enter Verification Code</p>
              <AuthCode
                containerClassName="flex justify-center gap-2 text-center"
                inputClassName="w-12 h-12 border-2 border-amber-200 rounded-lg text-center text-xl focus:border-amber-400 focus:ring-amber-400 transition-colors"
                length={6}
                onChange={(value) => setReceivedCode(value)}
                autoFocus={true}
              />
            </div>
            <Button
              onClick={handleVerifyCode}
              className="w-full bg-[#8B4513] hover:bg-[#6B3410] text-[#E8DED1] transition duration-300 py-3"
            >
              Verify Code
            </Button>
          </div>
        )}

        {step === 3 && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-amber-900">New Password</FormLabel>
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
                    <FormLabel className="text-amber-900">Confirm Password</FormLabel>
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
              <Button
                type="submit"
                className="w-full bg-[#8B4513] hover:bg-[#6B3410] text-[#E8DED1] transition duration-300 py-3"
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
