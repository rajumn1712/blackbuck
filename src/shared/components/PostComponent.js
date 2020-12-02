import React, { Component } from 'react';
import { Button, Layout, Menu, Space, Row, Col, Modal, Card, Avatar, Dropdown, Checkbox, Upload, message, Input, Tag } from 'antd'
import GroupImage from '../../styles/images/groupimage.png';
import Storage from '../../styles/images/storage.png';
import { DownOutlined, InboxOutlined, PlusOutlined } from '@ant-design/icons';
import openNotificationWithIcon from './toastNotify';
import { TweenOneGroup } from 'rc-tween-one';
const { Meta } = Card;
const { Dragger } = Upload;
var lstFiles=[];
const handleOnChange = (info) => {
    if (info.file.status === 'done') {
        // var postObj = { ...this.state.postObj };
        // postObj.lstFiles = info.fileLst;
        // this.setState({ postObj: postObj });
         lstFiles = info.fileList;
        openNotificationWithIcon({ title: 'Success', notType: 'success', message: `${info.file.name} file uploaded successfully` });
    } else if (info.file.status === 'error') {
        openNotificationWithIcon({ title: 'Error', notType: 'error', message: `${info.file.name} file uploaded ` });
    }
}
const props = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    showUploadList: false,
    onChange: handleOnChange,
};


class PostComponent extends Component {
    state = {
        avatars: { 'text': { 'text': 'good morning hyderabad', 'icon': GroupImage }, 'audio': { 'text': 'Upload audio', 'icon': GroupImage }, 'video': { 'text': 'Upload video', 'icon': GroupImage }, 'gif': { 'text': 'Upload gif', 'icon': GroupImage }, 'image': { 'text': 'Upload image', 'icon': GroupImage }, 'doc': { 'text': 'Upload doc', 'icon': GroupImage } },
        postObj: {
            users: ['Public', 'Friends', 'College', 'Groups'],
            userName: 'john Doe',
            lstFiles: [],
            Title: null,
            Caption: null,
            IsAnonymousChecked: false,
            tags: ['Unremovable', 'Tag 2', 'Tag 3'],
        },
        inputValue: '',
        inputVisible: false,
        lstFiles: [],
    }
    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus());
    };
    handleInputChange = e => {
        this.setState({ inputValue: e.target.value });
    };
    handleInputConfirm = () => {
        var postObj = { ...this.state.postObj };
        const { inputValue } = this.state;
        if (inputValue && postObj.tags.indexOf(inputValue) === -1) {
            const tags = [...postObj.tags, inputValue];
            postObj.tags = tags;
        }
        this.setState({
            postObj: postObj,
            inputVisible: false,
            inputValue: ''
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

    componentDidMount() {

    }

    handleClose = removedTag => {
        var postObj = { ...this.state.postObj };
        const tags = postObj.tags.filter(tag => tag !== removedTag);
        postObj.tags = tags;
        this.setState({ postObj: postObj });
    };
    onAnnChange = isValue => {
        var postObj = { ...this.state.postObj };
        postObj.IsAnonymousChecked = !isValue;
        this.setState({ postObj: postObj });
    }
    handleCancel = () => {
        this.props.type.visible = false;
    }
    render() {
        const { type, visible } = this.props.type;
        const { postObj, avatars, inputVisible, inputValue } = this.state;
        const tags = { ...this.state.postObj }
        const menu = (
            <Menu className="menu-droupdown">
                {postObj.users?.map((item, indx) =>
                    <Menu.Item key={indx}>{item}</Menu.Item>)}
            </Menu>);

        const title = <div className="d-flex justify-content-between">
            <Meta
                avatar={<Avatar src={GroupImage} />}
                title={<div><h4 className="media-head">{postObj.userName}</h4></div>}
                description={<div className="mb-0 f-10"><Dropdown overlay={menu} trigger={['click']}>
                    <a className="ant-dropdown-link" style={{ color: '#9B9B9B' }} onClick={e => e.preventDefault()}>
                        Select Type <DownOutlined />
                    </a>
                </Dropdown></div>} />
            <div style={{ display: 'flex' }}>{function onChange(e) {
                console.log(`checked = ${e.target.checked}`);
            }}
                <div className="lable-height"><span className="f-9 text-gray">Post</span><p className="check-text">Anonymous</p></div>
                <Checkbox className="ml-8 mt-8" checked={postObj.IsAnonymousChecked} onChange={() => this.onAnnChange(postObj.IsAnonymousChecked)}></Checkbox>
            </div>
        </div>
        const tagRepeat = tags.tags?.map(this.forMap);
        return (
            <Modal className="share-popup"
                title={title}
                visible={visible}
                footer={[<div className="d-flex justify-content-between">
                    <Button key="back" onClick={this.handleCancel} className="btn-cancel">
                        <a >Close</a>
                    </Button>
                    <Button key="submit" type="primary" onClick={this.handleOk}>
                        <a href="#">Post</a>
                    </Button></div>
                ]}>
                { <div className="upload-image">
                    {type == 'image' && <Dragger {...props}>
                        <Avatar src={avatars[type].icon} />
                        <p className="ant-upload-text">{avatars[type].text}</p>
                    </Dragger>}
                    {type !== 'image' && <div><Dragger {...props}>
                        <Avatar src={avatars[type].icon} />
                        <p className="ant-upload-text">{avatars[type].text}</p>
                    </Dragger>
                        <ul>
                            {
                                lstFiles?.map((item, index) =>
                                    <li key={index}>
                                        {item.name}
                                    </li>)
                            }
                        </ul>
                    </div>
                    }

                </div>
                }
                {type !== 'text' &&
                    <p className="title-img mb-0"><Input autoSize={{ minRows: 1, maxRows: 6 }} placeholder="Title of the image here" value={postObj.Title} /></p>
                }
                {type !== 'text' && <p className="caption-image"><Input placeholder="Add a caption of image, if you like" value={postObj.Caption} /></p>}
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
                        {tagRepeat}
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
            </Modal>
        )
    }
}

export default PostComponent;