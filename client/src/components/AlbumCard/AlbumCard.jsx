import React from 'react';
import styles from './AlbumCard.module.css';

function AlbumCard({ albumId, albumName, clickOnCard }) {
  return (
    <div onClick={clickOnCard} className={styles.albumCard}>
      <div className={styles.albumIcon}>
        <img src="https://cdn-icons-png.flaticon.com/128/1379/1379905.png" alt="Folder Icon" />
      </div>
      <div className={styles.albumName}>{albumName}</div>
    </div>
  );
}

export default AlbumCard;