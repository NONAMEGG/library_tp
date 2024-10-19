import React, { Suspense, useState, useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const Home = React.lazy(() => import("./pages/home"));
const Login = React.lazy(() => import("./pages/login"));
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
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
