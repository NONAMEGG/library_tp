import { useSession, SessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

const Dashboard = () => {
  const { data: session } = <SessionProvider>useSession()</SessionProvider>;
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const { data } = await supabase.from("books").select("*");
      setBooks(data);
    };

    fetchBooks();
  }, []);

  if (!session || session.user.role !== "librarian") {
    return <h1>Access Denied</h1>;
  }

  return (
    <div>
      <h1>Librarian Dashboard</h1>
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

export default Dashboard;
