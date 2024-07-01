import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppState as RootState } from '../store';  

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  favLinks: string[];
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
}

// Initial state
const initialState: AppState = {
  user: null,
  isAuthenticated: false,
};

// Slice
export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
    updateUser(state, action: PayloadAction<Partial<User>>) {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    addFavLink(state, action: PayloadAction<string>) {
      if (state.user) {
        state.user.favLinks.push(action.payload);
      }
    },
    removeFavLink(state, action: PayloadAction<string>) {
      if (state.user) {
        state.user.favLinks = state.user.favLinks.filter(link => link !== action.payload);
      }
    },
  },
});

export const { setUser, clearUser, updateUser, addFavLink, removeFavLink } = appSlice.actions;

export const selectUser = (state: RootState) => state.app.user;
export const selectIsAuthenticated = (state: RootState) => state.app.isAuthenticated;

export default appSlice.reducer;
