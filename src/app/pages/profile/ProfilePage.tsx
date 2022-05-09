import React from 'react'
import {Redirect, Route, Switch} from 'react-router-dom'
import {PageLink, PageTitle} from '../../../_metronic/layout/core'
import {Overview} from './Overview'
import { Analyse } from './components/prod/Analyse'
import { Analyse as DevAnalyse} from './components/dev/Analyse'
import {AccountHeader} from './ProfileHeader'

const profileBreadCrumbs: Array<PageLink> = [
  {
    title: 'Profile',
    path: '/profile/overview',
    isSeparator: false,
    isActive: false,
  },
  {
    title: '',
    path: '',
    isSeparator: true,
    isActive: false,
  },
]

const ProfilePage: React.FC = () => {  
  return (
    <>
      <AccountHeader />
      <Switch>
        <Route path='/profile/overview'>
          <PageTitle breadcrumbs={profileBreadCrumbs}>Overview</PageTitle>
          <Overview />
        </Route>
        <Route path='/profile/analyse'>
          <PageTitle breadcrumbs={profileBreadCrumbs}>Analyse Image</PageTitle>
          {
            process.env.REACT_APP_ENV === "prod" ?  <Analyse /> : <DevAnalyse />
          }
        </Route>

        <Redirect from='/profile' exact={true} to='/profile/overview' />
        <Redirect to='/profile/overview' />
      </Switch>
    </>
  )
}

export default ProfilePage
