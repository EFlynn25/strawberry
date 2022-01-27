import React, { Fragment } from 'react';

import './HPSAbout.css'
import { ReactComponent as SLogo } from '../../../../../assets/icons/strawberry.svg';

class HPSAbout extends React.Component {
  render() {
    return (
      <Fragment>
        <SLogo className="hpsaLogoBg" />
        <h1 className="hpsaTitle">Strawberry <span>v0.2</span></h1>
        <span className="hpsaSmoothie" title="Strawberry Smoothie">🥤</span>
        <p className="hpsaCopyright">© 2022 Neon Black Network. All Rights Reserved.</p>
      </Fragment>
    )
  }
}

export default HPSAbout;
