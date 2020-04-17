import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import ErrorModal from '../../shared/components/UI/ErrorModal';

import { AuthContext } from '../../shared/context/auth-context';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';

import { VALIDATOR_REQUIRE, VALIDATOR_MIN_LENGTH } from '../../shared/utils/validators';

import './PlaceForm.css';

const UpdatePlace = () => {
  const [loadedPlace, setLoadedPlace] = useState(null);
  const history = useHistory();
  const placeId = useParams().placeId;

  const auth = useContext(AuthContext);

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: {
        value: '',
        isValid: true,
      },
      description: {
        value: '',
        isValid: true,
      },
    },
    false,
  );
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  useEffect(() => {
    sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`, {})
      .then(async (responseData) => {
        const { title, description } = responseData.place;
        await setFormData(
          {
            title: {
              value: title,
              isValid: true,
            },
            description: {
              value: description,
              isValid: true,
            },
          },
          true,
        );
        setLoadedPlace(responseData.place);
      })
      .catch(() => {});
  }, [setFormData, sendRequest, placeId]);

  const updatePlace = async (event) => {
    event.preventDefault();
    const { title, description } = formState.inputs;
    await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${auth.token}`,
      },
      body: JSON.stringify({
        title: title.value,
        description: description.value,
      }),
    })
      .then(() => {
        history.push(`/${auth.userId}/places`);
      })
      .catch(() => {});
  };

  if (!loadedPlace) {
    return (
      <div className='center'>
        <LoadingSpinner loading={isLoading} asOverlay />
      </div>
    );
  }

  return (
    <React.Fragment>
      {error && <ErrorModal error={error} onClear={clearError} />}
      <form className='place-form' onSubmit={updatePlace}>
        {isLoading && (
          <div className='center'>
            <LoadingSpinner loading={isLoading} asOverlay />
          </div>
        )}
        <Input
          id='title'
          element='input'
          type='text'
          label='Title'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Please enter the valid title.'
          onChange={inputHandler}
          initialValue={loadedPlace ? loadedPlace.title : ''}
          initialValid={!!loadedPlace}
        />
        <Input
          id='description'
          element='textarea'
          type='text'
          label='Description'
          validators={[VALIDATOR_MIN_LENGTH(6)]}
          errorText='Please enter the valid description.'
          onChange={inputHandler}
          initialValue={loadedPlace ? loadedPlace.description : ''}
          initialValid={!!loadedPlace}
        />
        <Button type='submit' disabled={!formState.isValid}>
          UPDATE PLACE
        </Button>
      </form>
    </React.Fragment>
  );
};

export default UpdatePlace;
