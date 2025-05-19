import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncAction";
export const userSlice = createSlice({
	name: "user",
	initialState: {
		isLoggedIn: false,
		current: null,
      token: null,
      isLoading: false,
	},
	reducers: {
      login: (state, action) => {
         state.isLoggedIn = action.payload.isLoggedIn;
         state.current = action.payload.user;
         state.token = action.payload.token;
      },
      logout: (state) => {
         state.isLoggedIn = false;
         state.current =null;
         state.token = null;
      },
   },
   extraReducers: (builder) => {
      builder.addCase(actions.getCurrent.pending, (state) => {
         state.isLoading = true;
      });
      builder.addCase(actions.getCurrent.fulfilled, (state, action) => {
         state.isLoading = false;
         state.current = action.payload;
      });
      builder.addCase(actions.getCurrent.rejected, (state) => {
         state.isLoading = false;
         state.current = null;
      });
   }
});

export const { login,logout } = userSlice.actions;
export default userSlice.reducer;
