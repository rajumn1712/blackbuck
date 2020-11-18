import React, { Component } from 'react';
import {Layout, Typography} from 'antd'
import { Link } from 'react-router-dom';
import { userManager } from '../shared/authentication/auth';
import { store } from '../store'
import PreviewRed from '../styles/images/previewred.png';
import AdsImage from '../styles/images/adsimage.png';
const { Header } = Layout;
const { Title } = Typography;
class Ads extends Component {


    render() {
        return (
        <div className="ads mb-24">
            <Title className="f-16" level={4}>Ads</Title> 
            <img className="mb-8 image-shadow" src={PreviewRed} /> 
            <img className="image-shadow" src={AdsImage} />
        </div>
        )
    }

}
export default Ads;