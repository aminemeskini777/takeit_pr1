
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isReady, setIsReady] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsReady(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const normalizeRole = (value) => {
    if (!value) return "";
    const role = String(value).trim().toLowerCase();
    if (role.includes("manager")) return "manager";
    if (role.includes("employee")) return "employee";
    return role;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      const normalizedRole = normalizeRole(user?.role);

      if (normalizedRole === "manager") {
        navigate("/manager/dashboard");
      } else {
        navigate("/employee/dashboard");
      }
    } catch (error) {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="relative min-h-screen flex overflow-hidden bg-white">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-orange-300/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-red-300/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(251,146,60,0.12),transparent_45%),radial-gradient(circle_at_85%_90%,rgba(239,68,68,0.10),transparent_40%)]" />
      
      <div className="relative z-10 hidden md:flex w-1/2 items-center justify-end pr-10">
        <div
          className={`w-[500px] h-[440px] max-w-full overflow-hidden rounded-2xl border border-orange-100 shadow-xl shadow-orange-100/40 transition-all duration-500 ease-out ${
            isReady ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
          <img
            src="/images/2.png"
            alt="Login Visual"
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 hidden -translate-x-1/2 md:flex items-center">
        <div className="relative h-[72%] w-[130px]">
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-orange-400/90 to-transparent" />
          <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-400/20 blur-3xl animate-loginPulse" />
          <div className="absolute left-1/2 top-[16%] h-5 w-5 -translate-x-1/2 rounded-full bg-orange-500 shadow-[0_0_32px_rgba(249,115,22,0.9)] animate-orbDown" />
          <div className="absolute left-1/2 bottom-[18%] h-4 w-4 -translate-x-1/2 rounded-full bg-red-500 shadow-[0_0_24px_rgba(239,68,68,0.8)] animate-orbUp" />
        </div>
      </div>

      
      <div className="relative z-10 flex w-full md:w-1/2 items-center justify-start bg-white/70 px-6 backdrop-blur-[1px]">
        <div
          className={`w-full max-w-md space-y-8 rounded-2xl border border-white/40 bg-white/70 p-8 shadow-xl shadow-orange-100/40 transition-all duration-500 ease-out delay-100 ${
            isReady ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          }`}
        >
         
          <div className="flex justify-start">
            <img
              src="/images/1.jpg"
              alt="Company Logo"
              className="h-20 w-[180px] object-contain"
            />
          </div>

         
          <div className="space-y-2">
            <span className="inline-flex items-center rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-orange-700">
              ESPACE RH
            </span>
            <h5 className="text-3xl font-black leading-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-500 to-orange-700">
              S'authentifier
            </h5>
            <p className="text-sm text-slate-500">Connectez-vous pour acceder a votre espace.</p>
          </div>

         
          <form onSubmit={handleLogin} className="space-y-6" autoComplete="off">
            <div className="space-y-2">
              <Label>Adresse email</Label>
              <Input
                type="email"
                placeholder="user@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Mot de passe</Label>
              <Input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-lg transition-all duration-150 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]"
            >
              Se Connecter
            </Button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes loginPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.95; }
        }
        @keyframes orbDown {
          0% { transform: translate(-50%, -10px); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translate(-50%, 360px); opacity: 0; }
        }
        @keyframes orbUp {
          0% { transform: translate(-50%, 10px); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translate(-50%, -360px); opacity: 0; }
        }
        .animate-loginPulse {
          animation: loginPulse 3.4s ease-in-out infinite;
        }
        .animate-orbDown {
          animation: orbDown 4.2s linear infinite;
        }
        .animate-orbUp {
          animation: orbUp 4.8s linear infinite 0.6s;
        }
      `}</style>
    </div>
  );
}

export default Login;
