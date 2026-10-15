import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://192.168.10.6:8080/api"
});

export default axiosInstance;