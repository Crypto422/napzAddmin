/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { RootState } from '../../../../../setup';
import { UserModel } from '../../../auth/models/UserModel';
import { shallowEqual, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import Loading from './Loading';

const CommentItem = (props: any) => {
    const { comment } = props;
    const users: UserModel[] = useSelector<RootState>(({ auth }) => auth.usersData, shallowEqual) as UserModel[]
    const [commentCreactor, setCommentCreatorData] = useState<any>();
    const [colorId, setColorId] = useState<any>('');
    const [agoTime, setAgoTime] = useState<string>('');

    useEffect(() => {
        if (users !== undefined) {
            let uid = comment.user_id;
            let creator = users.filter((user: UserModel) => user.id === uid);
            setCommentCreatorData(creator[0]);
        }
    }, [comment, users])

    const colors = ['primary', 'success', 'info', 'warning', 'danger']
    const handleColorId = (char: string) => {
        const array1 = ['a', 'j', 'k', 't', 'u']
        const array2 = ['b', 'i', 'l', 's', 'v']
        const array3 = ['c', 'h', 'm', 'r', 'w']
        const array4 = ['d', 'g', 'n', 'q', 'x']
        const array5 = ['e', 'f', 'o', 'p', 'y', 'z']
        if (array1.includes(char)) {
            return 0;
        } else if (array2.includes(char)) {
            return 1;
        } else if (array3.includes(char)) {
            return 2;
        } else if (array4.includes(char)) {
            return 3;
        } else if (array5.includes(char)) {
            return 4;
        }
    }

    useEffect(() => {
        let colorId = handleColorId(commentCreactor?.username?.slice(0, 1).toLowerCase()) || 0;
        setColorId(colorId);

    }, [commentCreactor])

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
        if (comment !== undefined) {
            const diff = calcDate(new Date(), new Date(comment.created_date));
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
    }, [comment])
    return (
        <>
            {
                commentCreactor !== undefined ?
                    <div className="mb-3">
                        <div className="mb-3">
                            <div className="card card-bordered w-100">
                                <div className="card-body">
                                    <div className="w-100 d-flex flex-stack mb-8">
                                        <div className="d-flex align-items-center f">

                                            {
                                                commentCreactor?.avatar_url?.length > 0 ?
                                                    <div
                                                        className="symbol symbol-50px me-5"
                                                        data-bs-toggle="tooltip"
                                                        title={commentCreactor.username}
                                                    >
                                                        <img alt="Pic" src={commentCreactor.avatar_url} />
                                                    </div>
                                                    :
                                                    <div className="symbol symbol-50px me-5">
                                                        <div className={`symbol-label bg-light-${colors[colorId]} text-${colors[colorId]} fw-bolder`}>
                                                            {commentCreactor?.username?.slice(0, 1).toUpperCase()}
                                                        </div>
                                                    </div>
                                            }
                                            <div className="d-flex flex-column fw-bold fs-5 text-gray-600 text-dark">
                                                <div className="d-flex align-items-center">
                                                    <a className="text-gray-800 fw-bolder text-hover-primary fs-5 me-3">
                                                        {commentCreactor.name}
                                                    </a>
                                                    <span className="m-0"></span>
                                                </div>
                                                <span className="text-muted fw-bold fs-6">{
                                                    agoTime
                                                }</span>
                                            </div>
                                        </div>
                                        <div className="m-0">
                                            <button className="btn btn-color-gray-400 btn-active-color-primary p-0 fw-bolder">Reply</button>
                                        </div>
                                    </div>
                                    <p className="fw-normal fs-5 text-gray-700 m-0">
                                        {
                                            comment.description
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div> :
                    <Loading />
            }
        </>
    )
}

export { CommentItem }