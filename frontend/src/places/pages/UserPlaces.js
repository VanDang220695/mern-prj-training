import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useHttpClient } from '../../shared/hooks/http-hook';

import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import ErrorModal from '../../shared/components/UI/ErrorModal';

import PlaceList from '../components/PlaceList';

const UserPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useParams().userId;

  const fetchUserPlaceData = () => {
    sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`, {})
      .then((responseData) => {
        setLoadedPlaces(responseData.places);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchUserPlaceData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDeleteSuccess = () => {
    fetchUserPlaceData();
  };

  return (
    <React.Fragment>
      {error && <ErrorModal error={error} onClear={clearError} />}
      {isLoading && (
        <div className='center'>
          <LoadingSpinner loading={isLoading} asOverlay />
        </div>
      )}
      {!isLoading && <PlaceList items={loadedPlaces} onDeleteSuccess={onDeleteSuccess} />}
    </React.Fragment>
  );
};

export default UserPlaces;
