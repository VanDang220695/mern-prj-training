import React, { useReducer, useEffect } from 'react';
import classnames from 'classnames';

import { validate } from '../../utils/validators';
import './Input.css';

const inputReducer = (state, action) => {
  const { value, validators } = action;
  switch (action.type) {
    case 'CHANGE':
      return {
        ...state,
        value,
        isValid: validate(value, validators),
      };
    case 'TOUCH':
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};

const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || '',
    isValid: props.initialValid,
    isTouched: false,
  });

  const { id, onChange } = props;
  const { isValid, value } = inputState;

  useEffect(() => {
    onChange(id, value, isValid);
  }, [onChange, id, isValid, value]);

  const onChangeHandler = (event) => {
    dispatch({
      type: 'CHANGE',
      value: event.target.value,
      validators: props.validators,
    });
  };

  const onTouchedHandler = () => {
    dispatch({
      type: 'TOUCH',
    });
  };

  const element =
    props.element === 'input' ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={onChangeHandler}
        onBlur={onTouchedHandler}
        value={inputState.value}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        placeholder={props.placeholder}
        onChange={onChangeHandler}
        onBlur={onTouchedHandler}
        value={inputState.value}
      />
    );

  return (
    <div
      className={classnames('form-control', {
        'form-control--invalid': inputState.isTouched && !inputState.isValid,
      })}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {inputState.isTouched && !inputState.isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
