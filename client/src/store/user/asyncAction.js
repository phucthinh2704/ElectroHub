import { createAsyncThunk } from "@reduxjs/toolkit";
import * as apis from "../../apis";

export const getCurrent = createAsyncThunk(
	"user/current",
	async (data, { rejectWithValue }) => {
		const response = await apis.apiGetCurrent();
		if (response.success) {
			return response.user;
		} else {
			return rejectWithValue(response);
		}
	}
);
