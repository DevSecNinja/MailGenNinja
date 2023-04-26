import { PublicClientApplication } from "@azure/msal-browser";

const msalConfig = {
    auth: {
        clientId: process.env.REACT_APP_AZURE_AD_APP_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${process.env.REACT_APP_AZURE_AD_APP_TENANT_ID}`,
        redirectUri: window.location.origin,
    },
    cache: {
        cacheLocation: BrowserCacheLocation.LocalStorage // Default is "sessionStorage". Otherwise authentication in Safari doesn't work.
    }
};

const msalInstance = new PublicClientApplication(msalConfig);

export default msalInstance;  
