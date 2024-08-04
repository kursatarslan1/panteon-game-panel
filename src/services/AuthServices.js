import { toast } from "react-toastify";
import axios, { baseURL, URL } from "../constants/api/axios";

const login = async (data) => {
  try {
    const response = await axios.post(`${baseURL}${URL.login}`, data);
    if (response.status !== 200) {
      return false;
    }
    return response.data;
  } catch (error) {
    console.log("Login service error - authservices: ", error);
    return false;
  }
};

const userinfo = async (token) => {
  try {
    const response = await axios.get(`${baseURL}${URL.userinfo}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log("User info service error - authservices: ", error);
    return false;
  }
};

const register = async (data) => {
  try {
    const response = await axios.post(`${baseURL}${URL.register}`, data);
    return response.data;
  } catch (error) {
    if (error.response.data.includes("already exists")) {
      toast.error("Bu kullanıcı adı veya email zaten kayıtlı.");
    }
    console.log("Register service error - authservices: ", error);
    return false;
  }
};

const AuthService = { login, register, userinfo };

export default AuthService;
