import React from 'react'
import { ProfileDetails } from './components/prod/ProfileDetails'
import { ProfileDetails as DevProfileDetails } from './components/dev/ProfileDetails'
import { PageTitle } from '../../../_metronic/layout/core'
const Settings = () => {
  return (
    <>
      <PageTitle breadcrumbs={[]}>Settings</PageTitle>
      {
        process.env.REACT_APP_ENV === "prod" ? <ProfileDetails /> : <></>
      }
      {
        process.env.REACT_APP_ENV === "dev" ? <DevProfileDetails /> : <></>
      }

    </>
  )
}

export default Settings
