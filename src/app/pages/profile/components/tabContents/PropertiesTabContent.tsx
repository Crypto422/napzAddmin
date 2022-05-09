/* eslint-disable jsx-a11y/anchor-is-valid */

import * as React from 'react';
import { useState, useEffect } from 'react';
import ColorItem from './PropertySubcomponent/ColorItem';

const PropertiesTabContent = (props: any) => {
    const { analyse, isFirst, data, imgURL } = props;
    let select = data.dominantColors.colors[0];
    const [selectedItem, setSelectedItem] = useState<any>(select);
    const [colorList, setColorList] = useState<any>(data.dominantColors.colors)
    const CustomStyle = {
        progressbar: {
            backgroundColor: `${selectedItem.hex}`,
            width: `100%`,
            height: '24px'
        }
    }
    function componentToHex(c: any) {
        var hex = c.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }

    function rgbToHex(r: any, g: any, b: any) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
    function decorateColors(colors: any) {
        var scoresSum = colors.reduce(function (sum: any, color: any) {
            return sum + color.score;
        }, 0) / 100;

        return colors.map((color: any) => {
            color.percentRounded = Math.round(color.score / scoresSum);
            color.hex = rgbToHex(color.color.red, color.color.green, color.color.blue)
            return color;
        });
    }

    useEffect(() => {
        let colors = decorateColors(data.dominantColors.colors)
        setColorList(colors);
        // eslint-disable-next-line
    }, [])

    return (
        <div className={`tab-pane fade show ${analyse && isFirst && 'active'}`} id='properties' role="tabpanel">
            <div className="row gy-5 g-xl-8">
                <div className="col-12  col-xl-7" style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                    <div className=' position-relative' style={{ width: '100%', maxWidth: 'fit-content' }}>
                        <img id='imageid' style={{ maxHeight: '500px', opacity: "100%", width: 'inherit'}} src={imgURL} alt='UploadImage' />
                    </div>
                </div>
                <div className="col-12  col-xl-5" style={{ background: '#12121b' ,borderRadius: '2%'}}>
                    <div className='d-flex align-items-left justify-content-left'>
                        <a className='text-dark fw-bolder  text-hover-primary fs-3 p-3'
                            style={{ width: 'max-content' }}
                        >
                            Dominant Colors
                        </a>
                    </div>
                    <div style={{ display: 'flex', height: 'calc(100% - 112px)' }}>
                        {
                            colorList.map((item: any, index: any) => {
                                return (
                                    <ColorItem
                                        key={index}
                                        data={item}
                                        setSelectedItem={setSelectedItem}
                                    />
                                )
                            })
                        }
                    </div>
                    <div className='d-flex align-items-center w-100  flex-column mt-3'>
                        <div className='d-flex justify-content-between w-100 mt-auto mb-2'>
                            <span className='timeline-content fw-bolder text-gray-800'>
                                {selectedItem.hex},&nbsp;RGB({selectedItem.color.red},{selectedItem.color.green},{selectedItem.color.blue})
                            </span>
                            <span className='fw-bolder fs-6'>{selectedItem.percentRounded}%</span>
                        </div>
                        <div className=' mx-3 w-100 rounded bg-light mb-3' style={{ height: '24px' }}>
                            <div
                                className='rounded'
                                role='progressbar'
                                style={CustomStyle.progressbar}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PropertiesTabContent;