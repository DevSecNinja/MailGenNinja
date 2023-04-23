import React, { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";

const GroupsList = () => {
    const { instance, accounts } = useMsal();
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const fetchGroups = async () => {
            if (accounts.length === 0) return;

            const accessTokenRequest = {
                scopes: ["User.Read.All", "Group.Read.All"],
                account: accounts[0],
            };

            try {
                const response = await instance.acquireTokenSilent(accessTokenRequest);
                const headers = new Headers();
                const bearer = `Bearer ${response.accessToken}`;

                headers.append("Authorization", bearer);

                const options = {
                    method: "GET",
                    headers: headers,
                };

                const url = `https://graph.microsoft.com/v1.0/me/ownedObjects?$filter=groupTypes/any(c:c+eq+'Unified')`;

                const res = await fetch(url, options);
                const data = await res.json();

                setGroups(data.value);
            } catch (error) {
                console.error(error);
            }
        };

        fetchGroups();
    }, [accounts, instance]);

    return (
        <div>
            <h3>Your Distribution Groups:</h3>
            <ul>
                {groups.map((group) => (
                    <li key={group.id}>{group.displayName}</li>
                ))}
            </ul>
        </div>
    );
};

export default GroupsList;  