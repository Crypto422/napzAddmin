import * as React from 'react';
/* eslint-disable jsx-a11y/anchor-is-valid */
const NoPreUpload = () => {
    return (
        <tr >
            <td style={{width: '100%' }} colSpan={7}>
                <div className='d-flex align-items-center justify-content-center'>
                    <a className='text-dark fw-bolder text-hover-primary fs-6'
                    style={{ width: 'max-content'  }}
                    >
                        No previous uploads yet
                    </a>
                </div>
            </td>
        </tr>
    )
}

export default NoPreUpload;