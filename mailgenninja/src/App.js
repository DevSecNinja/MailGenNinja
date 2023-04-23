import React from 'react';
import './App.css';

// import { useMsal } from "@azure/msal-react";  
import AuthButton from "./AuthButton";
import GroupsList from "./GroupsList";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <AuthButton />
        <GroupsList />
        <h1>Welcome to MailGenNinja</h1>
        <p>This is a sample React web app deployed using GitHub Actions and Terraform on Azure Static Web Apps.</p>
      </header>
    </div>
  );
}

export default App;  
