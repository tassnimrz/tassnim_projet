import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";


const CreateContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [socials, setSocials] = useState([]);
    const [email, setEmail] = useState("");
    const [tel, setTel] = useState("");
    const [adresse, setAdresse] = useState("");
    const [map, setMap] = useState("");
    const [plateforme, setPlateforme] = useState("");
    const [lien, setLien] = useState("");
    const [message, setMessage] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editingSocialId, setEditingSocialId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [showSocialForm, setShowSocialForm] = useState(false);

    // Liste des plateformes de réseaux sociaux
    const socialPlatforms = [
        "Facebook",
        "Twitter",
        "Instagram",
        "LinkedIn",
        "YouTube",
        "TikTok",
        "Snapchat",
        "Pinterest",
        "Reddit",
       "Whatsapp",
        "Other"
    ];

    // Récupérer tous les contacts et réseaux sociaux
    useEffect(() => {
        fetchContacts();
        fetchSocials();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/contact");
            setContacts(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des contacts", error);
        }
    };

    const fetchSocials = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/reseaux");
            setSocials(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement des réseaux sociaux", error);
        }
    };

    // Soumettre le formulaire de création/édition des contacts
    const handleContactSubmit = async (e) => {
        e.preventDefault();
        const formData = { email, tel, adresse, map };

        try {
            if (editingId) {
                await axios.put(`http://127.0.0.1:8000/contact/update/${editingId}`, formData);
                setMessage("Contact mis à jour avec succès !");
            } else {
                await axios.post("http://127.0.0.1:8000/contact/store", formData);
                setMessage("Contact ajouté avec succès !");
            }

            setEmail("");
            setTel("");
            setAdresse("");
            setMap("");
            setEditingId(null);
            setShowForm(false);
            fetchContacts();
        } catch (error) {
            console.error("Erreur lors de l'ajout/mise à jour du contact", error);
            setMessage("Erreur lors de l'opération.");
        }
    };

    // Soumettre le formulaire de création/édition des réseaux sociaux
    const handleSocialSubmit = async (e) => {
        e.preventDefault();
        const formData = { plateforme, lien };

        try {
            if (editingSocialId) {
                await axios.put(`http://127.0.0.1:8000/reseaux/update/${editingSocialId}`, formData);
                setMessage("Réseau social mis à jour avec succès !");
            } else {
                await axios.post("http://127.0.0.1:8000/reseaux/store", formData);
                setMessage("Réseau social ajouté avec succès !");
            }

            setPlateforme("");
            setLien("");
            setEditingSocialId(null);
            setShowSocialForm(false);
            fetchSocials();
        } catch (error) {
            console.error("Erreur lors de l'ajout/mise à jour du réseau social", error);
            setMessage("Erreur lors de l'opération.");
        }
    };

    // Modifier un contact
    const handleEditContact = (contact) => {
        setEmail(contact.email);
        setTel(contact.tel);
        setAdresse(contact.adresse);
        setMap(contact.map);
        setEditingId(contact.id);
        setShowForm(true);
        setMessage("");
    };

    // Modifier un réseau social
    const handleEditSocial = (social) => {
        setPlateforme(social.plateforme);
        setLien(social.lien);
        setEditingSocialId(social.id);
        setShowSocialForm(true);
        setMessage("");
    };

    // Supprimer un contact
    const handleDeleteContact = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/contact/destroy/${id}`);
            setMessage("Contact supprimé avec succès !");
            fetchContacts();
        } catch (error) {
            console.error("Erreur lors de la suppression du contact", error);
            setMessage("Erreur lors de la suppression.");
        }
    };

    // Supprimer un réseau social
    const handleDeleteSocial = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/reseaux/destroy/${id}`);
            setMessage("Réseau social supprimé avec succès !");
            fetchSocials();
        } catch (error) {
            console.error("Erreur lors de la suppression du réseau social", error);
            setMessage("Erreur lors de la suppression.");
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white p-6 shadow-lg rounded-lg">
            {/* Formulaire pour contacts */}
            <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4 flex items-center gap-2 hover:bg-blue-700 transition">
                <FaPlus /> {showForm ? "Masquer le formulaire" : "Ajouter un Contact"}
            </button>

            {showForm && (
                <div className="p-4 bg-gray-100 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">{editingId ? "Modifier le Contact" : "Ajouter un Contact"}</h2>
                    {message && <p className="text-green-500">{message}</p>}
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                        <div>
                            <label className="block font-medium">Email :</label>
                            <input type="email" className="w-full border p-2 rounded" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block font-medium">Téléphone :</label>
                            <input type="tel" className="w-full border p-2 rounded" value={tel} onChange={(e) => setTel(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block font-medium">Adresse :</label>
                            <input type="text" className="w-full border p-2 rounded" value={adresse} onChange={(e) => setAdresse(e.target.value)} required />
                        </div>
                        <div>
                            <label className="block font-medium">Google Maps (URL) :</label>
                            <input type="url" className="w-full border p-2 rounded" value={map} onChange={(e) => setMap(e.target.value)} required />
                        </div>
                        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
                            {editingId ? "Mettre à jour" : "Ajouter"}
                        </button>
                    </form>
                </div>
            )}

            {/* Formulaire pour réseaux sociaux */}
            <button
                onClick={() => setShowSocialForm(!showSocialForm)}
                className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4 flex items-center gap-2 hover:bg-green-700 transition">
                <FaPlus /> {showSocialForm ? "Masquer le formulaire des Réseaux Sociaux" : "Ajouter un Réseau Social"}
            </button>

            {showSocialForm && (
                <div className="p-4 bg-gray-100 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">{editingSocialId ? "Modifier le Réseau Social" : "Ajouter un Réseau Social"}</h2>
                    {message && <p className="text-green-500">{message}</p>}
                    <form onSubmit={handleSocialSubmit} className="space-y-4">
                        <div>
                            <label className="block font-medium">Plateforme :</label>
                            <select
                                className="w-full border p-2 rounded"
                                value={plateforme}
                                onChange={(e) => setPlateforme(e.target.value)}
                                required
                            >
                                <option value="">Sélectionner une plateforme</option>
                                {socialPlatforms.map((platform, index) => (
                                    <option key={index} value={platform}>{platform}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-medium">Lien :</label>
                            <input type="url" className="w-full border p-2 rounded" value={lien} onChange={(e) => setLien(e.target.value)} required />
                        </div>
                        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-700">
                            {editingSocialId ? "Mettre à jour" : "Ajouter"}
                        </button>
                    </form>
                </div>
            )}

            <h2 className="text-xl font-bold mt-6">Liste des Contacts</h2>
            <ul className="space-y-4 mt-4">
                {contacts.map((contact) => (
                    <li key={contact.id} className="border p-4 rounded shadow flex items-center justify-between">
                        <div>
                            <p><strong>Email:</strong> {contact.email}</p>
                            <p><strong>Téléphone:</strong> {contact.tel}</p>
                            <p><strong>Adresse:</strong> {contact.adresse}</p>
                            {contact.map && (
                                <a href={contact.map} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                    Voir sur Google Maps
                                </a>
                            )}
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={() => handleEditContact(contact)} className="text-blue-500 hover:text-blue-700">
                                <FaEdit />
                            </button>
                            <button onClick={() => handleDeleteContact(contact.id)} className="text-red-500 hover:text-red-700">
                                <FaTrash />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            <h2 className="text-xl font-bold mt-6">Liste des Réseaux Sociaux</h2>
            <ul className="space-y-4 mt-4">
                {socials.map((social) => (
                    <li key={social.id} className="border p-4 rounded shadow flex items-center justify-between">
                        <div>
                            <p><strong>Plateforme:</strong> {social.plateforme}</p>
                            <p><strong>Lien:</strong> <a href={social.lien} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{social.lien}</a></p>
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={() => handleEditSocial(social)} className="text-blue-500 hover:text-blue-700">
                                <FaEdit />
                            </button>
                            <button onClick={() => handleDeleteSocial(social.id)} className="text-red-500 hover:text-red-700">
                                <FaTrash />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};




const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<CreateContacts />);