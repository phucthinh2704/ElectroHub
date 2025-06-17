import axios from "../config/axios";

export const apiGetAllCategories = async () =>
	axios({
		method: "GET",
		url: `/product-category/`,
	});
export const apiAddCategory = async (data) =>
	axios({
		method: "POST",
		url: `/product-category/`,
		data,
	});
export const apiUpdateCategory = async (id, data) =>
	axios({
		method: "PUT",
		url: `/product-category/${id}`,
		data,
	});
export const apiDeleteCategory = async (id) =>
	axios({
		method: "DELETE",
		url: `/product-category/${id}`,
	});
