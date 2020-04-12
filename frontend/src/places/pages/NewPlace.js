import React from 'react';

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { useForm } from '../../shared/hooks/form-hook';
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
  });

  const placeSubmitHandler = (event) => {
    event.preventDefault();
  };

  return (
    <form className='place-form' onSubmit={placeSubmitHandler}>
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
        validators={[VALIDATOR_MIN_LENGTH(5)]}
        errorText='Please enter a valid description (at least 5 characters).'
        onChange={inputHandler}
      />
      <Input
        id='address'
        element='input'
        type='text'
        label='Address'
        validators={[VALIDATOR_REQUIRE()]}
        errorText='Please enter a valid address.'
        onChange={inputHandler}
      />
      <Button type='submit' disabled={!formState.isValid}>
        ADD PLACE
      </Button>
    </form>
  );
};

export default NewPlace;
