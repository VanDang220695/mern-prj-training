import React, { useRef, useState, useEffect } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import Button from './Button';

import './ImageUpload.css';

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [isTouched, setIsTouched] = useState(false);
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);
  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileRender = new FileReader();
    fileRender.onload = () => {
      setPreviewUrl(fileRender.result);
    };
    fileRender.readAsDataURL(file);
  }, [file]);

  const pickerHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    setIsTouched(true);
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      if (['image/jpeg', ['image/png'].includes(pickedFile.type)]) {
        fileIsValid = true;
        setFile(pickedFile);
        props.onChange(props.id, pickedFile, fileIsValid);
      }
    } else {
      fileIsValid = false;
    }
    setIsValid(fileIsValid);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };
  return (
    <div className={classnames('form-control', { 'form-control--invalid': isTouched && !isValid })}>
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: 'none' }}
        type='file'
        accept='.jpg,.png,.jpeg'
        onChange={pickerHandler}
      />
      <label htmlFor={props.id}>{props.label}</label>
      <div className={classnames('image-upload', { center: props.center })}>
        <div className='image-upload__preview'>
          {previewUrl && <img src={previewUrl} alt='Preview' />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button type='button' onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

ImageUpload.propTypes = {
  errorText: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
};

export default ImageUpload;
