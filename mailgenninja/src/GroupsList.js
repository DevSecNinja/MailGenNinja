import React, { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { Client } from "@microsoft/microsoft-graph-client";
import styles from "./GroupsList.module.css"

const GroupsList = () => {
    const { instance, accounts } = useMsal();
    const [groups, setGroups] = useState([]);

    // TODO: Add validation to ensure that environment variables are properly set
    const claimedAndNonArchivedGroups = groups.filter((group) =>
        !group.displayName.endsWith("_CLAIMABLE") && 
        !group.displayName.startsWith("(Archived)") &&
        group.displayName.endsWith(process.env.REACT_APP_EMAIL_DOMAIN)
    );

    useEffect(() => {
        const fetchGroups = async () => {
            if (accounts.length === 0) return;

            const accessTokenRequest = {
                scopes: ["Group.Read.All"],
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

                const filteredGroups = res.value.sort((a, b) => a.displayName.localeCompare(b.displayName));

                setGroups(filteredGroups);
            } catch (error) {
                console.error(error);
            }
        };

        fetchGroups();
    }, [accounts, instance]);

    if (groups && groups.length > 0) {
        return (
            <div>
                <h3>Your Mail-Enabled Security Groups ({claimedAndNonArchivedGroups.length}):</h3>
                <table className={styles.groupsTable}>
                    <thead>
                        <tr>
                            <th>Display Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {claimedAndNonArchivedGroups.map((group) => (
                            <tr key={group.id}>
                                <td className={group.displayName.startsWith('(Archived)') ? styles.strikethrough : ''}>
                                    {group.displayName}
                                </td>
                                <a href={`mailto:${group.mail}`}>{group.mail}</a>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
};

export default GroupsList;  
