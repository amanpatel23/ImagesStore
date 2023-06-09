import React, { useEffect } from "react";
import { useValue } from "../../contexts/userContext";
import Dashboard from "./Dashboard";
import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

function ProtectedDashboard() {
  const navigate = useNavigate();
  const { user } = useValue();

  useEffect(() => {
    if (!localStorage.getItem("userInfo")) {
      navigate('/signin');
    }
  }, [navigate]);

  return (user && <Dashboard />);
}

export default ProtectedDashboard;
