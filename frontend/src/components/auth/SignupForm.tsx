import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "@/api/axios";
import ToastComponent from "../ToastComponent";

const signupFormSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(30),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
    city: z.string().min(1, "City is required"),
    country: z.string().min(1, "Country is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const SignupForm = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // UI only
  const [showConfirm, setShowConfirm] = useState(false);   // UI only

  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      city: "",
      country: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signupFormSchema>) => {
    setLoading(true);
    try {
      // IMPORTANT: preserve depdip's backend payload exactly
      const { name, email, password, city, country } = values;
      const signupData = { name, email, password, city, country };

      const response = await api.post("/auth/signup", signupData);

      if (response.status === 200) {
        toast.success("Account created successfully! Please log in.");
        form.reset(); // preserved from depdip
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (err: unknown) {
      // preserve depdip's error handling branches; alias name changed to axiosErr (safe)
      const axiosErr = err as
        | { response?: { status?: number; data?: { message?: string } }; request?: unknown; message?: string }
        | undefined;

      if (axiosErr?.response) {
        if (axiosErr.response.status === 409) {
          toast.error("Email already exists. Please use a different email.");
        } else if (axiosErr.response.data?.message) {
          toast.error(axiosErr.response.data.message);
        } else {
          toast.error("Registration failed. Please try again.");
        }
      } else if (axiosErr?.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error("An error occurred: " + (axiosErr?.message ?? "Unknown error"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-md mx-auto flex flex-col gap-6"
        aria-label="Sign up form"
      >
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" autoComplete="name" aria-required="true" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="john@example.com"
                  aria-required="true"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* City */}
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="Mumbai" autoComplete="address-level2" aria-required="true" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Country */}
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input placeholder="India" autoComplete="country" aria-required="true" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    aria-required="true"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-600 hover:text-gray-900"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm Password */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    aria-required="true"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-600 hover:text-gray-900"
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? "Hide" : "Show"}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={loading} aria-busy={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </Button>
      </form>

      <ToastComponent />
    </Form>
  );
};

export default SignupForm;
