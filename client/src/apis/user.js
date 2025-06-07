import axios from "../config/axios";

export const apiRegister = async (data) =>
	axios({
		method: "POST",
		url: `/user/register`,
		data,
		withCredentials: true,
	});

export const apiLogin = async (data) =>
	axios({
		method: "POST",
		url: `/user/login`,
		data,
		withCredentials: true,
	});

export const apiLogout = async () =>
	axios({
		method: "POST",
		url: `/user/logout`,
		withCredentials: true,
	});

export const apiForgotPassword = async (data) =>
	axios({
		method: "POST",
		url: `/user/forgot-password`,
		data,
	});

export const apiResetPassword = async (data) =>
	axios({
		method: "PUT",
		url: `/user/reset-password/${data.token}`,
		data,
	});

export const apiGetCurrent = async () =>
	axios({
		method: "GET",
		url: `/user/current`,
		withCredentials: true,
	});
export const apiGetAllUsers = async (params) =>
	axios({
		method: "GET",
		url: `/user`,
		params
	});
export const apiBlockUser = async (id) =>
	axios({
		method: "POST",
		url: `/user/block/${id}`,
	});

export const apiUpdateCurrentUser = async (data) =>
	axios({
		method: "PUT",
		url: `/user/current`,
		data,
		withCredentials: true,
	});
export const apiUpdateUserByAdmin = async (id, data) =>
	axios({
		method: "PUT",
		url: `/user/${id}`,
		data
	});
export const apiDeleteUser = async (id) =>
	axios({
		method: "DELETE",
		url: `/user/${id}`,
	});
