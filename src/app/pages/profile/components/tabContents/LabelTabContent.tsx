import * as React from 'react';
import LabelItem from './LabelSubcomponent/Labeltem';
import { v4 as uuid } from 'uuid';

const LabelTabContent = (props: any) => {
    const { analyse, isFirst, data, imgURL, style } = props;
    const getUid = () => {
        return uuid();
    }
    return (
        <div className={`tab-pane fade show ${analyse && isFirst && 'active'}`} id='label' role="tabpanel">
            <div className="row gy-5 g-xl-8">
                <div className="col-12  col-xl-7" style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                    <div className=' position-relative' style={{ width: '100%', maxWidth: 'fit-content' }}>
                        <img id='imageid' style={{ maxHeight: '500px',opacity: "100%", width: 'inherit' }} src={imgURL} alt='UploadImage' />
                    </div>
                </div>
                <div className="col-12  col-xl-5 " style={{ background: '#12121b',borderRadius: '2%' }}>
                    <div className='table-responsive' style={style}>
                        {data.map((itemdata: any, index: any) => {
                            return (
                                <LabelItem key={getUid()} value={itemdata} />
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LabelTabContent;