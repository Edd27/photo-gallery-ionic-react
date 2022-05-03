import {useState, useEffect} from 'react'
import {isPlatform} from '@ionic/react'
import {Camera, CameraResultType, CameraSource, Photo} from '@capacitor/camera'
import {Filesystem, Directory} from '@capacitor/filesystem'
import {Storage} from '@capacitor/storage'
import {Capacitor} from '@capacitor/core'

export interface UserPhoto {
  filepath: string,
  webviewPath?: string
}

const PHOTO_STORAGE = 'photos'

export const usePhotoGallery = () => {
  const [photos, setPhotos] = useState<UserPhoto[]>([])

  const savePicture = async (photo: Photo, filepath: string) : Promise<UserPhoto> => {
    let base64Data: string

    if (isPlatform('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path!,
      });
      base64Data = file.data;
    } else {
      base64Data = await base64FromPath(photo.webPath!);
    }

    const savedFile = await Filesystem.writeFile({
      path: filepath,
      data: base64Data,
      directory: Directory.Data
    })

    if (isPlatform('hybrid')) {
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    } else {
      return {
        filepath,
        webviewPath: photo.webPath,
      };
    }
  }

  useEffect(() => {
    const loadSaved = async () => {
      const {value} = await Storage.get({key: PHOTO_STORAGE})

      const photosInStorage = (value ? JSON.parse(value) : []) as UserPhoto[]

      if(!isPlatform('hybrid')) {
        for(let photo of photosInStorage){
          const file = await Filesystem.readFile({
            path: photo.filepath,
            directory: Directory.Data
          })
  
          photo.webviewPath = `data:image/jpeg;base64,${file.data}`
        }
      }
      
      setPhotos(photosInStorage)
    }

    loadSaved()
  } , [])


  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    })
    
    const filepath = new Date().getTime() + '.jpeg'
    const savedImage = await savePicture(photo, filepath)
    setPhotos([savedImage, ...photos]);
    Storage.set({key: PHOTO_STORAGE, value: JSON.stringify(photos)})
  }

  return {
    photos,
    takePhoto
  }
}

export const base64FromPath = async (path: string) : Promise<string> => {
  const res = await fetch(path)
  const blob = await res.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      if(typeof reader.result === 'string') {
        resolve(reader.result)
      }else{
        reject('Could not convert to base64')
      }
    }

    reader.readAsDataURL(blob)
  })
}