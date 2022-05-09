import * as React from 'react';

const RatingStar = (props: any) => {
    const { checked } = props;
    return (
        <div className={`rating-label me-2 ${checked && 'checked'}`} style={{ display: 'flex', alignItems: 'center' }}>
           <i className="bi bi-star fs-1"></i>
        </div>
    )
}

export default RatingStar;