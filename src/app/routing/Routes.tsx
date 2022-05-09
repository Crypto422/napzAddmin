/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import { shallowEqual, useSelector } from 'react-redux'
import React, { FC } from 'react'
import { Redirect, Switch, Route } from 'react-router-dom'
// import {shallowEqual, useSelector} from 'react-redux'
import { MasterLayout } from '../../_metronic/layout/MasterLayout'
import { PrivateRoutes } from './PrivateRoutes'
import { AuthPage, Logout } from '../pages/auth'
import { ErrorsPage } from '../modules/errors/ErrorsPage'
import { RootState } from '../../setup'
import { MasterInit } from '../../_metronic/layout/MasterInit'
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from '../../service/firebase';

const Routes: FC = () => {
  const [user] = useAuthState(auth);
  const isAuthorized = useSelector<RootState>(({ auth }) => auth.user, shallowEqual)

  return (
    <>
      {
        process.env.REACT_APP_ENV === "prod" ?
          <Switch>
            {!isAuthorized ? (
              /*Render auth page when user at `/auth` and not authorized.*/
              <Switch>
                <Route>
                  <AuthPage />
                </Route>
              </Switch>

            ) : (
              <Redirect from='/auth' to='/' />
              /*Otherwise redirect to root page (`/`)*/
            )}

            <Route path='/error' component={ErrorsPage} />
            <Route path='/logout' component={Logout} />

            {!isAuthorized ? (
              /*Redirect to `/auth` when user is not authorized*/
              <Redirect to='/auth/login' />
            ) : (
              <>
                <MasterLayout>
                  <PrivateRoutes />
                </MasterLayout>
              </>
            )}
          </Switch> :
          <Switch>
            {!user ? (
              /*Render auth page when user at `/auth` and not authorized.*/
              <Switch>
                <Route>
                  <AuthPage />
                </Route>
              </Switch>
            ) : (
              /*Otherwise redirect to root page (`/`)*/
              <Redirect from='/auth' to='/' />
            )}

            <Route path='/error' component={ErrorsPage} />
            <Route path='/logout' component={Logout} />

            {!user ? (
              /*Redirect to `/auth` when user is not authorized*/
              <Redirect to='/auth/login' />
            ) : (
              <>
                <MasterLayout>
                  <PrivateRoutes />
                </MasterLayout>
              </>
            )}
          </Switch>
      }

      <MasterInit />
    </>
  )
}

export { Routes }
