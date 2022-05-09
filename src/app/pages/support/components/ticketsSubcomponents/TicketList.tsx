/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { KTSVG } from '../../../../../_metronic/helpers';
import Fuse from 'fuse.js';
import Pagenation from '../pagination/Pagenation';
import { TicketDataModel } from '../models/TicketModel';
import { shallowEqual, useSelector } from 'react-redux'
import { RootState } from '../../../../../setup'
import Loading from '../Loading';
import { useState, useEffect, useMemo } from 'react';
import { TicketItem } from './TicketItem';
import { getTickets } from '../../redux/TicketCRUD';
import { UserModel } from '../../../auth/models/UserModel';
import { useDispatch } from 'react-redux';
import * as support from '../../redux/TicketsRedux';

const TicketList = () => {
    const tickets: TicketDataModel[] = useSelector<RootState>(({ support }) => support.tickets, shallowEqual) as TicketDataModel[];
    const user: UserModel = useSelector<RootState>(({ auth }) => auth.user, shallowEqual) as UserModel
    const [loading, setLoading] = useState<boolean>(false);
    const [totalTicketItems, setTotalTicketItems] = useState<any>([]);
    const dispatch = useDispatch();
    const [ticketItems, setTicketItems] = useState<any>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState<string>('');
    let PageSize = 10;
    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return totalTicketItems.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, totalTicketItems, PageSize]);

    const handlePageChange = (props: any) => {
        let page = parseInt(props);
        let itemscount = (page - 1) * PageSize;
        if (itemscount < totalTicketItems.length) {
            setCurrentPage(props);
        } else {
            setCurrentPage(currentPage + 1)
        }
    }

    const searchData = () => {
        if (!searchValue) {
            setTotalTicketItems(tickets);
            return;
        }

        const fuse = new Fuse(tickets, {
            keys: ["title"]
        })

        const result = fuse.search(searchValue);
        const matches: any = [];
        if (!result.length) {
            setTotalTicketItems([]);
        } else {
            result.forEach(({ item }) => {
                matches.push(item);
            });
            setTotalTicketItems(matches);
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
        setTicketItems([...currentTableData]);
        //eslint-disable-next-line
    }, [currentTableData])

    useEffect(() => {
        setLoading(true);
        getTickets()
            .then((res) => {
                let { data } = res;
                let newTicketsData: any = [];
                data.forEach((doc) => {
                    newTicketsData.push({ ...doc });
                });
                newTicketsData = newTicketsData.filter((ticket: any) => ticket.user_id === user?.id || ticket.status === 'public')
                dispatch(support.actions.setTickets(newTicketsData))
                setTotalTicketItems(newTicketsData)
                setLoading(false)
            })
            .catch((err) => {
                setLoading(false)
            })
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (tickets !== undefined) {
            searchData();
        }
        // eslint-disable-next-line
    }, [tickets])

    return (
        <div className="card">
            <div className="card-body">
                <div className="d-flex flex-column flex-xl-row p-7">
                    <div className="flex-lg-row-fluid me-xl-15 mb-20 mb-xl-0">
                        <div className="mb-0">
                            <div className="position-relative mb-15">
                                <KTSVG
                                    className="svg-icon svg-icon-1 svg-icon-primary position-absolute top-50 translate-middle ms-9"
                                    path="/media/icons/duotune/general/gen021.svg"
                                />
                                <input
                                    type="text"
                                    className="form-control form-control-lg form-control-solid ps-14"
                                    placeholder="Search by title"
                                    value={searchValue}
                                    onChange={handleSearch}
                                />
                            </div>
                            <h1 className="text-dark mb-10">Public Tickets</h1>
                            {loading ? (
                                <Loading />
                            ) : (
                                ticketItems.map((item: any) => {
                                    return (
                                        <TicketItem
                                            key={item.id}
                                            ticketData={item}
                                        />
                                    );
                                })
                            )
                            }
                            <Pagenation
                                currentPage={currentPage}
                                totalCount={totalTicketItems.length}
                                pageSize={PageSize}
                                onPageChange={handlePageChange}
                            />
                        </div>

                    </div>
                    <div className="flex-column flex-lg-row-auto w-100 mw-lg-300px mw-xxl-350px">
                        <div className="card-rounded bg-primary bg-opacity-5 p-10 mb-15">
                            <h2 className="text-dark fw-bolder mb-11">More Channels</h2>
                            <div className="d-flex align-items-center mb-10">
                                <i className="bi bi-file-earmark-text text-primary fs-1 me-5"></i>
                                <div className="d-flex flex-column">
                                    <h5 className="text-gray-800 fw-bolder">Project Briefing</h5>
                                    <div className="fw-bold">
                                        <span className="text-muted">Check out our</span>
                                        <a  className="link-primary">&nbsp;Support Policy</a>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center mb-10">
                                <i className="bi bi-chat-square-text-fill text-primary fs-1 me-5"></i>
                                <div className="d-flex flex-column">
                                    <h5 className="text-gray-800 fw-bolder">More to discuss?</h5>
                                    <div className="fw-bold">
                                        <span className="text-muted">Email us to</span>
                                        <a  className="link-primary">&nbsp;support@keenthemes.com</a>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center mb-10">
                                <i className="bi bi-twitter text-primary fs-1 me-5"></i>
                                <div className="d-flex flex-column">
                                    <h5 className="text-gray-800 fw-bolder">Latest News</h5>
                                    <div className="fw-bold">
                                        <span className="text-muted">Follow us at</span>
                                        <a  className="link-primary">&nbsp;KeenThemes Twitter</a>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <i className="bi bi-github text-primary fs-1 me-5"></i>
                                <div className="d-flex flex-column">
                                    <h5 className="text-gray-800 fw-bolder">Github Access</h5>
                                    <div className="fw-bold">
                                        <span className="text-muted">Our github repo</span>
                                        <a  className="link-primary">&nbsp;KeenThemes Github</a>
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
                                <a  className="fw-bold text-gray-800 text-hover-primary fs-5 m-0">Angular Admin</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { TicketList };