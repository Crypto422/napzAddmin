import * as React from 'react';

const Loading = () => {
    return (
        <div>
            <div className='d-flex align-items-center justify-content-center h-350px card'>
                <div className="overlay-layer ">
                    <div
                        className="spinner-border text-primary"
                        role="status"
                    >
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Loading;