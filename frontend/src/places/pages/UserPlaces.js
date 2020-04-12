import React from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';

const PLACES = [
  {
    id: 'p1',
    title: 'Empire state building',
    description: 'One of most famous sky in the world',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Empire_State_Building_from_the_Top_of_the_Rock.jpg/447px-Empire_State_Building_from_the_Top_of_the_Rock.jpg',
    address: '20 W 34th St, New York, NY 10001, Hoa Kỳ',
    location: {
      lat: 40.7484405,
      lng: -73.9856644,
    },
    creator: 'u1',
  },
  {
    id: 'p2',
    title: 'Empire state building',
    description: 'One of most famous sky in the world',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Empire_State_Building_from_the_Top_of_the_Rock.jpg/447px-Empire_State_Building_from_the_Top_of_the_Rock.jpg',
    address: '20 W 34th St, New York, NY 10001, Hoa Kỳ',
    location: {
      lat: 40.7484405,
      lng: -73.9856644,
    },
    creator: 'u2',
  },
];

const UserPlaces = () => {
  const userId = useParams().userId;
  const loadedPlaces = PLACES.filter((place) => place.creator === userId);
  return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;
