import GoogleLoginButton from "@/components/auth/GoogleAuthButton";
import LoginForm from "@/components/auth/LoginForm";
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

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Log In</CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Welcome back! Please enter your details.
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
          <LoginForm />
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-3 text-sm text-gray-500">OR</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
          <GoogleLoginButton />
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
