"use client";
import { useAuth } from "@/hooks/useAuth"; // Import useAuth hook
import { TRegister } from "@/utils/types/auth";
import { Field, Form, Formik, FormikHelpers } from "formik";
import React from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const { register } = useAuth(); // Destructure login from useAuth hook
  const router = useRouter(); // For navigation after successful login

  const handleSubmit = (values: TRegister) => {
    console.log(values);

    // Call the login function from useAuth
    register(values)
      .then((data) => {
        if (data?.success) {
          // Add any code you want to execute after successful login
          setTimeout(() => {
            router.push("/"); // Redirect to the homepage (or any other page)
          }, 1000);
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
      <h3 className="mb-5 text-4xl font-medium">Sign Up</h3>

      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          profile_name: "",
          password: "",
        }}
        onSubmit={(
          values: TRegister,
          { setSubmitting }: FormikHelpers<TRegister>
        ) => {
          
            handleSubmit(values); // Trigger handleSubmit when the form is submitted
            setSubmitting(false);
          ;
        }}
      >
        <Form className="grid w-96 grid-cols-2 gap-3">
          <label htmlFor="firstName">First Name</label>
          <Field
            id="firstName"
            name="firstName"
            placeholder="Enter first name"
            type="text"
          />

          <label htmlFor="lastName">Last Name</label>
          <Field
            id="lastName"
            name="lastName"
            placeholder="Enter last name"
            type="text"
          />

          <label htmlFor="email">Email</label>
          <Field
            id="email"
            name="email"
            placeholder="Enter email"
            type="email"
          />

          <label htmlFor="profile_name">Profile Name</label>
          <Field
            id="profile_name"
            name="profile_name"
            placeholder="Enter profile name"
            type="text"
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
            Submit
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default Login;