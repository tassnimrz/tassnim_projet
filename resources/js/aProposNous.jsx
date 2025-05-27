import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPlus, 
  faEdit, 
  faTrash, 
  faTimes,
  faCheck,
  faInfoCircle,
  faArrowUp
} from "@fortawesome/free-solid-svg-icons";

// Style global avec styled-components
const GlobalStyle = createGlobalStyle`
  :root {
    --primary: #4361ee;
    --primary-light: #4895ef;
    --secondary: #3f37c9;
    --dark: #1a1a2e;
    --light: #f8f9fa;
    --success: #4cc9f0;
    --warning: #f8961e;
    --danger: #f72585;
    --gray: #6c757d;
    --border-radius: 12px;
    --box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    line-height: 1.6;
    color: var(--dark);
    min-height: 100vh;
    padding: 2rem;
  }

  @media (max-width: 768px) {
    body {
      padding: 1rem;
    }
  }
`;

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Composants stylisés
const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Card = styled.div`
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 2rem;
  margin-bottom: 2rem;
  transition: var(--transition);
  border-left: 4px solid ${props => props.isEditing ? 'var(--warning)' : 'var(--primary)'};

  &:hover {
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  }
`;

const Button = styled.button`
  background: ${props => props.primary ? 'var(--primary)' : 'transparent'};
  color: ${props => props.primary ? 'white' : 'var(--primary)'};
  border: ${props => props.primary ? 'none' : '1px solid var(--primary)'};
  border-radius: var(--border-radius);
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: var(--transition);
  margin: ${props => props.margin || '0'};
  width: ${props => props.fullWidth ? '100%' : 'auto'};

  &:hover {
    background: ${props => props.primary ? 'var(--secondary)' : 'rgba(67, 97, 238, 0.1)'};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: var(--border-radius);
  font-size: 1rem;
  transition: var(--transition);
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: var(--border-radius);
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: var(--transition);
  margin-bottom: 1rem;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
  }
`;

const InfoItem = styled.div`
  background: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-left: 4px solid var(--primary-light);
  transition: var(--transition);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  animation: ${fadeIn} 0.3s ease-out;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
`;

const Title = styled.h3`
  color: var(--primary);
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
`;

const Description = styled.p`
  color: var(--dark);
  opacity: 0.9;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${props => 
    props.danger ? 'var(--danger)' : 
    props.warning ? 'var(--warning)' : 'var(--gray)'};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);

  &:hover {
    background: ${props => 
      props.danger ? 'rgba(247, 37, 133, 0.1)' : 
      props.warning ? 'rgba(248, 150, 30, 0.1)' : 'rgba(108, 117, 125, 0.1)'};
    color: ${props => 
      props.danger ? 'var(--danger)' : 
      props.warning ? 'var(--warning)' : 'var(--dark)'};
  }
`;

const Message = styled.div`
  padding: 1rem;
  margin: 1rem 0;
  border-radius: var(--border-radius);
  background: ${props => 
    props.success ? 'rgba(76, 201, 240, 0.2)' : 
    props.error ? 'rgba(247, 37, 133, 0.2)' : 'rgba(248, 150, 30, 0.2)'};
  color: ${props => 
    props.success ? 'var(--success)' : 
    props.error ? 'var(--danger)' : 'var(--warning)'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: ${fadeIn} 0.3s ease-out;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: var(--dark);
  margin-bottom: 1.5rem;
  position: relative;
  display: inline-block;

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 50px;
    height: 3px;
    background: var(--primary);
    border-radius: 3px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--gray);
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  animation: ${pulse} 2s infinite;

  svg {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: var(--primary-light);
  }
`;

