import axios from "../config/axios";

export const apiGetProducts = async (params) =>
	axios({
		method: "GET",
		url: `/product/`,
		params,
	});

export const apiGetProductById = async ({ pid }) =>
	axios({
		method: "GET",
		url: `/product/${pid}`,
	});
export const apiRatings = async (data) =>
	axios({
		method: "PUT",
		url: `/product/ratings`,
		data,
	});
