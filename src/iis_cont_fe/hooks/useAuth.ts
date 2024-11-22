import { useUser } from "./useUser";
import axios from "axios";
import { AuthResponse, TLogin, TRegister } from "@/utils/types/auth";

export const useAuth = () => {
  const { user, addUser, removeUser } = useUser();

  const refresh = () => {
    fetch('api/auth/refresh');
  };

  const register = async (creds: TRegister) => {
    return await axios
      .post(`/api/auth/reg/`, creds)
      .then((res) => {
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

  const get_data = async (profile_name: string) => {
    return await axios
    .get(`/api/data/getPosts?user=${profile_name}`)
    .then((res) => {
        return res.data;
    })
    .catch((err) => {
      console.log("Error");
      console.log(err);
      return "smth"
    });
  }

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

  return { user, login, register, logout, refresh, get_data };
};