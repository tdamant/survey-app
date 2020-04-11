import spinner from '../Images/spinner.gif'
import React from 'react';

function LoadingSpinner() {
  return (
    <img  src={spinner} style={{width: '100px', height: '100px'}}/>
  );
}

export default LoadingSpinner