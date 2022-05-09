import * as React from 'react';
/* eslint-disable jsx-a11y/anchor-is-valid */
const TitleItem = (props: any) => {
    const { title } = props;
    return (
        <div className='d-flex align-items-left justify-content-left mt-6 mb-3'>
            <a className='text-dark fw-bolder text-hover-primary fs-3'
            >
                {title}
            </a>
        </div>
    )
}

export default TitleItem;