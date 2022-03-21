import React from 'react-dom';

const PopupInfo = ({ data }) => (
    <div className='popup-container'>
    <div className='my-popup'>
      <h1>{data.title}</h1>
      <p>
          {data.description}
      </p>
    </div>
  </div>
);

export default PopupInfo;