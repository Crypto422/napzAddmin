/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { TicketDataModel } from '../models/TicketModel';
import { KTSVG } from '../../../../../_metronic/helpers';
import { useEffect, useState } from 'react';

const TicketItem = (props: any) => {
    // const {open, data, id} = props;
    // const { title, service, attachments, status } : TicketModel = data;

    return (
        <div className="mb-5">
            <div
                className="accordion-header py-3 d-flex"
                data-bs-toggle="collapse"
                data-bs-target="#kt_accordion_2_item_1"
            >
                <span className="accordion-icon">
                    <KTSVG
                        className="svg-icon svg-icon-4"
                        path="/media/icons/duotune/arrows/arr071.svg"
                    />
                </span>
                <h3 className="fs-4 text-gray-800 fw-bold mb-0 ms-4">
                    What admin theme does?
                </h3>
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
    )
}

export { TicketItem }