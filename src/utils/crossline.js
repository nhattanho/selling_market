import React from 'react'

export const Crossline = ({ color, width, marginLeft, marginRight }) => {
    return (
        <hr
            style={{
            color: color,
            backgroundColor: color,
            height: 2,
            width: width,
            marginLeft: marginLeft,
            marginRight: marginRight,
        }}
        />

    )
};