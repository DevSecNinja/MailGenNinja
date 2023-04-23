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
        <h1>Welcome to MailGenNinja</h1>
        <p>MailGenNinja is a sleek and user-friendly web app designed to effortlessly generate unique email addresses for each website registration, enhancing your online security and organization.
          Embodying the precision and agility of a ninja, this app simplifies email management and seamlessly integrates with Office 365 distribution groups for a streamlined experience.</p>
        <p>This app is deployed using GitHub Actions and Terraform on Azure Static Web Apps.</p>
      </header>
      <GroupsList />
    </div>
  );
}

export default App;  
