import React from 'react';
import ReactDOM from 'react-dom';
import classes from 'classnames';
import { CSSTransition } from 'react-transition-group';

import BackDrop from './Backdrop';
import './Modal.css';

const ModalOverlay = (props) => {
  const content = (
    <div className={classes('modal', props.className)} style={props.style}>
      <header className={classes('modal__header', props.headerClass)}>
        <h2>{props.header}</h2>
      </header>
      <form onSubmit={props.onSubmit ? props.onSubmit : (event) => event.preventDefault()}>
        <div className={classes('modal__content', props.contentClass)}>{props.children}</div>
      </form>
      <footer className={classes('modal__footer', props.footerClass)}>{props.footer}</footer>
    </div>
  );
  return ReactDOM.createPortal(content, document.getElementById('modal-hook'));
};

const Modal = (props) => {
  return (
    <React.Fragment>
      {props.show && <BackDrop onClick={props.onCancel} />}
      <CSSTransition in={props.show} mountOnEnter unmountOnExit timeout={200} classNames='modal'>
        <ModalOverlay {...props} />
      </CSSTransition>
    </React.Fragment>
  );
};

export default Modal;
