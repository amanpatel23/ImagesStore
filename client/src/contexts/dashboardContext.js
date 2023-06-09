import { createContext, useContext, useEffect, useState } from "react";
// import { useValue as userContextValue } from "./userContext";
// import axios from "axios";

const DashboardContext = createContext();
function useValue() {
  const value = useContext(DashboardContext);
  return value;
}

function DashboardProvider({ children }) {
  const [albums, setAlbums] = useState([]);
  const [currAlbum, setCurrAlbum] = useState(null);
  const [albumImages, setAlbumImages] = useState([]);

  useEffect(() => {
    console.log('dContext');
    const recentOpenedAlbum = localStorage.getItem('currAlbum');
    if (recentOpenedAlbum) {
      setCurrAlbum(JSON.parse(recentOpenedAlbum));
    }
  }, [])

  return (
    <DashboardContext.Provider
      value={{
        albums,
        setAlbums,
        currAlbum,
        setCurrAlbum,
        albumImages,
        setAlbumImages,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export { useValue };
export default DashboardProvider;
