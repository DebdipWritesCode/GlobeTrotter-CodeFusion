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

interface City {
  _id: string;
  name: string;
  country: string;
  costIndex?: number;
  popularityScore?: number;
  description?: string;
}

// Zod schema for validation (no images)
const citySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  country: z.string().min(2, "Country must be at least 2 characters"),
  costIndex: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Number(val)), "Must be a number"),
  popularityScore: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Number(val)), "Must be a number"),
  description: z.string().optional(),
});

type CityFormValues = z.infer<typeof citySchema>;

const ManageCities = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  // React Hook Form instance
  const form = useForm<CityFormValues>({
    resolver: zodResolver(citySchema),
    defaultValues: {
      name: "",
      country: "",
      costIndex: "",
      popularityScore: "",
      description: "",
    },
  });

  // Fetch cities
  const fetchCities = async () => {
    try {
      setLoading(true);
      const res = await api.get("/cities");
      setCities(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch cities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  // Create City
  const handleCreate = async (values: CityFormValues) => {
    try {
      await api.post("/cities", {
        ...values,
        costIndex: values.costIndex ? Number(values.costIndex) : undefined,
        popularityScore: values.popularityScore
          ? Number(values.popularityScore)
          : undefined,
      });
      toast.success("City created");
      setIsCreateOpen(false);
      form.reset();
      fetchCities();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create city");
    }
  };

  // Update City
  const handleUpdate = async (values: CityFormValues) => {
    if (!selectedCity) return;
    try {
      await api.put(`/cities/${selectedCity._id}`, {
        ...values,
        costIndex: values.costIndex ? Number(values.costIndex) : undefined,
        popularityScore: values.popularityScore
          ? Number(values.popularityScore)
          : undefined,
      });
      toast.success("City updated");
      setIsEditOpen(false);
      setSelectedCity(null);
      form.reset();
      fetchCities();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update city");
    }
  };

  // Delete City
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this city?")) return;
    try {
      await api.delete(`/cities/${id}`);
      toast.success("City deleted");
      fetchCities();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete city");
    }
  };

  // Form Fields Component (no images)
  const CityFormFields = () => (
    <div className="space-y-4 py-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Tokyo" {...field} />
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
              <Input placeholder="e.g., Japan" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="costIndex"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cost Index</FormLabel>
            <FormControl>
              <Input placeholder="e.g., 75" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="popularityScore"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Popularity Score</FormLabel>
            <FormControl>
              <Input placeholder="e.g., 90" {...field} />
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
              <Textarea placeholder="Short description about the city" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Cities</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => form.reset()}>Add City</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create City</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreate)}>
                <CityFormFields />
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
      ) : cities.length === 0 ? (
        <p className="text-gray-500">No cities found.</p>
      ) : (
        <div className="space-y-4">
          {cities.map((city) => (
            <div
              key={city._id}
              className="p-4 border rounded-lg flex justify-between items-center hover:shadow-md transition"
            >
              <div>
                <p className="font-semibold text-lg">{city.name}</p>
                <p className="text-sm text-gray-500">{city.country}</p>
                <p className="text-sm text-gray-600">{city.description}</p>
                <p className="text-sm text-gray-600">Cost Index: {city.costIndex}</p>
                <p className="text-sm text-gray-600">Popularity Score: {city.popularityScore}</p>
              </div>
              <div className="flex gap-2">
                <Dialog
                  open={isEditOpen && selectedCity?._id === city._id}
                  onOpenChange={(open) => {
                    setIsEditOpen(open);
                    if (open) {
                      setSelectedCity(city);
                      form.reset({
                        name: city.name,
                        country: city.country,
                        costIndex: city.costIndex?.toString() ?? "",
                        popularityScore: city.popularityScore?.toString() ?? "",
                        description: city.description ?? "",
                      });
                    } else {
                      setSelectedCity(null);
                      form.reset();
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline">Edit</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Edit City</DialogTitle>
                    </DialogHeader>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(handleUpdate)}>
                        <CityFormFields />
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
                  onClick={() => handleDelete(city._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageCities;
