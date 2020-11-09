import React, { Component } from 'react';
import { Button, Layout, Menu, Space, Row, Col, Modal, Card, Avatar, Dropdown, Checkbox, Upload, message, Input, Tag } from 'antd'
import GroupImage from '../../styles/images/groupimage.png';
import Storage from '../../styles/images/storage.png';
import { DownOutlined, InboxOutlined } from '@ant-design/icons';
import openNotificationWithIcon from './toastNotify';
const { Meta } = Card;
const { Dragger } = Upload;
const props = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
        if (info.file.status === 'done') {
            openNotificationWithIcon({ title: 'Success', notType: 'success', message: `${info.file.name} file uploaded successfully` });
        } else if (info.file.status === 'error') {
            openNotificationWithIcon({ title: 'Error', notType: 'error', message: `${info.file.name} file uploaded ` });
        }
    },
};

class PostComponent extends Component {
    state = {
        postObj: {
            users: ['Public', 'Friends', 'College', 'Groups'],
            userName: 'john Doe',
            lstFiles: [],
            Title: null,
            Caption: null,
            IsAnonymousChecked: false,
            tags: ['Unremovable', 'Tag 2', 'Tag 3'],
        }
    }

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
    render() {
        const { type, visible } = this.props.type;
        const { postObj } = this.state;
        const tags = { ...this.state.postObj }
        const menu = (
            <Menu className="menu-droupdown">
                {postObj.users?.map((item, indx) =>
                    <Menu.Item key={indx}>{item}</Menu.Item>)}
            </Menu>);

        const title = <div className="justify-content-between">
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
                <Checkbox className="ml-8 mt-8" checked={postObj.IsAnonymousChecked}></Checkbox>
            </div>
        </div>
        const tagRepeat = tags.tags?.map(this.forMap);
        return (
            <Modal className="share-popup"
                title={title}
                visible={visible}
                footer={[<div className="justify-content-between">
                    <Button key="back" onClick={this.handleCancel} className="btn-cancel">
                        <a href="">Close</a>
                    </Button>
                    <Button key="submit" type="primary" onClick={this.handleOk}>
                        <a href="#">Post</a>
                    </Button></div>
                ]}>
                {type !== 'text' && <div className="upload-image">
                    <Dragger {...props}>
                        <Avatar src={Storage} />
                        <p className="ant-upload-text">Upload Image</p>
                    </Dragger>
                </div>
                }
                {type !== 'text' &&
                    <p className="title-img mb-0"><Input placeholder="Title of the image here" value={postObj.Title} /></p>
                }
                {type !== 'text' && <p className="caption-image"><Input placeholder="Add a caption of image, if you like" value={postObj.Caption} /></p>}
                {tagRepeat}
            </Modal>
        )
    }
}

export default PostComponent;