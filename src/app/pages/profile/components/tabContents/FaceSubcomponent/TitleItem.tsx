import * as React from 'react';
/* eslint-disable jsx-a11y/anchor-is-valid */
const TitleItem = (props: any) => {
    const {count} = props;
    return (
        <tr >
            <td style={{width: '100%' }} colSpan={3}>
                <div className='d-flex align-items-left justify-content-left'>
                    <a className='text-dark fw-bolder  text-hover-primary fs-3'
                    style={{ width: 'max-content'  }}
                    >
                        Face&nbsp;{count}
                    </a>
                </div>
            </td>
        </tr>
    )
}

export default TitleItem;