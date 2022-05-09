/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { KTSVG } from '../../../../_metronic/helpers';
import { useState, useEffect } from 'react';
import { TicketDataModel } from './models/TicketModel';
import { useWebSocket } from '../../../../setup/context/WebSocketContext';
import Attachments from './createTicketModalSubcompnents/Attachments';
import { createTicket, updateTicketData } from '../redux/TicketCRUD';
import { RootState } from '../../../../setup';
import { UserModel } from '../../auth/models/UserModel'
import { shallowEqual, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom';

const CreateTicketModal = (props: any) => {
    const user: UserModel = useSelector<RootState>(({ auth }) => auth.user, shallowEqual) as UserModel
    const { ticketData, closeModal, isCreate } = props;
    const [isEdit, setEdit] = useState<boolean>(false);
    const [save, setSave] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { sendSocketMsg } = useWebSocket();
    const [uploadMedia, setUploadMedia] = useState<boolean>(false);
    const [attachments, setAttachments] = useState<any[]>([]);
    const history = useHistory();
    const [data, setData] = useState<any>({
        title: ticketData?.title || "",
        service: ticketData?.service || "",
        status: ticketData?.status || "public",
        state: ticketData?.state || "Open",
        readers: ticketData?.readers || [],
        description: ticketData?.description || "",
        comments: ticketData?.comments || [],
        attachments: ticketData?.attachments || [],
    })
    useEffect(() => {
        if (!isCreate) {
            data['title'] = ticketData?.title || ""
            data['service'] = ticketData?.service || ""
            data['status'] = ticketData?.status || "public"
            data['state'] = ticketData?.state || "Open"
            data['description'] = ticketData?.description || ""
            data['comments'] = JSON.parse(ticketData?.comments) || []
            data['readers'] = JSON.parse(ticketData?.readers) || []
            data['attachments'] = JSON.parse(ticketData?.attachments) || []
            setData(() => data);
        }
        // eslint-disable-next-line
    }, [ticketData])

    const [errors, setErrors] = useState({
        title: false,
        service: false,
        status: false,
        description: false,
    });

    useEffect(() => {
        if (!isCreate) {
            if (ticketData !== undefined) {
                let attach = JSON.parse(ticketData.attachments);
                setAttachments(attach);
            }
        }
        // eslint-disable-next-line
    }, [ticketData])

    const handleChange = (event: any) => {
        event.persist();
        setData({
            ...data,
            [event.target.name]: event.target.value
        })
        setErrors(errors => ({
            ...errors,
            [event.target.name]: false
        }))
        setEdit(true);
    }

    const handleMediaDataChanged = (media: any, error: boolean, upload: boolean) => {
        data['attachments'] = media;
        setData(data);
        setUploadMedia(upload);
    }

    const handleCloseModal = () => {
        // @ts-ignore
        Swal.fire({
            text: "Are you sure you would like to cancel?",
            icon: "warning",
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonText: "Yes, cancel it!",
            cancelButtonText: "No, return",
            customClass: {
                confirmButton: "btn btn-primary",
                cancelButton: "btn btn-active-light"
            }
        }).then(function (result: any) {
            if (result.value) {
                closeModal()
            } else if (result.dismiss === 'cancel') {
                // @ts-ignore
                Swal.fire({
                    text: "Your form has not been cancelled!.",
                    icon: "error",
                    buttonsStyling: false,
                    confirmButtonText: "Ok, got it!",
                    customClass: {
                        confirmButton: "btn btn-primary",
                    }
                });
            }
        });
    }

    const handleSubmit = () => {
        let tempErrors = errors;
        if (data.title === '') {
            tempErrors.title = true;
        }
        if (data.service === '') {
            tempErrors.service = true;
        }
        if (data.description === '') {
            tempErrors.description = true;
        }

        setErrors({
            ...errors,
            ...tempErrors
        })

        if (!errors.title
            && !errors.service
            && !errors.description
        ) {
            setErrors((errors: any) => ({
                ...errors
            }))

            setLoading(true)
            setTimeout(() => {
                if (errors.title === false
                    && errors.service === false
                    && errors.status === false
                    && errors.description === false
                    && errors.service === false
                ) {
                    setSave(true);
                } else {
                    console.log(errors)
                    setLoading(false);
                    setSave(false);
                }
            }, 200);
        }
    }

    React.useEffect(() => {
        if (uploadMedia) {
            if (isCreate) {
                uploadDataToDb(data);
            } else {
                updateDataToDb(data);
            }
        }
        // eslint-disable-next-line
    }, [uploadMedia])

    const handleCreateSendSocketMsg = () => {
        let msg: any = {
            type: 'CreateTicket'
        }
        sendSocketMsg(JSON.stringify(msg))
    }
    const handleUpdateSendSocketMsg = () => {
        let msg: any = {
            type: 'UpdateTicket',
            body: `${ticketData.id}`
        }
        sendSocketMsg(JSON.stringify(msg))
    }
    const handleCreateSuccess = () => {
        // @ts-ignore
        Swal.fire({
            text: `${data.fullname} successfully added.`,
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
                confirmButton: "btn fw-bold btn-primary",
            }
        }).then(function () {
            history.push('/support/tickets');
            closeModal();
        })
    }
    const handleEditSuccess = () => {
        // @ts-ignore
        Swal.fire({
            text: `${data.fullname} successfully edited.`,
            icon: "success",
            buttonsStyling: false,
            confirmButtonText: "Ok, got it!",
            customClass: {
                confirmButton: "btn fw-bold btn-primary",
            }
        }).then(function () {
            closeModal();
        })
    }

    const uploadDataToDb = (data: TicketDataModel) => {
        let item = {
            ...data,
            user_id: user.id
        }
        try {
            createTicket(item)
                .then((res) => {
                    setSave(false);
                    setLoading(false);
                    handleCreateSuccess();
                    handleCreateSendSocketMsg();
                    console.log('Success Ticket Posting...')
                })
                .catch(() => {
                    console.log('Fail Ticket Posting...')
                })
        } catch (error) {
            console.log(error);
        }
    };
    const updateDataToDb = (data: TicketDataModel) => {
        let item = {
            ...data,
            user_id: user.id
        }
        try {
            updateTicketData(ticketData.id, item)
                .then((res) => {
                    setSave(false);
                    setLoading(false);
                    handleEditSuccess();
                    handleUpdateSendSocketMsg();
                    console.log('Success Ticket Editing...')
                })
                .catch(() => {
                    console.log('Fail Ticket Editing...')
                })
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="modal-dialog modal-dialog-centered mw-750px">
            <div className="modal-content rounded">
                <div className="modal-header pb-0 border-0 justify-content-end">
                    <div
                        className="btn btn-sm btn-icon btn-active-color-primary"
                        onClick={handleCloseModal}
                    >
                        <KTSVG
                            className="svg-icon svg-icon-1"
                            path="/media/icons/duotune/arrows/arr061.svg"
                        />
                    </div>
                </div>
                <div className="modal-body scroll-y px-10 px-lg-15 pt-0">
                    <div className="mb-13 text-center">
                        <h1 className="mb-3">
                            {
                                isCreate ? "Create Ticket" : "Edit Ticket"
                            }
                        </h1>
                        <div className="text-gray-400 fw-bold fs-5">If you need more info, please check
                            <a className="fw-bolder link-primary">&nbsp;Support Guidelines</a>.</div>
                    </div>
                    <div className="d-flex flex-column mb-8 fv-row">
                        <label className="d-flex align-items-center fs-6 fw-bold mb-2">
                            <span className="required">Title</span>
                            <i className="fas fa-exclamation-circle ms-2 fs-7" data-bs-toggle="tooltip" title="Specify a title for your ticket"></i>
                        </label>
                        <input
                            type="text"
                            className="form-control form-control-solid"
                            placeholder="Enter your ticket title"
                            name="title"
                            value={data.title}
                            onChange={handleChange}
                        />
                        {errors.title === true && (
                            <div className='fv-plugins-message-container '>
                                <div className='fv-help-block'>Title field is required</div>
                            </div>
                        )}
                    </div>
                    <div className="row g-9 mb-8">
                        <div className="col-md-4 fv-row">
                            <label className="required fs-6 fw-bold mb-2">Service</label>
                            <select
                                className="form-select form-select-solid"
                                data-placeholder="Select a service"
                                name="service"
                                value={data.service}
                                onChange={handleChange}
                            >
                                <option value="">Select a product...</option>
                                <option value="Analyse">Analyse</option>
                            </select>
                            {errors.service === true && (
                                <div className='fv-plugins-message-container '>
                                    <div className='fv-help-block'>Service field is required</div>
                                </div>
                            )}
                        </div>
                        <div className="col-md-4 fv-row">
                            <label className="required fs-6 fw-bold mb-2">Status</label>
                            <select
                                className="form-select form-select-solid"
                                data-placeholder="Select status"
                                name="status"
                                value={data.status}
                                onChange={handleChange}
                            >
                                <option value="private">Private</option>
                                <option value="public">Public</option>
                            </select>
                        </div>
                        <div className="col-md-4 fv-row">
                            <label className="required fs-6 fw-bold mb-2">State</label>
                            <select
                                className="form-select form-select-solid"
                                data-placeholder="Select state"
                                name="state"
                                value={data.state}
                                onChange={handleChange}
                            >
                                <option value="Open">Open</option>
                                <option value="Close">Close</option>
                                <option value="Draft">Draft</option>
                            </select>
                        </div>
                    </div>
                    <div className="d-flex flex-column mb-8 fv-row">
                        <label className="fs-6 fw-bold mb-2">Description</label>
                        <textarea
                            className="form-control form-control-solid"
                            rows={4}
                            name="description"
                            placeholder="Type your ticket description"
                            value={data.description}
                            onChange={handleChange}
                        ></textarea>
                        {errors.description === true && (
                            <div className='fv-plugins-message-container '>
                                <div className='fv-help-block'>Description field is required</div>
                            </div>
                        )}
                    </div>
                    <Attachments
                        save={save}
                        initialData={attachments}
                        setEdit={setEdit}
                        handleMediaDataChanged={handleMediaDataChanged}
                    />
                </div>
                <div className="modal-footer justify-content-center ">
                    <div className="text-center">
                        <button
                            type="reset"
                            className="btn btn-light me-3"
                            disabled={loading}
                            onClick={handleCloseModal}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading || !isEdit}
                            onClick={handleSubmit}
                        >
                            {!loading && <span className="indicator-label">Submit</span>}
                            {loading && (
                                <span className='indicator-progress' style={{ display: 'block' }}>
                                    Please wait...{' '}
                                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { CreateTicketModal };