import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import Contact from './components/Contact'
import FAQ from './components/FAQ'
import Overview from './components/Overview'
import {Tickets} from './components/Tickets'
import {SupportHeader} from './SupportHeader'

const profileBreadCrumbs: Array<PageLink> = [
  {
    title: 'Support Center',
    path: '/support/overview',
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

const SupportPageWrapper: React.FC = () => {

  return (
    <>
      <SupportHeader />
      <Switch>
        <Route path='/support/overview'>
          <PageTitle breadcrumbs={profileBreadCrumbs}>Overview</PageTitle>
          <Overview />
        </Route>
        <Route path='/support/tickets'>
          <PageTitle breadcrumbs={profileBreadCrumbs}>Tickets</PageTitle>
          <Tickets />
        </Route>
        <Route path='/support/faq'>
          <PageTitle breadcrumbs={profileBreadCrumbs}>FAQ</PageTitle>
          <FAQ />
        </Route>
        <Route path='/support/contact'>
          <PageTitle breadcrumbs={profileBreadCrumbs}>Contact Us</PageTitle>
          <Contact />
        </Route>

        <Redirect from='/support' exact={true} to='/support/overview' />
        <Redirect to='/support/overview' />
      </Switch>
    </>
  )
}

export default SupportPageWrapper
