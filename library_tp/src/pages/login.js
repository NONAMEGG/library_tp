import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";
import { signIn } from "next-auth/react";

const Login = () => {
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    //   const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const username = e.target.username.value;
    //     const password = e.target.password.value;

    //     const result = await signIn("credentials", {
    //       redirect: false,
    //       username,
    //       password,
    //     });

    //     if (result.error) {
    //       console.log("Failed login");
    //       return;
    //     } else {
    //     }
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("username", username)
          .eq("password", password);

        if (error) {
          console.error("Error fetching data:", error);
          return;
        }
        if (data.length == 0) {
          console.log("No such user or wrong password");
        } else {
          console.log("login successful");
          const new_info = {
            id: data[0].id,
            username: data[0].username,
            role: data[0].role,
          };
          localStorage.setItem("account", JSON.stringify(new_info));
          navigate(`/`);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };
    fetchData();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="Username" />
      <input type="password" name="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
