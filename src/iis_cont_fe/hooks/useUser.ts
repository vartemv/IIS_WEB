import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { AuthUser } from "@/utils/types/auth";
import useCookie from "./useCookie";

export const useUser = () => {
  const { user, setUser } = useContext(AuthContext);
  const { setCookie, removeCookie } = useCookie();

  const addUser = (user: AuthUser) => { 
    console.log("Adding user")   
    setUser(user);
    setCookie("user", JSON.stringify(user));
  };

  const removeUser = () => {
    setUser(null);
    removeCookie("user");
  };

  return { user, addUser, removeUser };
};