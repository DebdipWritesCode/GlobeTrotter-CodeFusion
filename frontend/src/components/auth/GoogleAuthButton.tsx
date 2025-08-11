import React from "react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import api from "@/api/axios";
import { useDispatch } from "react-redux";
import { setAccessToken } from "@/slices/authSlice";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      console.error("No credential from Google");
      return;
    }

    try {
      const res = await api.post("/auth/google", {
        idToken: credentialResponse.credential,
      });

      if (res.data?.jwt_token) {
        dispatch(setAccessToken(res.data));
        console.log("Google login success:", res.data);

        navigate("/dashboard");
      } else {
        console.error("No JWT token returned from backend");
      }
    } catch (err) {
      console.error("Google login failed:", err);
    }
  };

  const handleError = () => {
    console.error("Google Sign-In Failed");
  };

  return (
    <div className="w-full mt-4">
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
};

export default GoogleLoginButton;
