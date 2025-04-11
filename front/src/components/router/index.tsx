import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Route } from './route';

export function Router() {
  const [routes, setRoutes] = useState([]);
  const [vehicle, setVehicle] = useState('0');
  const mutation = useMutation({
    mutationFn: () => {
      return axios.post('http://localhost:3002/router/from-json', {
        ignoreSameTripsDriver: true,
      });
    },
  });

  useEffect(() => {
    (async function a() {
      const { data } = (await mutation.mutateAsync()) as any;
      setRoutes(data.routes);
    })();
  }, []);

  console.log(routes);

  function onChangeVehicle(event: any) {
    setVehicle(event.target.value);
  }
  return (
    <div>
      <select onChange={onChangeVehicle}>
        {routes.map((route) => {
          return (
            <option value={route['vehicle']}>{route['description']}</option>
          );
        })}
      </select>
      {routes.map((route) => {
        return <Route route={route} vehicle={vehicle}></Route>;
      })}
      <ul>{JSON.stringify(routes[0])}</ul>
      <button
        onClick={() => {
          mutation.mutate();
        }}
      >
        Add Todo
      </button>
      asdfddddss
    </div>
  );
}
