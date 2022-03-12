import React, { Fragment } from 'react';

import './HPSAbout.css'
import { ReactComponent as SLogo } from '../../../../../assets/icons/strawberry.svg';

class HPSAbout extends React.Component {
  render() {
    return (
      <Fragment>
        <SLogo className="hpsaLogoBg" />
        <h1 className="hpsaTitle">Strawberry <span>v0.2.1 dev</span></h1>
        <div className="hpsaCredits">
          <h3>Credits:</h3>
          <p>Naomi Nelson - Strawberry's name</p>
        </div>
        <span className="hpsaSmoothie" title="Strawberry Smoothie">🥤</span>
        <p className="hpsaCopyright">© 2022 Neon Era. All Rights Reserved.</p>
      </Fragment>
    )
  }
}

export default HPSAbout;
