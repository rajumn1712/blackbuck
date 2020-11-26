import React, { Component } from 'react';
import {Layout, Typography} from 'antd'
import PreviewRed from '../styles/images/previewred.png';
import AdsImage from '../styles/images/adsimage.png';
const { Header } = Layout;
const { Title } = Typography;
class Ads extends Component {


    render() {
        return (
        <div className="ads mb-24">
            <Title className="f-16" level={4}>Ads</Title> 
            <img style={{cursor:"pointer"}} className="mb-8 image-shadow" src={PreviewRed} onClick={()=>window.open("https://theblackbucks.com/","_blank")}  /> 
            <img style={{cursor:"pointer"}} className="image-shadow" src={AdsImage} onClick={()=>window.open("https://theblackbucks.com/","_blank")} />
        </div>
        )
    }

}
export default Ads;