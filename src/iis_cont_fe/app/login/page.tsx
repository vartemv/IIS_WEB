"use client"
import { useAuth } from "@/hooks/useAuth"; // Import useAuth hook
import { TLogin } from "@/utils/types/auth";
import { Field, Form, Formik, FormikHelpers } from "formik";
import React from "react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const { login } = useAuth(); // Destructure login from useAuth hook
  const router = useRouter(); // For navigation after successful login

  const handleSubmit = (values: TLogin) => {
    // Call the login function from useAuth
    login(values)
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
    <div className="max-w-[100vw] p-5">
      <h3 className="mb-5 text-4xl font-medium">Login</h3>

      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={(
          values: TLogin,
          { setSubmitting }: FormikHelpers<TLogin>
        ) => {
          handleSubmit(values); // Trigger handleSubmit when the form is submitted
          setSubmitting(false);
        }}
      >
        <Form className="grid w-96 grid-cols-2 gap-3">
          <label htmlFor="email">Email</label>
          <Field
            id="email"
            name="email"
            placeholder="Enter email"
            type="email"
          />

          <label htmlFor="password">Password</label>
          <Field
            id="password"
            name="password"
            type="password"
            placeholder="Enter password"
          />

          <button
            type="submit"
            className="w-fit border border-black/75 px-4 py-1"
          >
            Login
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default LoginForm;