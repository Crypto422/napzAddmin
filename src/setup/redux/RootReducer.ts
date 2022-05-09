import {all} from 'redux-saga/effects'
import {combineReducers} from 'redux'

import * as auth from '../../app/pages/auth'
import * as support from '../../app/pages/support'

export const rootReducer = combineReducers({
  auth: auth.reducer,
  support: support.reducer,
})

export type RootState = ReturnType<typeof rootReducer>

export function* rootSaga() {
  yield all([auth.saga(),support.saga()])
}
