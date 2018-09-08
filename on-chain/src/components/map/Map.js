import React from 'react';
const { compose, withProps, withStateHandlers } = require("recompose");
const { withScriptjs, withGoogleMap } = require("react-google-maps");
const googleScriptSrc = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDe1q7rvBSFYyG_d87OZplzm5IVeJodp6A&v=3.exp&libraries=geometry,drawing";

const BasicGoogleMap = compose(
    withProps({
        googleMapURL: googleScriptSrc,
        loadingElement: <div style={{ height: `100%` }} />,
        containerElement: <div className="map-container" />,
        mapElement: <div style={{ height: `100%` }} />,
        myStyle: [
            {
                featureType: "poi",
                stylers: [
                    { visibility: "off" }
                ]
            }
        ]
    }),
    withStateHandlers(() => ({
        isOpen: false,
    }), {
        onToggleOpen: ({ isOpen }) => () => ({
            isOpen: !isOpen,
        })
    }),
    withScriptjs,
    withGoogleMap
)(props => {
    return props.renderMethod(props);
});

export {BasicGoogleMap}