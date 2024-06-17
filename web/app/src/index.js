import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";  // Ensure this path is correct
import Package from "./page/Package";  // Ensure this path is correct
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./page/Login";  // Ensure this path is correct
import Home from "./page/Home";  // Ensure this path is correct
import Product from "./page/Product";  // Ensure this path is correct
import User from "./page/User";  // Ensure this path is correct
import Sale from "./page/Sale";  // Ensure this path is correct
import BillSale from "./page/BillSale";  // Ensure this path is correct
import BillPerDay from "./page/BillPerDay";  // Ensure this path is correct
import Stock from "./page/Stock";

import ReportStock from "./page/ReportStock";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Package />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/product",
    element: <Product />,
  },
  {
    path: "/user",
    element: <User />,
  },
  {
    path: "/sale",
    element: <Sale />,
  },
  {
    path: "/billSale",
    element: <BillSale />,
  },
  {
    path:'/sumSalePerday',
    element:<BillPerDay/>
  },
  {
    path:"/stock",
    element:<Stock />
  },
  {
    path:"/stockReport",
    element:<ReportStock />
  }
 
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
