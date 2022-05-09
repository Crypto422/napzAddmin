import * as React from 'react';

const ObjectLabelItem = (props: any) => {
    const { value , index, handleHover} = props;
    const MouseOver = () => {
        handleHover(index);
    }
    return (
        <div className='d-flex align-items-center w-100  flex-column btn btn-active-light-danger mt-3' onMouseOver={MouseOver}>
            <div className='d-flex justify-content-between w-100 '>
                <span className='timeline-content fw-bolder text-gray-800'>{value.name}</span>
                <span className='fw-bolder fs-6'>{Math.round(value.score * 100)}%</span>
            </div>
            <div className='h-5px mx-3 w-100 bg-light '>
                <div
                    className='bg-primary rounded h-5px'
                    role='progressbar'
                    style={{ width: `${Math.round(value.score * 100)}%` }}
                ></div>
            </div>
        </div>
    )
}

export default ObjectLabelItem;