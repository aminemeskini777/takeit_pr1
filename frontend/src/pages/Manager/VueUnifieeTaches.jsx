// 2. VueUnifieeTaches.jsx (au lieu de ManagerTasks.jsx)
import ManagerPage from "./ManagerPage";

export default function VueUnifieeTaches() {
  return (
    <ManagerPage title="Vue unifiée des tâches">
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Toutes les tâches (JIRA + Internes)</h2>
        <p className="text-slate-500">Contenu à venir...</p>
      </div>
    </ManagerPage>
  );
}