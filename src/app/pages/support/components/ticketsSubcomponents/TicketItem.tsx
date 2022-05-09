/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { Link } from 'react-router-dom';
import { KTSVG } from '../../../../../_metronic/helpers';
const TicketItem = (props: any) => {
    const { ticketData } = props;
    return (
        <Link
            to={{ pathname: `/support/tickets/${ticketData.id}` }}
            className="mb-10">
            <div className="d-flex mb-10">
                {
                    ticketData.state === 'Open' ?
                        <KTSVG
                            className="svg-icon svg-icon-2x me-5 ms-n1 mt-2 svg-icon-success"
                            path="/media/icons/duotune/general/gen048.svg"
                        /> : <></>
                }{
                    ticketData.state === 'Close' ?
                        <KTSVG
                            className="svg-icon svg-icon-2x me-5 ms-n1 mt-2 svg-icon-danger"
                            path="/media/icons/duotune/general/gen051.svg"
                        /> : <></>
                }{
                    ticketData.state === 'Draft' ?
                        <KTSVG
                            className="svg-icon svg-icon-2x me-5 ms-n1 mt-2 svg-icon-warning"
                            path="/media/icons/duotune/general/gen045.svg"
                        /> : <></>
                }
                <div className="d-flex flex-column">
                    <div className="d-flex align-items-center mb-2">
                        <div className="text-dark text-hover-primary fs-4 me-3 fw-bold">
                            {
                                ticketData?.title
                            }
                        </div>
                        <span className="badge badge-light my-1">{ticketData?.service}</span>
                    </div>
                    <span className="text-muted fw-bold fs-6">
                        {
                            ticketData?.description
                        }
                    </span>
                </div>
            </div>
        </Link>
    )
}

export { TicketItem };