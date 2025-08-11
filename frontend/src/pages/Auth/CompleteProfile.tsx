import CompleteProfileForm from "@/components/auth/CompleteProfileForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

const CompleteProfile = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Please fill in the details below to complete your profile.
          </CardDescription>
          <CardAction>
            <Link to="/signup">
              <Button variant="outline" className="w-full mt-4">
                Sign up
              </Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <CompleteProfileForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default CompleteProfile;
