import { useUser } from "./useUser";
import axios from "axios";
import { AuthResponse, TLogin, TRegister } from "@/utils/types/auth";
import useCookie from "./useCookie";

export const useAuth = () => {
  const { user, addUser, removeUser } = useUser();

  const refresh = () => {
    fetch('api/auth/refresh');
  };

  const register = async (creds: TRegister) => {
    return await axios
      .post(`/api/auth/reg/`, creds)
      .then((res) => {
        console.log(res);
        if (res.data?.data)
          addUser(res.data.data)
        return res.data as AuthResponse;
      })
      .catch((err) => {
        if (err && err?.response && err.response?.data)
          return { ...err.response.data, success: false } as AuthResponse;
        else return err as AuthResponse;
      });
  };

  const login = async (creds: TLogin) => {
    return await axios
      .post(`api/auth/login/`, creds)
      .then((res) => {
        if (res.data?.data) 
          addUser(res.data.data);
        return res.data as AuthResponse;
      })
      .catch((err) => {
        if (err && err?.response && err.response?.data)
          return { ...err.response.data, success: false } as AuthResponse;
        else return err as AuthResponse;
      });
  };

  const logout = () => {
    removeUser();
  };

  return { user, login, register, logout, refresh };
};