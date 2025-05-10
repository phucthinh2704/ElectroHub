import axios from "../config/axios";

export const apiGetAllCategories = async () =>
	axios({
		method: "GET",
		url: `/product-category/`,
	});
