import React, { Component } from 'react';
import {Layout, Avatar, Image} from 'antd'
import { Link } from 'react-router-dom';
import { userManager } from '../shared/authentication/auth';
import { store } from '../store'
import PreviewRed from '../styles/images/previewred.png';
import AdsImage from '../styles/images/adsimage.png';
const { Header } = Layout;
class Ads extends Component {


    render() {
        return (
        <div>
            <h4 className="f-16">Ads</h4>  
               <Image className="mb-8" src={PreviewRed} /> 
               <Image src={AdsImage} />
        </div>
        )
    }

}
export default Ads;