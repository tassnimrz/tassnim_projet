import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const Apropos = () => {
    const [content, setContent] = useState([]);
    const images = [
        "https://cdn.studenti.stbm.it/images/2020/01/21/infermiere-orig.jpeg",
       "https://img.epochtimes.com.tw/upload/images/2022/09/13/574965_medium.jpg",
        "https://images.squarespace-cdn.com/content/v1/5e335808cc2de96b45415c0c/1580433870495-0LGWK285HTMW0FGZP5T9/shutterstock_282712163_2.jpg"
    ];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        fetchContent();

        // Changer d'image toutes les 3 secondes
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const fetchContent = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/a-propos-ns");
            setContent(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des informations", error);
        }
    };

    // Détecter si la section est visible
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <section
            id="about-us"
            className="py-5 text-center"
            style={{
                padding: '40px',
                margin: '20px',
            }}
            ref={ref}
        >
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '30px',
                    marginTop: '30px',
                    alignItems: 'center',
                }}
            >
                {/* Animation des images */}
                <motion.div
   initial={{ x: -100, opacity: 0 }}
   animate={isInView ? { x: 0, opacity: 1 } : {}}
   transition={{ duration: 1 }}
    style={{
        flex: '1',
        textAlign: 'center',
    }}
>
    <AnimatePresence mode="wait">
        <motion.img
            key={images[currentImageIndex]}
            src={images[currentImageIndex]}
            alt="A propos de nous"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
                maxWidth: '600px',
                height: '500px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
        />
    </AnimatePresence>
</motion.div>


                {/* Contenu animé */}
                <div
                    style={{
                        flex: '2',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        minHeight: '300px',
                        overflow: 'visible',
                        width: '100%',
                    }}
                >
                    {content.map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 1, delay: 0.3 }}
                            style={{
                                width: '100%',
                            }}
                        >
                            {/* Animation du titre */}
                            <motion.h3
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                                transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
                                style={{
                                    fontSize: '2rem',
                                    fontWeight: 'bold',
                                    color: '#2c3e50',
                                    textAlign: 'center',
                                    fontFamily: '"Roboto", sans-serif',
                                    marginBottom: '15px',
                                    width: '100%',
                                }}
                            >
                                {item.title}
                            </motion.h3>

                            {/* Animation de la description */}
                            <motion.p
                                initial={{ opacity: 0, x: 30 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 1, delay: 0.7 }}
                                style={{
                                    fontSize: '1.2rem',
                                    color: '#7f8c8d',
                                    marginTop: '10px',
                                    fontFamily: '"Lora", serif',
                                    lineHeight: '1.8',
                                    textAlign: 'justify',
                                    width: '100%',
                                    overflowWrap: 'break-word',
                                    wordWrap: 'break-word',
                                    whiteSpace: 'normal',
                                }}
                            >
                                {item.description}
                            </motion.p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Apropos;