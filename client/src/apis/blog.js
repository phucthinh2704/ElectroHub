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
export const apiLikeBlog = async (id) =>
	axios({
		method: "PUT",
		url: `/blog/like/${id}`,
	});
export const apiDislikeBlog = async (id) =>
	axios({
		method: "PUT",
		url: `/blog/dislike/${id}`,
	});
export const apiCommentBlog = async (id, data) =>
	axios({
		method: "POST",
		url: `/blog/comment/${id}`,
		data,
	});
export const apiDeleteCommentBlog = async (blogId, commentId) =>
	axios({
		method: "DELETE",
		url: `/blog/comment/${blogId}/${commentId}`,
	});
export const apiLikeCommentBlog = async (blogId, commentId) =>
	axios({
		method: "PUT",
		url: `/blog/like-comment/${blogId}/${commentId}`,
	});
