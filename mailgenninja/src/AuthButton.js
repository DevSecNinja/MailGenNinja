import React from "react";
import { useMsal } from "@azure/msal-react";
import styles from "./AuthButton.module.css";

const AuthButton = () => {
    const { instance, accounts } = useMsal();

    const handleLogin = () => {
        instance.loginPopup().catch((error) => console.error(error));
    };

    const handleLogout = () => {
        instance.logout({ account: accounts[0] });
    };

    return accounts.length === 0 ? (
        <button onClick={handleLogin} className={styles.authButton}>
            Login
        </button>
    ) : (
        <button onClick={handleLogout} className={styles.authButton}>
            Logout
        </button>
    );
};

export default AuthButton;  
