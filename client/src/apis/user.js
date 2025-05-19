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
