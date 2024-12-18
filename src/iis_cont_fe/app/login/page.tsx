"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { TLogin, TRegister } from "@/utils/types/auth";
import { useState } from "react";
import Image from 'next/image'
import FITlogo from '@/app/public/logo.png'

const Sign_in = () => {
  const [loginData, setLoginData] = useState<TLogin>({ email: "", password: "" });
  const [registerData, setRegisterData] = useState<TRegister>({ email: "", password: "", profile_name: "", lastName: "", firstName: "" });
  const { login, register } = useAuth(); // Destructure login from useAuth hook
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({});
  const [loginErrorMessage, setLoginErrorMessage] = useState<string | null>(null);
  const [registerErrorMessage, setRegisterErrorMessage] = useState<string | null>(null);
  const [registerErrors, setRegisterErrors] = useState<{
    email?: string;
    password?: string;
    profile_name?: string;
    lastName?: string;
    firstName?: string;
  }>({});
  const router = useRouter(); // For navigation after successful login

  const validateLogin = () => {
    const errors: { email?: string; password?: string } = {};
    if (!loginData.email) errors.email = "Email is required.";
    if (!loginData.password) errors.password = "Password is required.";
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegister = () => {
    const errors: {
      email?: string;
      password?: string;
      profile_name?: string;
      lastName?: string;
      firstName?: string;
    } = {};
    if (!registerData.email) errors.email = "Email is required.";
    if (!registerData.password) errors.password = "Password is required.";
    if (!registerData.profile_name) errors.profile_name = "Profile name is required.";
    if (!registerData.firstName) errors.firstName = "First name is required.";
    if (!registerData.lastName) errors.lastName = "Last name is required.";
    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: "login" | "register") => {
    const { id, value } = e.target;

    if (type === "login") {
      setLoginData({ ...loginData, [id]: value });
    } else if (type === "register") {
      setRegisterData({ ...registerData, [id]: value });
    }
  };

  const handleLoginSubmit = () => {
    if (!validateLogin()) {
      return;
    }
    // Call the login function from useAuth
    login(loginData)
      .then((data) => {
        if (data?.success) {
          router.push("/info"); // Redirect to the homepage (or any other page)
        } else {
          setLoginErrorMessage(data.message || "Login failed. Please try again."); // Handle error or failed login
        }
      })
      .catch((err) => {
        console.log(err); // Handle unexpected errors
      });
  };

  const handleRegisterSubmit = () => {
    if (!validateRegister()) {
      return;
    }
    register(registerData)
      .then((data) => {
        if (data?.success) {
          router.push("/info"); // Redirect to the homepage (or any other page)
        } else {
          setRegisterErrorMessage(data.message || "Registration failed. Please try again.");
        }
      })
      .catch((err) => {
        console.log(err); // Handle unexpected errors
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen flex-col">
      <a href="/info" className="mb-8">
        <Image src={FITlogo} alt="Logo" className="mb-8" width={50}
          height={50} />
      </a>
      <Tabs defaultValue="Login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2 bg-gray-200">
          <TabsTrigger value="Login">
            Login
          </TabsTrigger>
          <TabsTrigger value="Register">
            Register
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Login to your favorite FITstagram
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {loginErrorMessage && <p className="text-red-500 text-sm mb-2">{loginErrorMessage}</p>}
              <div className="space-y-1">
                <Label htmlFor="email">FITmail</Label>
                <Input id="email" type="email" value={loginData.email} onChange={(e) => handleInputChange(e, "login")} required />
                {loginErrors.email && <p className="text-red-500 text-sm">{loginErrors.email}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">FITpass</Label>
                <Input id="password" type="password" onChange={(e) => handleInputChange(e, "login")} value={loginData.password} required />
                {loginErrors.password && <p className="text-red-500 text-sm">{loginErrors.password}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant={"default"} onClick={handleLoginSubmit} >Login</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="Register">
          <Card>
            <CardHeader>
              <CardTitle>Register</CardTitle>
              <CardDescription>
                Create account at your going-to-be favorite FITstagram
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {registerErrorMessage && <p className="text-red-500 text-sm mb-2">{registerErrorMessage}</p>}
              <div className="space-y-1">
                <Label htmlFor="firstName">Name </Label>
                <Input id="firstName" type="text" value={registerData.firstName} onChange={(e) => handleInputChange(e, "register")} required />
                {registerErrors.firstName && <p className="text-red-500 text-sm">{registerErrors.firstName}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="lastName">Surname</Label>
                <Input id="lastName" type="text" value={registerData.lastName} onChange={(e) => handleInputChange(e, "register")} required />
                {registerErrors.lastName && <p className="text-red-500 text-sm">{registerErrors.lastName}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="profile_name">FITname</Label>
                <Input id="profile_name" type="text" value={registerData.profile_name} onChange={(e) => handleInputChange(e, "register")} required />
                {registerErrors.profile_name && <p className="text-red-500 text-sm">{registerErrors.profile_name}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={registerData.email} onChange={(e) => handleInputChange(e, "register")} required />
                {registerErrors.email && <p className="text-red-500 text-sm">{registerErrors.email}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">FITpass</Label>
                <Input id="password" type="password" value={registerData.password} onChange={(e) => handleInputChange(e, "register")} required />
                {registerErrors.password && <p className="text-red-500 text-sm">{registerErrors.password}</p>}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant={"default"} onClick={handleRegisterSubmit} type="submit">Register</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Sign_in;