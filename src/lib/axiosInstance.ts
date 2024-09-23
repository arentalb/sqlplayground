import axios, { AxiosResponse } from "axios";

const axiosInstance = axios.create({
  baseURL: "/",
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // // Return a new object but also keep the response
    // console.log(response);
    // return {
    //   ...response,
    //   data: response.data,
    // } as AxiosResponse;

    return response;
  },
  (error) => {
    return Promise.reject({
      status: "error",
      message: error.response?.data?.message || "An error occurred",
      code: error.response?.status || 500,
    });
  },
);

export default axiosInstance;
