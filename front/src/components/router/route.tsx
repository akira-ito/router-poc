import { useEffect, useRef, useState } from 'react';
import {
  MapContainer,
  Marker,
  Popup,
  Circle,
  TileLayer,
  Tooltip,
  Polyline,
  CircleMarker,
} from 'react-leaflet';
import L from 'leaflet';
import * as polyline from '@mapbox/polyline';
// @ts-ignore
import polyUtil from 'polyline-encoded';

const fillBlueOptions = { fillColor: 'blue' };
const blackOptions = { color: 'black' };
const limeOptions = { color: 'lime' };
const purpleOptions = { color: 'purple' };
const redOptions = { color: 'red' };

var myIcon = L.icon({
  iconUrl: 'my-icon.png',
  iconSize: [38, 95],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
  shadowUrl: 'my-icon-shadow.png',
  shadowSize: [68, 95],
  shadowAnchor: [22, 94],
});
// var redMarker = L.AwesomeMarkers.icon({
//   icon: 'coffee',
//   markerColor: 'red',
// });

export function Route({ route, vehicle }: any) {
  const [r, setR] = useState({ vehicle });
  const [geometry, setGeometry] = useState<any>([]);
  const mapRef = useRef(null);

  useEffect(() => {
    const steps = route['geometry'];

    let g = polyline.decode(route['geometry']);
    // g = g.map((g) => [g[1], g[0]]) as any;

    // var latlngs = polyUtil.decode(route['geometry'], 5);
    // console.log('dfdfd', g, latlngs);

    // g = [g[0]];

    setGeometry(g);
    setR(route);
  }, []);

  if (!vehicle || Number(vehicle) !== Number(route['vehicle'])) return <></>;

  return (
    <>
      <MapContainer
        center={[19.32489, -81.37885]}
        zoom={13}
        ref={mapRef}
        style={{ height: '50vh', width: '100vw' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* <Circle center={[latitude, longitude]} radius={10}></Circle> */}
        {route['steps'].map((step: any, index: number) => {
          return (
            <Marker
              position={[step['location'][1], step['location'][0]]}
              // icon={myIcon}
            >
              <Tooltip permanent>
                {index}: {step['type']} - {step['id']}
              </Tooltip>
            </Marker>
          );
        })}

        <CircleMarker
          center={[51.51, -0.12]}
          pathOptions={redOptions}
          radius={20}
        >
          <Popup>Popup in CircleMarker</Popup>
        </CircleMarker>

        <Polyline
          key={'g'}
          // pathOptions={limeOptions}
          positions={geometry}
        />
        {/* Additional map layers or components can be added here */}
      </MapContainer>
    </>
  );
}
