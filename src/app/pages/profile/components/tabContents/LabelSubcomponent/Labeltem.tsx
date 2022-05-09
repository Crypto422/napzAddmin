import * as React from 'react';

const LabelItem = (props: any) => {
    const { value } = props;
    return (
        <div className='d-flex align-items-center w-100  flex-column mt-3'>
            <div className='d-flex justify-content-between w-100 mt-auto mb-2'>
                <span className='timeline-content fw-bolder text-gray-800'>{value.description}</span>
                <span className='fw-bolder fs-6'>{Math.round(value.score * 100)}%</span>
            </div>
            <div className='h-5px mx-3 w-100 bg-light mb-3'>
                <div
                    className='bg-warning rounded h-5px'
                    role='progressbar'
                    style={{ width: `${Math.round(value.score * 100)}%` }}
                ></div>
            </div>
        </div>
    )
}

export default LabelItem;
