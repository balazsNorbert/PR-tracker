import { jwtDecode } from 'jwt-decode';
import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('token');

const initialState = {
  user: token ? jwtDecode(token) : null,
  token: token || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { token } = action.payload;
      localStorage.setItem('token', token);
      state.token = token;
      state.user = jwtDecode(token);
    },
    logout: (state) => {
      localStorage.removeItem('token');
      state.token = null;
      state.user = null;
    },
    checkTokenExpiration: (state) => {
      if (state.token) {
        const decodedToken = jwtDecode(state.token);
        const expirationTime = decodedToken.exp * 1000;
        const currentTime = Date.now();

        if(expirationTime < currentTime) {
          localStorage.removeItem("token");
          state.token = null;
          state.user = null;
        }
      }
    }
  }
});

export const { login, logout, checkTokenExpiration } = authSlice.actions;
export default authSlice.reducer;