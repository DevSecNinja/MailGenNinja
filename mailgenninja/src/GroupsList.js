import React, { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { Client } from "@microsoft/microsoft-graph-client";

const GroupsList = () => {
    const { instance, accounts } = useMsal();
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const fetchGroups = async () => {
            if (accounts.length === 0) return;

            const accessTokenRequest = {
                scopes: ["User.Read", "Group.Read.All"],
                account: accounts[0],
            };

            try {
                const response = await instance.acquireTokenSilent(accessTokenRequest);

                const client = Client.init({
                    authProvider: (done) => {
                        done(null, response.accessToken);
                    },
                });

                const queryParams = {
                    $filter: "mailEnabled eq true and securityEnabled eq true",
                    $count: "true",
                    $top: 999
                };

                const res = await client
                    .api("/groups")
                    .query(queryParams)
                    .get();

                const filteredGroups = res.value.filter(
                    (group) =>
                        !group.displayName.endsWith("_CLAIMABLE") &&
                        group.displayName.endsWith(".org")
                ).sort((a, b) => a.displayName.localeCompare(b.displayName));

                setGroups(filteredGroups);
            } catch (error) {
                console.error(error);
            }
        };

        fetchGroups();
    }, [accounts, instance]);

    if (groups) {
        return (
            <div>
                <h3>Your Distribution Groups:</h3>
                <ul>
                    {groups.map((group) => (
                        <li key={group.id}>{group.displayName}: {group.mail}</li>
                    ))}
                </ul>
            </div>
        );
    }
};

export default GroupsList;  
