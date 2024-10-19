import React, { Suspense, useState, useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const Home = React.lazy(() => import("./pages/home"));
const Login = React.lazy(() => import("./pages/login"));
const Dashboard = React.lazy(() => import("./pages/dashboard"));
const Register = React.lazy(() => import("./pages/register"));
const Error = React.lazy(() => import("./pages/error"));
const Root = React.lazy(() => import("./components/root"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<div>loading////</div>}>
        <Root />
      </Suspense>
    ),
    errorElement: (
      <Suspense fallback={<div>loading////</div>}>
        <Error />
      </Suspense>
    ),
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<div>loading////</div>}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "/register",
        element: (
          <Suspense fallback={<div>loading////</div>}>
            <Register />
          </Suspense>
        ),
      },
      {
        path: "/login",
        element: (
          <Suspense fallback={<div>loading////</div>}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <Suspense fallback={<div>loading////</div>}>
            <Dashboard />
          </Suspense>
        ),
      },
    ],
  },
]);

function App() {
  const [account, setAccount] = useState(null);
  useEffect(() => {
    const checkFile = async () => {
      try {
        if (localStorage.getItem("account") != null) {
          await setAccount(localStorage.getItem("account"));
          router.navigate("/");
        }
      } catch (err) {
        router.navigate("/login");
      }
    };
    checkFile();
  }, []);

  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
