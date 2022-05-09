import * as React from 'react';

const EntitiesItem = (props: any) => {
    const { value } = props;
    let percent = Math.min(Math.round(value.score * 100), 100)
    return (
        <div className='d-flex align-items-center w-100  flex-column mb-3'>
            <div className='d-flex justify-content-between w-100 mt-auto mb-2'>
                <span className='timeline-content fw-bolder text-gray-800'>{value.description}</span>
                <span className='fw-bolder fs-6'>{percent}%</span>
            </div>
            <div className='h-5px mx-3 w-100 bg-light mb-3'>
                <div
                    className='bg-warning rounded h-5px'
                    role='progressbar'
                    style={{ width: `${percent}%` }}
                ></div>
            </div>
        </div>
    )
}

export default EntitiesItem;