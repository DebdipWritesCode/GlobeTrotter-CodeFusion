import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, MapPin, Building2 } from "lucide-react";
import { toast } from "react-toastify";
import api from "@/api/axios";

const DEFAULT_CITY_IMAGE = 'https://drprem.com/travel/wp-content/uploads/sites/53/2020/06/Guide-to-cultural-tourism.jpg';

interface City {
  _id: string;
  name: string;
  country: string;
  costIndex: number;
  popularityScore: number;
  description: string;
  images: string[];
}

const ManageCities = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    costIndex: "",
    popularityScore: "",
    description: "",
    images: [] as string[]
  });
  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await api.get("/cities");
      setCities(response.data);
    } catch (error) {
      toast.error("Failed to fetch cities");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const cityData = {
        ...formData,
        costIndex: parseFloat(formData.costIndex),
        popularityScore: parseFloat(formData.popularityScore)
      };

      if (editingCity) {
        await api.put(`/cities/${editingCity._id}`, cityData);
        toast.success("City updated successfully");
      } else {
        await api.post("/cities", cityData);
        toast.success("City created successfully");
      }

      setIsDialogOpen(false);
      resetForm();
      fetchCities();
    } catch (error) {
      toast.error(editingCity ? "Failed to update city" : "Failed to create city");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (city: City) => {
    setEditingCity(city);
    setFormData({
      name: city.name,
      country: city.country,
      costIndex: city.costIndex.toString(),
      popularityScore: city.popularityScore.toString(),
      description: city.description,
      images: city.images
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this city?")) {
      try {
        await api.delete(`/cities/${id}`);
        toast.success("City deleted successfully");
        fetchCities();
      } catch (error) {
        toast.error("Failed to delete city");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      country: "",
      costIndex: "",
      popularityScore: "",
      description: "",
      images: []
    });
    setEditingCity(null);
  };

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
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Manage Cities</h1>
              <p className="text-muted-foreground">Create and manage platform cities</p>
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="w-4 h-4 mr-2" />
                Add City
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-background border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  {editingCity ? "Edit City" : "Add New City"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">City Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter city name"
                      className="bg-background border-border focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Country</label>
                    <Input
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="Enter country name"
                      className="bg-background border-border focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Cost Index</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.costIndex}
                      onChange={(e) => setFormData({ ...formData, costIndex: e.target.value })}
                      placeholder="e.g., 1.5"
                      className="bg-background border-border focus:border-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Popularity Score</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.popularityScore}
                      onChange={(e) => setFormData({ ...formData, popularityScore: e.target.value })}
                      placeholder="e.g., 8.5"
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
                    placeholder="Describe the city..."
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
                    {editingCity ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Cities Grid */}
        {cities.length === 0 ? (
          <Card className="bg-card/50 dark:bg-card/30 border-border/50">
            <CardContent className="p-12 text-center">
              <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No cities found</h3>
              <p className="text-muted-foreground">Create your first city to get started</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cities.map((city) => (
              <Card key={city._id} className="bg-card/50 dark:bg-card/30 border-border/50 hover:shadow-md transition-all duration-200">
                <img
                  src={DEFAULT_CITY_IMAGE}
                  alt={city.name}
                  className="w-full h-40 object-cover"
                  loading="lazy"
                />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-foreground">
                    <MapPin className="w-5 h-5 text-primary" />
                    {city.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Country:</span>
                    <span className="text-foreground font-medium">{city.country}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Cost Index:</span>
                    <span className="text-foreground font-medium">{city.costIndex}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Popularity:</span>
                    <span className="text-foreground font-medium">{city.popularityScore}/10</span>
                  </div>
                  {city.description && (
                    <div className="text-sm text-muted-foreground mt-2">
                      {city.description.length > 100 
                        ? `${city.description.substring(0, 100)}...` 
                        : city.description}
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(city)}
                      className="flex-1 text-xs"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(city._id)}
                      className="flex-1 text-xs"
                    >
                      Delete
                    </Button>
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

export default ManageCities;
