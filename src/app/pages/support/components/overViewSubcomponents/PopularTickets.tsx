import * as React from 'react';
import { KTSVG } from '../../../../../_metronic/helpers';
import { Link } from 'react-router-dom';
const PopularTickets = () => {
    return (
        <div className="col-md-6">
                <div className="card card-md-stretch me-xl-3 mb-md-0 mb-6">
                    <div className="card-body p-10 p-lg-15">
                        <div className="d-flex flex-stack mb-7">
                            <h1 className="fw-bolder text-dark">Popular Tickets</h1>
                            <div className="d-flex align-items-center">
                                <Link to="/support/tickets" className="text-primary fw-bolder me-1">Support</Link>
                                <KTSVG path='/media/icons/duotune/arrows/arr064.svg' className='svg-icon svg-icon-2 svg-icon-primary' />

                            </div>
                        </div>
                        <div className="accordion accordion-icon-toggle" id="kt_accordion_2">
                            <div className="mb-5">
                                <div
                                    className="accordion-header py-3 d-flex"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#kt_accordion_2_item_1"
                                >
                                    <span className="accordion-icon ms-n1 me-2">
                                        <KTSVG
                                            className="svg-icon svg-icon-4"
                                            path="/media/icons/duotune/arrows/arr071.svg"
                                        />
                                    </span>
                                    <div className="d-flex align-items-center flex-wrap">
                                        <h3 className="text-gray-800 fw-bold cursor-pointer me-3 mb-0">How Extended Licese works?</h3>
                                        <span className="badge badge-light my-1 d-block">Laravel</span>
                                    </div>
                                </div>
                                <div
                                    id="kt_accordion_2_item_1"
                                    className="fs-6 collapse show ps-10"
                                    data-bs-parent="#kt_accordion_2"
                                >
                                    Lorem Ipsum is simply dummy text of the printing and
                                    typesetting industry. Lorem Ipsum has been the industry's
                                    standard dummy text ever since the 1500s, when an unknown
                                    printer took a galley of type and scrambled it to make a type
                                    specimen book. It has survived not only five centuries, but
                                    also the leap into electronic typesetting, remaining
                                    essentially unchanged.
                                </div>
                            </div>
                            <div className="mb-5">
                                <div
                                    className="accordion-header py-3 d-flex collapsed"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#kt_accordion_2_item_2"
                                >
                                    <span className="accordion-icon ms-n1 me-2">
                                        <KTSVG
                                            className="svg-icon svg-icon-4"
                                            path="/media/icons/duotune/arrows/arr071.svg"
                                        />
                                    </span>
                                    <div className="d-flex align-items-center flex-wrap">
                                        <h3 className="text-gray-800 fw-bold cursor-pointer me-3 mb-0">How Extended Licese works?</h3>
                                        <span className="badge badge-light my-1 d-block">Laravel</span>
                                    </div>
                                </div>
                                <div
                                    id="kt_accordion_2_item_2"
                                    className="collapse fs-6 ps-10"
                                    data-bs-parent="#kt_accordion_2"
                                >
                                    Lorem Ipsum is simply dummy text of the printing and
                                    typesetting industry. Lorem Ipsum has been the industry's
                                    standard dummy text ever since the 1500s, when an unknown
                                    printer took a galley of type and scrambled it to make a type
                                    specimen book. It has survived not only five centuries, but
                                    also the leap into electronic typesetting, remaining
                                    essentially unchanged.
                                </div>
                            </div>
                            <div className="mb-5">
                                <div
                                    className="accordion-header py-3 d-flex collapsed"
                                    data-bs-toggle="collapse"
                                    data-bs-target="#kt_accordion_2_item_3"
                                >
                                    <span className="accordion-icon ms-n1 me-2">
                                        <KTSVG
                                            className="svg-icon svg-icon-4"
                                            path="/media/icons/duotune/arrows/arr071.svg"
                                        />
                                    </span>
                                    <div className="d-flex align-items-center flex-wrap">
                                        <h3 className="text-gray-800 fw-bold cursor-pointer me-3 mb-0">How Extended Licese works?</h3>
                                        <span className="badge badge-light my-1 d-block">Laravel</span>
                                    </div>
                                </div>
                                <div
                                    id="kt_accordion_2_item_3"
                                    className="collapse fs-6 ps-10"
                                    data-bs-parent="#kt_accordion_2"
                                >
                                    Lorem Ipsum is simply dummy text of the printing and
                                    typesetting industry. Lorem Ipsum has been the industry's
                                    standard dummy text ever since the 1500s, when an unknown
                                    printer took a galley of type and scrambled it to make a type
                                    specimen book. It has survived not only five centuries, but
                                    also the leap into electronic typesetting, remaining
                                    essentially unchanged.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    )
}
export { PopularTickets };