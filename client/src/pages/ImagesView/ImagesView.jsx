import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import s3 from "../../configs/aws-s3-config";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./ImagesView.module.css";
import ImageCard from "../../components/ImageCard/ImageCard";

function ImagesView() {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [currAlbum, setCurrAlbum] = useState(null);
  const [uploadingImages, setUploadingImages] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editImageName, setEditImageName] = useState("");
  const [editImageId, setEditImageId] = useState(null);

  useEffect(() => {
    setCurrAlbum(JSON.parse(localStorage.getItem("currAlbum")));
  }, []);

  useEffect(() => {
    if (currAlbum) {
      const getImages = async () => {
        try {
          const response = await axios.get("https://imagesstore-backend-api.onrender.com/api/user/getImages", {
            params: {
              albumId: currAlbum.albumId,
            },
          });

          const images = response.data.images;
          setUploadedImages(images);
        } catch (error) {
          console.log(error);
        }
      };

      getImages();
    }
  }, [currAlbum]);

  const editImageNameHandler = async (e) => {

    e.preventDefault();
    try {
      const response = await axios.post("https://imagesstore-backend-api.onrender.com/api/user/updateImageName", {
        editImageId,
        editImageName,
      });

      setUploadedImages((prevState) =>
        prevState.map((img) => {
          if (img._id === editImageId) {
            return { ...img, imageName: editImageName };
          } else {
            return img;
          }
        })
      );

      if (response.status === 200) {
        toast.success("Image Name Updated Successfully.");
      }

      setEditImageId(null);
      setEditImageName("");
      setShowForm(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDrop = async (acceptedFiles) => {
    const imageFiles = acceptedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    setUploadingImages(imageFiles);

    try {
      for (const file of imageFiles) {
        const Key =
          Date.now() + "-" + parseInt(Math.random() * 1e9) + "-" + file.name;
        const params = {
          Bucket: "asset-manager-ap",
          Key: Key,
          Body: file,
        };

        const s3_response = await s3.upload(params).promise();

        const imageData = {
          imageName: file.name,
          ETag: s3_response.ETag,
          Location: s3_response.Location,
          Key: s3_response.Key,
          album: currAlbum.albumId,
        };

        const response = await axios.post("https://imagesstore-backend-api.onrender.com/api/user/saveImages", {
          imageData,
          albumId: currAlbum.albumId,
        });

        if (response.status === 200) {
          setUploadedImages((prevState) => [response.data.image, ...prevState]);
          setUploadingImages((prevState) => prevState.slice(1));
          toast.success("Image Uploaded Successfully.");
        }
      }
    } catch (error) {
      toast.error("Error Occured.");
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: "image/*",
  });

  return (
    <div className={styles.albumImages}>
      <div className={styles.dropzone} {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the images here</p>
        ) : (
          <p>Drag and drop your images here</p>
        )}
      </div>
      {uploadingImages.length > 0 && (
        <div className={styles.uploadingImages}>
          <h3>Currently Uploading Images...</h3>
          {uploadingImages.map((image, index) => (
            <span key={index}>{image.name}</span>
          ))}
        </div>
      )}
      <div className={styles.previewSection}>
        <h2 className={styles.albumName}>{currAlbum && currAlbum.albumName}</h2>
        {showForm && (
          <form onSubmit={editImageNameHandler} className={styles.albumForm}>
            <input
              type="text"
              placeholder="Image Name"
              value={editImageName}
              onChange={(e) => setEditImageName(e.target.value)}
              required
            />
            <button type="submit">Update Name</button>
          </form>
        )}
        <div className={styles.images__container}>
          {uploadedImages.map((image, index) => (
            <ImageCard
              key={index}
              image={image}
              setUploadedImages={setUploadedImages}
              setShowForm={setShowForm}
              setEditImageName={setEditImageName}
              setEditImageId={setEditImageId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ImagesView;
