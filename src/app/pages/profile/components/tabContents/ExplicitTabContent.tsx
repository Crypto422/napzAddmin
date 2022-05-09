/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import LabelItem from './ExplicitSubcomponent/LabelItem';

const ExplicitTabContent = (props: any) => {
    const { analyse, isFirst, data ,imgURL, style} = props;
    return (
        <div className={`tab-pane fade show ${analyse && isFirst && 'active'}`} id='explicit' role="tabpanel">
            <div className="row gy-5 g-xl-8">
                <div className="col-12  col-xl-7" style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                    <div className=' position-relative' style={{ width: '100%', maxWidth: 'fit-content' }}>
                        <img id='imageid' style={{ opacity: "100%", width: 'inherit' ,maxHeight: '500px'}} src={imgURL} alt='UploadImage' />
                    </div>
                </div>
                <div className="col-12  col-xl-5" style={{ background: '#12121b',borderRadius: '2%' }}>
                    <div className='table-responsive' style={style}>
                        {/* begin::Table */}
                        <table className='table align-middle gs-0 gy-3'>
                            {/* begin::Table body */}
                            <tbody>
                                
                                <LabelItem title={'Adult'} value={data.adult}/>
                                <LabelItem title={'Medical'} value={data.medical}/>
                                <LabelItem title={'Racy'} value={data.racy}/>
                                <LabelItem title={'Spoof'} value={data.spoof}/>
                                <LabelItem title={'Violence'} value={data.violence}/>
                                <tr>
                                    <td className='text-center' colSpan={5}>
                                        <div className='d-flex flex-column w-100 me-2'>
                                            <div className='d-flex flex-stack mb-2'>
                                                <span className='text-primary me-2 fs-7 fw-bold'>
                                                Likeliness values are Unknown, Very Unlikely, Unlikely, Possible, Likely, and Very Likely
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                            {/* end::Table body */}
                        </table>
                    </div>
                    {/* end::Table */}
                </div>
            </div>
        </div>
    )
}

export default ExplicitTabContent;