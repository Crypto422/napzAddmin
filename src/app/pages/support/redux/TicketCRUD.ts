import axios from 'axios'
import { TicketDataModel } from '../components/models/TicketModel';

const API_URL =process.env.REACT_APP_API_URL ;

export function getTickets() {
  return axios.get<TicketDataModel[]>(`${API_URL}/ticketDatas`)
}

export function createTicket(props: any) {
  return axios.post(`${API_URL}/ticketDatas`, {...props})
}

export function getTicketById(id: number) {
  return axios.get<TicketDataModel>(`${API_URL}/ticketDatas/${id}`)
}

// Server should return ProjectDataModel
export function updateTicketData(id: number, props: any){
    return axios.put<TicketDataModel>(`${API_URL}/ticketDatas/${id}`,{...props})
}

export function deleteTicketData(id: number){
    return axios.delete(`${API_URL}/ticketDatas/${id}`)
}


