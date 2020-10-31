import React, { Component } from 'react';
import { Button, Layout, Menu, Space, Row, Col, Modal } from 'antd'
import { Link } from 'react-router-dom';
import { userManager } from '../shared/authentication/auth';
import { store } from '../store'
import { userLogout } from '../reducers/auth';
const { Header } = Layout;
class  ShareBox extends Component {
    state={visible:false}
    openpopup=()=>{
        this.setState({visible:true})
    }


    render() {
        const { user } = store.getState().oidc;
        return (
            <div className="share-box bg-white">
                <div className="justify-content-around">
                    <Link to="/contact"><i className="sharebox-icons text-icon"></i><p className="text-hover text-color mb-0">Text</p></Link>
                    <Link to="/" onClick={()=>this.openpopup()}><i className="sharebox-icons photo-icon"></i><p className="text-hover text-color mb-0">Images</p></Link>
                    <Link to="/contact"><i className="sharebox-icons audio-icon"></i><p className="text-hover text-color mb-0">Speaker</p></Link>
                    <Link to="/contact"><i className="sharebox-icons document-icon"></i><p className="text-hover text-color mb-0">Docs</p></Link>
                    <Link to="/contact"><i className="sharebox-icons gif-icon"></i><p className="text-hover text-color mb-0">GIF</p></Link>
                    <Link to="/contact"><i className="sharebox-icons vedio-icon"></i><p className="text-hover text-color mb-0">Vedio</p></Link>
                </div>
                
            <Modal title="Basic Modal" visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </Modal>

            </div>
        )
    }
}

export default ShareBox;