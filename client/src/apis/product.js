import axios from "../config/axios";

export const apiGetProducts = async (params) =>
	axios({
		method: "GET",
		url: `/product/`,
		params,
	});
export const apiCreateProduct = async (data) =>
	axios({
		method: "POST",
		url: `/product/`,
		data,
	});
export const apiUpdateProduct = async (id, data) =>
	axios({
		method: "PUT",
		url: `/product/${id}`,
		data,
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
export const apiDeleteProduct = async (id) =>
	axios({
		method: "DELETE",
		url: `/product/${id}`,
	});
export const apiUpdateProductVariant = async (id, data) =>
	axios({
		method: "PUT",
		url: `/product/variant/${id}`,
		data,
	});
