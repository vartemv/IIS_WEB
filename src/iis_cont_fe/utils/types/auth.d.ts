export type TUser = {
    email: string;
    firstName: string;
    lastName: string;
  };
  
  export type AuthUser = {
    token: string;
    user: TUser;
  };
  
  export type TLogin = {
    email: string;
    password: string;
  };

  export type TRegister = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    
    profile_name: string;
    confirmPassword?: string; // Optional: If needed for validation
  };
  
  export type AuthResponse = {
    message: string;
    data?: AuthUser;
    success?: boolean;
  };