import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaExclamationCircle, FaStar, FaTag, FaHeartbeat, FaRobot, FaShieldAlt, FaGlobe, FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Services = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/service");
        setServices(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des services:", error);
      }
    };

    fetchServices();
  }, []);

  const getIconForDescription = (description) => {
    if (!description) return null;

    if (description.toLowerCase().includes('urgent')) {
      return <FaExclamationCircle size={25} style={{ color: '#FF5733' }} title="Service Urgent" />;
    } else if (description.toLowerCase().includes('nouveau')) {
      return <FaStar size={25} style={{ color: '#3498db' }} title="Nouveau Service" />;
    } else if (description.toLowerCase().includes('promotion')) {
      return <FaTag size={25} style={{ color: '#2ecc71' }} title="Promotion" />;
    } else if (description.toLowerCase().includes("santé") || description.toLowerCase().includes("médical")) {
      return <FaHeartbeat size={25} style={{ color: '#FF6347' }} title="Santé" />;
    } else if (description.toLowerCase().includes("intelligence artificielle") || description.toLowerCase().includes("innovation")) {
      return <FaRobot size={25} style={{ color: '#4682B4' }} title="Intelligence Artificielle" />;
    } else if (description.toLowerCase().includes("sécurité") || description.toLowerCase().includes("confidentialité")) {
      return <FaShieldAlt size={25} style={{ color: '#32CD32' }} title="Sécurité" />;
    } else if (description.toLowerCase().includes("monde") || description.toLowerCase().includes("international")) {
      return <FaGlobe size={25} style={{ color: '#FFD700' }} title="International" />;
    }

    return <FaUsers size={25} style={{ color: '#808080' }} title="Service Générique" />;
  };

  // Ajout de l'observateur de visibilité
  const { ref, inView } = useInView({
    triggerOnce: true, // Ne déclenche l'animation qu'une seule fois
    threshold: 0.2,    // Déclenche l'animation quand 20% de la section est visible
  });

  return (
    <section id="services" ref={ref} className="container my-5 py-5" style={{ backgroundColor: '#f9f9f9' }}>
     <motion.h2
        className="text-center text-4xl font-bold text-gray-800 mb-10"
        initial={{ opacity: 0, y: -50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        🚀 Nos Services
      </motion.h2>
      <div className="row d-flex justify-content-between mt-5">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            className="col-12 col-md-4 mb-4"
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: index * 0.2 }} // Délai progressif pour un effet fluide
          >
            <motion.div
              className="service-card shadow-lg rounded-3 p-4"
              style={{
                transition: 'transform 0.3s ease',
                border: 'none',
                backgroundColor: '#fff',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                flexDirection: 'column',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              whileHover={{ scale: 1.05 }} // Effet de zoom au survol
            >
              <motion.div
                style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: index * 0.3, duration: 3 }}
              >
                {getIconForDescription(service.description)}
                <h5 className="fw-bold mb-3" style={{ color: '#333' }}>{service.title}</h5>
              </motion.div>

              <motion.p
                className="text-muted"
                style={{ fontSize: '1.1rem', lineHeight: '1.5' }}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.4, duration: 3}}
              >
                {service.description}
              </motion.p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Services;