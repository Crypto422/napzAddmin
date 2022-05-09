/* eslint-disable react/jsx-no-target-blank */
import React from 'react'
import { useIntl } from 'react-intl'
import { KTSVG } from '../../../helpers'
import { AsideMenuItem } from './AsideMenuItem'
import { AsideMenuItemWithSub } from './AsideMenuItemWithSub'

export function AsideMenuMain() {
  const intl = useIntl()

  return (
    <>
      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>General</span>
        </div>
      </div>

      <AsideMenuItem
        to='/dashboard'
        icon='/media/icons/duotune/art/art002.svg'
        title={intl.formatMessage({ id: 'MENU.DASHBOARD' })}
        fontIcon='bi-app-indicator'
      />
      <AsideMenuItem
        to='/upload'
        icon='/media/icons/duotune/general/gen006.svg'
        title='Upload'
        fontIcon='bi-layers'
      />


      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Profile</span>
        </div>
      </div>

      <AsideMenuItemWithSub
        to='/profile'
        title='Profile'
        icon='/media/icons/duotune/communication/com006.svg'
        fontIcon='bi-person'
      >
        <AsideMenuItem to='/profile/overview' title='Overview' hasBullet={true} />
        <AsideMenuItem to='/profile/analyse' title='Analyse Images' hasBullet={true} />
      </AsideMenuItemWithSub>

      <AsideMenuItem
        to='/settings'
        icon='/media/icons/duotune/general/gen019.svg'
        title='Settings'
        fontIcon='bi-layers'
      />

      <div className='menu-item'>
        <div className='menu-content pt-8 pb-2'>
          <span className='menu-section text-muted text-uppercase fs-8 ls-1'>Support Center</span>
        </div>
      </div>

      <AsideMenuItemWithSub
        to='/support'
        title='Support Center'
        icon='/media/icons/duotune/general/gen022.svg'
        fontIcon='bi-person'
      >
        <AsideMenuItem to='/support/overview' title='Overview' hasBullet={true} />
        <AsideMenuItem to='/support/tickets' title='Tickets' hasBullet={true} />
        <AsideMenuItem to='/support/faq' title='FAQ' hasBullet={true} />
        <AsideMenuItem to='/support/contact' title='Contact Us' hasBullet={true} />

      </AsideMenuItemWithSub>

      <div className='menu-item'>
        <div className='menu-content'>
          <div className='separator mx-1 my-4'></div>
        </div>
      </div>
      <div className='menu-item'>
        <a
          target='_blank'
          className='menu-link'
          href={process.env.REACT_APP_PREVIEW_DOCS_URL + '/docs/changelog'}
        >
          <span className='menu-icon'>
            <KTSVG path='/media/icons/duotune/general/gen005.svg' className='svg-icon-2' />
          </span>
          <span className='menu-title'>User Guides</span>
        </a>
      </div>
    </>
  )
}
