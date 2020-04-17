import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UI/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import ErrorModal from '../../shared/components/UI/ErrorModal';
import LoadingSpinner from '../../shared/components/UI/LoadingSpinner';

import {
  VALIDATOR_EMAIL,
  VALIDATOR_MIN_LENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/utils/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';

import './Auth.css';

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false,
  );

  const switchModeHandler = () => {
    if (!isLogin) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid,
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false,
      );
    }
    setIsLogin((prevState) => !prevState);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    const { name, email, password, image } = formState.inputs;
    if (isLogin) {
      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      })
        .then((data) => {
          auth.login(data.userId, data.token);
        })
        .catch(() => {});
    } else {
      const formData = new FormData();
      formData.append('email', email.value);
      formData.append('name', name.value);
      formData.append('password', password.value);
      formData.append('image', image.value);
      sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/signup/`, {
        method: 'POST',
        body: formData,
      })
        .then((data) => {
          auth.login(data.userId, data.token);
        })
        .catch(() => {});
    }
  };

  return (
    <React.Fragment>
      {error && <ErrorModal error={error} onClear={clearError} />}
      <Card className='authentication'>
        <LoadingSpinner loading={isLoading} asOverlay />
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLogin && (
            <Input
              element='input'
              id='name'
              type='text'
              label='Your name'
              validators={[VALIDATOR_REQUIRE()]}
              errorText='Please enter a name'
              onChange={inputHandler}
            />
          )}
          {!isLogin && (
            <ImageUpload
              id='image'
              label='Your Avatar'
              center
              onChange={inputHandler}
              errorText='Please pick a valid image.'
            />
          )}
          <Input
            id='email'
            element='input'
            type='email'
            label='E-Mail'
            validators={[VALIDATOR_EMAIL()]}
            errorText='Please enter a valid email address.'
            onChange={inputHandler}
          />
          <Input
            id='password'
            element='input'
            type='password'
            label='Password'
            validators={[VALIDATOR_MIN_LENGTH(6)]}
            errorText='Please enter a valid password (at least 5 characters).'
            onChange={inputHandler}
          />
          <Button type='submit' disabled={!formState.isValid}>
            {isLogin ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          Switch to {isLogin ? 'SIGNUP' : 'LOGIN'}
        </Button>
      </Card>
    </React.Fragment>
  );
};
export default Auth;
