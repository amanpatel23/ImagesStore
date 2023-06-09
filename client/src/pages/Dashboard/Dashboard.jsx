import React, { useEffect, useState } from "react";
import AlbumCard from "../../components/AlbumCard/AlbumCard";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useValue as userContextValue } from "../../contexts/userContext";
import styles from "./Dashboard.module.css";

function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const [albumName, setAlbumName] = useState("");
  const [albums, setAlbums] = useState([]);

  const { user, logOutHandler } = userContextValue();

  const navigate = useNavigate();

  const handleToggleForm = () => {
    setShowForm(!showForm);
  };

  const handleAlbumNameChange = (e) => {
    setAlbumName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "/api/user/addalbum",
        { albumName },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.status === 200) {
        setAlbums((prevAlbums) => [response.data.album, ...prevAlbums]);
        toast.success("New Album Added To Your Dashboard");
      }
    } catch (error) {
      logOutHandler();
      toast.error("Your Session Expired. SignIn Again");
      navigate("/signin");
    }

    setAlbumName("");
  };

  const clickOnCardHandler = (clickedAlbum) => {
    localStorage.setItem("currAlbum", JSON.stringify(clickedAlbum));
    navigate("/showImages");
  };

  useEffect(() => {
    const getAlbums = async () => {
      try {
        const response = await axios.get("/api/user/albums", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const albumsArray = response.data.albums;
        setAlbums(albumsArray);
      } catch (error) {
        logOutHandler();
        toast.error("Session Expired. SignIn Again");
        navigate("/signin");
      }
    };

    getAlbums();
  }, []);

  return (
    <>
      <div className={styles.dashboard}>
        <div className={styles.topSection}>
          <button className={styles.toggleButton} onClick={handleToggleForm}>
            {showForm ? "Hide Form" : "Add New Album"}
          </button>
          {showForm && (
            <form onSubmit={handleSubmit} className={styles.albumForm}>
              <input
                type="text"
                placeholder="Album Name"
                value={albumName}
                onChange={handleAlbumNameChange}
                required
              />
              <button type="submit">Create Album</button>
            </form>
          )}
        </div>
        <div className={styles.albumGrid}>
          {albums.map((album) => (
            <AlbumCard
              key={album.albumId}
              albumName={album.albumName}
              albumId={album.albumId}
              clickOnCard={() => clickOnCardHandler(album)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Dashboard;
