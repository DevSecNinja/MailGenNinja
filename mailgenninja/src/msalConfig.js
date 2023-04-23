import { PublicClientApplication, LogLevel } from "@azure/msal-browser";

const msalConfig = {
    auth: {
        clientId: process.env.REACT_APP_AZURE_AD_APP_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${process.env.REACT_APP_AZURE_AD_APP_TENANT_ID}`,
        // redirectUri: window.location.origin,
        redirectUri: "http://localhost:3000",
    },
};

const msalInstance = new PublicClientApplication(msalConfig);

export default msalInstance;  
