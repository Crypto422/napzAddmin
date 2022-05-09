import React, { useContext,useEffect, createContext } from "react"
import { getTokenByRefreshToken } from '../../app/pages/auth/redux/AuthCRUD'
import { useHistory } from 'react-router-dom'
import { RootState } from '../../setup'
import jwt_decode from 'jwt-decode'
import * as auth from '../../app/pages/auth/redux/AuthRedux'
import { shallowEqual, useSelector, useDispatch } from 'react-redux'
const Context = createContext<any>({})

export function useWebSocket() {
  return useContext(Context)
}
const api = process.env.REACT_APP_WS_URL 

export function WebSocketProvider({ children }: any) {

  const dispatch = useDispatch()
  const history = useHistory()
  const accessToken: any = useSelector<RootState>(({ auth }) => auth.accessToken, shallowEqual)
  const refreshToken = useSelector<RootState>(({ auth }) => auth.refreshToken, shallowEqual)

  const socket = new WebSocket(api as string);

  const checkExpireTime = () => {
    try {
      if (accessToken) {
        const decode: any = jwt_decode(accessToken)
        const currentTime = Date.now() / 1000
        if (decode.exp < currentTime) {
          getTokenByRefreshToken(refreshToken as string)
            .then((res: any) => {
              let { data } = res;
              console.log("ResetTokens", data);
              dispatch(auth.actions.resetToken(data.accessToken, data.refreshToken))
            })
            .catch((error: any) => {
              history.push('/auth/login')
              dispatch(auth.actions.logout())
              console.log("LoginTime is expired So you should login again", decode.exp, currentTime)
            })
        }
      }
    } catch (err) {
      console.log('Fail fetch userData', err)
    }
  }


  useEffect(() => {
    const interval = setInterval(() => {
      checkExpireTime()
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [accessToken]);

  const connect = (cb: any) => {

    socket.onopen = () => {
      console.log("Successfully Connected");
    }

    socket.onmessage = (msg) => {
      cb(msg);
    }

    socket.onclose = (event) => {
      console.log("Socket Closed Connection: ", event)
      alert("The real-time connection with the server has been disconnected.\nPlease reload for real-time updates");
    }


    socket.onerror = (error) => {
      console.log("Socket Error: ", error)
      alert("The real-time connection with the server has been disconnected.\nPlease reload for real-time updates");
    }
  };

  const sendSocketMsg = (msg: any) => {
    socket.send(msg);
  };

  const value = {
    connect,
    sendSocketMsg,
    checkExpireTime
  }
  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  )
}
