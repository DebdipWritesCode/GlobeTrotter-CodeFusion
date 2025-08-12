// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useState } from "react";
// import { toast } from "react-toastify";
// import api from "@/api/axios";
// import { store } from "@/redux/store";
// import { setAccessToken } from "@/slices/authSlice";
// import { useNavigate } from "react-router-dom";
// import ToastComponent from "../ToastComponent";

// interface Payload {
//   jwt_token: string;
//   user: {
//     id: string;
//     name: string;
//     email: string;
//     role: string;
//     created_at: string;
//   };
//   metadata: {
//     user_agent: string;
//     client_ip: string;
//   };
// }

// const loginFormSchema = z.object({
//   email: z.string().email("Invalid email"),
//   password: z.string().min(8, "Password must be at least 8 characters"),
// });

// const LoginForm = () => {
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();

//   const form = useForm<z.infer<typeof loginFormSchema>>({
//     resolver: zodResolver(loginFormSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
//     setLoading(true);
//     try {
//       const loginData = { ...values };

//       const response = await api.post("/auth/login", loginData);

//       if (response.status === 200) {
//         const { jwt_token } = response.data;
//         const payload: Payload = {
//           jwt_token,
//           user: {
//             id: response.data.user.id,
//             name: response.data.user.name,
//             email: response.data.user.email,
//             role: response.data.user.role, // ✅ role is captured
//             created_at: response.data.user.created_at,
//           },
//           metadata: {
//             user_agent: response.data.metadata.user_agent,
//             client_ip: response.data.metadata.client_ip,
//           },
//         };

//         store.dispatch(setAccessToken(payload));

//         toast.success("Login successful! Redirecting...");
//         console.log("Response data:", response.data);

//         setTimeout(() => {
//           if (response.data.user.role === "admin") {
//             navigate("/admin/");
//           } else {
//             navigate("/dashboard");
//           }
//         }, 1500);
//       } else {
//         throw new Error("Unexpected response from server");
//       }
//     } catch (err: unknown) {
//       const e = err as { response?: { status?: number; data?: { message?: string } } } | undefined
//       if (e?.response) {
//         if (e.response.status === 401) {
//           toast.error("Invalid email or password. Please try again.");
//         } else if (e.response.data?.message) {
//           toast.error(e.response.data.message);
//         } else {
//           toast.error("An unexpected error occurred. Please try again later.");
//         }
//       } else {
//         toast.error("Network error. Please check your connection.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="max-w-md mx-auto flex flex-col gap-6">
//         <FormField
//           control={form.control}
//           name="email"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Email</FormLabel>
//               <FormControl>
//                 <Input type="email" placeholder="john@example.com" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="password"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Password</FormLabel>
//               <FormControl>
//                 <Input type="password" placeholder="••••••••" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <Button type="submit" className="w-full" disabled={loading}>
//           {loading ? "Logging in..." : "Log In"}
//         </Button>
//       </form>

//       <ToastComponent />
//     </Form>
//   );
// };

// export default LoginForm;


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
import { store } from "@/redux/store";
import { setAccessToken } from "@/slices/authSlice";
import { useNavigate } from "react-router-dom";
import ToastComponent from "../ToastComponent";

interface Payload {
  jwt_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    created_at: string;
  };
  metadata: {
    user_agent: string;
    client_ip: string;
  };
}

const loginFormSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // from nishant (UI only)

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    setLoading(true);
    try {
      const loginData = { ...values };

      const response = await api.post("/auth/login", loginData);

      if (response.status === 200) {
        const { jwt_token } = response.data;
        // === depdip backend payload construction (unchanged) ===
        const payload: Payload = {
          jwt_token,
          user: {
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            role: response.data.user.role, // role captured exactly as depdip
            created_at: response.data.user.created_at,
          },
          metadata: {
            user_agent: response.data.metadata.user_agent,
            client_ip: response.data.metadata.client_ip,
          },
        };

        store.dispatch(setAccessToken(payload));

        toast.success("Login successful! Redirecting...");
        console.log("Response data:", response.data);

        // === depdip redirect logic preserved exactly ===
        setTimeout(() => {
          if (response.data.user.role === "admin") {
            navigate("/admin/");
          } else {
            navigate("/dashboard");
          }
        }, 1500);
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (err: unknown) {
      // from nishant: safer alias for axios-like error shape (frontend UX only)
      const axiosErr = err as { response?: { status?: number; data?: { message?: string } } } | undefined;
      if (axiosErr?.response) {
        if (axiosErr.response.status === 401) {
          toast.error("Invalid email or password. Please try again.");
        } else if (axiosErr.response.data?.message) {
          toast.error(axiosErr.response.data.message);
        } else {
          toast.error("An unexpected error occurred. Please try again later.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
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
        aria-label="Sign in form"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                {/* nishant: added inputMode, autoComplete, aria-required — UI only */}
                <Input
                  {...field}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="john@example.com"
                  aria-required="true"
                />
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
                <div className="relative">
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    aria-required="true"
                  />
                  {/* nishant: show/hide toggle (pure UI) */}
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

        <Button type="submit" className="w-full" disabled={loading} aria-busy={loading}>
          {loading ? "Logging in..." : "Log In"}
        </Button>
      </form>

      <ToastComponent />
    </Form>
  );
};

export default LoginForm;
