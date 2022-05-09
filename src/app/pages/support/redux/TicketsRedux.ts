import { Action } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { put, takeLatest, select } from 'redux-saga/effects'
import { UserModel } from '../../auth/models/UserModel'
import { getUserById } from '../../auth/redux/AuthCRUD'
import { TicketDataModel } from '../components/models/TicketModel'

export interface ActionWithPayload<T> extends Action {
  payload?: T
}

export const actionTypes = {
  SetTickets: '[Set Tickets] Action',
  SetTicketData: '[Set TicketData] Action',
  AddTicket: '[Add Ticket] Action',
  UpdateTicket: '[Update Ticket] Action',
  DeleteTicket: '[Delete Ticket] Action',
  SetTicketCreatorData: '[Set TicketCreatorData] Action',
}

const initialTicketsState: ITicketsState = {
  tickets: undefined,
  ticketData: undefined,
  ticketCreatorData: undefined,
}

export interface ITicketsState {
  tickets?: TicketDataModel[]
  ticketData?: TicketDataModel
  ticketCreatorData?: UserModel
}

export const reducer = persistReducer(
  { storage, key: 'v100-tickets', whitelist: ['tickets', 'ticketData', 'ticketCreatorData'] },
  (state: ITicketsState = initialTicketsState, action: ActionWithPayload<ITicketsState>) => {
    switch (action.type) {

      case actionTypes.SetTickets: {
        const tickets = action.payload?.tickets
        return { ...state, tickets }
      }

      case actionTypes.SetTicketData: {
        const ticketData = action.payload?.ticketData
        return { ...state, ticketData }
      }

      case actionTypes.SetTicketCreatorData: {
        const ticketCreatorData = action.payload?.ticketCreatorData
        return { ...state, ticketCreatorData }
      }

      default:
        return state
    }
  }
)

export const actions = {
  setTickets: (tickets: TicketDataModel[]) => ({ type: actionTypes.SetTickets, payload: { tickets } }),
  setTicketData: (ticketData: TicketDataModel) => ({ type: actionTypes.SetTicketData, payload: { ticketData } }),
  setTicketCreatorData: (ticketCreatorData: UserModel) => ({ type: actionTypes.SetTicketCreatorData, payload: { ticketCreatorData } }),
  store: () => ({ type: "def" }),
}

export function* saga() {
  yield takeLatest(actionTypes.SetTicketData, function* ticeketDataSeted() {
    // @ts-ignore
    const getTicketData = (state) => state.support.ticketData;
    // @ts-ignore
    let data = yield select(getTicketData)
    if (data !== undefined) {
      let { user_id } = data
      const { data: user } = yield getUserById(user_id)
      yield put(actions.setTicketCreatorData(user))
    }
  })
}
