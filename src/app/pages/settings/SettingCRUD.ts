import axios from 'axios'
import { UserModel } from '../auth/models/UserModel'

const API_URL =process.env.REACT_APP_API_URL ;

// Server should return AuthModel
export function updateUser(props: any, uid: number) {
  return axios.put<UserModel>(`${API_URL}/users/${uid}`, {...props})
}
