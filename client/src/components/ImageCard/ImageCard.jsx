import axios from "axios";
import s3 from "../../configs/aws-s3-config";
import { toast } from "react-toastify";
import styles from "./ImageCard.module.css";

function ImageCard({
  image,
  setUploadedImages,
  setShowForm,
  setEditImageName,
  setEditImageId,
}) {
  const deleteImageHandler = async (e) => {
    e.stopPropagation();
    try {
      const response = await axios.get("https://imagesstore-backend-api.onrender.com/api/user/deleteImage", {
        params: {
          imageId: image._id,
          albumId: image.album,
        },
      });

      const deleteParams = {
        Bucket: "asset-manager-ap",
        Key: image.Key,
      };

      await s3.deleteObject(deleteParams).promise();

      setUploadedImages((prevState) =>
        prevState.filter((img) => img.Key != image.Key)
      );

      toast.success("Image Deleted Successfully");
      setShowForm(false);
    } catch (error) {
      console.log(error);
    }
  };

  const clickedOnEditButton = () => {
    setShowForm(true);
    setEditImageName(image.imageName);
    setEditImageId(image._id);
  };

  return (
    <>
      <div className={styles.card__outer}>
        <div className={styles.card__inner}>
          <div className={styles.card__image}>
            <img src={image.Location} alt="image" />
          </div>
          <div className={styles.image__desc}>
            <p>{image.imageName}</p>
          </div>
          <div className={styles.action__div}>
            <div onClick={deleteImageHandler} className={styles.delete__btn}>
              <i className="fa-solid fa-trash"></i>
            </div>
            <div onClick={clickedOnEditButton} className={styles.update__btn}>
              <i className="fa-solid fa-pen"></i>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ImageCard;
