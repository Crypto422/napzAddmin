import * as React from 'react';
/* eslint-disable jsx-a11y/anchor-is-valid */

const BestGuessLabelsItem = (props: any) => {
    const { label } = props;
    return (
        <div className='d-flex align-items-left justify-content-left mb-2'>
            <a className='text-dark text-gray-800 text-hover-primary fs-6'
            >
                {label}
            </a>
        </div>
    )
}

export default BestGuessLabelsItem;