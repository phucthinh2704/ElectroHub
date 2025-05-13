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
