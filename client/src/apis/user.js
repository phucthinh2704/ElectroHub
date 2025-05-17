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
	});
