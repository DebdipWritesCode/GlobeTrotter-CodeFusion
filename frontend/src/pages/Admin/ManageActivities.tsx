import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, MapPin, Activity } from "lucide-react";
import { toast } from "react-toastify";
import api from "@/api/axios";
import { formatINR } from "@/lib/utils";

interface Activity {
  _id: string;
  name: string;
  description: string;
  cityId: {
    _id: string;
    name: string;
    country: string;
  };
  category: string;
  cost: number;
  duration: number;
  images: string[];
}

interface City {
  _id: string;
  name: string;
  country: string;
}

const ManageActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cityId: "",
    category: "",
    cost: "",
    duration: "",
    images: [] as string[]
  });

  useEffect(() => {
    fetchActivities();
    fetchCities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await api.get("/activities");
      setActivities(response.data);
  } catch {
      toast.error("Failed to fetch activities");
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await api.get("/cities");
      setCities(response.data);
  } catch {
      toast.error("Failed to fetch cities");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const activityData = {
        ...formData,
        cost: parseFloat(formData.cost),
        duration: parseFloat(formData.duration)
      };

      if (editingActivity) {
        await api.put(`/activities/${editingActivity._id}`, activityData);
        toast.success("Activity updated successfully");
      } else {
        await api.post("/activities", activityData);
        toast.success("Activity created successfully");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchActivities();
  } catch {
      toast.error(editingActivity ? "Failed to update activity" : "Failed to create activity");
    }
  };


  
  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      name: activity.name,
      description: activity.description,
      cityId: activity.cityId._id,
      category: activity.category,
      cost: activity.cost.toString(),
      duration: activity.duration.toString(),
      images: activity.images
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      try {
        await api.delete(`/activities/${id}`);
        toast.success("Activity deleted successfully");
        fetchActivities();
  } catch {
        toast.error("Failed to delete activity");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      cityId: "",
      category: "",
      cost: "",
      duration: "",
      images: []
    });
    setEditingActivity(null);
  };

  const groupedActivities = activities.reduce((acc, activity) => {
    const cityName = activity.cityId.name;
    if (!acc[cityName]) {
      acc[cityName] = [];
    }
    acc[cityName].push(activity);
    return acc;
  }, {} as Record<string, Activity[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <Card className="bg-card/50 dark:bg-card/30 border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 dark:bg-primary/20 rounded-lg">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Manage Activities</h1>
              <p className="text-muted-foreground">Create and manage platform activities</p>
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="w-4 h-4 mr-2" />
                Add Activity
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-background border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  {editingActivity ? "Edit Activity" : "Add New Activity"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-background border-border focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">City</label>
                    <Select value={formData.cityId} onValueChange={(value) => setFormData({ ...formData, cityId: value })}>
                      <SelectTrigger className="bg-background border-border focus:border-primary">
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city._id} value={city._id}>
                            {city.name}, {city.country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Category</label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                      <SelectTrigger className="bg-background border-border focus:border-primary">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sightseeing">Sightseeing</SelectItem>
                        <SelectItem value="food">Food</SelectItem>
                        <SelectItem value="adventure">Adventure</SelectItem>
                        <SelectItem value="culture">Culture</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Cost (₹)</label>
                    <Input
                      type="number"
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                      className="bg-background border-border focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Duration (hours)</label>
                    <Input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="bg-background border-border focus:border-primary"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-background border-border focus:border-primary"
                    rows={3}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingActivity ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Activities List */}
        {activities.length === 0 ? (
          <Card className="bg-card/50 dark:bg-card/30 border-border/50">
            <CardContent className="p-12 text-center">
              <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No activities found</h3>
              <p className="text-muted-foreground">Create your first activity to get started</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedActivities).map(([cityName, cityActivities]) => (
              <Card key={cityName} className="bg-card/50 dark:bg-card/30 border-border/50 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <MapPin className="w-5 h-5 text-primary" />
                    {cityName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cityActivities.map((activity) => (
                      <div
                        key={activity._id}
                        className="p-4 border border-border/50 rounded-lg bg-background hover:border-border transition-colors"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-foreground">{activity.name}</h4>
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(activity)}
                              className="text-xs"
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(activity._id)}
                              className="text-xs"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>₹{formatINR(activity.cost)}</span>
                          <span>{activity.duration}h</span>
                          <span className="capitalize">{activity.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageActivities;
