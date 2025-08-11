import { useTheme } from "../hooks/useTheme";
import { Sun, Moon, Laptop } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setTheme("light")}
        className={`p-2 rounded-md ${theme === "light" ? "bg-muted" : ""}`}
        title="Light mode"
      >
        <Sun className="w-5 h-5" />
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`p-2 rounded-md ${theme === "dark" ? "bg-muted" : ""}`}
        title="Dark mode"
      >
        <Moon className="w-5 h-5" />
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`p-2 rounded-md ${theme === "system" ? "bg-muted" : ""}`}
        title="System theme"
      >
        <Laptop className="w-5 h-5" />
      </button>
    </div>
  );
}
