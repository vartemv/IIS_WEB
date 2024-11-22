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

const Sign_in = () => {
  const [loginData, setLoginData] = useState<TLogin>({ email: "", password: "" });
  const [registerData, setRegisterData] = useState<TRegister>({ email: "", password: "", profile_name: "", lastName: "", firstName: ""});
  const { login, register } = useAuth(); // Destructure login from useAuth hook
  const router = useRouter(); // For navigation after successful login

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: "login" | "register") => {
    const { id, value } = e.target;

    if (type === "login") {
      setLoginData({ ...loginData, [id]: value });
    } else if (type === "register") {
      setRegisterData({ ...registerData, [id]: value });
    }
  };

  const handleLoginSubmit = () => {
    // Call the login function from useAuth
    login(loginData)
      .then((data) => {
        if (data?.success) {
          router.push("/info"); // Redirect to the homepage (or any other page)
        } else {
          console.log(data.message); // Handle error or failed login
        }
      })
      .catch((err) => {
        console.log(err); // Handle unexpected errors
      });
  };

  const handleRegisterSubmit = () => {
    register(registerData)
      .then((data) => {
        if (data?.success) {
            router.push("/info"); // Redirect to the homepage (or any other page)
        } else {
          console.log(data.message); // Handle error or failed login
        }
      })
      .catch((err) => {
        console.log(err); // Handle unexpected errors
      });
  };

    return (
        <div className="flex items-center justify-center min-h-screen">
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
                <div className="space-y-1">
                  <Label htmlFor="email">FITmail</Label>
                  <Input id="email" type = "email" value={loginData.email}  onChange={(e) => handleInputChange(e, "login")} required/>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">FITpass</Label>
                  <Input id="password" type="password" onChange={(e) => handleInputChange(e, "login")} value={loginData.password} required/>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant = {"default"} onClick={handleLoginSubmit} >Login</Button>
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
                <div className="space-y-1">
                  <Label htmlFor="firstName">Name </Label>
                  <Input id="firstName" type="text" value={registerData.firstName}  onChange={(e) => handleInputChange(e, "register")} required/>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lastName">Surname</Label>
                  <Input id="lastName" type="text" value={registerData.lastName}  onChange={(e) => handleInputChange(e, "register")} required/>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="profile_name">FITname</Label>
                  <Input id="profile_name" type="text" value={registerData.profile_name}  onChange={(e) => handleInputChange(e, "register")} required/>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={registerData.email}  onChange={(e) => handleInputChange(e, "register")} required/>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">FITpass</Label>
                  <Input id="password" type="password" value={registerData.password}  onChange={(e) => handleInputChange(e, "register")} required />
                </div>
              </CardContent>
              <CardFooter>
                <Button variant = {"default"} onClick={handleRegisterSubmit} type="submit">Register</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      );
}

export default Sign_in;