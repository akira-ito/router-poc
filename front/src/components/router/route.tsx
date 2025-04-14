import * as polyline from '@mapbox/polyline';
import L from 'leaflet';
import { useEffect, useRef, useState } from 'react';
import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
} from 'react-leaflet';
// @ts-ignore

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
  const [r, setR] = useState(route);
  const [geometry, setGeometry] = useState<any>([]);
  const mapRef = useRef(null);

  useEffect(() => {
    // const steps = route['geometry'];

    let g = polyline.decode(route['geometry']);
    // g = g.map((g) => [g[1], g[0]]) as any;

    // var latlngs = polyUtil.decode(route['geometry'], 5);
    // console.log('dfdfd', g, latlngs);

    // g = [g[0]];

    setGeometry(g);

    const locations = {} as any;
    const routeF = route['steps'].filter((step: any) => {
      const s = step['location'].join();
      const stepLoc = locations[s];
      if (stepLoc) {
        stepLoc.multiples.push(step);

        return false;
      }

      step.multiples = [{ ...step, multiples: [{ ...step }] }];
      locations[s] = step;
      return true;
    });

    if (!vehicle || Number(vehicle) !== Number(route['vehicle'])) return;

    console.log(routeF.length, route['steps'].length, locations);
    // setR(route);

    setR({ steps: routeF });
  }, [route, vehicle]);

  if (!vehicle || Number(vehicle) !== Number(route['vehicle'])) return <></>;

  const getMarker = (step: any, index: number) => {
    if (step['type'] === 'end') return <></>;

    function getDesc(st: any) {
      const orderText = st['order']['orderId']
        ? `O:${st['order']['orderId']}`
        : null;
      const tripText = st['trip']['orderId']
        ? `T:${st['trip']['orderId']}`
        : null;
      const x = route['description'];
      return orderText || tripText || x;
    }

    let text = `${index}: ${step['type']} - ${getDesc(step)}`;

    console.log(' step.multiples', step.multiples, index);

    if (step.multiples?.length > 1) {
      text = `${index}: `;
      step.multiples.forEach((s: any, i: number) => {
        text = `${text}  ${s['type']} - ${getDesc(s)}`;
      });
    }
    return (
      <Marker
        position={[step['location'][1], step['location'][0]]}
        // icon={myIcon}
      >
        <Tooltip permanent>{text}</Tooltip>
      </Marker>
    );
  };

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

        {r['steps']?.map((step: any, index: number) => {
          return getMarker(step, index);
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
