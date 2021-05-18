import React from 'react';
import {MapContainer,TileLayer} from "react-leaflet";
import './Map.css';
import {showDataOnMap} from "./util";

function Map({countries,casesType,center, zoom}) {
    return (
        <div className="map">
            <MapContainer className="leaflet-container" center={center} zoom={zoom}>
                <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap </a> contributors' 
                />
                {/* Loop through Countries and draw circles on the screen */}
                {showDataOnMap(countries, casesType)} 
            </MapContainer>
        </div>
    );
}

export default Map
