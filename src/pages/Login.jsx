import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();

    const success = login(email, password);

    if (success) {
      navigate("/dashboard");
    } else {
      alert("Invalid Credentials!");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#454040]">
      <form
        onSubmit={handleLogin}
        className="bg-[#605B51] p-10 rounded-2xl shadow-2xl w-full max-w-md border border-[#D8D365]/20"
      >
        <h2 className="text-3xl font-bold mb-8 text-[#E6F082] text-center tracking-tight">
          Member Login
        </h2>

        <div className="mb-5">
          <label className="block text-sm font-medium mb-2 text-[#D8D365]">
            Email Address
          </label>
          <input
            type="email"
            className="w-full p-4 rounded-lg bg-[#454040] text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-[#E6F082] transition-all"
            placeholder="mmohid069@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium mb-2 text-[#D8D365]">
            Password
          </label>
          <input
            type="password"
            className="w-full p-4 rounded-lg bg-[#454040] text-white border border-transparent focus:outline-none focus:ring-2 focus:ring-[#E6F082] transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#E6F082] hover:bg-[#D8D365] hover:cursor-pointer text-[#454040] font-black py-4 rounded-xl transition-all shadow-lg active:scale-95"
        >
          LOG IN
        </button>
      </form>
    </div>
  );
};

export default Login;
