import { createSlice } from '@reduxjs/toolkit';

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
//   image: string;
// }

// interface InitialState {
//   user: User | null;
// }

const getUserFromStorage = () => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

const initialState = {
  user: getUserFromStorage(),
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(action.payload));
      }
    },
    clearUser: (state) => {
      state.user = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
    },
    logout: (state) => {
      localStorage.clear();
      state.user = null;
    },
  },
});

export const { setUser, clearUser, logout } = userSlice.actions;
