import React from "react";
import styles from "./Home.module.css";

function Home() {

  return (
    <div className={styles.home}>
      <div className={styles.left}>
        <h2>Welcome to AssetManager</h2>
        <p>
          AssetManager is a powerful web application that allows you to easily
          upload and manage your images on Amazon S3. With AssetManager, you can
          organize and retrieve your assets efficiently, making it a breeze to
          showcase your content.
        </p>
        <p>
          Whether you're a photographer, a designer, or a content creator,
          AssetManager provides a seamless experience to help you streamline
          your asset management process.
        </p>
      </div>
      <div className={styles.right}>
        <img
          src="https://images.unsplash.com/photo-1685950871149-b2cee6808f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHx8&auto=format&fit=crop&w=600&q=60"
          alt="Example"
        />
      </div>
    </div>
  );
}

export default Home;
