import { configureStore } from '@reduxjs/toolkit';
import authSlice from '@/slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
  },
});

// Type Helpers for use in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;