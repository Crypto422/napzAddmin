import * as React from 'react';
const PartialMatchingImageItem = (props: any) => {
    const { url } = props;
    return (
        <div className='d-flex align-items-center justify-content-center mb-2'>
            <div className=' position-relative' style={{ width: '100%', maxWidth: 'fit-content' }}>
                <img id='imageid' style={{ opacity: "100%", width: 'inherit', borderRadius: '3%' }} src={url} alt={'Cannot Link'} />
            </div>
        </div>
    )
}

export default PartialMatchingImageItem;