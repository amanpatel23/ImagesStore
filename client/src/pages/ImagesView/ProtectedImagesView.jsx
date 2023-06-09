import React, { useEffect } from "react";
import { useValue } from "../../contexts/userContext";
import ImagesView from './ImagesView';
import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

function ProtectedImagesView() {
  const navigate = useNavigate();
  const { user } = useValue();

  useEffect(() => {
    if (!localStorage.getItem("userInfo")) {
      navigate('/signin');
    }
  }, [navigate]);

  return (user && <ImagesView />);
}

export default ProtectedImagesView;
