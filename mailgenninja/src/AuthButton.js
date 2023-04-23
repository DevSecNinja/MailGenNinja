import React from "react";
import { useMsal } from "@azure/msal-react";

const AuthButton = () => {
    const { instance, accounts } = useMsal();

    const handleLogin = () => {
        instance.loginPopup().catch((error) => console.error(error));
    };

    const handleLogout = () => {
        instance.logout({ account: accounts[0] });
    };

    return accounts.length === 0 ? (
        <button onClick={handleLogin}>Login</button>
    ) : (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default AuthButton;  
