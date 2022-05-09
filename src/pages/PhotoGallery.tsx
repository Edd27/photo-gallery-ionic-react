import {useState} from 'react'
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonFab, IonFabButton, IonIcon, IonGrid, IonRow, IonCol, IonImg, IonActionSheet } from '@ionic/react';
import { camera, trash, close } from 'ionicons/icons';
import './PhotoGallery.css';
import { usePhotoGallery, UserPhoto } from '../hooks/usePhotoGallery';

const Tab2: React.FC = () => {
  const [photoToDelete, setPhotoToDelete] = useState<UserPhoto>()
  const { photos, takePhoto, deletePhoto } = usePhotoGallery()

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Photo Gallery</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            {photos.map((photo, index) => (
              <IonCol size="6" key={index}>
                <IonImg className='image' src={photo.webviewPath} onClick={() => setPhotoToDelete(photo)}/>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
        <IonFab vertical='bottom' horizontal='center' slot='fixed'>
          <IonFabButton onClick={() => takePhoto()}>
            <IonIcon icon={camera}/>
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
                deletePhoto(photoToDelete);
                setPhotoToDelete(undefined);
              }
            },
          },
          {
            text: 'Cancel',
            icon: close,
            role: 'cancel',
          },
        ]}
        onDidDismiss={() => setPhotoToDelete(undefined)}
      />
    </IonPage>
  );
};

export default Tab2;
