import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../_metronic/layout/core'
import { TicketList } from './ticketsSubcomponents/TicketList'
import { ViewTickets } from './ticketsSubcomponents/ViewTicket'


const profileBreadCrumbs: Array<PageLink> = [
  {
    title: 'Tickets',
    path: '/support/tickets',
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

const Tickets: React.FC = () => {
  return (
    <>
      <Switch>
        <Route exact path='/support/tickets'>
          <PageTitle breadcrumbs={profileBreadCrumbs}>Tickets List</PageTitle>
          <TicketList />
        </Route>
        <Route path='/support/tickets/:id'>
          <PageTitle breadcrumbs={profileBreadCrumbs}>View Ticket</PageTitle>
          <ViewTickets />
        </Route>
      </Switch>
    </>
  )
}

export { Tickets }
