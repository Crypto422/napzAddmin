import * as React from 'react';
import TextItem from './TextDetectionSubcomponent/TextItem';
import { v4 as uuid } from 'uuid';
import TitleItem from './WebSubcomponent/TitleItem';
import TextCanvas from './TextDetectionSubcomponent/TextCanvas';
import { useState } from 'react';

const TextTabContent = (props: any) => {
    const { analyse, isFirst, data, imgURL, style } = props;
    const [selectedText, setSeletedText] = useState<any>('')
    const paragraphs = data.text.split('\n');
    const getUid = () => {
        return uuid();
    }

    const handleHover = (index: any) => {
        setSeletedText(index);
    }
    return (

        <div className={`tab-pane fade show ${analyse && isFirst && 'active'}`} id='text' role="tabpanel">
            <div className="row gy-5 g-xl-8">
                <div className="col-12  col-xl-7" style={{ display: "flex", justifyContent: 'center', alignItems: 'center' }}>
                    <div className=' position-relative' style={{ width: '100%', maxWidth: 'fit-content' }}>
                       <TextCanvas texts={data.pages[0].blocks} selectedText={selectedText} imgUrl={imgURL} />
                    </div>
                </div>
                <div className="col-12  col-xl-5" style={{ background: '#12121b',borderRadius: '2%' }}>
                    <div className='table-responsive' style={style}>
                        <TitleItem
                            title='Detected Texts'
                        />
                        {paragraphs.map((value: any, index:any) => {
                            if (value.length > 0) {
                                return (
                                    <TextItem
                                        key={getUid()}
                                        index={index}
                                        handleHover={handleHover}
                                        value={value}
                                    />
                                )
                            }
                            return (
                                <div key={getUid()}></div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TextTabContent;