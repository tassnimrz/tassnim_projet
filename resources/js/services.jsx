import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Services = ({ isAdmin }) => {
    const [services, setServices] = useState([]);

    // Récupérer les services depuis le backend
    useEffect(() => {
        fetch('/api/services')
            .then(response => response.json())
            .then(data => setServices(data));
    }, []);

    // Supprimer un service
    const handleDelete = async (id) => {
        if (confirm('Voulez-vous vraiment supprimer ce service ?')) {
            await fetch(`/api/services/${id}`, { method: 'DELETE' });
            setServices(services.filter(service => service.id !== id));
        }
    };

    return (
        <div className="container mt-4">
            <h2>Nos Services</h2>
            {services.map(service => (
                <div key={service.id} className="card mb-3">
                    <div className="card-body">
                        <h5>{service.nom}</h5>
                        <p>{service.description}</p>
                        {isAdmin && (
                            <button 
                                className="btn btn-danger" 
                                onClick={() => handleDelete(service.id)}
                            >
                                Supprimer
                            </button>
                        )}
                    </div>
                </div>
            ))}
            {isAdmin && (
                <button 
                    className="btn btn-primary mt-3"
                    onClick={() => console.log("Ajouter un service")}
                >
                    + Ajouter un service
                </button>
            )}
        </div>
    );
};

export default Services;
