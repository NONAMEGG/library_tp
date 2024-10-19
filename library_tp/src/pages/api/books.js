import { supabase } from "../../lib/supabaseClient";

export default async (req, res) => {
  if (req.method === "GET") {
    const { data, error } = await supabase.from("books").select("*");
    if (error) return res.status(400).json({ error });
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const { title, author } = req.body;
    const { data, error } = await supabase
      .from("books")
      .insert([{ title, author, available: true }]);
    if (error) return res.status(400).json({ error });
    return res.status(201).json(data);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
};
