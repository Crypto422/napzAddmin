
import * as React from 'react';
import { FAQ } from './overViewSubcomponents/FAQ';
import { PopularTickets } from './overViewSubcomponents/PopularTickets';

const Overview = () => {
    return (
        <div className="row gy-0 mb-6 mb-xl-12">
            <PopularTickets />
            <FAQ/>
        </div>
    )
}

export default Overview;