import React from "react";
import styles from "./ErrorPage.module.css";

function ErrorPage() {
  return (
    <div className={styles.errorPage}>
      <h1 className={styles.errorCode}>404</h1>
      <h2 className={styles.errorMessage}>Page Not Found</h2>
      <p className={styles.errorDescription}>
        Oops! The page you are looking for does not exist.
      </p>
    </div>
  );
}

export default ErrorPage;
