import { getCookie } from "../getCookie";
import React from "react";
import "./WelcomePage.css";

function WelcomePage() {
    const isAdmin = getCookie("isAdmin") === "true";

    return (
        <div className="welcome-container">
            <div className="welcome-border">
                <h1 className="welcome-title">Welcome to the Database Viewer App!</h1>
                <p className="welcome-intro">
                    This application helps you browse, create, and modify a set of databases. Use the navigation bar to explore its features.
                </p>

                <div className="feature-section">
                    <h2>Key Features</h2>
                    <ul>
                        <li><strong>Single Table CRUD:</strong> Perform Create, Read, Update, and Delete operations on individual tables.</li>
                        <li><strong>Browse Multiple Tables:</strong> View join operations across tables (read-only).</li>
                        <li><strong>Statistics:</strong> Generate graphs and view database statistics.</li>
                        {isAdmin && (
                            <li><strong>Admin Panel:</strong> Manage database access for users.</li>
                        )}
                        <li><strong>Logger:</strong> Review the history of database changes.</li>
                        <li><strong>Structure Modifier:</strong> Modify, create, and delete database/table schemas.</li>
                        <li><strong>Schema Browser:</strong> Generate schemas for specific databases.</li>
                        <li><strong>Connections Creator:</strong> Establish relationships between database tables.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default WelcomePage;
