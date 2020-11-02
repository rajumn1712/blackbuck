import React, { Component } from 'react';
import { Button, Layout, Menu, Space, Row, Col, Modal, Card, Avatar, Image} from 'antd'
import { Link } from 'react-router-dom';
import { userManager } from '../shared/authentication/auth';
import { store } from '../store'
import { userLogout } from '../reducers/auth';
import PreviewRed from '../styles/images/previewred.png';
const { Header } = Layout;
const { Meta } = Card;
class Ads extends Component {


    render() {
        return (
        <div>
            <h4>Ads</h4>
            <div className="right-rail">
                {/* <Card size="small" title="" >
                <Avatar src={PreviewRed} />       
                </Card> */}
                   
            {/* <Avatar src={PreviewRed} /> */}

             <Image src={PreviewRed} /> 
                        
            </div>
        </div>
        )
    }

}
export default Ads;