import React, { useEffect, useState } from 'react';

import { useHttpClient } from '../../shared/hooks/http-hook';

import UserList from '../components/UserList';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState([]);
  useEffect(() => {
    sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users`, {})
      .then((data) => {
        setLoadedUsers(data.users);
      })
      .catch((error) => {});
  }, [sendRequest]);

  return (
    <React.Fragment>
      {error && <ErrorModal error={error} onClear={clearError} />}
      {isLoading && (
        <div className='center'>
          <LoadingSpinner loading={isLoading} asOverlay />
        </div>
      )}
      {!isLoading && <UserList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;
