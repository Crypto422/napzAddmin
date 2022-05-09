import * as React from 'react';

const TextItem = (props: any) => {
    const { value,index, handleHover } = props;
    const MouseOver = () => {
        handleHover(index);
    }
    return (
        <div className='d-flex align-items-center w-100  flex-column btn btn-active-light-warning' onMouseOver={MouseOver}>
            <div className='d-flex justify-content-between w-100 '>
                <span className='timeline-content fw-bolder text-gray-800'>{value}</span>
            </div>
        </div>
    )
}

export default TextItem;