import React from "react";
import "./css/app.css";
export default function App() {
  return (
    <div className="login-box">
      <div className="login-header">
        <header>Sign In to BackOffice</header>
      </div>
      <div className="input-box">
        <input
          type="text"
          className="input-field"
          placeholder="Username"
          autoComplete="off"
          required
        />
      </div>
      <div className="input-box">
        <input
          type="password"
          className="input-field"
          placeholder="Password"
          autoComplete="off"
          required
        />
      </div>
      
      <div className="input-submit">
        <button className="submit-btn" id="submit" />
        <label htmlFor="submit">Sign In</label>
      </div>
    </div>
  );
}
