import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeartbeat, FaRobot, FaShieldAlt, FaGlobe, FaUsers } from 'react-icons/fa';

const Apropos = () => {
    const [content, setContent] = useState([]);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/a-propos-ns");
            setContent(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des informations", error);
        }
    };

    // Fonction pour choisir une icône en fonction du contenu
    const getIconForDescription = (description) => {
        if (description.toLowerCase().includes("santé") || description.toLowerCase().includes("médical")) {
            return <FaHeartbeat size={50} style={{ color: '#FF6347' }} />;
        } else if (description.toLowerCase().includes("intelligence artificielle") || description.toLowerCase().includes("innovation")) {
            return <FaRobot size={50} style={{ color: '#4682B4' }} />;
        } else if (description.toLowerCase().includes("sécurité") || description.toLowerCase().includes("confidentialité")) {
            return <FaShieldAlt size={50} style={{ color: '#32CD32' }} />;
        } else if (description.toLowerCase().includes("monde") || description.toLowerCase().includes("international")) {
            return <FaGlobe size={50} style={{ color: '#FFD700' }} />;
        } else {
            return <FaUsers size={50} style={{ color: '#808080' }} />; // Icône par défaut
        }
    };

    return (
        <section
            id="about-us"
            className="py-5 text-center"
            style={{
                backgroundColor: '#f3f4f6',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                marginTop: '30px',
                paddingTop: '50px',
                paddingBottom: '50px',
            }}
        >
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333' }}>À propos de nous</h2>
            <p
                style={{
                    fontSize: '1.125rem',
                    color: '#666',
                    maxWidth: '800px',
                    margin: '0 auto',
                    lineHeight: '1.6',
                    paddingBottom: '30px',
                }}
            >
                Découvrez notre mission et nos engagements pour offrir une meilleure expérience.
            </p>

            <div
                className="content-container"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    gap: '30px',
                    marginTop: '30px',
                }}
            >
                {content.map((item) => (
                    <div
                        key={item.id}
                        className="content-card"
                        style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '10px',
                            padding: '30px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            textAlign: 'center',
                            width: '300px',
                            transition: 'transform 0.3s',
                        }}
                        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        {getIconForDescription(item.description)}
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333', marginTop: '10px' }}>{item.title}</h3>
                        <p style={{ fontSize: '1rem', color: '#555', marginTop: '10px' }}>{item.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Apropos;