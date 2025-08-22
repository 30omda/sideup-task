import axios from "axios";
const host = import.meta.env.VITE_API_Login;

const axiosInstance = axios.create({
    baseURL: host,
});

export default axiosInstance;
