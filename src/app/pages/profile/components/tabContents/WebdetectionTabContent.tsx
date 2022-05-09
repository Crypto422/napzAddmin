import * as React from 'react';
import TitleItem from './WebSubcomponent/TitleItem';
import BestGuessLabelsItem from './WebSubcomponent/BestGuessLabelItem';
import PageTitleItem from './WebSubcomponent/PageTitleItem';
import PartialMatchingImageItem from './WebSubcomponent/PartialMatchingImageItem';
import EntitiesItem from './WebSubcomponent/EntitiesItem';

const WebDetectionTabContent = (props: any) => {
    const { data, imgURL, style } = props;
    return (
        <div className='tab-pane fade show' id='webdetection' role="tabpanel">
            <div className="row gy-5 g-xl-8">
                <div className="col-12  col-xl-7 d-flex justify-content-center align-items-center">
                    <div className=' position-relative w-100' style={{  maxWidth: 'fit-content' }}>
                        <img  style={{maxHeight: '500px', opacity: "100%", width: 'inherit'}} src={imgURL} alt='UploadImage' />
                    </div>
                </div>
                <div className="col-12  col-xl-5" style={{ background: '#12121b',borderRadius: '2%' }}>
                    <div className='table-responsive' style={style}>
                        {data?.webEntities ?
                            <TitleItem
                                title='Web Entities'
                            />:<></>
                        }
                        {data?.webEntities ?
                            data.webEntities?.map((item: any, index:any) => {
                                if (item.description !== undefined) {
                                    return (
                                        <EntitiesItem
                                            key={index}
                                            value={item}
                                        />
                                    )
                                }
                                return <div key={index}></div>
                            }) :<></>
                        }
                        {data?.fullMatchingImages ?
                            <TitleItem
                                title='Full Matching Images'
                            /> :<></>
                        }
                        {data?.fullMatchingImages ?
                            data.fullMatchingImages?.map((item: any, index:any) => {
                                return (
                                    <PartialMatchingImageItem
                                        key={index}
                                        url={item.url}
                                    />
                                )
                            }):<></>
                        }
                        {data?.partialMatchingImages ?
                            <TitleItem
                                title='Partial Matching Images'
                            />:<></>
                        }
                        {data?.partialMatchingImages ?
                            data.partialMatchingImages?.map((item: any, index: any) => {
                                return (
                                    <PartialMatchingImageItem
                                        key={index}
                                        url={item.url}
                                    />
                                )
                            }):<></>
                        }
                        
                        {data?.pagesWithMatchingImages ?
                            <TitleItem
                                title='Pages With Matching Image'
                            />:<></>
                        }
                        {data?.pagesWithMatchingImages ?
                            data.pagesWithMatchingImages?.map((item: any, index: any) => {
                                return (
                                    <PageTitleItem
                                        key={index}
                                        title={item.pageTitle}
                                        url={item.url}
                                    />
                                )
                            }):<></>
                        }
                        {data?.visuallySimilarImages ?
                            <TitleItem
                                title='Visually Similar Images'
                            />:<></>
                        }
                        {data?.visuallySimilarImages ?
                            data.visuallySimilarImages?.map((item: any, index: any) => {
                                return (
                                    <PartialMatchingImageItem
                                        key={index}
                                        url={item.url}
                                    />
                                )
                            }):<></>
                        }
                        {data?.bestGuessLabels ?
                            <TitleItem
                                title='Best Guess Labels'
                            />:<></>
                        }
                        {data?.bestGuessLabels ?
                            data.bestGuessLabels?.map((item: any, index:any) => {
                                return (
                                    <BestGuessLabelsItem
                                        key={index}
                                        label={item.label}
                                    />
                                )
                            }):<></>
                        }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default WebDetectionTabContent;