/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import LabelItem from './FaceSubcomponent/Labeltem';
import AngleItem from './FaceSubcomponent/AngleItem';
import { Fragment } from 'react';
import { v4 as uuid } from 'uuid';
import TitleItem from './FaceSubcomponent/TitleItem';
import ConfidenceItem from './FaceSubcomponent/ConfidencdItem';
import FaceCanvas from './FaceSubcomponent/FaceCanvas';

const FaceTabContent = (props: any) => {
    const { analyse, isFirst, data, imgURL,style } = props;
    const getUid = () => {
        return uuid();
    }
    return (
        <div className={`tab-pane fade show ${analyse && isFirst && 'active'}`} id='face' role="tabpanel">
            <div className="row ">
                <div className="col-12  col-xl-7" style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                    <div  className=' position-relative' style={{ width: '100%', maxWidth: 'fit-content' }}>
                        <FaceCanvas  faces={data} imgUrl={imgURL} />
                    </div>
                </div>
                <div className="col-12  col-xl-5 " style={{ background: '#12121b',borderRadius: '2%' }}>
                    {/* begin::Table container */}
                    <div className='table-responsive' style={style}>
                        {/* begin::Table */}
                        <table className='table align-middle gs-0 gy-3'>
                            {/* begin::Table body */}
                            <tbody>
                                {
                                    data.map((itemdata: any, index: any) => {
                                        return (
                                            <Fragment key={getUid()}>
                                                {data.length > 1 &&
                                                    <TitleItem key={getUid()} count={index + 1} />}
                                                <LabelItem key={getUid()} title={'Joy'} value={itemdata.joyLikelihood} />
                                                <LabelItem key={getUid()} title={'Sorrow'} value={itemdata.sorrowLikelihood} />
                                                <LabelItem key={getUid()} title={'Anger'} value={itemdata.angerLikelihood} />
                                                <LabelItem key={getUid()} title={'Surprise'} value={itemdata.surpriseLikelihood} />
                                                <LabelItem key={getUid()} title={'Exposed'} value={itemdata.underExposedLikelihood} />
                                                <LabelItem key={getUid()} title={'Blurred'} value={itemdata.blurredLikelihood} />
                                                <LabelItem key={getUid()} title={'Headwear'} value={itemdata.headwearLikelihood} />
                                                <AngleItem key={getUid()} roll={itemdata.rollAngle} tilt={itemdata.tiltAngle} pan={itemdata.panAngle} />
                                                <ConfidenceItem key={getUid()} value={itemdata.detectionConfidence} />
                                            </Fragment>
                                        )
                                    })
                                }
                            </tbody>
                            {/* end::Table body */}
                        </table>
                    </div>
                    {/* end::Table */}
                    {/* </div> */}

                </div>
            </div>
        </div>
    )
}

export default FaceTabContent;