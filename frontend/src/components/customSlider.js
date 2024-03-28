import React from 'react';
import { Slider, styled } from '@material-ui/core';
import { useField, useFormikContext } from 'formik';

const CustomSlider = ({ name, ...props }) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(name);

  const handleChange = (event, value) => {
    setFieldValue(name, value);
  };

  const SliderStyled = styled(Slider)({
    '& .MuiSlider-rail': {
      height: '20px',
      color: '#D3FF86',
    },
    '& .MuiSlider-track': {
      height: '20px',
      color: '#D3FF86',
    },
    '& .MuiSlider-thumb': {
      color: '#D3FF86',
      height: '30px',
      width: '16px',
      backgroundColor: '#fff',
      border: '2px solid currentColor',
    },
    '& .MuiSlider-mark': {
      color: '#D3FF86',
      height: '20px',
      width: '5px',

    },
  });

  return (
    <SliderStyled
      {...field}
      {...props}
      value={field.value || 0}
      onChange={handleChange}
    />
  );
};

export default CustomSlider;