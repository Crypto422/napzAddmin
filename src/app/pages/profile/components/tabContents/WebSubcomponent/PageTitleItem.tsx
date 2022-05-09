import * as React from 'react';
/* eslint-disable jsx-a11y/anchor-is-valid */
import Parse from 'html-react-parser'

const PageTitleItem = (props: any) => {
    const { title, url } = props;
    return (
        <div className='d-flex align-items-left justify-content-left mb-2'>
            <a href={url}
                className='text-dark text-gray-800 text-hover-primary fs-6'
                target='_blank'
                rel='noreferrer'
            >
                {Parse(title)}
            </a>
        </div>
    )
}

export default PageTitleItem;