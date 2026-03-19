import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Award,
  ClipboardList,
  Building2,
  Medal,
  PlusCircle,
  TrendingUp,
  UserCog,
} from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import api from "../../api/axios";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: "top" },
    title: { display: false },
  },
  scales: {
    y: { beginAtZero: true, ticks: { precision: 0 } },
  },
};

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [topEmployees, setTopEmployees] = useState([]);
  const [evolutionData, setEvolutionData] = useState({ labels: [], datasets: [] });

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true);
        setError("");

        const [statsRes, employeesRes, evolutionRes] = await Promise.all([
          api.get("/dashboard/stats"),
          api.get("/dashboard/top-employees"),
          api.get("/dashboard/evolution"),
        ]);

        setStats([
          {
            title: "Total tickets",
            value: statsRes.data.tickets,
            subtitle: "Tous les tickets",
            icon: ClipboardList,
            color: "bg-blue-100 text-blue-600",
          },
          {
            title: "Tickets JIRA",
            value: statsRes.data.jira,
            subtitle: "Source JIRA",
            icon: TrendingUp,
            color: "bg-purple-100 text-purple-600",
          },
          {
            title: "Tickets internes",
            value: statsRes.data.internal,
            subtitle: "Source interne",
            icon: Building2,
            color: "bg-orange-100 text-orange-600",
          },
          {
            title: "Tickets termines",
            value: statsRes.data.done,
            subtitle: "Statut done",
            icon: Award,
            color: "bg-green-100 text-green-600",
          },
        ]);

        setTopEmployees(employeesRes.data || []);

        const evolution = evolutionRes.data || [];
        setEvolutionData({
          labels: evolution.map((item) => item.month),
          datasets: [
            {
              label: "Taches terminees",
              data: evolution.map((item) => item.tasksDone),
              fill: false,
              borderColor: "rgba(34,197,94,0.85)",
              backgroundColor: "rgb(34,197,94)",
              tension: 0.35,
            },
          ],
        });
      } catch (err) {
        console.error(err);
        const status = err?.response?.status;
        if (status === 401) {
          setError("Session expiree. Veuillez vous reconnecter.");
        } else if (status === 403) {
          setError("Acces refuse. Ce tableau de bord est reserve aux managers.");
        } else {
          setError("Impossible de charger les donnees. Veuillez reessayer.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, []);

  async function handleEmployeeClick(employee) {
    try {
      setDetailLoading(true);
      setModalOpen(true);
      const res = await api.get(`/dashboard/employees/${employee.id}`);
      setSelectedEmployee(res.data);
    } catch (err) {
      console.error(err);
      setSelectedEmployee({
        name: employee.name,
        tasks: employee.tasks,
        badges: [],
        progress: "0%",
        history: [],
      });
    } finally {
      setDetailLoading(false);
    }
  }

  function closeModal() {
    setModalOpen(false);
    setSelectedEmployee(null);
  }

  return (
    <div className="flex">
      <Sidebar role="manager" />

      <div className="flex-1 min-h-screen bg-slate-50">
        <Navbar title="Manager Dashboard" />

        <div className="space-y-7 p-6 md:p-8">
          <div className="flex justify-end gap-2">
            <Button className="h-8 rounded-md bg-orange-600 px-2 text-xs hover:bg-orange-700" onClick={() => navigate("/manager/tasks/create")}>
              <PlusCircle className="mr-1 size-3.5" />
              Tache
            </Button>
            <Button className="h-8 rounded-md bg-red-600 px-2 text-xs hover:bg-red-700" onClick={() => navigate("/manager/badges")}>
              <Medal className="mr-1 size-3.5" />
              Badges
            </Button>
            <Button className="h-8 rounded-md bg-orange-700 px-2 text-xs hover:bg-orange-800" onClick={() => navigate("/manager/users")}>
              <UserCog className="mr-1 size-3.5" />
              Employes
            </Button>
          </div>

          {loading && <div className="text-center text-slate-500">Chargement des donnees...</div>}
          {error && <div className="text-center text-red-600">{error}</div>}

          {!loading && stats.length > 0 && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card
                    key={index}
                    className="rounded-2xl border-slate-200/80 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <CardContent className="flex items-start justify-between p-5">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                        <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                        <p className="text-xs text-slate-500">{stat.subtitle}</p>
                      </div>
                      <div className={`rounded-xl p-3 ${stat.color}`}>
                        <Icon size={20} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {!loading && (
            <Card className="rounded-2xl border-slate-200/80 shadow-sm">
              <CardHeader>
                <CardTitle>Evolution mensuelle des taches</CardTitle>
                <CardDescription>Nombre de taches terminees par mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <Line data={evolutionData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          )}

          {!loading && (
            <Card className="rounded-2xl border-slate-200/80 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle>Top Contributeurs</CardTitle>
                <CardDescription>Employes avec le plus de taches cloturees</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {topEmployees.length === 0 ? (
                  <div className="text-center text-slate-500 py-4">Aucune activite enregistree.</div>
                ) : (
                  topEmployees.map((emp) => (
                    <div
                      key={emp.id}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 cursor-pointer hover:bg-slate-50"
                      onClick={() => handleEmployeeClick(emp)}
                    >
                      <span className="font-medium text-slate-800">{emp.name}</span>
                      <span className="text-sm text-slate-500">{emp.tasks} taches cloturees</span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-20">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            {detailLoading ? (
              <p className="text-slate-600">Chargement du detail employe...</p>
            ) : (
              <>
                <h2 className="text-xl font-bold text-slate-900">{selectedEmployee?.name || "Employe"}</h2>
                <div className="mt-4 space-y-2 text-sm text-slate-700">
                  <p>
                    <strong>Taches terminees:</strong> {selectedEmployee?.tasks ?? 0}
                  </p>
                  <p>
                    <strong>Badges:</strong>{" "}
                    {selectedEmployee?.badges?.length ? selectedEmployee.badges.join(", ") : "Aucun"}
                  </p>
                  <p>
                    <strong>Progression:</strong> {selectedEmployee?.progress || "0%"}
                  </p>
                </div>

                <div className="mt-5">
                  <h3 className="mb-2 text-sm font-semibold text-slate-800">Historique recent</h3>
                  <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                    {selectedEmployee?.history?.length ? (
                      selectedEmployee.history.map((item) => (
                        <div key={item.id} className="rounded-lg border border-slate-200 p-3 text-sm">
                          <p className="font-medium text-slate-800">{item.title}</p>
                          <p className="text-slate-500">
                            {item.status} - {item.source} - {item.createdAt}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">Aucun historique disponible.</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button onClick={closeModal}>Fermer</Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
