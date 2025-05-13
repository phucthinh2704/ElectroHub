import { createSlice } from "@reduxjs/toolkit";
import * as actions from "./asyncActions";
export const appSlice = createSlice({
	name: "app",
	initialState: {
		categories: [],
		isLoading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(actions.getCategories.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(actions.getCategories.fulfilled, (state, action) => {
				state.isLoading = false;
				state.categories = action.payload;
			})
			.addCase(actions.getCategories.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload.message;
			});
	},
});

// export const {  } = appSlice.actions;
export default appSlice.reducer;
