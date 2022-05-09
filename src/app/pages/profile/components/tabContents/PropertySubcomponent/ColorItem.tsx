import * as React from 'react';

const ColorItem  = (props: any) => {
    const { data, setSelectedItem } = props;
    const itemStyle = {
        backgroundColor: `${data.hex}`,
        width: `${data.percentRounded}%`,
        height: '100%',
        display: 'inline-flex'
    }

    const MouseOver = () => {
        setSelectedItem(data);
    }

    return (
        <div style={itemStyle} onMouseOver={MouseOver}>

        </div>
    )
}

export default ColorItem;