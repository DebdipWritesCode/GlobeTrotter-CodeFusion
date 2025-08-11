import { useEffect, useState } from "react";
import api from "@/api/axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PopulatedCity {
  _id: string;
  name: string;
}

interface Activity {
  _id: string;
  name: string;
  description?: string;
  cityId: PopulatedCity; // Populated from backend
  category?: "sightseeing" | "food" | "adventure" | "culture" | "other";
  cost?: number;
  duration?: number;
}

interface City {
  _id: string;
  name: string;
}

// Zod schema
const activitySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  cityId: z.string().min(1, "City is required"),
  category: z.enum(["sightseeing", "food", "adventure", "culture", "other"]),
  cost: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Number(val)), "Must be a number"),
  duration: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Number(val)), "Must be a number"),
});

type ActivityFormValues = z.infer<typeof activitySchema>;

const ManageActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      name: "",
      description: "",
      cityId: "",
      category: "sightseeing",
      cost: "",
      duration: "",
    },
  });

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const res = await api.get("/activities"); // Returns populated cityId
      setActivities(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch activities");
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const res = await api.get("/cities");
      setCities(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch cities");
    }
  };

  useEffect(() => {
    fetchActivities();
    fetchCities();
  }, []);

  const handleCreate = async (values: ActivityFormValues) => {
    try {
      await api.post("/activities", {
        ...values,
        cost: values.cost ? Number(values.cost) : undefined,
        duration: values.duration ? Number(values.duration) : undefined,
      });
      toast.success("Activity created");
      setIsCreateOpen(false);
      form.reset();
      fetchActivities();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create activity");
    }
  };

  const handleUpdate = async (values: ActivityFormValues) => {
    if (!selectedActivity) return;
    try {
      await api.put(`/activities/${selectedActivity._id}`, {
        ...values,
        cost: values.cost ? Number(values.cost) : undefined,
        duration: values.duration ? Number(values.duration) : undefined,
      });
      toast.success("Activity updated");
      setIsEditOpen(false);
      setSelectedActivity(null);
      form.reset();
      fetchActivities();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update activity");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;
    try {
      await api.delete(`/activities/${id}`);
      toast.success("Activity deleted");
      fetchActivities();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete activity");
    }
  };

  const ActivityFormFields = () => (
    <div className="space-y-4 py-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="Activity name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cityId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>City</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city._id} value={city._id}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sightseeing">Sightseeing</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="adventure">Adventure</SelectItem>
                  <SelectItem value="culture">Culture</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="cost"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cost</FormLabel>
            <FormControl>
              <Input placeholder="e.g., 100" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Duration (hours)</FormLabel>
            <FormControl>
              <Input placeholder="e.g., 2" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea placeholder="Short description about the activity" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  // Group activities by city name
  const groupedActivities = activities.reduce((acc, activity) => {
    const cityName = activity.cityId?.name || "Unknown City";
    if (!acc[cityName]) acc[cityName] = [];
    acc[cityName].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Activities</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => form.reset()}>Add Activity</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Activity</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreate)}>
                <ActivityFormFields />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : activities.length === 0 ? (
        <p className="text-gray-500">No activities found.</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedActivities).map(([cityName, cityActivities]) => (
            <div key={cityName} className="space-y-4">
              <h2 className="text-2xl font-bold">{cityName}</h2>
              {cityActivities.map((activity) => (
                <div
                  key={activity._id}
                  className="p-4 border rounded-lg flex justify-between items-center hover:shadow-md transition"
                >
                  <div>
                    <p className="font-semibold text-lg">{activity.name}</p>
                    <p className="text-sm text-gray-500">Category: {activity.category}</p>
                    <p className="text-sm text-gray-500">
                      Cost: {activity.cost !== undefined ? `₹${activity.cost}` : "N/A"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Duration: {activity.duration ? `${activity.duration}h` : "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Dialog
                      open={isEditOpen && selectedActivity?._id === activity._id}
                      onOpenChange={(open) => {
                        setIsEditOpen(open);
                        if (open) {
                          setSelectedActivity(activity);
                          form.reset({
                            name: activity.name,
                            description: activity.description ?? "",
                            cityId: activity.cityId?._id || "",
                            category: activity.category ?? "sightseeing",
                            cost: activity.cost?.toString() ?? "",
                            duration: activity.duration?.toString() ?? "",
                          });
                        } else {
                          setSelectedActivity(null);
                          form.reset();
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline">Edit</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>Edit Activity</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                          <form onSubmit={form.handleSubmit(handleUpdate)}>
                            <ActivityFormFields />
                            <div className="flex justify-end gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditOpen(false)}
                              >
                                Cancel
                              </Button>
                              <Button type="submit">Update</Button>
                            </div>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(activity._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageActivities;
