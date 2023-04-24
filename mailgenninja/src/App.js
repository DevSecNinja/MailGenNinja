import React, { useState, useEffect } from 'react';  
import './App.css';  
import AuthButton from './AuthButton';  
import GroupsList from './GroupsList';  
import { useMsal } from '@azure/msal-react';  
import { Client } from '@microsoft/microsoft-graph-client';  
  
function App() {  
  const { instance, accounts } = useMsal();  
  const [firstName, setFirstName] = useState('');  
  
  useEffect(() => {  
    const fetchUserDetails = async () => {  
      if (accounts.length === 0) return;  
  
      const accessTokenRequest = {  
        scopes: ['User.Read'],  
        account: accounts[0],  
      };  
  
      try {  
        const response = await instance.acquireTokenSilent(accessTokenRequest);  
  
        const client = Client.init({  
          authProvider: (done) => {  
            done(null, response.accessToken);  
          },  
        });  
  
        const userDetails = await client.api('/me').get();  
        setFirstName(userDetails.givenName);  
      } catch (error) {  
        console.error(error);  
      }  
    };  
  
    fetchUserDetails();  
  }, [accounts, instance]);  
  
  return (  
    <div className="App">  
      <header className="App-header">  
        <AuthButton />  
        <h1>Welcome to MailGenNinja{firstName && `, ${firstName}!`}</h1>  
        <p>MailGenNinja is a sleek and user-friendly web app designed to effortlessly generate unique email addresses for each website registration, enhancing your online security and organization.
          Embodying the precision and agility of a ninja, this app simplifies email management and seamlessly integrates with Office 365 distribution groups for a streamlined experience.</p>
        <p>This app is deployed using GitHub Actions and Terraform on Azure Static Web Apps.</p>
      </header>  
      <GroupsList />  
    </div>  
  );  
}  
  
export default App;  
