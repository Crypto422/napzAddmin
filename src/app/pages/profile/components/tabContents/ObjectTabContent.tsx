/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import LabelItem from './ObjectSubComponent/Labeltem';
import { v4 as uuid } from 'uuid';
import ObjectCanvas from './ObjectSubComponent/ObjectCanvas';
import { useState } from 'react';

const ObjectTabContent = (props: any) => {
    const { analyse, isFirst, data, imgURL, style } = props;
   const [selectedObject, setSeletedObject] = useState<any>('')
    const getUid = () => {
        return uuid();
    }

    const handleHover = (index: any) => {
        setSeletedObject(index);
    }

    return (
        <div className={`tab-pane fade show ${analyse && isFirst && 'active'}`} id='object' role="tabpanel">
            <div className="row gy-5 g-xl-8">
                <div className="col-12  col-xl-7" style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                    <div className=' position-relative' style={{ width: '100%', maxWidth: 'fit-content' }}>
                       <ObjectCanvas objects={data} selectedObject={selectedObject} imgUrl={imgURL}/>
                    </div>
                </div>
                <div className="col-12  col-xl-5" style={{ background: '#12121b',borderRadius: '2%' }}>
                    <div className='table-responsive' style={style}>
                        {
                            data.map((itemdata: any, index: any) => {
                                return (
                                    <LabelItem 
                                        key={getUid()} 
                                        index={index} 
                                        value={itemdata} 
                                        handleHover={handleHover}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ObjectTabContent;