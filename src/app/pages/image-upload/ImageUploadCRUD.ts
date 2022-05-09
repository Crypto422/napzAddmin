import axios from 'axios'
import { ImageDataModel } from './models/ImageDataMode'

const API_URL =process.env.REACT_APP_API_URL ;

// Server should return ImageDataModel
export function createImageData(props: any) {
    return axios.post<ImageDataModel>(`${API_URL}/imageDatas`,{...props})
}

// Server should return ImageDataModels
export function getImageDatas() {
    return axios.get(`${API_URL}/imageDatas`)
}

// Server should return ImageDataModel
export function getImageData(id: number){
    return axios.get<ImageDataModel>(`${API_URL}/imageDatas/${id}`)
}

export function getImageDatasBYUid(uid: number){
    return axios.get<ImageDataModel[]>(`${API_URL}/imageDatas/uid/${uid}`)
}

// Server should return ImageDataModel
export function updateImageData(id: number, props: any){
    return axios.put<ImageDataModel>(`${API_URL}/imageDatas/${id}`,{...props})
}

export function deleteImageData(id: number){
    return axios.delete(`${API_URL}/imageDatas/${id}`)
}

