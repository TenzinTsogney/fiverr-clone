import axios from "axios";

const newRequest = axios.create({
  baseURL: baseURL: import.meta.env.VITE_API_URL || "http://localhost:8800/api",
  withCredentials: true, // needed for cookies
});

export default newRequest;
