import { GetInfo } from "./accounts/account_info.js";
import { json, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

function Home() {
  const [users, setUsers] = useState([]);
  const [bookData, setBookData] = useState({});
  const [books, setBooks] = useState([]);
  const [eachuserBooks, setEachUserBooks] = useState({});
  const [bookIds, setBookIds] = useState({});
  const [show, setShow] = useState(false);
  const handleInputChange = (userId, event) => {
    setBookIds((prev) => ({
      ...prev,
      [userId]: event.target.value,
    }));
  };

  const handleInputChangeOnAddBook = (e) => {
    const { name, value } = e.target;
    console.log(name);
    setBookData((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    console.log(bookData);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase.from("users").select();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();

    const intervalId = setInterval(fetchUsers, 5000);
    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    const fetchUsersBooks = async () => {
      const { data, error } = await supabase.from("users_books").select();
      if (error) {
        console.error("Error fetching user books:", error);
      } else {
        const booksByUser = data.reduce((acc, book) => {
          if (!acc[book.user_id]) acc[book.user_id] = [];
          acc[book.user_id].push(book);
          return acc;
        }, {});
        setEachUserBooks(booksByUser);
      }
    };

    fetchUsersBooks();

    const intervalId = setInterval(fetchUsersBooks, 2000);
    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data, error } = await supabase.from("books").select();
        setBooks(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchBooks();
    const intervalId2 = setInterval(fetchBooks, 5000);
    return () => clearInterval(intervalId2);
  }, []);

  const Exit = async () => {
    var info = GetInfo();
    try {
      console.log(info);

      localStorage.clear();
    } catch (error) {
      alert("Ошибка выхода!");
    }
  };

  const DeleteUser = async (id) => {
    const { data, error } = await supabase.from("users").select().eq("id", id);
    if (error) {
      console.error("Error fetching data:", error);
      return;
    }
    if (data.length == 0) {
      console.log("No such user");
    } else {
      if (JSON.parse(localStorage.getItem("account")).id != id) {
        const { data, err } = await supabase
          .from("users")
          .delete()
          .eq("id", id);
        if (err) {
          console.error("Error deleting data:", err);
          return;
        }
        console.log("deleted successfully");
      } else {
        console.error("You can't delete yourself))))))");
      }
    }
  };

  const handleSubmit = (e) => {
    // e.preventDefault();
    // const username = e.target.username.value;
    // const password = e.target.password.value;
    // const insertSupabase = async () => {
    //   try {
    //     if (!username || !password) {
    //       console.error("Username or password is missing");
    //       return;
    //     }
    //     const { data, error } = await supabase.from("users").select();
    //     if (error) {
    //       console.error("Error fetching data:", error);
    //       return;
    //     }
    //     console.log("Data fetched:", data);
    //     let newId = 1;
    //     if (data && data.length > 0) {
    //       newId = data[data.length - 1].id + 1;
    //     }
    //     const { error: insertError } = await supabase.from("users").insert({
    //       username: username,
    //       password: password,
    //       id: newId,
    //       role: "customer",
    //     });
    //     if (insertError) {
    //       console.error("Error inserting data:", insertError);
    //       return;
    //     }
    //     console.log("User inserted successfully");
    //     navigate("/login");
    //   } catch (err) {
    //     console.error("Unexpected error:", err);
    //   }
    // };
    // insertSupabase();
  };

  const AddBook = async () => {
    console.log(bookData.title);
    console.log(bookData.author);
    console.log(bookData.publDate);
    const { data, error } = await supabase.from("books").select();
    if (error) {
      console.error("Error fetching data:", error);
      return;
    }
    let newId = 1;
    if (data && data.length > 0) {
      newId = data[data.length - 1].id + 1;
    }
    const { addError } = await supabase.from("books").insert({
      id: newId,
      title: bookData.title,
      author: bookData.author,
      public_year: parseInt(bookData.publDate, 10),
      num_in_stock: 1000,
    });
    if (addError) {
      console.error("Error inserting data:", addError);
      return;
    }
  };

  const GiveAbook = async (user_id) => {
    const book_id = parseInt(bookIds[user_id], 10);
    const getBooks = async () => {
      const { data, bookError } = await supabase
        .from("books")
        .select()
        .eq("id", book_id);
      if (bookError) {
        console.error("Error fetching books:", bookError);
        return;
      }
      return data;
    };
    const bookData = await getBooks();
    const getUsersBooks = async () => {
      const { data, userError } = await supabase
        .from("users_books")
        .select()
        .eq("user_id", user_id)
        .eq("book_id", book_id);
      if (userError) {
        console.error("Error fetching books:", userError);
        return;
      }
      return data;
    };
    const userData = await getUsersBooks();
    const SupabaseBackendWork = async () => {
      if (bookData.length == 0) {
        console.log("No such book");
        return;
      } else {
        if (userData.length == 0) {
          if (bookData[0].num_in_stock > 0) {
            const { err } = await supabase.from("users_books").insert({
              user_id: user_id,
              book_id: book_id,
            });
            if (err) {
              console.error("Error inserting data:", err);
            }
            const { updateErr } = await supabase.from("books").update({
              num_in_stock: bookData[0].num_in_stock - 1,
            });
            if (updateErr) {
              console.error("Update Error: ", updateErr);
            }
          } else {
            console.log("Books are out of stock");
            return;
          }
        } else {
          console.log("already in users books");
          return;
        }
        console.log("updated successfully");
      }
    };

    SupabaseBackendWork();
  };

  const [userBooks, setUserBooks] = useState([]);
  useEffect(() => {
    const fetchUserBooks = async () => {
      try {
        const fetchUserBooksSupabase = async () => {
          const { data, error } = await supabase
            .from("users_books")
            .select()
            .eq("user_id", JSON.parse(localStorage.getItem("account")).id);
          if (error) {
            console.error("Error fetching data:", error);
          }
          return data;
        };
        const userBooks = await fetchUserBooksSupabase();
        let book_ids = [];
        userBooks.map((book) => {
          book_ids.push(book.book_id);
        });
        const fetchBooksSupabase = async () => {
          const { data, error } = await supabase
            .from("books")
            .select()
            .in("id", book_ids);
          if (error) {
            console.error("Error fetching data:", error);
          }
          return data;
        };
        const books = await fetchBooksSupabase();
        setUserBooks(books);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUserBooks();
    const intervalId = setInterval(fetchUserBooks, 5000);
    return () => clearInterval(intervalId);
  }, []);

  if (JSON.parse(localStorage.getItem("account")).role == "librarian") {
    return (
      <>
        <div> {JSON.parse(localStorage.getItem("account")).username}</div>
        <div> {JSON.parse(localStorage.getItem("account")).role}</div>
        <Link className="buttonExit" onClick={(e) => Exit(e)} to="/login">
          EXIT
        </Link>
        <div>
          <div>
            <button onClick={() => setShow(!show)}>
              Форма добавления книги
            </button>
            {show ? (
              <div>
                <input
                  type="text"
                  name="title"
                  onChange={handleInputChangeOnAddBook}
                  value={bookData.title}
                  placeholder="title"
                ></input>
                <input
                  type="text"
                  name="author"
                  onChange={handleInputChangeOnAddBook}
                  value={bookData.author}
                  placeholder="author"
                ></input>
                <input
                  type="text"
                  name="publDate"
                  onChange={handleInputChangeOnAddBook}
                  value={bookData.publDate}
                  placeholder="publication_year"
                ></input>
                <button onClick={AddBook}>Добавить книгу</button>
              </div>
            ) : (
              <></>
            )}
            <p>Books</p>
            <div>
              <ul>
                {books?.map((book) => (
                  <li key={book.id}>{book.title}</li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <p>Users</p>
            <div>
              <ul>
                {users?.map((user) => (
                  <li key={user.id}>
                    {user.username}{" "}
                    {user.id !=
                    JSON.parse(localStorage.getItem("account")).id ? (
                      <>
                        <button onClick={() => DeleteUser(user.id)}>
                          Delete
                        </button>{" "}
                        <input
                          type="text"
                          name="book_id"
                          placeholder="id of the book"
                          value={bookIds[user.id] || ""}
                          onChange={(e) => handleInputChange(user.id, e)}
                        />
                        <button onClick={() => GiveAbook(user.id)}>
                          Give a Book
                        </button>
                        <ul>
                          {eachuserBooks[user.id]?.map((book) => (
                            <li key={book.book_id}>
                              {books[book.book_id]?.title}
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      ""
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div> {JSON.parse(localStorage.getItem("account")).username}</div>
      <div> {JSON.parse(localStorage.getItem("account")).role}</div>
      <div>
        <p>My Books</p>
        <ul>
          {userBooks?.map((book) => (
            <li>{book.title}</li>
          ))}
        </ul>
      </div>
      <Link className="buttonExit" onClick={(e) => Exit(e)} to="/login">
        EXIT
      </Link>
    </>
  );
}

export default Home;
