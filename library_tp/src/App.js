import React, { Suspense, useState, useEffect } from "react";
import {
  useLocation,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

const Home = React.lazy(() => import("./pages/home"));
const Login = React.lazy(() => import("./pages/login"));
const Dashboard = React.lazy(() => import("./pages/dashboard"));
const Register = React.lazy(() => import("./pages/register"));
const Error = React.lazy(() => import("./pages/error"));
const Root = React.lazy(() => import("./components/root"));
const AdminPanel = React.lazy(() => import("./components/AdminPanel"));

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
      {
        path: "/admin",
        element: (
          <Suspense fallback={<div>loading////</div>}>
            <AdminPanel />
          </Suspense>
        ),
      },
    ],
  },
]);

function App() {
  const [account, setAccount] = useState(null);
  const pathname = window.location.pathname;
  useEffect(() => {
    const checkFile = async () => {
      try {
        const account = localStorage.getItem("account");
        if (account) {
          setAccount(account);
          // Проверка на наличие роли
          router.navigate(account.role === "admin" ? "/admin" : "/admin");
        } else {
          if (pathname !== "/login" && pathname !== "/register") {
            router.navigate("/login");
          }
        }
      } catch (err) {
        console.error(err);
        router.navigate("/login");
      }
    };
    checkFile();
  }, [pathname]);

  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
