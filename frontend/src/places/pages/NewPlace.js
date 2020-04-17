import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

import { AuthContext } from '../../shared/context/auth-context';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';

import { VALIDATOR_REQUIRE, VALIDATOR_MIN_LENGTH } from '../../shared/utils/validators';

import './PlaceForm.css';

const NewPlace = () => {
  const [formState, inputHandler] = useForm({
    title: {
      value: '',
      isValid: false,
    },
    description: {
      value: '',
      isValid: false,
    },
    address: {
      value: '',
      isValid: false,
    },
    image: {
      value: null,
      isValid: false,
    },
  });

  const auth = useContext(AuthContext);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const history = useHistory();

  const placeSubmitHandler = async (event) => {
    event.preventDefault();
    const { title, description, address, image } = formState.inputs;
    const formData = new FormData();
    formData.append('title', title.value);
    formData.append('description', description.value);
    formData.append('address', address.value);
    formData.append('image', image.value);
    await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    })
      .then(() => {
        history.push(`/${auth.userId}/places`);
      })
      .catch(() => {});
  };

  return (
    <React.Fragment>
      {error && <ErrorModal error={error} onClear={clearError} />}
      <form className='place-form' onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner loading={isLoading} asOverlay />}
        <Input
          id='title'
          element='input'
          type='text'
          label='Title'
          validators={[VALIDATOR_REQUIRE()]}
          errorText='Please enter a valid title.'
          onChange={inputHandler}
        />
        <Input
          id='description'
          element='textarea'
          type='text'
          label='Description'
          validators={[VALIDATOR_MIN_LENGTH(6)]}
          errorText='Please enter a valid description (at least 5 characters).'
          onChange={inputHandler}
        />
        <Input
          id='address'
          element='input'
          type='text'
          label='Address'
          validators={[VALIDATOR_MIN_LENGTH(6)]}
          errorText='Please enter a valid address.'
          onChange={inputHandler}
        />
        <ImageUpload
          id='image'
          label='Your Place Image'
          center
          onChange={inputHandler}
          errorText='Please pick a valid image.'
        />
        <Button type='submit' disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </React.Fragment>
  );
};

export default NewPlace;
