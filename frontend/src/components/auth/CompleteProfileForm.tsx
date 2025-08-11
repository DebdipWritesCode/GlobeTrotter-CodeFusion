import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "@/api/axios";
import { useState } from "react";

const profileSchema = z.object({
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const CompleteProfileForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const user = location.state?.user;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      city: "",
      country: "",
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user?.id) {
      toast.error("User ID missing. Please log in again.");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      await api.put(`/users/${user.id}/profile`, values);
      toast.success("Profile completed successfully! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">Complete Your Profile</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your city" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CompleteProfileForm;
