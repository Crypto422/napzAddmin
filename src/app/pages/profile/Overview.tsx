/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { shallowEqual, useSelector } from 'react-redux'
import { UserModel } from '../auth/models/UserModel'
import { RootState } from '../../../setup'
import { useAuth } from '../../../setup/context/AppContext';

export function Overview() {
  const user: UserModel = useSelector<RootState>(({ auth }) => auth.user, shallowEqual) as UserModel

  const { userData } = useAuth();
  return (
    <>
      <div className='card mb-5 mb-xl-10' id='kt_profile_details_view'>
        <div className='card-header cursor-pointer'>
          <div className='card-title m-0'>
            <h3 className='fw-bolder m-0'>User Info</h3>
          </div>
        </div>

        <div className='card-body p-9'>
          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Full Name</label>

            <div className='col-lg-8'>
              <span className='fw-bolder fs-6 text-dark'>
                {
                  process.env.REACT_APP_ENV === "prod" ? user?.name : userData?.Name 
                }
              </span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>User Name</label>

            <div className='col-lg-8 fv-row'>
              <span className='fw-bold fs-6'>
                {
                  process.env.REACT_APP_ENV === "prod" ? user?.username : userData?.Username
                }</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Email</label>

            <div className='col-lg-8 fv-row'>
              <span className='fw-bold fs-6'>
                {
                  process.env.REACT_APP_ENV === "prod" ? user?.email : userData?.Email
                }
              </span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Time Zone</label>

            <div className='col-lg-8 fv-row'>
              <span className='fw-bold fs-6'>{
                process.env.REACT_APP_ENV === "prod" ? user?.timezone : userData?.Timezone
              }</span>
            </div>
          </div>

          <div className='row mb-7'>
            <label className='col-lg-4 fw-bold text-muted'>Currency</label>

            <div className='col-lg-8 fv-row'>
              <span className='fw-bold fs-6'>{
                process.env.REACT_APP_ENV === "prod" ? user?.currency : userData?.Currency
              }</span>
            </div>
          </div>

          <div className='row mb-10'>
            <label className='col-lg-4 fw-bold text-muted'>Allow </label>

            <div className='col-lg-8'>
              <span className='fw-bold fs-6'>Yes</span>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
