/* eslint-disable jsx-a11y/anchor-is-valid */
import { FC } from 'react'
import { Link } from 'react-router-dom'
import { shallowEqual, useSelector } from 'react-redux'
import { UserModel } from '../../../../app/pages/auth/models/UserModel'
import { RootState } from '../../../../setup'
import * as auth from '../../../../app/pages/auth/redux/AuthRedux'
import { Languages } from './Languages'
import { useDispatch } from 'react-redux'
import { toAbsoluteUrl } from '../../../helpers'
import { logout } from '../../../../app/pages/auth/service/authService'
import { useAuth } from '../../../../setup/context/AppContext';
import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

const HeaderUserMenu: FC = () => {
  const user: UserModel = useSelector<RootState>(({ auth }) => auth.user, shallowEqual) as UserModel
  const history = useHistory();
  const dispatch = useDispatch()
  const Logout = () => {
    dispatch(auth.actions.logout())
    logout();
    history.push('/auth/login')
  }

  const { userData } = useAuth()
  const [avatar, setAvatar] = useState('')
  useEffect(() => {
    if (process.env.REACT_APP_ENV === "dev")
      setAvatar(
        userData?.AvatarURL || ''
      )
  }, [userData])

  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px'
      data-kt-menu='true'
    >
      <div className='menu-item px-3'>
        <div className='menu-content d-flex align-items-center px-3'>
          <div className='symbol symbol-50px me-5'>
            <img style={{ objectFit: 'cover' }}
              alt='Logo'
              src={
                process.env.REACT_APP_ENV === "prod" ?
                  user?.avatar_url.length > 0 ? user?.avatar_url : toAbsoluteUrl('/media/avatars/blank.png') :
                  avatar.length > 0 ? avatar : toAbsoluteUrl('/media/avatars/blank.png')
              }
            />
          </div>

          <div className='d-flex flex-column'>
            <div className='fw-bolder d-flex align-items-center fs-5'>
              {
                process.env.REACT_APP_ENV === "prod" ?
                  user?.name : userData?.Name
              }
              <span className='badge badge-light-success fw-bolder fs-8 px-2 py-1 ms-2'>Pro</span>
            </div>
            <a  className='fw-bold text-muted text-hover-primary fs-7'>
              {
                process.env.REACT_APP_ENV === "prod" ?
                  user?.email : userData?.Email
              }
            </a>
          </div>
        </div>
      </div>

      <div className='separator my-2'></div>

      <div className='menu-item px-5'>
        <Link to={'/profile/overview'} className='menu-link px-5'>
          My Profile
        </Link>
      </div>

      <div className='menu-item px-5'>
        <a  className='menu-link px-5'>
          <span className='menu-text'>My Projects</span>
          <span className='menu-badge'>
            <span className='badge badge-light-danger badge-circle fw-bolder fs-7'>3</span>
          </span>
        </a>
      </div>

      <div
        className='menu-item px-5'
        data-kt-menu-trigger='hover'
        data-kt-menu-placement='left-start'
        data-kt-menu-flip='bottom'
      >
        <a  className='menu-link px-5'>
          <span className='menu-title'>My Subscription</span>
          <span className='menu-arrow'></span>
        </a>

        <div className='menu-sub menu-sub-dropdown w-175px py-4'>
          <div className='menu-item px-3'>
            <a  className='menu-link px-5'>
              Referrals
            </a>
          </div>

          <div className='menu-item px-3'>
            <a  className='menu-link px-5'>
              Billing
            </a>
          </div>

          <div className='menu-item px-3'>
            <a  className='menu-link px-5'>
              Payments
            </a>
          </div>

          <div className='menu-item px-3'>
            <a  className='menu-link d-flex flex-stack px-5'>
              Statements
              <i
                className='fas fa-exclamation-circle ms-2 fs-7'
                data-bs-toggle='tooltip'
                title='View your statements'
              ></i>
            </a>
          </div>

          <div className='separator my-2'></div>

          <div className='menu-item px-3'>
            <div className='menu-content px-3'>
              <label className='form-check form-switch form-check-custom form-check-solid'>
                <input
                  className='form-check-input w-30px h-20px'
                  type='checkbox'
                  value='1'
                  defaultChecked={true}
                  name='notifications'
                />
                <span className='form-check-label text-muted fs-7'>Notifications</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className='menu-item px-5'>
        <a  className='menu-link px-5'>
          My Statements
        </a>
      </div>

      <div className='separator my-2'></div>

      <Languages />

      <div className='menu-item px-5 my-1'>
        <Link to='/profile/settings' className='menu-link px-5'>
          Account Settings
        </Link>
      </div>

      <div className='menu-item px-5'>
        <a onClick={Logout} className='menu-link px-5'>
          Sign Out
        </a>
      </div>
    </div>
  )
}

export { HeaderUserMenu }
