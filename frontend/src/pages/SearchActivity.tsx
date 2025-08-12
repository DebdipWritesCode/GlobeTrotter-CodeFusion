import { useState, useRef } from "react";
import axios from "axios";
import api from "../api/axios";

const SearchActivity = () => {
  type City = { _id: string; name: string; description?: string; images?: string[] };
  type Activity = {
    _id: string;
    name: string;
    description?: string;
    images?: string[];
    cityId?: { name?: string } | null;
  };
  type SearchActivityResponse = {
    type: "activity";
    activities?: Activity[];
    cities?: City[];
    similar?: Activity[];
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [cityResults, setCityResults] = useState<City | null>(null);
  const [cityActivities, setCityActivities] = useState<Activity[]>([]);
  const [activityResults, setActivityResults] = useState<SearchActivityResponse | null>(null);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = async (term = searchTerm) => {
    if (!term.trim()) return;
    setLoading(true);
    setError("");
    setCityResults(null);
    setCityActivities([]);
    setActivityResults(null);
    setShowSuggestions(false);

    try {
      const res = await api.get(`/search?q=${encodeURIComponent(term)}`);
      if (res.data.type === "city") {
        setCityResults(res.data.city);
        setCityActivities(res.data.activities || []);
      } else if (res.data.type === "activity") {
        setActivityResults(res.data);
      }
    } catch (err: unknown) {
      console.error(err);
      const status = axios.isAxiosError(err) ? err.response?.status : undefined;
      if (status === 400) {
        setError("Please enter a search term.");
      } else if (status === 404) {
        setError("No results found.");
      } else {
        setError("An error occurred while searching.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await api.get(`/search/suggestions?q=${encodeURIComponent(query)}`);
      setSuggestions(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (value: string) => {
    setSearchTerm(value);
    setShowSuggestions(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    handleSearch(suggestion);
  };

  type CardProps = { image?: string; title: string; description?: string; subtitle?: string };
  const Card = ({ image, title, description, subtitle }: CardProps) => (
    <div className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-border">
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full h-40 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto text-foreground">
      {/* Search */}
      <div className="relative mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by city or activity..."
            className="flex-1 px-4 py-2 bg-background text-foreground border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
            value={searchTerm}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={() => handleSearch()}
            className="px-5 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
          >
            Search
          </button>
        </div>

        {/* Dark Autocomplete Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-card border border-border rounded-lg mt-1 shadow-lg max-h-60 overflow-auto">
            {suggestions.map((s, idx) => (
              <li
                key={idx}
                className="px-4 py-2 hover:bg-muted text-foreground cursor-pointer transition-colors"
                onClick={() => handleSuggestionClick(s)}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Loading */}
      {loading && <p className="text-muted-foreground">Searching...</p>}

      {/* Error */}
      {error && <p className="text-destructive">{error}</p>}

      {/* City Result */}
      {cityResults && (
        <div className="mb-10">
          <h2 className="text-3xl font-bold mb-3">{cityResults.name}</h2>
          <p className="mb-6 text-muted-foreground">{cityResults.description}</p>
          <h3 className="text-2xl font-semibold mb-4">Activities in this city</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cityActivities.map((activity) => (
              <Card
                key={activity._id}
                image={activity.images?.[0]}
                title={activity.name}
                description={activity.description}
              />
            ))}
          </div>
        </div>
      )}

      {/* Activity Result */}
      {activityResults && (
        <div>
          <h2 className="text-3xl font-bold mb-6">Activities Found</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {activityResults.activities?.map((activity: Activity) => (
              <Card
                key={activity._id}
                image={activity.images?.[0]}
                title={activity.name}
                description={activity.description}
                subtitle={`City: ${activity.cityId?.name}`}
              />
            ))}
          </div>

          <h3 className="text-2xl font-semibold mb-4">Cities offering this activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {activityResults.cities?.map((city: City) => (
              <Card
                key={city._id}
                image={city.images?.[0]}
                title={city.name}
                description={city.description}
              />
            ))}
          </div>

      {activityResults.similar && activityResults.similar.length > 0 && (
            <>
              <h3 className="text-2xl font-semibold mb-4">Similar activities</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activityResults.similar?.map((activity: Activity) => (
                  <Card
                    key={activity._id}
                    image={activity.images?.[0]}
                    title={activity.name}
                    description={activity.description}
                    subtitle={`City: ${activity.cityId?.name}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchActivity;
