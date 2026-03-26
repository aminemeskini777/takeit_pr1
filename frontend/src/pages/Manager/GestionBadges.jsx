// frontend/src/pages/Manager/GestionBadges.jsx
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
import {
  Award,
  PlusCircle,
  Pencil,
  Trash2,
  Trophy,
  Star,
  Target,
  Sparkles,
  Users,
  Calendar,
  Settings
} from 'lucide-react';

const GestionBadges = () => {
  useAuth();
  const [badges, setBadges] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAttributionModal, setShowAttributionModal] = useState(false);
  const [editingBadge, setEditingBadge] = useState(null);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    seuil_attribution: '',
    image: '',
    periode: 'mensuelle',
    actif: true
  });
  const [attributionData, setAttributionData] = useState({
    badge_id: '',
    employe_id: '',
    commentaire: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchBadges();
    fetchStats();
  }, []);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      const response = await api.get('/badges');
      setBadges(response.data.badges);
      setEmployes(response.data.employes);
    } catch (error) {
      console.error('Erreur chargement:', error);
      showMessage('error', 'Erreur de chargement des badges');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/badges-stats');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Erreur stats:', error);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleInputChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const openModal = (badge = null) => {
    if (badge) {
      setEditingBadge(badge);
      setFormData({
        nom: badge.nom,
        description: badge.description || '',
        seuil_attribution: badge.seuil_attribution,
        image: badge.image || '',
        periode: badge.periode,
        actif: badge.actif
      });
    } else {
      setEditingBadge(null);
      setFormData({
        nom: '',
        description: '',
        seuil_attribution: '',
        image: '',
        periode: 'mensuelle',
        actif: true
      });
    }
    setShowModal(true);
  };

  const openAttributionModal = (badge) => {
    setSelectedBadge(badge);
    setAttributionData({
      badge_id: badge.id,
      employe_id: '',
      commentaire: ''
    });
    setShowAttributionModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingBadge) {
        await api.put(`/badges/${editingBadge.id}`, formData);
        showMessage('success', 'Badge modifié avec succès');
      } else {
        await api.post('/badges', formData);
        showMessage('success', 'Badge créé avec succès');
      }
      setShowModal(false);
      fetchBadges();
      fetchStats();
    } catch (error) {
      console.error('Erreur:', error);
      showMessage('error', error.response?.data?.message || 'Erreur lors de l\'opération');
    } finally {
      setLoading(false);
    }
  };

  const handleAttribution = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/badges/attribuer-manuellement', attributionData);
      showMessage('success', 'Badge attribué manuellement avec succès');
      setShowAttributionModal(false);
      fetchBadges();
      fetchStats();
    } catch (error) {
      console.error('Erreur:', error);
      showMessage('error', error.response?.data?.message || 'Erreur lors de l\'attribution');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous supprimer ce badge ?')) {
      try {
        setLoading(true);
        await api.delete(`/badges/${id}`);
        showMessage('success', 'Badge supprimé avec succès');
        fetchBadges();
        fetchStats();
      } catch (error) {
        console.error('Erreur suppression:', error);
        showMessage('error', error.response?.data?.message || 'Erreur lors de la suppression');
      } finally {
        setLoading(false);
      }
    }
  };

  const getPeriodeLabel = (periode) => {
    const labels = {
      mensuelle: '📅 Mensuelle',
      trimestrielle: '📆 Trimestrielle',
      annuelle: '🗓️ Annuelle'
    };
    return labels[periode] || periode;
  };

  return (
    <ManagerPage title="Gestion des badges">
      {message.text && (
        <div className={`mb-6 rounded-lg border px-4 py-3 text-sm transition-all ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          <div className="flex items-center gap-2 font-medium">{message.text}</div>
        </div>
      )}

      {/* Statistiques */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-5 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total badges</p>
                  <p className="text-2xl font-bold">{stats.total_badges}</p>
                </div>
                <Award className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Badges actifs</p>
                  <p className="text-2xl font-bold">{stats.badges_actifs}</p>
                </div>
                <Sparkles className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total attributions</p>
                  <p className="text-2xl font-bold">{stats.total_attributions}</p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Automatiques</p>
                  <p className="text-2xl font-bold">{stats.attributions_automatiques}</p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Manuelles</p>
                  <p className="text-2xl font-bold">{stats.attributions_manuelles}</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Liste des badges */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Badges de reconnaissance</CardTitle>
          <CardDescription>
            Créez, modifiez et attribuez des badges aux employés selon leurs performances.
          </CardDescription>
          <CardAction>
            <Button
              onClick={() => openModal()}
              disabled={loading}
              className="bg-orange-500 text-white hover:bg-orange-600 shadow-sm"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Ajouter badge
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {loading && !badges.length ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {badges.length === 0 ? (
                <div className="col-span-full text-center py-10 text-muted-foreground">
                  Aucun badge disponible
                </div>
              ) : (
                badges.map((badge) => (
                  <Card key={badge.id} className={`border ${!badge.actif ? 'opacity-60' : ''}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                            <Award className="h-6 w-6 text-orange-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{badge.nom}</CardTitle>
                            <CardDescription>
                              {badge.description || 'Aucune description'}
                            </CardDescription>
                          </div>
                        </div>
                        {!badge.actif && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            Inactif
                          </span>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Seuil:</span>
                        <span className="font-semibold text-orange-600">
                          {badge.seuil_attribution} tâches
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Période:</span>
                        <span className="font-medium">{getPeriodeLabel(badge.periode)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Attributions:</span>
                        <span className="font-medium">{badge.attributions_count || 0}</span>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => openModal(badge)}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button
                          onClick={() => openAttributionModal(badge)}
                          variant="outline"
                          size="sm"
                          className="flex-1 border-orange-200 text-orange-700 hover:bg-orange-50"
                        >
                          <Star className="h-4 w-4 mr-1" />
                          Attribuer
                        </Button>
                        <Button
                          onClick={() => handleDelete(badge.id)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Création/Modification */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setShowModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md shadow-2xl">
              <CardHeader className="border-b">
                <CardTitle className="text-lg">
                  {editingBadge ? 'Modifier' : 'Ajouter'} un badge
                </CardTitle>
                <CardDescription>
                  Définissez les règles d'attribution du badge.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nom">Nom du badge</Label>
                    <Input
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      required
                      placeholder="Expert, Productif, Star..."
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="border-input min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                      placeholder="Description du badge..."
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="seuil_attribution">Seuil d'attribution</Label>
                    <Input
                      id="seuil_attribution"
                      name="seuil_attribution"
                      type="number"
                      min="1"
                      value={formData.seuil_attribution}
                      onChange={handleInputChange}
                      required
                      placeholder="Nombre de tâches clôturées"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="periode">Période</Label>
                    <select
                      id="periode"
                      name="periode"
                      value={formData.periode}
                      onChange={handleInputChange}
                      className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    >
                      <option value="mensuelle">Mensuelle</option>
                      <option value="trimestrielle">Trimestrielle</option>
                      <option value="annuelle">Annuelle</option>
                    </select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="image">Image (URL)</Label>
                    <Input
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="/badges/mon-badge.png"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="actif"
                      name="actif"
                      checked={formData.actif}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    />
                    <Label htmlFor="actif" className="cursor-pointer">
                      Badge actif
                    </Label>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="submit" disabled={loading} className="flex-1 bg-orange-500 hover:bg-orange-600">
                      {loading ? 'Traitement...' : (editingBadge ? 'Mettre à jour' : 'Créer')}
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

      {/* Modal Attribution manuelle */}
      {showAttributionModal && selectedBadge && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setShowAttributionModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md shadow-2xl">
              <CardHeader className="border-b">
                <CardTitle className="text-lg">Attribuer un badge</CardTitle>
                <CardDescription>
                  Badge: <span className="font-semibold text-orange-600">{selectedBadge.nom}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAttribution} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="employe_id">Employé</Label>
                    <select
                      id="employe_id"
                      name="employe_id"
                      value={attributionData.employe_id}
                      onChange={(e) => setAttributionData({ ...attributionData, employe_id: e.target.value })}
                      className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                      required
                    >
                      <option value="">Sélectionner un employé</option>
                      {employes.map(employe => (
                        <option key={employe.id} value={employe.id}>
                          {employe.name} ({employe.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="commentaire">Commentaire (optionnel)</Label>
                    <textarea
                      id="commentaire"
                      name="commentaire"
                      value={attributionData.commentaire}
                      onChange={(e) => setAttributionData({ ...attributionData, commentaire: e.target.value })}
                      className="border-input min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                      placeholder="Raison de l'attribution..."
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="submit" disabled={loading} className="flex-1 bg-orange-500 hover:bg-orange-600">
                      {loading ? 'Traitement...' : 'Attribuer'}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setShowAttributionModal(false)}
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

export default GestionBadges;