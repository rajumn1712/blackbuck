import React, { Component } from 'react';
import { Button, Layout, Menu, Space, Row, Col, Modal, Card, Avatar, Dropdown, Checkbox, Upload, message, Input, Tag, Image, Divider, List,
    Tooltip } from 'antd'
import { DownOutlined, InboxOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { TweenOneGroup } from 'rc-tween-one';
import { Link } from 'react-router-dom';
import { userManager } from '../shared/authentication/auth';
import { store } from '../store'
import { userLogout } from '../reducers/auth';
import GroupImage from '../styles/images/groupimage.png';
import OkIcon from '../styles/images/okicon.png';
import Audio from '../styles/images/audio.png';
import Video from '../styles/images/video.mp4';
const { Header } = Layout;
const { Meta } = Card;
const { Dragger } = Upload;
// doc
const fileList = [];
const { TextArea } = Input;
const docs = [
    {
        avatar : [<span className="doc-icons word"></span>],
        title: 'Mini Project.Doc',
        fileSize: '150 KB'
    },
    {
        avatar : [<span className="doc-icons excel"></span>],
        title: 'Project Members list.xl...',
        fileSize: '40 KB'
    },
    {
        avatar : [<span className="doc-icons ppt"></span>],
        title: 'Power Point Slides of students.PPT',
        fileSize: '10MB'
    }
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
    popupOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    };

    state = {
        tags: [],
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
        return (
            <span key={tag} style={{ display: 'inline-block' }}>
                {tagElem}
            </span>
        );
    }
    render() {
        const { tags, inputVisible, inputValue } = this.state;
        const tagChild = tags?.map(this.forMap);
        const { user } = store.getState().oidc;
        const menu = (
            <Menu className="custom-droupdown">
                <Menu.Item key="0"><a href="">Public</a></Menu.Item>
                <Menu.Item key="1"><a href="">Friends</a></Menu.Item>
                <Menu.Item key="2"><a href="">College</a></Menu.Item>
                <Menu.Item key="3"><a href="">Groups</a></Menu.Item>
            </Menu>
        );
        const title = <div className="justify-content-between">
            <Meta
                avatar={<Avatar src={GroupImage} />}
                title={<h4 className="f-16 mb-0">Jhon Doe</h4>}
                description={<div className="mb-0 f-14"><Dropdown  overlay={menu} trigger={['click']}>
                    <a className="ant-dropdown-link" style={{ color: '#9B9B9B' }} onClick={e => e.preventDefault()}>
                        Public
                    </a>
                </Dropdown></div>} />
            <div style={{ display: 'flex' }}>{function onChange(e) {
                console.log(`checked = ${e.target.checked}`);
            }}
                <div><span className="f-14" style={{color: 'var(--textlightcolor)'}}>Post</span><div className="f-14" style={{marginTop: -6}}>Anonymous</div></div>
                <Checkbox className="ml-16 mt-8 mr-8 anonymous-check"></Checkbox>
            </div>
        </div>

        return (
            <div className="share-box">
                <ul className="justify-content-around">
                    <li><Link to="" className="icon-animation" onClick={() => this.openpopup()}><span className="sharebox-icons text-icon"></span><p className="text-hover mb-0">Text</p></Link></li>
                    <li><Link to="" className="icon-animation" onClick={() => this.openpopup()}><span className="sharebox-icons photo-icon"></span><p className="text-hover mb-0">Images</p></Link></li>
                    <li><Link to="" className="icon-animation" onClick={() => this.openpopup()}><span className="sharebox-icons audio-icon"></span><p className="text-hover mb-0">Audio</p></Link></li>
                    <li><Link to="" className="icon-animation" onClick={() => this.openpopup()}><span className="sharebox-icons document-icon"></span><p className="text-hover mb-0">Docs</p></Link></li>
                    <li><Link to="" className="icon-animation" onClick={() => this.openpopup()}><span className="sharebox-icons gif-icon"></span><p className="text-hover mb-0">GIF</p></Link></li>
                    <li><Link to="" className="icon-animation" onClick={() => this.openpopup()}><span className="sharebox-icons video-icon"></span><p className="text-hover mb-0">Video</p></Link></li>
                </ul>
                <Modal className="share-popup"
                    title={title}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.popupOk}
                    footer={[<div className="justify-content-between">
                        <Button key="back" onClick={this.popupOk} className="btn-cancel">
                            Close
                        </Button>
                        <Button key="submit" type="primary" onClick={this.popupOk}>
                            Post
                        </Button></div>
                    ]}>
                     {/* Text popup */}
                     <div className="upload-image">
                        <div className="title-img mb-0">
                            <TextArea
                                placeholder="Title here"
                                autoSize={{ minRows: 1, maxRows: 6 }}
                                style={{resize: 'none'}}
                            />
                        </div>
                        <div className="caption-image">
                            <TextArea
                                placeholder="Add a caption of image, if you like"
                                autoSize={{ minRows: 1, maxRows: 6 }}
                                style={{resize: 'none'}}
                            />
                        </div>
                    </div> 
                    <Divider dashed />
                    {/* Image popup */}
                    <div className="upload-image">
                        <Dragger className="upload" {...props}>
                            <span className="sharebox-icons photo-upload"></span>
                            <p className="ant-upload-text mt-8 mb-0">Upload Image</p>
                        </Dragger>
                        <div className="mb-16 upload-preview">
                            <Image src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />
                            <a class="item-close">
                                <Tooltip title="Remove">
                                    <span className="close-icon"></span>
                                </Tooltip>
                            </a>
                        </div>
                        <div className="title-img">
                            <TextArea
                                placeholder="Title of the image here"
                                autoSize={{ minRows: 1, maxRows: 6 }}
                                style={{resize: 'none'}}
                            />
                        </div>
                        <div className="caption-image">
                            <TextArea
                                placeholder="Add a caption of image, if you like"
                                autoSize={{ minRows: 1, maxRows: 6 }}
                                style={{resize: 'none'}}
                            />
                        </div>
                    </div>
                    <Divider dashed />
                    {/* Audio popup */}
                    <div className="upload-image">
                        <Dragger className="upload" {...props}>
                            <span className="sharebox-icons audio-upload"></span>
                            <p className="ant-upload-text mt-8 mb-0">Upload Audio</p>
                        </Dragger>
                        <div className="title-img">
                            <TextArea
                                placeholder="Title of the audio here"
                                autoSize={{ minRows: 1, maxRows: 6 }}
                                style={{ resize: 'none' }}
                            />
                        </div>
                        <div className="caption-image">
                            <TextArea
                                placeholder="Add a caption of audio, if you like"
                                autoSize={{ minRows: 1, maxRows: 6 }}
                                style={{ resize: 'none' }}
                            />
                        </div>
                    </div>
                    <Divider dashed />
                    {/* document popup */}
                    <div className="upload-image">
                        {/* <Dragger className {...props}>
                        <Upload className="mb-8"
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            listType="picture"
                            defaultFileList={[...fileList]}  >
                            
                            <span className="sharebox-icons document-icon mb-4"></span>
                            <p className="ant-upload-text">Upload Document</p>
                        </Upload>
                        </Dragger> */}
                        <Dragger className="upload" {...props}>
                            <span className="sharebox-icons docs-upload"></span>
                            <p className="ant-upload-text mt-8 mb-0">Upload Documents</p>
                        </Dragger>
                        <div className="docs mb-16">
                            <List
                                itemLayout="horizontal"
                                dataSource={docs}
                                renderItem={item => (
                                    <List.Item className="upload-preview">
                                        <List.Item.Meta
                                            avatar={item.avatar}
                                            title={item.title}
                                            description={<div className="file-size f-12">{item.fileSize}</div>}
                                        />
                                        <a class="item-close">
                                            <Tooltip title="Remove">
                                                <span className="close-icon"></span>
                                            </Tooltip>
                                        </a>
                                    </List.Item>
                                )}
                            />
                        </div>
                        <div className="title-img">
                            <TextArea
                                placeholder="Title of the documents here"
                                autoSize={{ minRows: 1, maxRows: 6 }}
                                style={{resize: 'none'}}
                            />
                        </div>
                        <div className="caption-image">
                            <TextArea
                                placeholder="Add a caption of documents, if you like"
                                autoSize={{ minRows: 1, maxRows: 6 }}
                                style={{resize: 'none'}}
                            />
                        </div>
                    </div> 
                    <Divider dashed />
                    {/* Gif popup */}
                     <div className="upload-image">
                        <Dragger className="upload" {...props}>
                            <span className="sharebox-icons gif-upload"></span>
                            <p className="ant-upload-text mt-8 mb-0">Upload Gif</p>
                        </Dragger>
                        <div className="mb-16 upload-preview">
                            <Image src="https://i.gifer.com/UZYD.gif" />
                            <a class="item-close">
                                <Tooltip title="Remove">
                                    <span className="close-icon"></span>
                                </Tooltip>
                            </a>
                        </div>
                        <div className="title-img">
                            <TextArea
                                placeholder="Title of the Gif here"
                                autoSize={{ minRows: 1, maxRows: 6 }}
                                style={{resize: 'none'}}
                            />
                        </div>
                        <div className="caption-image">
                            <TextArea
                                placeholder="Add a caption of Gif, if you like"
                                autoSize={{ minRows: 1, maxRows: 6 }}
                                style={{resize: 'none'}}
                            />
                        </div>
                    </div>  
                    <Divider dashed />
                    {/* Video popup */}
                    <div className="upload-image">
                        <Dragger className="upload" {...props}>
                            <span className="sharebox-icons video-upload"></span>
                            <p className="ant-upload-text mt-8 mb-0">Upload Video</p>
                        </Dragger>
                        <div className="mb-16 upload-preview">
                            <video width="100%" controls>
                                <source src={Video} />
                            </video>
                            <a class="item-close">
                                <Tooltip title="Remove">
                                    <span className="close-icon"></span>
                                </Tooltip>
                            </a>
                        </div>
                        <div className="title-img">
                            <TextArea
                                placeholder="Title of the video here"
                                autoSize={{ minRows: 1, maxRows: 6 }}
                                style={{ resize: 'none' }}
                            />
                        </div>
                        <div className="caption-image">
                            <TextArea
                                placeholder="Add a caption of video, if you like"
                                autoSize={{ minRows: 1, maxRows: 6 }}
                                style={{ resize: 'none' }}
                            />
                        </div>
                    </div>  
                    <Divider dashed />
                    {/* TAGS */}
                    <div className="tags">
                        <div style={{ margin: 10 }}>
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