import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import ManagerPage from "./ManagerPage";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import AttachmentsField from "../../components/AttachmentsField";
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Flame,
  MessageCircle,
  Paperclip,
  Pencil,
  PlusCircle,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";

const emptyForm = {
  title: "",
  description: "",
  due_date: "",
  priority: "medium",
  status: "todo",
  assignees: [],
  attachmentsFiles: [],
  existingAttachments: [],
};

export default function GestionTaches() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [commentText, setCommentText] = useState("");

  const normalizeAttachments = (attachments = []) =>
    attachments.map((item) =>
      typeof item === "string" ? { name: item, url: "" } : item
    );

  useEffect(() => {
    fetchTasks();
  }, []);

  const stats = useMemo(() => {
    const total = tasks.length;
    const todo = tasks.filter((t) => t.status === "todo").length;
    const inProgress = tasks.filter((t) => t.status === "in_progress").length;
    const done = tasks.filter((t) => t.status === "done").length;
    return { total, todo, inProgress, done };
  }, [tasks]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get("/tasks");
      setTasks(response.data.tasks || []);
      setEmployees(response.data.employees || []);
    } catch (error) {
      console.error("Erreur chargement:", error);
      showMessage("error", "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  const openModal = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        title: task.title || "",
        description: task.description || "",
        due_date: task.due_date || "",
        priority: task.priority || "medium",
        status: task.status || "todo",
        assignees: (task.assignees || []).map((a) => String(a.id)),
        attachmentsFiles: [],
        existingAttachments: normalizeAttachments(task.attachments || []),
      });
    } else {
      setEditingTask(null);
      setFormData(emptyForm);
    }
    setShowModal(true);
  };

  const openDetails = (task) => {
    setSelectedTask({
      ...task,
      attachments: normalizeAttachments(task.attachments || []),
    });
    setCommentText("");
    setShowDetails(true);
  };

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAssigneesChange = (e) => {
    const values = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setFormData((prev) => ({ ...prev, assignees: values }));
  };

  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev) => ({ ...prev, attachmentsFiles: files }));
  };

  const removeExistingAttachment = (index) => {
    setFormData((prev) => ({
      ...prev,
      existingAttachments: prev.existingAttachments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description || "");
      payload.append("due_date", formData.due_date || "");
      payload.append("priority", formData.priority);
      payload.append("status", formData.status);
      formData.assignees.forEach((id) => payload.append("assignees[]", id));

      if (formData.existingAttachments?.length) {
        payload.append("existing_attachments", JSON.stringify(formData.existingAttachments));
      }

      if (formData.attachmentsFiles?.length) {
        formData.attachmentsFiles.forEach((file) => payload.append("attachments[]", file));
      }

      if (editingTask) {
        await api.post(`/tasks/${editingTask.id}?_method=PUT`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showMessage("success", "Tâche mise à jour");
      } else {
        await api.post("/tasks", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        showMessage("success", "Tâche créée");
      }

      setShowModal(false);
      fetchTasks();
    } catch (error) {
      console.error("Erreur:", error);
      showMessage("error", error.response?.data?.message || "Erreur lors de l'opération");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous supprimer cette tâche ?")) {
      try {
        setLoading(true);
        await api.delete(`/tasks/${id}`);
        showMessage("success", "Tâche supprimée");
        fetchTasks();
      } catch (error) {
        console.error("Erreur suppression:", error);
        showMessage("error", error.response?.data?.message || "Erreur lors de la suppression");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || !selectedTask) return;
    try {
      setLoading(true);
      await api.post(`/tasks/${selectedTask.id}/comments`, {
        content: commentText.trim(),
      });
      showMessage("success", "Commentaire ajouté");
      setCommentText("");
      fetchTasks();
    } catch (error) {
      console.error("Erreur commentaire:", error);
      showMessage("error", "Erreur lors de l'ajout");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      todo: "bg-slate-100 text-slate-700 border-slate-200",
      in_progress: "bg-amber-50 text-amber-700 border-amber-200",
      done: "bg-emerald-50 text-emerald-700 border-emerald-200",
    };
    return styles[status] || "bg-muted text-muted-foreground border-muted";
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      high: "bg-rose-50 text-rose-700 border-rose-200",
      medium: "bg-indigo-50 text-indigo-700 border-indigo-200",
      low: "bg-sky-50 text-sky-700 border-sky-200",
    };
    return styles[priority] || "bg-muted text-muted-foreground border-muted";
  };

  return (
    <ManagerPage title="Gestion des tâches internes">
      {message.text && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm transition-all ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Total</CardTitle>
                <CardDescription>Ensemble des tâches</CardDescription>
              </div>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                <ClipboardList className="h-5 w-5" />
              </span>
            </div>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats.total}</CardContent>
        </Card>
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>À faire</CardTitle>
                <CardDescription>En attente</CardDescription>
              </div>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                <CalendarDays className="h-5 w-5" />
              </span>
            </div>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats.todo}</CardContent>
        </Card>
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>En cours</CardTitle>
                <CardDescription>En exécution</CardDescription>
              </div>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <Users className="h-5 w-5" />
              </span>
            </div>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats.inProgress}</CardContent>
        </Card>
        <Card>
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Terminées</CardTitle>
                <CardDescription>Clôturées</CardDescription>
              </div>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </span>
            </div>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{stats.done}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Tâches internes</CardTitle>
          <CardDescription>Créez, assignez et suivez les tâches de l'équipe.</CardDescription>
          <CardAction>
            <Button
              onClick={() => openModal()}
              disabled={loading}
              className="bg-orange-500 text-white hover:bg-orange-600 shadow-sm"
            >
              <PlusCircle className="h-5 w-5" />
              Ajouter tâche
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          {loading && !tasks.length ? (
            <div className="flex items-center justify-center h-56">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Titre</th>
                    <th className="px-4 py-3 text-left font-medium">Statut</th>
                    <th className="px-4 py-3 text-left font-medium">Priorité</th>
                    <th className="px-4 py-3 text-left font-medium">Échéance</th>
                    <th className="px-4 py-3 text-left font-medium">Responsables</th>
                    <th className="px-4 py-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {tasks.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-10 text-center text-muted-foreground">
                        Aucune tâche disponible
                      </td>
                    </tr>
                  ) : (
                    tasks.map((task) => (
                      <tr key={task.id} className="hover:bg-muted/40 transition-colors">
                        <td className="px-4 py-3">
                          <div className="font-medium text-foreground">{task.title}</div>
                          <div className="text-xs text-muted-foreground">
                            Créée par {task.creator?.name || "Manager"}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusBadge(
                              task.status
                            )}`}
                          >
                            {task.status === "todo"
                              ? "À faire"
                              : task.status === "in_progress"
                              ? "En cours"
                              : "Terminée"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getPriorityBadge(
                              task.priority
                            )}`}
                          >
                            {task.priority === "high"
                              ? "Haute"
                              : task.priority === "low"
                              ? "Basse"
                              : "Moyenne"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {task.due_date || "-"}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {(task.assignees || []).map((a) => a.name).join(", ") || "-"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              onClick={() => openDetails(task)}
                              variant="outline"
                              size="sm"
                              className="border-slate-200 text-slate-700 hover:bg-slate-50"
                            >
                              <ClipboardList className="h-5 w-5" />
                              Voir
                            </Button>
                            <Button
                              onClick={() => openModal(task)}
                              variant="outline"
                              size="sm"
                              className="border-slate-200 text-slate-700 hover:bg-slate-50"
                            >
                              <Pencil className="h-5 w-5" />
                              Modifier
                            </Button>
                            <Button onClick={() => handleDelete(task.id)} variant="destructive" size="sm">
                              <Trash2 className="h-5 w-5" />
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setShowModal(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg shadow-2xl">
              <CardHeader className="border-b">
                <CardTitle>{editingTask ? "Modifier la tâche" : "Ajouter une tâche"}</CardTitle>
                <CardDescription>Organisez et assignez le travail interne.</CardDescription>
              </CardHeader>
              <CardContent className="max-h-[70vh] overflow-y-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Titre</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      placeholder="Mettre à jour le planning"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="border-input min-h-[72px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                      placeholder="Détails de la tâche"
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                  <div className="grid gap-2">
                    <Label htmlFor="due_date">Date d'échéance</Label>
                    <div className="relative">
                      <CalendarDays className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                      <Input
                        id="due_date"
                        type="date"
                        name="due_date"
                        value={formData.due_date}
                        onChange={handleInputChange}
                        className="pl-9"
                      />
                    </div>
                  </div>
                    <div className="grid gap-2">
                      <Label htmlFor="priority">Priorité</Label>
                      <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                        className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                      >
                        <option value="high">Haute</option>
                        <option value="medium">Moyenne</option>
                        <option value="low">Basse</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status">Statut</Label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="border-input h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                      >
                        <option value="todo">À faire</option>
                        <option value="in_progress">En cours</option>
                        <option value="done">Terminée</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="assignees">Responsables</Label>
                    <select
                      id="assignees"
                      name="assignees"
                      multiple
                      value={formData.assignees}
                      onChange={handleAssigneesChange}
                      className="border-input min-h-[120px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    >
                      {employees.length === 0 && (
                        <option value="" disabled>
                          Aucun employé disponible
                        </option>
                      )}
                      {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name} ({employee.email})
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-muted-foreground">
                      Maintenez Ctrl (ou Cmd) pour sélectionner plusieurs personnes.
                    </p>
                  </div>

                  <AttachmentsField
                    existingAttachments={formData.existingAttachments}
                    onFilesChange={handleFilesChange}
                    onRemoveExisting={removeExistingAttachment}
                  />

                  <div className="flex gap-3 pt-2">
                    <Button type="submit" disabled={loading} className="flex-1 bg-orange-500 hover:bg-orange-600">
                      <CheckCircle2 className="h-5 w-5" />
                      {loading ? "Traitement..." : editingTask ? "Mettre à jour" : "Créer"}
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

      {showDetails && selectedTask && (
        <>
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setShowDetails(false)} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-lg shadow-2xl">
              <CardHeader className="border-b">
                <CardTitle>Détails de la tâche</CardTitle>
                <CardDescription>{selectedTask.title}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2 text-sm">
                  <div>
                    <div className="text-muted-foreground">Statut</div>
                    <div className="font-medium">
                      {selectedTask.status === "todo"
                        ? "À faire"
                        : selectedTask.status === "in_progress"
                        ? "En cours"
                        : "Terminée"}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Priorité</div>
                    <div className="font-medium">
                      {selectedTask.priority === "high"
                        ? "Haute"
                        : selectedTask.priority === "low"
                        ? "Basse"
                        : "Moyenne"}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Échéance</div>
                    <div className="font-medium">{selectedTask.due_date || "-"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Responsables</div>
                    <div className="font-medium">
                      {(selectedTask.assignees || []).map((a) => a.name).join(", ") || "-"
                      }</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Description</div>
                  <div className="rounded-lg border bg-slate-50 px-3 py-2 text-sm">
                    {selectedTask.description || "Aucune description"}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-1">Pièces jointes</div>
                  <div className="rounded-lg border bg-slate-50 px-3 py-2 text-sm space-y-1">
                    {(selectedTask.attachments || []).length === 0 && "Aucune pièce jointe"}
                    {(selectedTask.attachments || []).map((file) => (
                      <div key={file.url || file.path || file.name}>
                        <a
                          href={file.url || "#"}
                          className="text-orange-600 hover:text-orange-700"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {file.name}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-medium">Commentaires</div>
                  <div className="space-y-2">
                    {(selectedTask.comments || []).length === 0 && (
                      <div className="text-sm text-muted-foreground">Aucun commentaire</div>
                    )}
                    {(selectedTask.comments || []).map((comment) => (
                      <div key={comment.id} className="rounded-lg border px-3 py-2 text-sm">
                        <div className="font-medium">{comment.user?.name || "Utilisateur"}</div>
                        <div className="text-muted-foreground">{comment.content}</div>
                      </div>
                    ))}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="commentText">Ajouter un commentaire</Label>
                    <textarea
                      id="commentText"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="border-input min-h-[90px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                      placeholder="Votre message"
                    />
                    <Button
                      type="button"
                      onClick={handleAddComment}
                      disabled={loading}
                      className="bg-orange-500 text-white hover:bg-orange-600"
                    >
                      <MessageCircle className="h-5 w-5" />
                      Envoyer
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button variant="secondary" onClick={() => setShowDetails(false)}>
                    Fermer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </ManagerPage>
  );
}
