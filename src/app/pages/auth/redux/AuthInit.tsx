import { FC, useRef, useEffect, useState } from 'react'
import { shallowEqual, useSelector, connect, useDispatch, ConnectedProps } from 'react-redux'
import { LayoutSplashScreen } from '../../../../_metronic/layout/core'
import * as auth from './AuthRedux'
import { getUserById, getUserByToken } from './AuthCRUD'
import { RootState } from '../../../../setup'
import { useWebSocket } from '../../../../setup/context/WebSocketContext'
import { UserModel } from '../models/UserModel'
import { useHistory } from 'react-router-dom'
import { TicketDataModel } from '../../support/components/models/TicketModel'
import { getTicketById, getTickets } from '../../support/redux/TicketCRUD'
import * as support from '../../support/redux/TicketsRedux';

const mapState = (state: RootState) => ({ auth: state.auth })
const connector = connect(mapState, auth.actions)
type PropsFromRedux = ConnectedProps<typeof connector>

const AuthInit: FC<PropsFromRedux> = (props) => {
  const didRequest = useRef(false)
  const dispatch = useDispatch()
  const history = useHistory()
  const { connect } = useWebSocket();
  const [showSplashScreen, setShowSplashScreen] = useState(true)
  const accessToken: any = useSelector<RootState>(({ auth }) => auth.accessToken, shallowEqual)
  const user: UserModel = useSelector<RootState>(({ auth }) => auth.user, shallowEqual) as UserModel
  const ticketData: TicketDataModel = useSelector<RootState>(({ support }) => support.ticketData, shallowEqual) as TicketDataModel;
  const [currentMsg, setCurrentMsg] = useState<any>("");

  const handleCreateTicket = () => {
    if (user === undefined)
      return
    getTickets()
      .then((res) => {
        let { data } = res;
        let newTickets: any = [];
        data.forEach((doc) => {
          newTickets.push({ ...doc });
        });
        newTickets = newTickets.filter((ticket: any) => ticket.user_id === user?.id || ticket.status === 'public')
        dispatch(support.actions.setTickets(newTickets))
      })
      .catch((err) => {
      })
  }

  const handleUpdateTicketData = (id: any) => {
    if (ticketData === undefined || user === undefined)
      return
    getTickets()
      .then((res) => {
        let { data } = res;
        let newTickets: any = [];
        data.forEach((doc) => {
          newTickets.push({ ...doc });
        });
        newTickets = newTickets.filter((ticket: any) => ticket.user_id === user?.id || ticket.status === 'public')
        dispatch(support.actions.setTickets(newTickets))
      })
      .catch((err) => {
      })
    let pid: number = parseInt(id)
    if (pid !== ticketData.id)
      return;
    getTicketById(pid)
      .then((res) => {
        let { data } = res;
        dispatch(support.actions.setTicketData(data))
      })
  }

  const handleDeleteTicket = (id: any) => {
    if (ticketData !== undefined) {
      let pid: number = parseInt(id)
      if (pid === ticketData.id) {
        history.push('/tickets')
      }
    }
    if (user === undefined)
      return
    getTickets()
      .then((res) => {
        let { data } = res;
        let newTickets: any = [];
        data.forEach((doc) => {
          newTickets.push({ ...doc });
        });
        newTickets = newTickets.filter((ticket: any) => ticket.user_id === user?.id || ticket.status === 'public')
        dispatch(support.actions.setTickets(newTickets))
      })
      .catch((err) => {
      })
  }

  const handleUpdateUser = (body: any) => {
    let pid: number = parseInt(body)
    if (user !== undefined) {
      if (user.id === pid) {
        getUserById(pid)
          .then((res) => {
            let { data } = res;
            if (data.banned === "true") {
              history.push('/auth/login')
              setTimeout(() => {
                dispatch(auth.actions.logout())
              }, 200);
            } else {
              getUserById(pid)
                .then((res) => {
                  let { data } = res;
                  dispatch(auth.actions.fulfillUser(data))
                })
                .catch((err) => {
                })
            }
          })
          .catch((err) => {
          })
      }
    }
  }
  const handleDeleteUser = (body: any) => {
    if (user === undefined)
      return
    let pid: number = parseInt(body)
    if (user.id === pid) {
      history.push('/auth/login')
      setTimeout(() => {
        dispatch(auth.actions.logout())
      }, 200);
    }
  }

  useEffect(() => {
    switch (currentMsg.type) {
      case 'UpdateUser':
        handleUpdateUser(currentMsg.body)
        break;
      case 'DeleteUser':
        handleDeleteUser(currentMsg.body)
        break;
      case 'CreateTicket':
        handleCreateTicket()
        break;
      case 'UpdateTicket':
        handleUpdateTicketData(currentMsg.body)
        break;
      case 'DeleteTicket':
        handleDeleteTicket(currentMsg.body)
        break;

      default:
        break;
    }
    // eslint-disable-next-line
  }, [currentMsg])

  // We should request user by authToken before rendering the application
  useEffect(() => {
    connect((msg: any) => {
      let parseMsg = JSON.parse(msg.data).body
      try {
        parseMsg = JSON.parse(parseMsg);
      }
      catch (err) {
      }
      setCurrentMsg(() => parseMsg)
    });
    const requestUser = async () => {
      try {
        if (!didRequest.current) {
          const { data: user } = await getUserByToken(accessToken as string)
          dispatch(props.fulfillUser(user))
        }
      } catch (error) {
        console.error(error)
        if (!didRequest.current) {
          dispatch(props.logout())
        }
      } finally {
        setShowSplashScreen(false)
      }

      return () => (didRequest.current = true)
    }


    if (accessToken) {
      requestUser()
    } else {
      dispatch(props.logout())
      setShowSplashScreen(false)
    }
    // eslint-disable-next-line
  }, [])

  return showSplashScreen ? <LayoutSplashScreen /> : <>{props.children}</>
}

export default connector(AuthInit)
