import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classes from 'classnames';

import './Button.css';

const Button = (props) => {
  const className = `${classes('button', {
    'button--inverse': props.inverse,
    'button--danger': props.danger,
  })} button--${props.size || 'default'}`;
  if (props.href) {
    return (
      <a className={className} href={props.href}>
        {props.children}
      </a>
    );
  }
  if (props.to) {
    return (
      <Link to={props.to} exact={props.exact} className={className}>
        {props.children}
      </Link>
    );
  }
  return (
    <button
      className={className}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

Button.propTypes = {
  to: PropTypes.string,
  exact: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;
