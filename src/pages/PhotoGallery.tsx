import { useState } from 'react'
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonActionSheet
} from '@ionic/react'
import { camera, trash, close } from 'ionicons/icons'
import './PhotoGallery.css'
import { usePhotoGallery, UserPhoto } from '../hooks/usePhotoGallery'

const styles = {
  row: {
    gap: '15px'
  },
  col: {
    alignItems: 'center',
    display: 'flex',
    height: '250px',
    position: 'relative',
    borderRadius: '15px',
    overflow: 'hidden',
    padding: 0,
    boxShadow: '0px 0px 6px 0px rgba(0,0,0,0.75)'
  },
  iconTrash: {
    color: 'white',
    fontSize: '5rem',
    position: 'absolute',
    cursor: 'pointer',
    opacity: 0,
    width: '100%',
    transition: 'all 0.3s ease-in-out'
  },
  img: {
    position: 'absolute',
    width: '100%',
    objectFit: 'contain',
    cursor: 'pointer',
    transition: 'all 0.3s ease-in-out'
  },
  grid: {
    paddingBottom: '6rem',
    marginTop: '1rem'
  }
}

const Tab2: React.FC = () => {
  const [photoToDelete, setPhotoToDelete] = useState<UserPhoto>()
  const [showIconTrash, setShowIconTrash] = useState(false)
  const { photos, takePhoto, deletePhoto } = usePhotoGallery()

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Photo Gallery</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid style={styles.grid}>
          <IonRow style={styles.row}>
            {photos.map((photo, index) => (
              <IonCol style={styles.col} size='12' size-md='3' key={index}>
                <IonImg
                  onMouseEnter={() => setShowIconTrash(true)}
                  onMouseLeave={() => setShowIconTrash(false)}
                  style={{
                    ...styles.img,
                    opacity: showIconTrash ? '0.5' : '1'
                  }}
                  src={photo.webviewPath}
                  onClick={() => setPhotoToDelete(photo)}
                />
                <IonIcon
                  onMouseEnter={() => setShowIconTrash(true)}
                  onMouseLeave={() => setShowIconTrash(false)}
                  style={{
                    ...styles.iconTrash,
                    color: 'red',
                    opacity: showIconTrash ? '1' : '0'
                  }}
                  icon={trash}
                  onClick={() => setPhotoToDelete(photo)}
                />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
        <IonFab vertical='bottom' horizontal='end' slot='fixed'>
          <IonFabButton onClick={() => takePhoto()}>
            <IonIcon icon={camera} />
          </IonFabButton>
        </IonFab>
      </IonContent>
      <IonActionSheet
        isOpen={!!photoToDelete}
        buttons={[
          {
            text: 'Delete',
            role: 'destructive',
            icon: trash,
            handler: () => {
              if (photoToDelete) {
                deletePhoto(photoToDelete)
                setPhotoToDelete(undefined)
              }
            }
          },
          {
            text: 'Cancel',
            icon: close,
            role: 'cancel'
          }
        ]}
        onDidDismiss={() => setPhotoToDelete(undefined)}
      />
    </IonPage>
  )
}

export default Tab2
