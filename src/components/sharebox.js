import React, { Component } from 'react';
import { Button, Layout, Menu, Space, Row, Col, Modal, Card, Avatar, Dropdown, Checkbox, Upload, message, Input, Tag } from 'antd'
import { DownOutlined, InboxOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { TweenOneGroup } from 'rc-tween-one';
import { Link } from 'react-router-dom';
import { userManager } from '../shared/authentication/auth';
import { store } from '../store'
import { userLogout } from '../reducers/auth';
import GroupImage from '../styles/images/groupimage.png';
import Audio from '../styles/images/audio.png';
import Storage from '../styles/images/storage.png';
const { Header } = Layout;
const { Meta } = Card;
const { Dragger } = Upload;
// doc
const fileList = [
    {
        uid: '-1',
        name: 'xxx.png',
        status: 'done',
        url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },
    {
        uid: '-2',
        name: 'yyy.png',
        status: 'error',
    },
];

const props = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};

class ShareBox extends Component {
    state = { visible: false }
    openpopup = () => {
        this.setState({ visible: true })
    }


    state = {
        tags: ['Tag 1', 'Tag 2', 'Tag 3'],
        inputVisible: false,
        inputValue: '',
    };

    handleClose = removedTag => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        console.log(tags);
        this.setState({ tags });
    };

    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus());
    };

    handleInputChange = e => {
        this.setState({ inputValue: e.target.value });
    };
    handleInputConfirm = () => {
        const { inputValue } = this.state;
        let { tags } = this.state;
        if (inputValue && tags.indexOf(inputValue) === -1) {
            tags = [...tags, inputValue];
        }
        console.log(tags);
        this.setState({
            tags,
            inputVisible: false,
            inputValue: '',
        });
    };

    saveInputRef = input => {
        this.input = input;
    };

    forMap = tag => {
        const tagElem = (
            <Tag
                closable
                onClose={e => {
                    e.preventDefault();
                    this.handleClose(tag);
                }}
            >
                {tag}
            </Tag>
        );
    }
    render() {
        const { tags, inputVisible, inputValue } = this.state;
        const tagChild = tags.map(this.forMap);
        const { user } = store.getState().oidc;
        const menu = (
            <Menu className="menu-droupdown">
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
            <div style={{ display: 'flex' }}>{function onChange(e) {
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
                        <Link to="" className="icon-animation" onClick={() => this.openpopup()}><span className="sharebox-icons vedio-icon"></span><p className="text-hover mb-0">Video</p></Link>
                    </ul>
                </div>
                <Modal className="share-popup"
                    title={title}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[<div className="justify-content-between">
                        <Button key="back" onClick={this.handleCancel} className="btn-cancel">
                            <a href="">Close</a>
                        </Button>
                        <Button key="submit" type="primary" onClick={this.handleOk}>
                            <a href="#">Post</a>
                        </Button></div>
                    ]}>

                    {/* Image popup */}
                    {/* <div className="upload-image">
                        <Dragger {...props}>
                            <Avatar src={Storage} />
                            <p className="ant-upload-text">Upload Image</p>
                        </Dragger>
                    
                        <div className="title-img"><Input placeholder="Title of the image here" /></div>
                        <div className="caption-image"><Input placeholder="Add a caption of image, if you like" /></div>
                    </div>   */}

                    {/* Text popup */}
                    {/* <div className="upload-image"> 
                    <p></p> 
                        <div className="title-img mb-0"><Input placeholder="Title here" /></div>
                        <div className="caption-image"><Input placeholder="Add a caption of image, if you like" /></div>
                    </div>  */}

                    {/* Audio popup */}
                    {/* <div className="upload-image">
                        <div className="speekar-block">
                            <Avatar src={Audio} />
                            <div className="speekar-text"><span className="sharebox-icons speekar-icon"></span><p className="mb-0">Choose Audio</p></div>
                        </div>
                    
                        <div className="title-img mb-0"><Input placeholder="Title of the image here" /></div>
                        <div className="caption-image"><Input placeholder="Add a caption of image, if you like" /></div>
                    </div>  */}

                    {/* document popup */}
                    <div className="upload-image">
                        <div className="mb-8">
                            <Upload
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                listType="picture"
                                defaultFileList={[...fileList]}
                            >
                                <Button icon={<UploadOutlined />}>Upload</Button>
                            </Upload>
                        </div>
                        <div className="title-img mb-0"><Input placeholder="Title of the image here" /></div>
                        <div className="caption-image"><Input placeholder="Add a caption of image, if you like" /></div>
                    </div>

                    {/* TAGS */}
                    <div className="tags">
                        <div style={{ marginBottom: 10 }}>
                            <TweenOneGroup
                                enter={{
                                    scale: 0.8,
                                    opacity: 0,
                                    type: 'from',
                                    duration: 100,
                                    onComplete: e => {
                                        e.target.style = '';
                                    },
                                }}
                                leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
                                appear={false}
                            >
                                {tagChild}
                            </TweenOneGroup>
                        </div>
                        {inputVisible && (
                            <Input
                                ref={this.saveInputRef}
                                type="text"
                                size="small"
                                style={{ width: 78 }}
                                value={inputValue}
                                onChange={this.handleInputChange}
                                onBlur={this.handleInputConfirm}
                                onPressEnter={this.handleInputConfirm}
                            />
                        )}
                        {!inputVisible && (
                            <Tag onClick={this.showInput} className="site-tag-plus">
                                <PlusOutlined /> # tag
                            </Tag>
                        )}

                    </div>
                </Modal>



            </div>
        )
    }
}

export default ShareBox;