import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UI/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';

import {
  VALIDATOR_EMAIL,
  VALIDATOR_MIN_LENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/utils/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/context/auth-context';

import './Auth.css';

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
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
        },
        false,
      );
    }
    setIsLogin((prevState) => !prevState);
  };

  const authSubmitHandler = (event) => {
    event.preventDefault();
    auth.login();
  };

  return (
    <Card className='authentication'>
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
          validators={[VALIDATOR_MIN_LENGTH(5)]}
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
  );
};
export default Auth;
