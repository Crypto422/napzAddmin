import {Action} from '@reduxjs/toolkit'
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {put, takeLatest, select} from 'redux-saga/effects'
import {UserModel} from '../models/UserModel'
import {getUserByToken, getUsers} from "./AuthCRUD";

export interface ActionWithPayload<T> extends Action {
  payload?: T
}

export const actionTypes = {
  Login: '[Login] Action',
  Logout: '[Logout] Action',
  Register: '[Register] Action',
  UserRequested: '[Request User] Action',
  UserLoaded: '[Load User] Auth API',
  SetUser: '[Set User] Action',
  SetUsersData: '[Set UsersData] Action',
  ResetToken: '[Reset Token] Action',
}

const initialAuthState: IAuthState = {
  user: undefined,
  usersData: undefined,
  accessToken: undefined,
  refreshToken: undefined
}

export interface IAuthState {
  user?: UserModel
  usersData?: UserModel[]
  accessToken?: string
  refreshToken?: string
}

export const reducer = persistReducer(
  {storage, key: 'v100-demo1-auth', whitelist: ['user', 'usersData','accessToken', 'refreshToken']},
  (state: IAuthState = initialAuthState, action: ActionWithPayload<IAuthState>) => {
    switch (action.type) {
      case actionTypes.Login: {
        const accessToken = action.payload?.accessToken
        const refreshToken = action.payload?.refreshToken
        return {accessToken, refreshToken,user: undefined}
      }

      case actionTypes.Register: {
        const accessToken = action.payload?.accessToken
        const refreshToken = action.payload?.refreshToken
        return {accessToken,refreshToken, user: undefined}
      }

      case actionTypes.ResetToken: {
        const accessToken = action.payload?.accessToken
        return {...state,accessToken}
      }

      case actionTypes.Logout: {
        return initialAuthState
      }

      case actionTypes.UserLoaded: {
        const user = action.payload?.user
        return {...state, user}
      }

      case actionTypes.SetUser: {
        const user = action.payload?.user
        return {...state, user}
      }

      case actionTypes.SetUsersData: {
        const usersData = action.payload?.usersData
        return { ...state, usersData }
      }

      default:
        return state
    }
  }
)

export const actions = {
  login: (accessToken: string, refreshToken: string) => ({type: actionTypes.Login, payload: {accessToken, refreshToken}}),
  register: (accessToken: string, refreshToken: string) => ({
    type: actionTypes.Register,
    payload: {accessToken, refreshToken},
  }),
  resetToken: (accessToken: string, refreshToken: string) => ({
    type: actionTypes.ResetToken,
    payload: {accessToken, refreshToken},
  }),
  logout: () => ({type: actionTypes.Logout}),
  requestUser: () => ({
    type: actionTypes.UserRequested,
  }),
  fulfillUser: (user: UserModel) => ({type: actionTypes.UserLoaded, payload: {user}}),
  setUser: (user: UserModel) => ({type: actionTypes.SetUser, payload: {user}}),
  setUsersData: (usersData: UserModel[]) => ({ type: actionTypes.SetUsersData, payload: { usersData } }),
  store: () => ({type: "def"}),
}

export function* saga() {
  yield takeLatest(actionTypes.Login, function* loginSaga() {
    yield put(actions.requestUser())
  })

  yield takeLatest(actionTypes.Register, function* registerSaga() {
    yield put(actions.requestUser())
  })

  yield takeLatest(actionTypes.UserRequested, function* userRequested() {
    // @ts-ignore
    const getToken = (state) => state.auth.accessToken;
    // @ts-ignore
    let token = yield select(getToken)
    const {data: user} = yield getUserByToken(token)
    if (user.banned === 'true'){
      yield put(actions.logout())
    } else {
      yield put(actions.fulfillUser(user))
      const { data: users } = yield getUsers()
      yield put(actions.setUsersData(users))
    }
  })
}
