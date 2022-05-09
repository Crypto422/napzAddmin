import axios from 'axios'
import { UserModel } from '../models/UserModel'

const API_URL =process.env.REACT_APP_API_URL ;
// Server should return AuthModel
export function login(props: any) {
  return axios.post(`${API_URL}/login`, {...props})
}

// Server should return AuthModel
export function register(props: any) {
  return axios.post(`${API_URL}/register`, { ...props })
}


export function getUsers() {
  return axios.get<UserModel[]>(`${API_URL}/users`)
}

export function getUserByToken(token: string) {
  return axios.post<UserModel>(`${API_URL}/verify_token`)
}
export function getTokenByRefreshToken(token: string) {
  return axios.post(`${API_URL}/refresh_token/${token}`)
}

export function getUserById(id: number) {
  return axios.get<UserModel>(`${API_URL}/users/${id}`)
}

export function getUserByEmail(email: string) {
  return axios.get<UserModel>(`${API_URL}/users/email/${email}`)
}

export function getUserByUsername(username: string) {
  return axios.get<UserModel>(`${API_URL}/users/username/${username}`)
}

export function updateGoogleUser(props: any, uid: number) {
  return axios.put<UserModel>(`${API_URL}/users/google/${uid}`, {...props})
}

