import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
  name: string | null;
  email: string | null;
  user_id: string | null;
  loading: boolean;
}

interface Payload {
  jwt_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    created_at: string;
  };
  metadata: {
    user_agent: string;
    client_ip: string;
  }
}

const initialState: AuthState = {
  accessToken: null,
  name: null,
  email: null,
  user_id: null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<Payload>) => {
      state.accessToken = action.payload.jwt_token;
      state.name = action.payload.user.name;
      state.email = action.payload.user.email;
      state.user_id = action.payload.user.id;
      state.loading = false;
    },
    clearAccessToken: (state) => {
      if (state.accessToken !== null) {
        state.accessToken = null;
      }
      state.loading = false;
    },
  },
});

export const { setAccessToken, clearAccessToken } = authSlice.actions;
export default authSlice.reducer;
