import * as React from 'react';

const AnalyseNavItem = (props: any) => {
    const { analyse,isFirst,disable,target, title } = props;
    return (
        <li className="nav-item">
            <button
                className={` btn btn-flex btn-color-primary btn-active-light-success ${analyse && isFirst&&!disable && 'active'}`}
                style={{ margin: '0px 2px' }}
                disabled={!analyse || disable }
                data-bs-toggle="tab"
                data-bs-target={target}
            >
                {title}
            </button>
        </li>
    )
}

export default AnalyseNavItem;