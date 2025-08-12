import React from "react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import api from "@/api/axios";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAccessToken } from "@/slices/authSlice";
import { useNavigate } from "react-router-dom";

// Add the props interface to accept className
interface GoogleAuthButtonProps {
  className?: string;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ className }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse?.credential) {
      console.error("No credential from Google");
      return;
    }

    try {
      const res = await api.post("/auth/google", {
        idToken: credentialResponse.credential,
      });

      if (res.data?.profileIncomplete) {
        navigate("/complete-profile", {
          state: { user: res.data.user },
        });
        return;
      }

      if (res.data?.jwt_token) {
        dispatch(setAccessToken(res.data));
        navigate("/dashboard");
      } else {
        console.error("No JWT token returned from backend", res.data);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response) {
          console.error("Server error:", err.response.status, err.response.data);
        } else if (err.request) {
          console.error("Network / no response from server:", err.request);
        } else {
          console.error("Axios error:", err.message);
        }
      } else {
        console.error("Unexpected error:", err);
      }
    }
  };

  const handleError = () => {
    console.error("Google Sign-In Failed");
  };

  // Use the className prop and add custom styling for prominence
  return (
    <div
      className={`${className || ""} w-full`}
      style={{
        zIndex: 10,
        position: "relative",
        overflow: "visible",
        minHeight: "44px",
        display: "block",
        opacity: 1,
        visibility: "visible",
      }}
    >
      <div className="relative w-full rounded-xl shadow-[0_10px_24px_rgba(0,0,0,0.08)]">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          type="standard"
          theme="outline"
          size="large"
          text="continue_with"
          width="100%"
          logo_alignment="center"
        />
      </div>
    </div>
  );
};

// Also export as default for flexibility
export default GoogleAuthButton;
