/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router'
import Modal from 'react-modal';
import { CreateTicketModal } from './components/CreateTicketModal';

const InitialData = {
    id: '',
    title: '',
    service: '',
    status: '',
    state: '',
    description: '',
    comments: [],
    attachments: [],
    created_date: '',
}

const SupportHeader: React.FC = () => {
    const location = useLocation()
    const [modalIsOpen, setIsOpen] = React.useState<boolean>(false);

    // handel modal
    function openModal() {
        setIsOpen(true);
    }

    function closeModal() {
        setIsOpen(false);
    }

    const customStyles = {
        content: {
            backgroundColor: 'transparent',
            border: 'none',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            padding: 0
        },
        overlay: {
            backgroundColor: 'rgba(0,0,0,0.4)',
            zIndex: 1055
        }
    };

    return (
        <div className='card mb-5 mb-xl-10'>
            <div className='card-body flex-column p-5'>
                <div className="d-flex align-items-center h-lg-300px p-5 p-lg-15">
                    <div className="d-flex flex-column align-items-start justift-content-center flex-equal me-5">
                        <h1 className="fw-bolder fs-4 fs-lg-1 text-gray-800 mb-5 mb-lg-10">How Can We Help You?</h1>
                        <div className="position-relative w-100">
                            <KTSVG path='/media/icons/duotune/general/gen021.svg' className='svg-icon svg-icon-2 svg-icon-primary position-absolute top-50 translate-middle ms-8' />
                            <input
                                type="text"
                                className="form-control fs-4 py-4 ps-14 text-gray-700 placeholder-gray-400 mw-500px"
                                name="search"
                                placeholder="Ask a question"
                            />
                        </div>
                    </div>
                    <div className="flex-equal d-flex justify-content-center align-items-end ms-5">
                        <img src={toAbsoluteUrl('/media/illustrations/sketchy-1/20.png')} alt="" className="mw-100 mh-125px mh-lg-275px mb-lg-n12" />
                    </div>
                </div>
                <div className='card-rounded bg-light d-flex flex-stack flex-wrap p-5'>
                    <ul className='nav flex-wrap border-transparent fw-bolder' style={{ width: 'fit-content' }}>
                        <li className='nav-item my-1'>
                            <Link
                                className={
                                    `text-gray-600 text-active-primary text-active-color-primary fw-boldest fs-8 fs-lg-base nav-link px-3 px-lg-8 mx-1 text-uppercase ` +
                                    (location.pathname === '/support/overview' && 'active')
                                }
                                to='/support/overview'
                            >
                                Overview
                            </Link>
                        </li>
                        <li className='nav-item my-1'>
                            <Link
                                className={
                                    `text-gray-600 text-active-primary text-active-color-primary fw-boldest fs-8 fs-lg-base nav-link px-3 px-lg-8 mx-1 text-uppercase ` +
                                    (location.pathname.includes("tickets") ? 'active' : "")
                                }
                                to='/support/tickets'
                            >
                                Tickets
                            </Link>
                        </li>
                        <li className='nav-item my-1'>
                            <Link
                                className={
                                    `text-gray-600 text-active-primary text-active-color-primary fw-boldest fs-8 fs-lg-base nav-link px-3 px-lg-8 mx-1 text-uppercase ` +
                                    (location.pathname === '/support/faq' && 'active')
                                }
                                to='/support/faq'
                            >
                                FAQ
                            </Link>
                        </li>
                        <li className='nav-item my-1'>
                            <Link
                                className={
                                    `text-gray-600 text-active-primary text-active-color-primary fw-boldest fs-8 fs-lg-base nav-link px-3 px-lg-8 mx-1 text-uppercase ` +
                                    (location.pathname === '/support/contact' && 'active')
                                }
                                to='/support/contact'
                            >
                                Contact Us
                            </Link>
                        </li>
                    </ul>
                    <a
                        className="btn btn-primary d-flex fw-bolder fs-8 fs-lg-base"
                        onClick={openModal}
                    >
                        Create Ticket
                    </a>
                    <Modal
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        style={customStyles}
                        ariaHideApp={false}
                        contentLabel="Create Ticket"
                    >
                        <CreateTicketModal
                            ticketData={InitialData}
                            isCreate={true}
                            closeModal={closeModal}
                        />
                    </Modal>
                </div>
            </div>
        </div>
    )
}

export { SupportHeader }
