import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import './LoadingSpinner.css';

const LoadingSpinner = (props) => {
  if (props.loading) {
    return (
      <div className={classnames({ 'loading-spinner__overlay': props.asOverlay })}>
        <div className='lds-dual-ring' />
      </div>
    );
  }
  return null;
};

LoadingSpinner.propTypes = {
  loading: PropTypes.bool,
  asOverlay: PropTypes.bool,
};

export default LoadingSpinner;
