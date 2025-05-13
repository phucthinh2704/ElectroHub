import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from "../../apis";

export const getCategories = createAsyncThunk(
	"app/categories",
	async (data, { rejectWithValue }) => {
		const response = await apis.apiGetAllCategories();

		if (response.success) {
			return response.categories;
		} else {
			return rejectWithValue(response);
		}
	}
);
