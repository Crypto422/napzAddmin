/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import RatingStar from '../ExplicitSubcomponent/RatingStar';
import { useState, useEffect } from 'react';


const LabelItem = (props: any) => {
    const { title, value } = props;
    const [state, setState] = useState<any>([]);
    const [desc, setDesc] = useState<any>('');

    useEffect(() => {
        switch (value) {
            case "UNKNOWN":
                setState([true, false, false, false, false]);
                setDesc('Unknown')
                break;
            case "VERY_UNLIKELY":
                setState([true, false, false, false, false]);
                setDesc('Very Unlikely')
                break;
            case "UNLIKELY":
                setState([true, true, false, false, false]);
                setDesc('Unlikely')
                break;
            case "POSSIBLE":
                setState([true, true, true, false, false]);
                setDesc('Possible')
                break;
            case "LIKELY":
                setState([true, true, true, true, false]);
                setDesc('Likely')
                break;
            case "VERY_LIKELY":
                setState([true, true, true, true, true]);
                setDesc('Very Likely')
                break;

            default:
                break;
        }
        // eslint-disable-next-line
    }, [])



    return (
        <tr>
            <td >
                <div className='d-flex justify-content-center flex-column' >
                    <a className='text-dark text-gray-800 fw-bolder text-hover-primary fs-6' style={{ textAlign: 'left', padding: 0 }}>
                        {title}
                    </a>
                </div>
            </td>
            <td >
                <div className='rating' style={{ justifyContent: 'center'}}>
                    {
                        state.map((value: any, index: any) => {
                            return (
                                <RatingStar key={index} checked={value} />
                            )
                        })
                    }
                </div>
            </td >
            <td >
                <div className='d-flex justify-content-end flex-column'  >
                    <a className='text-dark text-gray-800 text-hover-primary fs-8' style={{ textAlign: 'right', padding: 0 ,whiteSpace: 'nowrap'}}>
                        {desc}
                    </a>
                </div>
            </td>
        </tr>
    )
}

export default LabelItem;