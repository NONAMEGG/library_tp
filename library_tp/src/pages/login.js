import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";

const Login = () => {
  const navigate = useNavigate();
  const handleSubmit = (e) => {
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
