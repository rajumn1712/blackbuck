import React, { Component } from 'react';
import Smiley from '../styles/images/smiley.svg'
import comingsoon from '../styles/images/coming-soon.png'
class CommingSoon extends Component {

    render() {
        return <div className="coming-soon">
            {/* <h1 >Coming Soon </h1>
            <img src={Smiley}/> */}
           <img src={comingsoon} style={{width: '100%'}} />
        </div>
    }
}

export default CommingSoon;