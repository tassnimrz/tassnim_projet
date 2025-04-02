import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEnvelope, FaPhoneAlt, FaGlobe } from "react-icons/fa";

const Contact = () => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/contact");
      setContacts(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des contacts", error);
    }
  };

  return (
    <section id="contact-us"
    className="py-5 text-center"
    style={{
      backgroundColor: '#f3f4f6',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      marginTop: '30px', // Aligné avec la section "À propos de nous"
      paddingTop: '50px', // Uniforme avec "À propos de nous"
      paddingBottom: '50px', // Uniforme avec "À propos de nous"
    }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333' }}>Contactez-nous</h2>
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
          Si vous avez des questions ou besoin d'assistance, n'hésitez pas à nous contacter via les moyens suivants :
        </p>

     <div
          className="contact-icons"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            marginTop: '30px',
          }}
        >
        {contacts.map((contact) => (
          <React.Fragment key={contact.id}>
            {/* Email */}
            <a href={`mailto:${contact.email}`}  target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              width: '200px',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#007bff'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#ffffff'}>
               <FaEnvelope size={50} style={{ color: '#007bff' }} />
                         <h4 style={{ marginTop: '15px', fontSize: '1.25rem', color: '#333' }}>Email</h4>
              <p className="text-gray-600 text-sm group-hover:text-white">{contact.email}</p>
            </a>

            {/* Téléphone */}
            <a href={`tel:${contact.tel}`}  style={{
              textDecoration: 'none',
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              width: '200px',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#28a745'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#ffffff'}>
             <FaPhoneAlt size={50} style={{ color: '#28a745' }} />
             <h4 style={{ marginTop: '15px', fontSize: '1.25rem', color: '#333' }}>Téléphone</h4>
              <p className="text-gray-600 text-sm group-hover:text-white">{contact.tel}</p>
            </a>


            {/* Localisation */}
            {contact.map && (
              <a href={contact.map}  target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              width: '200px',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#25D366'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#ffffff'}
          >
                <FaGlobe size={50} className="text-orange-500 group-hover:text-white" />
                <h4 className="mt-3 text-xl font-semibold text-gray-700 group-hover:text-white">Localisation</h4>
                <p className="text-gray-600 text-sm group-hover:text-white">Voir sur Google Maps</p>
              </a>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default Contact;