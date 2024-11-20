export type TUser = {
    email: string;
    profileName: string;
  };
  
  export type AuthUser = {
    role: string;
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

  export type JWTPayload ={}

  export interface DecodedToken extends JWTPayload  {
    user: string;
    email: string;
    role: string;
    iat: number;
  };
  