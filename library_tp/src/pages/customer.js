import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import './customer.css';

const CustomerPage = () => {
  const { data: session } = useSession();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const { data } = await supabase
        .from("books")
        .select("*")
        .eq("available", true);
      setBooks(data);
    };

    fetchBooks();
  }, []);

  if (!session || session.user.role !== "customer") {
    return <h1>Access Denied</h1>;
  }

  return (
    <div>
      <h1>Available Books</h1>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            {book.title} by {book.author}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerPage;
