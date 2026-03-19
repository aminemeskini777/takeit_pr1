import { useEffect, useState } from "react";
import ManagerPage from "./ManagerPage";
import api from "../../api/axios";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

const emptyForm = { nom: "" };

export default function Equipes() {
  const [equipes, setEquipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchEquipes();
  }, []);

  const fetchEquipes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/equipes");
      setEquipes(res.data.equipes || []);
    } catch (e) {
      showMessage("error", "Erreur de chargement des equipes.");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const openModal = (equipe = null) => {
    setEditing(equipe);
    setFormData(equipe ? { nom: equipe.nom } : emptyForm);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editing) {
        await api.put(`/equipes/${editing.id}`, formData);
        showMessage("success", "Equipe mise a jour.");
      } else {
        await api.post("/equipes", formData);
        showMessage("success", "Equipe creee.");
      }
      setShowModal(false);
      fetchEquipes();
    } catch (err) {
      const msg = err?.response?.data?.message || "Erreur lors de l'operation.";
      showMessage("error", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette equipe ?")) return;
    try {
      setLoading(true);
      await api.delete(`/equipes/${id}`);
      showMessage("success", "Equipe supprimee.");
      fetchEquipes();
    } catch (err) {
      showMessage("error", "Erreur lors de la suppression.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ManagerPage title="Gestion des equipes">
      {message.text && (
        <div
          className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <Card>
        <CardHeader className="border-b flex items-center justify-between">
          <CardTitle className="text-xl">Equipes</CardTitle>
          <Button
            onClick={() => openModal()}
            disabled={loading}
            className="bg-orange-500 text-white hover:bg-orange-600"
          >
            Ajouter une equipe
          </Button>
        </CardHeader>
        <CardContent>
          {loading && equipes.length === 0 ? (
            <div className="flex justify-center items-center h-40 text-slate-500">Chargement...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Nom</th>
                    <th className="px-4 py-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {equipes.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="px-4 py-10 text-center text-muted-foreground">
                        Aucune equipe.
                      </td>
                    </tr>
                  ) : (
                    equipes.map((equipe) => (
                      <tr key={equipe.id} className="hover:bg-muted/40 transition-colors">
                        <td className="px-4 py-3 font-medium text-foreground">{equipe.nom}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openModal(equipe)}
                              className="border-slate-200 text-slate-700 hover:bg-slate-50"
                            >
                              Modifier
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(equipe.id)}
                            >
                              Supprimer
                            </Button>
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

      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setShowModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md shadow-2xl">
              <CardHeader className="border-b">
                <CardTitle className="text-lg">{editing ? "Modifier" : "Ajouter"} une equipe</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nom">Nom</Label>
                    <Input
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      placeholder="Nom de l'equipe"
                      required
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button type="submit" disabled={loading} className="flex-1 bg-orange-500 text-white hover:bg-orange-600">
                      {loading ? "Traitement..." : editing ? "Mettre a jour" : "Creer"}
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
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
}
