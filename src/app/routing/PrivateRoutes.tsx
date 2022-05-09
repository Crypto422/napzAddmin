import React, {Suspense} from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {FallbackView} from '../../_metronic/partials'
import DashboardWrapper from '../pages/dashboard/DashboardWrapper'
import ImageUploadPageWrapper from '../pages/image-upload/ImageUploadPageWrapper'
import ProfilePage from '../pages/profile/ProfilePage'
import Settings from '../pages/settings/Settings'
import SupportPageWrapper from '../pages/support/SupportPageWrapper'

export function PrivateRoutes() {

  return (
    <Suspense fallback={<FallbackView />}>
      <Switch>
        <Route path='/dashboard' component={DashboardWrapper} />
        <Route path='/upload' component={ImageUploadPageWrapper} /> 
        <Route path='/support' component={SupportPageWrapper} /> 
        <Route path='/profile' component={ProfilePage} />
        <Route path='/settings' component={Settings} />
        <Redirect from='/auth' to='/dashboard' />
        <Redirect exact from='/' to='/dashboard' />
        <Redirect to='error/404' />
      </Switch>
    </Suspense>
  )
}
