import React, { Component } from 'react';
import Smiley from '../styles/images/smiley.svg'
class CommingSoon extends Component {

    render() {
        return <div className="coming-soon">
            <h1 >Coming Soon </h1>
            <img src={Smiley}/>
        </div>
    }
}

export default CommingSoon;