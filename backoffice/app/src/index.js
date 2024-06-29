import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./page/App";
import reportWebVitals from "./reportWebVitals";
import Main from "./page/Main";
import ReportMember from "./page/ReportMember";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/main",
    element: <Main />,
  },
  {
    path:"/report-member",
    element:<ReportMember/>
  }
]);
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
