
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import ManagerPage from './ManagerPage';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';

const GestionUtilisateurs = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [equipes, setEquipes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'employee',
    equipe_id: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data.users);
      setEquipes(response.data.equipes);
    } catch (error) {
      console.error('Erreur chargement:', error);
      showMessage('error', 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        equipe_id: user.equipe_id || ''
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        role: 'employee',
        equipe_id: ''
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...formData,
        equipe_id: formData.equipe_id === '' ? null : formData.equipe_id
      };
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, payload);
        showMessage('success', 'Utilisateur modifié');
      } else {
        await api.post('/users', payload);
        showMessage('success', 'Utilisateur créé');
      }
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Erreur:', error);
      showMessage('error', error.response?.data?.message || 'Erreur lors de l\'opération');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous supprimer cet utilisateur ?')) {
      try {
        setLoading(true);
        await api.delete(`/users/${id}`);
        showMessage('success', 'Utilisateur supprimé');
        fetchUsers();
      } catch (error) {
        console.error('Erreur suppression:', error);
        showMessage('error', error.response?.data?.message || 'Erreur lors de la suppression');
      } finally {
        setLoading(false);
      }
    }
  };

  const resendActivation = async (id) => {
    try {
      setLoading(true);
      await api.post(`/users/${id}/resend-activation`);
      showMessage('success', 'Email d\'activation renvoyé');
    } catch (error) {
      console.error('Erreur envoi email:', error);
      showMessage('error', 'Erreur lors de l\'envoi de l\'email');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      inactive: 'bg-rose-50 text-rose-700 border-rose-200'
    };
    return styles[status] || 'bg-muted text-muted-foreground border-muted';
  };

  return (
    <ManagerPage title="Gestion des Utilisateurs">
     
      {message.text && (
        <div className={`mb-6 rounded-lg border px-4 py-3 text-sm transition-all ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          <div className="flex items-center gap-2 font-medium">{message.text}</div>
        </div>
      )}

      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-xl">Utilisateurs</CardTitle>
          <CardDescription>Gérez les comptes, leurs rôles et l'activation.</CardDescription>
          <CardAction>
            <Button
              onClick={() => openModal()}
              disabled={loading}
              className="bg-orange-500 text-white hover:bg-orange-600 shadow-sm"
            >
              Ajouter un utilisateur
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {loading && !users.length ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Nom</th>
                    <th className="px-4 py-3 text-left font-medium">Email</th>
                    <th className="px-4 py-3 text-left font-medium">Rôle</th>
                    <th className="px-4 py-3 text-left font-medium">Équipe</th>
                    <th className="px-4 py-3 text-left font-medium">Statut</th>
                    <th className="px-4 py-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-10 text-center text-muted-foreground">
                        Aucun utilisateur trouvé
                      </td>
                    </tr>
                  ) : (
                    users.map(user => (
                      <tr key={user.id} className="hover:bg-muted/40 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium text-foreground">{user.name}</div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${
                            user.role === 'manager' 
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                              : 'bg-sky-50 text-sky-700 border-sky-200'
                          }`}>
                            {user.role === 'manager' ? 'Manager' : 'Employé'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {user.equipe?.nom || '-'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusBadge(user.status)}`}>
                            {user.status === 'active' ? 'Actif' : 'Inactif'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              onClick={() => openModal(user)}
                              variant="outline"
                              size="sm"
                              className="border-slate-200 text-slate-700 hover:bg-slate-50"
                            >
                              Modifier
                            </Button>

                            {user.id !== currentUser?.id ? (
                              <Button
                                onClick={() => handleDelete(user.id)}
                                variant="destructive"
                                size="sm"
                              >
                                Supprimer
                              </Button>
                            ) : (
                              <Button
                                variant="secondary"
                                size="sm"
                                disabled
                                className="cursor-not-allowed"
                              >
                                Supprimer
                              </Button>
                            )}

                            {user.status === 'inactive' && (
                              <Button
                                onClick={() => resendActivation(user.id)}
                                variant="outline"
                                size="sm"
                                className="border-orange-200 text-orange-700 hover:bg-orange-50"
                              >
                                Renvoyer l'activation
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Formulaire */}
      {showModal && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md shadow-2xl">
              <CardHeader className="border-b">
                <CardTitle className="text-lg">
                  {editingUser ? 'Modifier' : 'Ajouter'} un utilisateur
                </CardTitle>
                <CardDescription>Renseignez les informations du compte.</CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="name"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="user@example.com"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="role">Rôle</Label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    >
                      <option value="employee">Employé</option>
                      <option value="manager">Manager</option>
                    </select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="equipe_id">Équipe</Label>
                    <select
                      id="equipe_id"
                      name="equipe_id"
                      value={formData.equipe_id}
                      onChange={handleInputChange}
                      className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    >
                      <option value="">Sélectionner une équipe</option>
                      {equipes.length === 0 && (
                        <option value="" disabled>Aucune équipe disponible</option>
                      )}
                      {equipes.map(equipe => (
                        <option key={equipe.id} value={equipe.id}>
                          {equipe.nom}
                        </option>
                      ))}
                    </select>
                    {equipes.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        Ajoutez des équipes dans la base de données.
                      </p>
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-orange-500 text-white hover:bg-orange-600"
                    >
                      {loading ? 'Traitement...' : (editingUser ? 'Mettre à jour' : 'Créer')}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setShowModal(false)}
                      className="flex-1"
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </ManagerPage>
  );
};

export default GestionUtilisateurs;
