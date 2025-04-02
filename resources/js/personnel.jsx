import React, { useEffect, useState } from "react";
import axios from "axios";

const PersonnelManagement = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    tel: "",
    adresse: "",
    date_naissance: "",
    status: "active",
    role: "patient",
  });

  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  // ➡️ Charger les utilisateurs
  const fetchUsers = async () => {
    const response = await axios.get("http://127.0.0.1:8000/api/users");
    setUsers(response.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ➡️ Gérer les champs du formulaire
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ➡️ Créer ou mettre à jour un utilisateur
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingUser) {
        await axios.put(`http://127.0.0.1:8000/api/users/${editingUser.id}`, formData);
      } else {
        await axios.post("http://127.0.0.1:8000/api/register", formData);
      }
      setFormData({});
      fetchUsers(); // Recharger les utilisateurs
      setEditingUser(null);
    } catch (error) {
      console.error("Erreur:", error.response?.data || error.message);
    }
  };

  // ➡️ Remplir le formulaire lors de la modification
  const handleEdit = (user) => {
    setFormData(user);
    setEditingUser(user);
  };

  // ➡️ Supprimer un utilisateur
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/users/${id}`);
      fetchUsers(); // Recharger les utilisateurs
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Gestion du Personnel</h2>

      {/* ➡️ Formulaire */}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Nom" value={formData.name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        <input name="password" placeholder="Mot de passe" type="password" value={formData.password} onChange={handleChange} />
        <input name="password_confirmation" placeholder="Confirmer le mot de passe" type="password" value={formData.password_confirmation} onChange={handleChange} />
        <input name="tel" placeholder="Téléphone" value={formData.tel} onChange={handleChange} />
        <input name="adresse" placeholder="Adresse" value={formData.adresse} onChange={handleChange} />
        <input name="date_naissance" type="date" value={formData.date_naissance} onChange={handleChange} />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="medecin">Médecin</option>
          <option value="secretaire">Secrétaire</option>
          <option value="patient">Patient</option>
        </select>
        <button type="submit">{editingUser ? "Modifier" : "Ajouter"}</button>
      </form>

      {/* ➡️ Table des utilisateurs */}
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Modifier</button>
                <button onClick={() => handleDelete(user.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default personnel;
