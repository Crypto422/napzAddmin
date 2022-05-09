/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { KTSVG } from '../../../../../_metronic/helpers';
import { TicketDataModel } from '../models/TicketModel';
import { RootState } from '../../../../../setup';
import { shallowEqual, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { getTicketById, updateTicketData } from '../../redux/TicketCRUD';
import * as support from '../../redux/TicketsRedux'
import dateFormat from "dateformat";
import Fuse from 'fuse.js';
import Loading from '../Loading';
import { UserModel } from '../../../auth/models/UserModel';
import { CommentModel } from '../models/CommentModel';
import { CommentItem } from './CommentItem';
import { v4 as uuid } from 'uuid';
import { useWebSocket } from '../../../../../setup/context/WebSocketContext';
import Pagenation from './pagination/Pagenation';
import { AttachmentItem } from './AttachmentsItem';
import Modal from 'react-modal';
import { CreateTicketModal } from '../../components/CreateTicketModal';

const ViewTickets = () => {
    const ticketData: TicketDataModel = useSelector<RootState>(({ support }) => support.ticketData, shallowEqual) as TicketDataModel;
    const ticketCreatorData: UserModel = useSelector<RootState>(({ support }) => support.ticketCreatorData, shallowEqual) as UserModel;
    const user: UserModel = useSelector<RootState>(({ auth }) => auth.user, shallowEqual) as UserModel;
    const [agoTime, setAgoTime] = useState<string>('');
    const [reply, setReply] = useState<string>('');
    const [comments, setComments] = useState<CommentModel[]>([]);
    const [attachments, setAttachments] = useState<any[]>([])
    const [totalComments, setTotalComments] = useState<CommentModel[]>([]);
    const dispatch = useDispatch();
    const { sendSocketMsg } = useWebSocket();
    const { id } = useParams<any>();
    const [loading, setLoading] = useState<boolean>(false);
    const [edited, setEdited] = useState<boolean>(false);
    const [searchValue, setSearchValue] = useState<string>('');

    const [data, setData] = useState<any>({
        id: ticketData?.id || "",
        title: ticketData?.title || "",
        service: ticketData?.service || "",
        status: ticketData?.status || "",
        state: ticketData?.state || "",
        description: ticketData?.description || "",
        attachments: ticketData?.attachments || [],
        comments: ticketData?.comments || [],
        readers: ticketData?.readers || [],
        user_id: ticketData?.user_id || "",
        created_date: ticketData?.created_date || "",
        updated_date: ticketData?.updated_date || ""
    })

    const [currentPage, setCurrentPage] = useState(1);
    let PageSize = 1;
    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return totalComments.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, totalComments, PageSize]);

    const handlePageChange = (props: any) => {
        let page = parseInt(props);
        let itemscount = (page - 1) * PageSize;
        if (itemscount < totalComments.length) {
            setCurrentPage(props);
        } else {
            setCurrentPage(currentPage + 1)
        }
    }

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


    const searchData = () => {
        let comment = JSON.parse(ticketData?.comments);
        if (!searchValue) {
            setTotalComments(comment);
            return;
        }

        const fuse = new Fuse(comment, {
            keys: ["description"]
        })

        const result = fuse.search(searchValue);
        const matches: any = [];
        if (!result.length) {
            setTotalComments([]);
        } else {
            result.forEach(({ item }) => {
                matches.push(item);
            });
            setTotalComments(matches);
        }
    }

    const handleSearch = (event: any) => {
        let value = event.target.value;
        setSearchValue(value);
    }

    useEffect(() => {
        searchData();
        // eslint-disable-next-line
    }, [searchValue])

    useEffect(() => {
       setComments([...currentTableData])
        //eslint-disable-next-line
    }, [currentTableData])



    useEffect(() => {
        if (ticketData !== undefined && ticketData !== null) {
            data['id'] = ticketData.id;
            data['title'] = ticketData.title;
            data['service'] = ticketData.service;
            data['status'] = ticketData.status;
            data['state'] = ticketData.state;
            data['description'] = ticketData.description;
            data['attachments'] = JSON.parse(ticketData.attachments);
            data['comments'] = JSON.parse(ticketData.comments);
            data['readers'] = JSON.parse(ticketData.readers);
            data['user_id'] = ticketData.user_id;
            data['created_date'] = ticketData.created_date;
            data['updated_date'] = ticketData.updated_date;
            setData(data);
        }
        // eslint-disable-next-line
    }, [ticketData])

    useEffect(() => {
        if (ticketData !== undefined) {
            let comment = JSON.parse(ticketData?.comments);
            setTotalComments(comment);
            let attachments = JSON.parse(ticketData?.attachments);
            setAttachments(attachments);
        }
    }, [ticketData])

    const handleData = () => {
        if (id !== undefined) {
            getTicketById(id)
                .then((res) => {
                    let { data } = res;
                    dispatch(support.actions.setTicketData(data))
                })
                .catch((err) => {
                })
        }
    }

    useEffect(() => {
        // @ts-ignore
        dispatch(support.actions.setTicketData(undefined))
        handleData()
        // eslint-disable-next-line
    }, [])

    const getUid = () => {
        return uuid();
    }

    const handleChange = (event: any) => {
        let value = event.target.value;
        setReply(value);
        if (reply.length > 0) {
            setEdited(true);
        } else {
            setEdited(false);
        }
    }

    function calcDate(date1: Date, date2: Date) {
        const diff = Math.floor(date1.getTime() - date2.getTime());
        const day = 1000 * 60 * 60 * 24;

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 3600));
        const days = Math.floor(diff / day);
        const months = Math.floor(days / 31);
        const years = Math.floor(months / 12);
        return {
            years: years,
            months: months,
            days: days,
            hours: hours,
            minutes: minutes,
            seconds: seconds
        }
    }

    useEffect(() => {
        if (ticketData !== undefined) {
            const diff = calcDate(new Date(), new Date(ticketData.created_date));
            if (diff.years > 0) {
                setAgoTime(`${diff.years} Years ago`)
            } else if (diff.months > 0) {
                setAgoTime(`${diff.months} Months ago`)
            } else if (diff.days > 0) {
                setAgoTime(`${diff.days} Days ago`)
            } else if (diff.hours > 0) {
                setAgoTime(`${diff.hours} Hours ago`)
            } else if (diff.minutes > 0) {
                setAgoTime(`${diff.minutes} Minutes ago`)
            } else if (diff.seconds > 0) {
                setAgoTime(`${diff.seconds} Seconds ago`)
            } else {
                setAgoTime('1 Seconds ago')
            }
        }
    }, [ticketData])

    const handleSendSocketMsg = () => {
        let msg: any = {
            type: 'UpdateTicket',
            body: `${ticketData.id}`
        }
        sendSocketMsg(JSON.stringify(msg))
    }

    const handleSubmit = () => {
        setLoading(true)
        let newComment = {
            id: getUid(),
            description: reply,
            user_id: user.id,
            created_date: new Date().toISOString()
        }

        let newComments = data.comments;
        newComments.push(newComment);
        data['comments'] = newComments;
        setData(data);

        updateTicketData(data.id, data)
            .then((res) => {
                let { data } = res
                handleSendSocketMsg();
                dispatch(support.actions.setTicketData(data))
                setReply('');
                setEdited(false);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
            })
    }

    return (
        <div className="card">
            <div className="card-body">
                {
                    ticketData !== undefined && ticketCreatorData !== undefined ?
                        <div className="d-flex flex-column flex-xl-row p-7">
                            <div className="flex-lg-row-fluid me-xl-15 mb-20 mb-xl-0">
                                <div className="mb-0">
                                    <div className="d-flex align-items-center flex-stack flex-wrap mb-12">
                                        <div className='d-flex flex-wrap'>
                                            {
                                                ticketData.state === 'Open' ?
                                                    <KTSVG
                                                        className="svg-icon svg-icon-4qx svg-icon-success ms-n2 me-3"
                                                        path="/media/icons/duotune/general/gen048.svg"
                                                    /> : <></>
                                            }{
                                                ticketData.state === 'Close' ?
                                                    <KTSVG
                                                        className="svg-icon svg-icon-4qx svg-icon-danger ms-n2 me-3"
                                                        path="/media/icons/duotune/general/gen051.svg"
                                                    /> : <></>
                                            }{
                                                ticketData.state === 'Draft' ?
                                                    <KTSVG
                                                        className="svg-icon svg-icon-4qx svg-icon-warning ms-n2 me-3"
                                                        path="/media/icons/duotune/general/gen045.svg"
                                                    /> : <></>
                                            }
                                            <div className="d-flex flex-column">
                                                <h1 className="text-gray-800 fw-bold">
                                                    {ticketData.title}
                                                </h1>
                                                <div className="">
                                                    <span className="fw-bold text-muted me-6">Sevice:&nbsp;
                                                        <a className="text-muted text-hover-primary">{ticketData.service}</a></span>
                                                    <span className="fw-bold text-muted me-6">By:&nbsp;
                                                        <a className="text-muted text-hover-primary">{ticketCreatorData.name}</a></span>
                                                    <span className="fw-bold text-muted">Created:&nbsp;
                                                        <span className="fw-bolder text-gray-600 me-1">
                                                            {agoTime}
                                                        </span>
                                                        ({dateFormat(new Date(ticketData.created_date), "mediumDate")})
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            type='button'
                                            className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
                                            data-kt-menu-trigger='click'
                                            data-kt-menu-placement='bottom-end'
                                            data-kt-menu-flip='top-end'
                                        >
                                            <KTSVG path='/media/icons/duotune/general/gen024.svg' className='svg-icon-2' />
                                        </button>
                                        <div
                                            className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary fw-bold w-200px py-3'
                                            data-kt-menu='true'
                                        >
                                            <div className='menu-item px-3'>
                                                <a
                                                    onClick={openModal}
                                                    className='menu-link flex-stack px-3'
                                                >
                                                    Edit
                                                    <i
                                                        className='fas fa-folder-download ms-2 fs-7'
                                                        data-bs-toggle='tooltip'
                                                        title='Edit ticket'
                                                    ></i>
                                                </a>
                                            </div>
                                        </div>
                                        <Modal
                                            isOpen={modalIsOpen}
                                            onRequestClose={closeModal}
                                            style={customStyles}
                                            ariaHideApp={false}
                                            contentLabel="Create Ticket"
                                        >
                                            <CreateTicketModal
                                                ticketData={ticketData}
                                                isCreate={false}
                                                closeModal={closeModal}
                                            />
                                        </Modal>
                                    </div>
                                    <div className="mb-15">
                                        <div className="mb-15 fs-5 fw-normal text-gray-800">
                                            <div className="mb-5 fs-15 fw-bold">
                                                Description
                                            </div>
                                            <div className="mb-10">
                                                {ticketData.description}
                                            </div>
                                        </div>
                                        <div className="mb-0">
                                            <textarea
                                                className="form-control form-control-solid placeholder-gray-300  fs-4 ps-9 pt-7"
                                                rows={6}
                                                placeholder="Share Your Knowledge"
                                                value={reply}
                                                onChange={handleChange}
                                            >
                                            </textarea>
                                            <button
                                                type="submit"
                                                className="btn btn-primary mt-n20 mb-20 position-relative float-end me-7"
                                                onClick={handleSubmit}
                                                disabled={!edited}
                                            >
                                                {!loading && <span >Send</span>}
                                                {loading && (
                                                    <span className='indicator-progress' style={{ display: 'block' }}>
                                                        Sending...{' '}
                                                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                                    </span>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    {
                                        comments.map((comment: CommentModel) => {
                                            return (
                                                <CommentItem
                                                    key={comment.id}
                                                    comment={comment}
                                                />
                                            )
                                        })
                                    }
                                </div>
                                <Pagenation
                                    currentPage={currentPage}
                                    totalCount={totalComments.length}
                                    pageSize={PageSize}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                            <div className="flex-column flex-lg-row-auto w-100 mw-lg-300px mw-xxl-350px">
                                <div className="position-relative mb-15">
                                    <KTSVG
                                        className="svg-icon svg-icon-1 svg-icon-primary position-absolute top-50 translate-middle ms-9"
                                        path="/media/icons/duotune/general/gen021.svg"
                                    />
                                    <input
                                        type="text"
                                        className="form-control form-control-lg form-control-solid ps-14"
                                        name="search"
                                        placeholder="Search by description"
                                        value={searchValue}
                                        onChange={handleSearch}
                                    />
                                </div>
                                <div className="card-rounded bg-primary bg-opacity-5 p-10 mb-15">
                                    <h2 className="text-dark fw-bolder mb-11">More Channels</h2>
                                    <div className="d-flex align-items-center mb-10">
                                        <i className="bi bi-file-earmark-text text-primary fs-1 me-5"></i>
                                        <div className="d-flex flex-column">
                                            <h5 className="text-gray-800 fw-bolder">Project Briefing</h5>
                                            <div className="fw-bold">
                                                <span className="text-muted">Check out our</span>
                                                <a className="link-primary">&nbsp;Support Policy</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center mb-10">
                                        <i className="bi bi-chat-square-text-fill text-primary fs-1 me-5"></i>
                                        <div className="d-flex flex-column">
                                            <h5 className="text-gray-800 fw-bolder">More to discuss?</h5>
                                            <div className="fw-bold">
                                                <span className="text-muted">Email us to</span>
                                                <a className="link-primary">&nbsp;support@keenthemes.com</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center mb-10">
                                        <i className="bi bi-twitter text-primary fs-1 me-5"></i>
                                        <div className="d-flex flex-column">
                                            <h5 className="text-gray-800 fw-bolder">Latest News</h5>
                                            <div className="fw-bold">
                                                <span className="text-muted">Follow us at</span>
                                                <a className="link-primary">&nbsp;KeenThemes Twitter</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <i className="bi bi-github text-primary fs-1 me-5"></i>
                                        <div className="d-flex flex-column">
                                            <h5 className="text-gray-800 fw-bolder">Github Access</h5>
                                            <div className="fw-bold">
                                                <span className="text-muted">Our github repo</span>
                                                <a className="link-primary">&nbsp;KeenThemes Github</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-rounded bg-primary bg-opacity-5 p-10 mb-15">
                                    <h1 className="fw-bolder text-dark mb-9">Documentation</h1>
                                    <div className="d-flex align-items-center mb-6">
                                        <KTSVG
                                            className="svg-icon svg-icon-2 ms-n1 me-3"
                                            path="/media/icons/duotune/arrows/arr071"
                                        />
                                        <a className="fw-bold text-gray-800 text-hover-primary fs-5 m-0">Angular Admin</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <Loading />
                }
                {
                    ticketData !== undefined && attachments.length > 0 ?
                        <div className="card-rounded bg-primary bg-opacity-5 card-flush h-lg-100" style={{ margin: '23px' }}>
                            <div className="card-header mt-6">
                                <div className="card-title flex-column">
                                    <h3 className="fw-bolder mb-1">
                                        Attachments
                                    </h3>
                                    {
                                        ticketData !== undefined ?
                                            <div className="fs-6 fw-bold text-gray-400">Total {attachments.length} Files</div>
                                            : <></>
                                    }
                                </div>
                            </div>
                            {
                                ticketData !== undefined ?
                                    <div className="card-body p-9 pt-0" style={{ overflow: 'auto' }}>
                                        {
                                            attachments.map((item: any) => {
                                                return (
                                                    <AttachmentItem
                                                        key={getUid()}
                                                        initialData={item}
                                                    />
                                                )
                                            })
                                        }
                                    </div>
                                    :
                                    <></>
                            }
                        </div>
                        : <></>
                }
            </div>
        </div>
    )
}

export { ViewTickets };