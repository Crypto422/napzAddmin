import * as React from 'react';

const ConfidenceItem = (props: any) => {
    const { value } = props;
    return (
        <tr>
            <td className='text-end' colSpan={3}>
                <div className='d-flex flex-column w-100 me-2'>
                    <div className='d-flex flex-stack mb-2'>
                        <span className='timeline-content fw-bolder text-gray-800'>Confidence</span>
                        <span className='fw-bolder fs-6'>{Math.round(value * 100)}%</span>
                    </div>
                    <div className='progress h-6px w-100'>
                        <div
                            className='progress-bar bg-success'
                            role='progressbar'
                            style={{ width: `${Math.round(value * 100)}%` }}
                        ></div>
                    </div>
                </div>
            </td>

        </tr>
    )
}

export default ConfidenceItem;