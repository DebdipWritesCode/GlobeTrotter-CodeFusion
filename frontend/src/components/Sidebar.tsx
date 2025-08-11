import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggle from "./ThemeToggle";

const Sidebar = () => {
  const [_, setIsOpen] = useState(false);
  const userName = useSelector((state: RootState) => state.auth.name);
  const userEmail = useSelector((state: RootState) => state.auth.email);

  const getInitials = (name: string | null) => {
    if (!name) return "US";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <>
      <Sheet>
        <SheetTrigger asChild className="fixed top-4 left-4 z-50 ">
          <Button
            variant="outline"
            className=" p-2 h-10 sm:h-14 text-lg flex items-center justify-center gap-2 shadow-md">
            <Menu size={80} />
            <p className="hidden sm:block">See Menu</p>
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-[300px] p-0">
          <SidebarContent
            userName={userName}
            userEmail={userEmail}
            getInitials={getInitials}
            onNavigate={() => setIsOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <div className="hidden fixed left-0 top-0 h-full w-[300px] border-r">
        <SidebarContent
          userName={userName}
          userEmail={userEmail}
          getInitials={getInitials}
        />
      </div>
    </>
  );
};

const SidebarContent = ({
  userName,
  userEmail,
  getInitials,
  onNavigate,
}: {
  userName: string | null;
  userEmail: string | null;
  getInitials: (name: string | null) => string;
  onNavigate?: () => void;
}) => {
  return (
    <div className="h-full flex flex-col justify-between">
      <div className="border-b px-6 py-4">
        <SheetHeader>
          <h1 className="text-3xl text-blue-900 font-normal font-heading">
            Munshiji
          </h1>
        </SheetHeader>
      </div>

      <nav className="flex-1 px-6 py-4">
        <ul className="space-y-2">
          <li>
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start"
              onClick={onNavigate}>
              <Link to="/see-sheets">Dashboard</Link>
            </Button>
          </li>

          <li>
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start"
              onClick={onNavigate}>
              <Link to="/about">About</Link>
            </Button>
          </li>

          <li>
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start"
              onClick={onNavigate}>
              <Link to="/buy-coffee">Buy me a coffee</Link>
            </Button>
          </li>
        </ul>
      </nav>

      <SheetFooter className="border-t px-6 py-4 flex flex-col gap-4 items-start">
        <ThemeToggle />

        <div className="flex items-center gap-3 w-full">
          <Avatar>
            <AvatarImage src="" />
            <AvatarFallback>{getInitials(userName)}</AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <p className="font-medium truncate">{userName || "User"}</p>
            <p className="text-sm text-muted-foreground truncate">
              {userEmail || "No email"}
            </p>
          </div>
        </div>
      </SheetFooter>
    </div>
  );
};

export default Sidebar;
