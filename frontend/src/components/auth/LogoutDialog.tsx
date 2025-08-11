import {
  Dialog,
  DialogHeader,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import ToastComponent from "../ToastComponent";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { clearAccessToken } from "@/slices/authSlice";
import api from "@/api/axios";
import { toast } from "react-toastify";

const LogoutDialog = () => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout"); // Call backend logout API
      dispatch(clearAccessToken()); // Clear Redux state
      toast.success("Logged out successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to logout");
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive" className=" h-8 ml-auto mr-6">Logout</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="destructive" onClick={() => handleLogout()}>
              Confirm
            </Button>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ToastComponent />
    </>
  );
};

export default LogoutDialog;
