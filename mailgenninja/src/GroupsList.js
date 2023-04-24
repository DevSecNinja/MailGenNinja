import React, { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { Client } from "@microsoft/microsoft-graph-client";
import styles from "./GroupsList.module.css"

// NOTE:
// The Microsoft Graph API currently does not support changing a Mail-Enabled Security Group
// It will throw a 403 error if you try to change the displayName of a group that is mailEnabled and securityEnabled
// "Insufficient privileges to complete the operation."

const GroupsList = () => {
    const { instance, accounts } = useMsal();
    const [groups, setGroups] = useState([]);
    const [newGroupName, setNewGroupName] = useState("");

    useEffect(() => {
        fetchGroups();
    }, [accounts, instance]);

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

            const filteredGroups = res.value.filter(
                (group) =>
                    group.mail.endsWith(process.env.REACT_APP_EMAIL_DOMAIN)
            ).sort((a, b) => a.displayName.localeCompare(b.displayName));

            setGroups(filteredGroups);
        } catch (error) {
            console.error(error);
        }
    };

    const handleInputChange = (e) => {
        setNewGroupName(e.target.value);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (newGroupName) {
            const claimableGroup = groups.find((group) => group.displayName.endsWith("_CLAIMABLE"));

            if (claimableGroup) {
                await renameGroup(claimableGroup.id, `${newGroupName} - ${process.env.REACT_APP_EMAIL_DOMAIN}`);
                setNewGroupName("");
                fetchGroups();
            } else {
                alert("No claimable groups available");
            }
        } else {
            alert("Please enter a website name");
        }
    };

    const renameGroup = async (groupId, newDisplayName) => {
        try {
            const accessTokenRequest = {
                scopes: ["Group.ReadWrite.All"],
                account: accounts[0],
            };

            const response = await instance.acquireTokenSilent(accessTokenRequest);

            const client = Client.init({
                authProvider: (done) => {
                    done(null, response.accessToken);
                },
            });

            await client
                .api(`/groups/${groupId}`)
                .patch({
                    displayName: newDisplayName
                });
        } catch (error) {
            console.error("Cannot rename group to: " + newDisplayName)
            console.error(error);
        }
    };

    if (groups && groups.length > 0) {
        return (
            <div>
                <h3>Create New Distribution Group:</h3>
                <form onSubmit={handleFormSubmit}>
                    <input
                        type="text"
                        placeholder="Website name"
                        value={newGroupName}
                        onChange={handleInputChange}
                    />
                    <button type="submit">Create Group</button>
                </form>
                <h3>Your Distribution Groups:</h3>
                <table className={styles.groupsTable}>
                    <thead>
                        <tr>
                            <th>Display Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groups.map((group) => (
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
