/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { toAbsoluteUrl } from '../../../../_metronic/helpers';

const Contact = () => {
    return (
        <div className="card">
            <div className="card-body p-lg-17">
                <div className="row mb-3">
                    <div className="col-md-6 pe-lg-10">
                        <form action="" className="form mb-15" method="post" id="kt_contact_form">
                            <h1 className="fw-bolder text-dark mb-9">Send Us Email</h1>
                            <div className="row mb-5">
                                <div className="col-md-6 fv-row">
                                    <label className="fs-5 fw-bold mb-2">Name</label>
                                    <input type="text" className="form-control form-control-solid" placeholder="" name="name" />
                                </div>
                                <div className="col-md-6 fv-row">
                                    <label className="fs-5 fw-bold mb-2">Email</label>
                                    <input type="text" className="form-control form-control-solid" placeholder="" name="email" />
                                </div>
                            </div>
                            <div className="d-flex flex-column mb-5 fv-row">
                                <label className="fs-5 fw-bold mb-2">Subject</label>
                                <input className="form-control form-control-solid" placeholder="" name="subject" />
                            </div>
                            <div className="d-flex flex-column mb-10 fv-row">
                                <label className="fs-6 fw-bold mb-2">Message</label>
                                <textarea className="form-control form-control-solid" rows={6} name="message" placeholder=""></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary" id="kt_contact_submit_button">
                                <span className="indicator-label">Send Feedback</span>
                                <span className="indicator-progress">Please wait...
                                    <span className="spinner-border spinner-border-sm align-middle ms-2"></span></span>
                            </button>
                        </form>
                    </div>
                    <div className="col-md-6 ps-lg-10">
                        <div id="kt_contact_map" className="w-100 rounded mb-2 mb-lg-0 mt-2" style={{height: "486px"}}></div>
                    </div>
                </div>
                <div className="row g-5 mb-5 mb-lg-15">
                    <div className="col-sm-6 pe-lg-10">
                        <div className="text-center bg-light card-rounded d-flex flex-column justify-content-center p-10 h-100">
                            <h1 className="text-dark fw-bolder my-5">Let’s Speak</h1>
                            <div className="text-gray-700 fw-bold fs-2">1 (833) 597-7538</div>
                        </div>
                    </div>
                    <div className="col-sm-6 ps-lg-10">
                        <div className="text-center bg-light card-rounded d-flex flex-column justify-content-center p-10 h-100">
                            <span className="svg-icon svg-icon-3tx svg-icon-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path opacity="0.3" d="M18.0624 15.3453L13.1624 20.7453C12.5624 21.4453 11.5624 21.4453 10.9624 20.7453L6.06242 15.3453C4.56242 13.6453 3.76242 11.4453 4.06242 8.94534C4.56242 5.34534 7.46242 2.44534 11.0624 2.04534C15.8624 1.54534 19.9624 5.24534 19.9624 9.94534C20.0624 12.0453 19.2624 13.9453 18.0624 15.3453Z" fill="black" />
                                    <path d="M12.0624 13.0453C13.7193 13.0453 15.0624 11.7022 15.0624 10.0453C15.0624 8.38849 13.7193 7.04535 12.0624 7.04535C10.4056 7.04535 9.06241 8.38849 9.06241 10.0453C9.06241 11.7022 10.4056 13.0453 12.0624 13.0453Z" fill="black" />
                                </svg>
                            </span>
                            <h1 className="text-dark fw-bolder my-5">Our Head Office</h1>
                            <div className="text-gray-700 fs-3 fw-bold">Churchill-laan 16 II, 1052 CD, Amsterdam</div>
                        </div>
                    </div>
                </div>
                <div className="card mb-4 bg-light text-center">
                    <div className="card-body py-12">
                        <a className="mx-4">
                            <img src={toAbsoluteUrl("/media/svg/brand-logos/facebook-4.svg")} className="h-30px my-2" alt="" />
                        </a>
                        <a className="mx-4">
                            <img src={toAbsoluteUrl("/media/svg/brand-logos/instagram-2-1.svg")} className="h-30px my-2" alt="" />
                        </a>
                        <a className="mx-4">
                            <img src={toAbsoluteUrl("/media/svg/brand-logos/github.svg")} className="h-30px my-2" alt="" />
                        </a>
                        <a className="mx-4">
                            <img src={toAbsoluteUrl("/media/svg/brand-logos/behance.svg")} className="h-30px my-2" alt="" />
                        </a>
                        <a className="mx-4">
                            <img src={toAbsoluteUrl("/media/svg/brand-logos/pinterest-p.svg")} className="h-30px my-2" alt="" />
                        </a>
                        <a className="mx-4">
                            <img src={toAbsoluteUrl("/media/svg/brand-logos/twitter.svg")} className="h-30px my-2" alt="" />
                        </a>
                        <a className="mx-4">
                            <img src={toAbsoluteUrl("/media/svg/brand-logos/dribbble-icon-1.svg")} className="h-30px my-2" alt="" />
                        </a>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Contact;