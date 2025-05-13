import { createSlice } from "@reduxjs/toolkit";
import { getNewProducts } from "./asyncAction";
export const productSlice = createSlice({
	name: "product",
	initialState: {
		newProducts: [],
		isLoading: false,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getNewProducts.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getNewProducts.fulfilled, (state, action) => {
				state.isLoading = false;
				state.newProducts = action.payload;
			})
			.addCase(getNewProducts.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload.message;
			});
	},
});

export default productSlice.reducer;
