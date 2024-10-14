import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "../style.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Error from "./components/Error";
import Admin from "./components/Admin";
import About from "./components/About";
import Home from "./components/Home";
import AppLayout from "./components/AppLayout";
import Web3 from "web3";
import VoterRegistration from "./components/VoterRegistration";
const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
const root = ReactDOM.createRoot(document.getElementById("root"));
const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/about",
          element: <About/>,
        },
        {
          path: "/admin",
  
          element: <Admin/>,
        },
        {
          path: "/registervoter",
  
          element: <VoterRegistration/>,
        },
      ],
      errorElement: <Error />,
    },
  ]);
root.render(<RouterProvider router={appRouter} />);
