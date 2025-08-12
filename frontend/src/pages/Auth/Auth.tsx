// src/pages/Auth/Auth.tsx
import type { FC } from "react";
import SlidingAuth from "@/components/auth/SlidingAuth/SlidingAuth";

type Props = {
  mode?: "signin" | "signup";
};

const Auth: FC<Props> = ({ mode = "signin" }) => {
  return <SlidingAuth initialMode={mode} />;
};

export default Auth;
