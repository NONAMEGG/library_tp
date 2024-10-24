import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./lib/supabaseClient";

const Register = () => {
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    const insertSupabase = async () => {
      try {
        if (!username || !password) {
          console.error("Username or password is missing");
          return;
        }

        const { data, error } = await supabase.from("users").select();

        if (error) {
          console.error("Error fetching data:", error);
          return;
        }

        console.log("Data fetched:", data);

        let newId = 1;
        if (data && data.length > 0) {
          newId = data[data.length - 1].id + 1;
        }

        const { error: insertError } = await supabase.from("users").insert({
          username: username,
          password: password,
          id: newId,
          role: "customer",
        });

        if (insertError) {
          console.error("Error inserting data:", insertError);
          return;
        }

        console.log("User inserted successfully");
        navigate("/login");
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    insertSupabase();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="Username" />
      <input type="password" name="password" placeholder="Password" />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
