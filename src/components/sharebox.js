import React, { Component } from 'react';
import { Button, Layout, Menu, Space, Row, Col, Modal,Card } from 'antd'
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
                <Card
                    actions={[
                        <Link to="/contact" className="icon-animation"><span className="sharebox-icons text-icon"></span><p className="text-hover text-color mb-0">Text</p></Link>,
                        <Link to="/" className="icon-animation" onClick={() => this.openpopup()}><span className="sharebox-icons photo-icon"></span><p className="text-hover text-color mb-0">Images</p></Link>,
                        <Link to="/contact" className="icon-animation"><span className="sharebox-icons audio-icon"></span><p className="text-hover text-color mb-0">Speaker</p></Link>,
                        <Link to="/contact" className="icon-animation"><span className="sharebox-icons document-icon"></span><p className="text-hover text-color mb-0">Docs</p></Link>,
                        <Link to="/contact" className="icon-animation"><span className="sharebox-icons gif-icon"></span><p className="text-hover text-color mb-0">GIF</p></Link>,
                        <Link to="/contact" className="icon-animation"><span className="sharebox-icons vedio-icon"></span><p className="text-hover text-color mb-0">Vedio</p></Link>,
                    ]}
                >
                </Card>

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