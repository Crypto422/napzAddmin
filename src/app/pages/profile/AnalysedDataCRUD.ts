import axios from 'axios'
import { AnalysedDataModel } from './components/models/AnalysedDataModel'

const API_URL =process.env.REACT_APP_API_URL ;

// Server should return AnalysedDataModel
export function createAnalysedData(props: any) {
    return axios.post<AnalysedDataModel>(`${API_URL}/analysedDatas`,{...props})
}

// Server should return AnalysedDataModels
export function getAnalysedDatas() {
    return axios.get(`${API_URL}/analysedDatas`)
}

// Server should return AnalysedDataModel
export function getAnalysedData(id: number){
    return axios.get<AnalysedDataModel>(`${API_URL}/analysedDatas/${id}`)
}

export function getAnalysedDatasByImageId(mid: number){
    return axios.get<AnalysedDataModel>(`${API_URL}/analysedDatas/mid/${mid}`)
}

export function getAnalysedDatasByImageIds(ids: string){
    return axios.get<AnalysedDataModel[]>(`${API_URL}/analysedDatas/ids/${ids}`)
}

// Server should return AnalysedDataModel
export function updateAnalysedData(id: number, props: any){
    return axios.put<AnalysedDataModel>(`${API_URL}/analysedDatas/${id}`,{...props})
}

export function deleteAnalysedData(id: number){
    return axios.delete(`${API_URL}/analysedDatas/${id}`)
}

