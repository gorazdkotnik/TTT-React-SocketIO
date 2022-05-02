import React from 'react';

import './Cell.css';

export default function Cell(props: any) {
  const customClasses = `${props.rowIndex === 0 ? 'top-row' : ''} ${
    props.rowIndex === 2 ? 'bottom-row' : ''
  } ${props.cellIndex === 0 ? 'left-cell' : ''} ${
    props.cellIndex === 2 ? 'right-cell' : ''
  }`;

  return (
    <div
      className={`cell ${customClasses}`}
      onClick={() => props.onClick(props.rowIndex, props.cellIndex)}
    >
      {props.children}
    </div>
  );
}