const BackToAdmin = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background-color: var(--primary);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--box-shadow);
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    background-color: var(--secondary);
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  }
`;

// Composant principal
const AProposNous = () => {
  const [content, setContent] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/a-propos-ns");
      setContent(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des informations", error);
      setMessage({ text: "Erreur lors du chargement des informations", type: "error" });
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { title, description };
    setIsLoading(true);

    try {
      if (editingId) {
        await axios.put(`http://127.0.0.1:8000/a-propos-ns/update/${editingId}`, data);
        setMessage({ text: "Informations mises à jour avec succès !", type: "success" });
      } else {
        await axios.post("http://127.0.0.1:8000/a-propos-ns/store", data);
        setMessage({ text: "Informations ajoutées avec succès !", type: "success" });
      }

      setTitle("");
      setDescription("");
      setEditingId(null);
      setShowForm(false);
      await fetchContent();
    } catch (error) {
      console.error("Erreur lors de l'ajout/mise à jour des informations", error);
      setMessage({ text: "Erreur lors de l'opération", type: "error" });
      setIsLoading(false);
    }
  };

  const handleEdit = (item) => {
    setTitle(item.title);
    setDescription(item.description);
    setEditingId(item.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette information ?")) return;
    
    try {
      setIsLoading(true);
      await axios.delete(`http://127.0.0.1:8000/a-propos-ns/${id}`);
      setMessage({ text: "Information supprimée avec succès !", type: "success" });
      await fetchContent();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'information", error);
      setMessage({ text: "Erreur lors de la suppression", type: "error" });
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEditingId(null);
    setShowForm(false);
  };

  const handleBackToAdmin = () => {
    window.location.href = "http://127.0.0.1:8000/dashboard/admin";
  };

  return (
    <>
      <GlobalStyle />
      {/* Bouton flèche pour retourner à l'admin */}
      <BackToAdmin onClick={handleBackToAdmin}>
        <FontAwesomeIcon icon={faArrowUp} />
      </BackToAdmin>

      <Container>
        <SectionTitle>À propos de nous</SectionTitle>
        
        {message.text && (
          <Message 
            success={message.type === "success"} 
            error={message.type === "error"}
          >
            <FontAwesomeIcon icon={message.type === "success" ? faCheck : faInfoCircle} />
            {message.text}
          </Message>
        )}

        <Button 
          onClick={() => setShowForm(!showForm)} 
          primary 
          fullWidth
          margin="0 0 2rem 0"
        >
          <FontAwesomeIcon icon={showForm ? faTimes : faPlus} />
          {showForm ? "Annuler" : "Ajouter une Information"}
        </Button>

        {showForm && (
          <Card isEditing={!!editingId}>
            <h2>{editingId ? "Modifier l'Information" : "Nouvelle Information"}</h2>
            <form onSubmit={handleSubmit}>
              <Input
                type="text"
                placeholder="Titre"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <TextArea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button 
                  type="submit" 
                  primary 
                  disabled={isLoading}
                >
                  <FontAwesomeIcon icon={editingId ? faEdit : faPlus} />
                  {editingId ? "Mettre à jour" : "Ajouter"}
                </Button>
                {editingId && (
                  <Button 
                    type="button" 
                    onClick={resetForm}
                    disabled={isLoading}
                  >
                    Annuler
                  </Button>
                )}
              </div>
            </form>
          </Card>
        )}

        {isLoading && content.length === 0 ? (
          <EmptyState>
            <FontAwesomeIcon icon={faInfoCircle} spin />
            <p>Chargement des informations...</p>
          </EmptyState>
        ) : content.length === 0 ? (
          <EmptyState>
            <FontAwesomeIcon icon={faInfoCircle} />
            <p>Aucune information disponible. Ajoutez-en une !</p>
          </EmptyState>
        ) : (
          <div>
            {content.map((item) => (
              <InfoItem key={item.id}>
                <ContentWrapper>
                  <Title>{item.title}</Title>
                  <Description>{item.description}</Description>
                </ContentWrapper>
                <ActionButtons>
                  <IconButton 
                    warning 
                    onClick={() => handleEdit(item)}
                    title="Modifier"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </IconButton>
                  <IconButton 
                    danger 
                    onClick={() => handleDelete(item.id)}
                    title="Supprimer"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </IconButton>
                </ActionButtons>
              </InfoItem>
            ))}
          </div>
        )}
      </Container>
    </>
  );
};

// Point d'entrée
const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(
  <React.StrictMode>
    <AProposNous />
  </React.StrictMode>
);