import React, { Component } from 'react';
import { Button, Layout, Menu, Space, Row, Col, Modal, Card, Avatar, Dropdown, Checkbox } from 'antd'
import { DownOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { userManager } from '../shared/authentication/auth';
import { store } from '../store'
import { userLogout } from '../reducers/auth';
import GroupImage from '../styles/images/groupimage.png';
const { Header } = Layout;
const { Meta } = Card;
class ShareBox extends Component {
    state = { visible: false }
    openpopup = () => {
        this.setState({ visible: true })
    }


    render() {
        const { user } = store.getState().oidc;
        const menu = (
            <Menu>
                <Menu.Item key="0"><a href="">Public</a></Menu.Item>
                <Menu.Item key="1"><a href="">Friends</a></Menu.Item>
                <Menu.Item key="2"><a href="">College</a></Menu.Item>
                <Menu.Item key="3"><a href="">Groups</a></Menu.Item>
            </Menu>
        );
        const title = <div className="justify-content-between">
            <Meta
                avatar={<Avatar src={GroupImage} />}
                title={<div><h4 className="media-head">Jhon Doe</h4></div>}
                description={<div className="mb-0 f-10"><Dropdown overlay={menu} trigger={['click']}>
                    <a className="ant-dropdown-link" style={{ color: '#9B9B9B' }} onClick={e => e.preventDefault()}>
                        Public <DownOutlined />
                    </a>
                </Dropdown></div>} />
            <div style={{display:'flex'}}>{function onChange(e) {
                console.log(`checked = ${e.target.checked}`);
                }}
                <div className="lable-height"><span className="f-9 text-gray">Post</span><p className="check-text">Checkbox</p></div>
                <Checkbox className="ml-8 mt-8"></Checkbox>
            </div>
        </div>

        return (
            <div className="share-box bg-white">

                <div>
                    <ul className="justify-content-around">
                        <li><Link to="" className="icon-animation" onClick={() => this.openpopup()}><span className="sharebox-icons text-icon"></span><p className="text-hover mb-0">Text</p></Link></li>
                        <li><Link to="" className="icon-animation" onClick={() => this.openpopup()}><span className="sharebox-icons photo-icon"></span><p className="text-hover mb-0">Images</p></Link></li>
                        <li><Link to="" className="icon-animation" onClick={() => this.openpopup()}><span className="sharebox-icons audio-icon"></span><p className="text-hover mb-0">Speaker</p></Link></li>
                        <li><Link to="" className="icon-animation" onClick={() => this.openpopup()}><span className="sharebox-icons document-icon"></span><p className="text-hover mb-0">Docs</p></Link></li>
                        <li><Link to="" className="icon-animation" onClick={() => this.openpopup()}><span className="sharebox-icons gif-icon"></span><p className="text-hover mb-0">GIF</p></Link></li>
                        <li><Link to="" className="icon-animation" onClick={() => this.openpopup()}><span className="sharebox-icons vedio-icon"></span><p className="text-hover mb-0">Video</p></Link></li>
                    </ul>
                </div>
                <Modal className="share-popup"
                    title={title}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[<div className="justify-content-between">
                        <Button key="back" onClick={this.handleCancel}>
                        <a href="">Close</a>
                        </Button>
                        <Button key="submit" type="primary" onClick={this.handleOk}>
                            <a href="#">Post</a>
                        </Button></div>
                    ]}>
                        <div className="">

                        </div>

                </Modal>


            </div>
        )
    }
}

export default ShareBox;