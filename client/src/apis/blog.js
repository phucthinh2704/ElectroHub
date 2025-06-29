import axios from "../config/axios";
export const apiGetAllBlogs = async (params) =>
	axios({
		method: "GET",
		url: `/blog/`,
		params,
	});
export const apiBlogById = async (id) =>
	axios({
		method: "GET",
		url: `/blog/${id}`,
	});
export const apiCreateBlog = async (data) =>
	axios({
		method: "POST",
		url: `/blog/`,
		data,
	});
