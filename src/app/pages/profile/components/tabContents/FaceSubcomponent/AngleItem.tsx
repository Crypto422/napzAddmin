/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';


const AngleItem = (props: any) => {
    const { roll, pan, tilt } = props;

    const handleColor = (props: any) => {
        let value = Math.round(props);
        if (value <= 0) {
            return 'badge-light-danger'
        }
        else if (value > 0 && value < 10) {
            return 'badge-light-info'
        }
        else if (value >=10)
            return 'badge-light-success';
    }
    return (
        <tr>
            <td style={{ width: '100%' }} colSpan={3}>
                <div className='d-flex align-items-center justify-content-center' >
                    <span className={`badge fs-7 fw-bolder ${handleColor(roll)}`} >
                        Roll &nbsp; {Math.round(roll)}&#176;
                    </span>
                    <span className={`badge fs-7 fw-bolder ${handleColor(tilt)}`} style={{ marginLeft: 5, marginRight: 5 }}>
                        Tilt  &nbsp; {Math.round(tilt)}&#176;
                    </span>
                    <span className={`badge fs-7 fw-bolder ${handleColor(pan)}`}>
                        Pan &nbsp; {Math.round(pan)}&#176;
                    </span>
                </div>
            </td>
        </tr>
    )
}

export default AngleItem;