import React from 'react';

import './Row.css';

export default function Row(props: any) {
  return <div className="row">{props.children}</div>;
}
