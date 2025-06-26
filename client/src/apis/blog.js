import axios from "../config/axios";
export const apiGetAllBlogs = async (params) =>
   axios({
      method: "GET",
      url: `/blog/`,
      params
   });
