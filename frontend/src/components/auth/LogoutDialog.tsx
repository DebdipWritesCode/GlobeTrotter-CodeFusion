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

const LogoutDialog = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearAccessToken());
  }

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
            <DialogClose>
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
