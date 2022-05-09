import * as React from 'react';
import LogoLabelItem from './LogoSubcomponent/LabelItem';
import { v4 as uuid } from 'uuid';
import LogoCanvas from './LogoSubcomponent/LogoCanvas';
import { useState } from 'react';

const LabelTabContent = (props: any) => {
    const { analyse, isFirst, data, imgURL, style } = props;
    const [selectedLogo, setSeletedLogo] = useState<any>('');

    const handleHover = (index: any) => {
        setSeletedLogo(index);
    }


    const getUid = () => {
        return uuid();
    }
    return (
        <div className={`tab-pane fade show ${analyse && isFirst && 'active'}`} id='logo' role="tabpanel">
            <div className="row gy-5 g-xl-8">
                <div className="col-12  col-xl-7" style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                    <div className=' position-relative' style={{ width: '100%', maxWidth: 'fit-content' }}>
                        <LogoCanvas logos={data} selectedLogo={selectedLogo} imgUrl={imgURL} />
                    </div>
                </div>
                <div className="col-12  col-xl-5" style={{ background: '#12121b',borderRadius: '2%' }}>
                    <div className='table-responsive' style={style}>
                        {data.map((itemdata: any, index: any) => {
                            return (
                                <LogoLabelItem
                                    key={getUid()}
                                    value={itemdata}
                                    index={index}
                                    handleHover={handleHover}
                                />
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LabelTabContent;