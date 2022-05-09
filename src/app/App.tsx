import React, { Suspense } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { I18nProvider } from '../_metronic/i18n/i18nProvider'
import { LayoutProvider, LayoutSplashScreen } from '../_metronic/layout/core'
import { Routes } from './routing/Routes'
import AuthInit from './pages/auth/redux/AuthInit'
import { AuthProvider } from '../setup/context/AppContext';
import { WebSocketProvider } from '../setup/context/WebSocketContext'
type Props = {
  basename: string
}

const App: React.FC<Props> = ({ basename }) => {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <BrowserRouter basename={basename}>
        <I18nProvider>
          <LayoutProvider>
            {
              process.env.REACT_APP_ENV === "prod" ?
                <WebSocketProvider>
                  <AuthInit>
                    <Routes />
                  </AuthInit>
                </WebSocketProvider>
                :
                <AuthProvider>
                  <Routes />
                </AuthProvider>
            }

          </LayoutProvider>
        </I18nProvider>
      </BrowserRouter>
    </Suspense>
  )
}

export { App }
