import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AuditConformite = () => {
    const [audits, setAudits] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/audit')
            .then(response => {
                setAudits(response.data);
            });
    }, []);

    return (
        <div>
            <h1>Audit de conformité</h1>
            <ul>
                {audits.map(audit => (
                    <li key={audit.id}>
                        {audit.type_verification} - {audit.statut} - {audit.date_verification}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AuditConformite;
