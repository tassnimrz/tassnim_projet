import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaSnapchat,
  FaTiktok,
  FaPinterest,
  FaReddit,
  FaWhatsapp,
  FaTelegram,
  FaDiscord,
  FaGithub,
  FaGitlab,
  FaDribbble,
  FaBehance,
  FaTwitch,
  FaMedium,
  FaSoundcloud,
  FaSpotify,
  FaSteam,
  FaAmazon,
  FaMicrosoft,
  FaApple,
  FaGoogle,
  FaGlobe,
} from "react-icons/fa";

const Socials = () => {
  const [contacts, setContacts] = useState([]);
  const [socials, setSocials] = useState([]);

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

  const getSocialIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return <FaFacebook size={40} color="#1877F2" />;
      case "twitter":
      case "x":
        return <FaTwitter size={40} color="#1DA1F2" />;
      case "instagram":
        return <FaInstagram size={40} color="#E4405F" />;
      case "linkedin":
        return <FaLinkedin size={40} color="#0077B5" />;
      case "youtube":
        return <FaYoutube size={40} color="#FF0000" />;
      case "snapchat":
        return <FaSnapchat size={40} color="#FFFC00" />;
      case "tiktok":
        return <FaTiktok size={40} color="#000000" />;
      case "pinterest":
        return <FaPinterest size={40} color="#E60023" />;
      case "reddit":
        return <FaReddit size={40} color="#FF4500" />;
      case "whatsapp":
        return <FaWhatsapp size={40} color="#25D366" />;
      case "telegram":
        return <FaTelegram size={40} color="#0088CC" />;
      case "discord":
        return <FaDiscord size={40} color="#5865F2" />;
      case "github":
        return <FaGithub size={40} color="#333" />;
      case "gitlab":
        return <FaGitlab size={40} color="#FCA121" />;
      case "dribbble":
        return <FaDribbble size={40} color="#EA4C89" />;
      case "behance":
        return <FaBehance size={40} color="#1769FF" />;
      case "twitch":
        return <FaTwitch size={40} color="#9146FF" />;
      case "medium":
        return <FaMedium size={40} color="#000000" />;
      case "soundcloud":
        return <FaSoundcloud size={40} color="#FF7700" />;
      case "spotify":
        return <FaSpotify size={40} color="#1DB954" />;
      case "steam":
        return <FaSteam size={40} color="#171A21" />;
      case "amazon":
        return <FaAmazon size={40} color="#FF9900" />;
      case "microsoft":
        return <FaMicrosoft size={40} color="#737373" />;
      case "apple":
        return <FaApple size={40} color="#000000" />;
      case "google":
        return <FaGoogle size={40} color="#4285F4" />;
      default:
        return <FaGlobe size={40} color="#555" />;
    }
  };

  return (
    <section id="contact" className="container mt-4 pt-3 py-2">
    <div className="row justify-content-center">

        {/* Section Contacts */}
        <div className="col-md-6">
          <div className="d-flex justify-content-between mb-3 ">
            {contacts.map((contact) => (
              <div key={contact.id} className="d-flex justify-content-between w-100">
                <div>
                  <h5 style={{ color: '#1877F2' }}>📞 Téléphone :</h5>
                  <p>{contact.tel}</p>
                </div>
                <div>
                  <h5 style={{ color: '#1877F2' }}>🏠 Adresse :</h5>
                  <p>{contact.adresse}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Réseaux Sociaux */}
        <div className="col-md-6 text-center">
          <div className="d-flex justify-content-center">
            {socials.map((social) => (
              <a key={social.id} href={social.lien} target="_blank" rel="noopener noreferrer" className="mx-3">
                {getSocialIcon(social.plateforme)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Socials;