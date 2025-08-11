import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "./api/axios";
import { setAccessToken, clearAccessToken } from "./slices/authSlice";
import type { RootState } from "./redux/store";
import Router from "./router/Router";
import Loading from "./components/Loading";

const App = () => {
  const dispatch = useDispatch();

  const loading = useSelector((state: RootState) => state.auth.loading);

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const res = await axios.post("/auth/refresh_access_token", {}, { withCredentials: true }); // ✅ Ensure this
        dispatch(setAccessToken(res.data));
      } catch {
        dispatch(clearAccessToken());
      }
    };
    refreshToken();
  }, [dispatch]);

  if (loading) return (
    <Loading />
  )

  return <Router />;
};

export default App;
