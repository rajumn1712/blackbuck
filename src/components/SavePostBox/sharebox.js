import React, { Component } from 'react';
import { Button, Menu, Modal, Card, Avatar, Dropdown, Checkbox, message, Input, Tag, Divider } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import { TweenOneGroup } from 'rc-tween-one';
import { Link } from 'react-router-dom';
// import { userManager } from '../../shared/authentication/auth';
import { store } from '../../store'
// import { userLogout } from '../../reducers/auth';
import GroupImage from '../../styles/images/groupimage.png';
import OkIcon from '../../styles/images/okicon.png';
import Audio from '../../styles/images/audio.png';
import TextBox from './textboxmodal';
import ImageBox from './imageboxmodal';
import AudioBox from './audioboxmodal';
import DocumentsBox from './documentsboxmodal';
import GifBox from './gifboxmodal';
import VideoBox from './videoboxmodal';


const { Meta } = Card;
// doc
const fileList = [];

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


const postsmenu =
    [
        {
            "Heading": "Text",
            "Url": "",
            "CssSprite": "sharebox-icons text-icon",
            "IsActive": false,
            "Id": "Text"
        },
        {
            "Heading": "Images",
            "Url": "",
            "CssSprite": "sharebox-icons photo-icon",
            "IsActive": false,
            "Id": "Images"
        },
        {
            "Heading": "Audio",
            "Url": "",
            "CssSprite": "sharebox-icons audio-icon",
            "IsActive": false,
            "Id": "Audio"
        },
        {
            "Heading": "Docs",
            "Url": "",
            "CssSprite": "sharebox-icons document-icon",
            "IsActive": false,
            "Id": "Docs"
        },
        {
            "Heading": "Gif",
            "Url": "",
            "CssSprite": "sharebox-icons gif-icon",
            "IsActive": false,
            "Id": "Gif"
        },
        {
            "Heading": "Video",
            "Url": "",
            "CssSprite": "sharebox-icons video-icon",
            "IsActive": false,
            "Id": "Video"
        }
    ]

class ShareBox extends Component {
    state = {
        visible: false, modal: '', tags: [],
        inputVisible: false,
        inputValue: '',
    }
    openpopup = (modal) => {
        this.setState({ visible: true, modal: modal })
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
        const { tags, inputVisible, inputValue, visible, modal } = this.state;
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
        const title = <div className="d-flex justify-content-between">
            <Meta
                avatar={<Avatar src={GroupImage} />}
                title={<h4 className="f-16 mb-0">Jhon Doe</h4>}
                description={<div className="mb-0 f-14"><Dropdown overlay={menu} trigger={['click']}>
                    <a className="ant-dropdown-link" style={{ color: '#9B9B9B' }} onClick={e => e.preventDefault()}>
                        Public
                    </a>
                </Dropdown></div>} />
            <div style={{ display: 'flex' }}>{function onChange(e) {
                console.log(`checked = ${e.target.checked}`);
            }}
                <div><span className="f-14" style={{ color: 'var(--textlightcolor)' }}>Post</span><div className="f-14" style={{ marginTop: -6 }}>Anonymous</div></div>
                <Checkbox className="ml-16 mt-8 mr-8 anonymous-check"></Checkbox>
            </div>
        </div>

        return (
            <div className="share-box">
                <ul className="justify-content-around">
                    {postsmenu.map(menu => {
                        return <li key={menu.Id}><Link className="icon-animation" onClick={() => this.openpopup(menu.Id)}><span className={menu.CssSprite}></span><p className="text-hover mb-0">{menu.Heading}</p></Link></li>
                    })}
                </ul>
                <Modal className="share-popup"
                    title={title}
                    visible={visible}
                    onOk={this.handleOk}
                    onCancel={this.popupOk}
                    footer={[<div className="d-flex justify-content-between">
                        <Button key="back" onClick={this.popupOk} className="btn-cancel">
                            Close
                        </Button>
                        <Button key="submit" type="primary" onClick={this.popupOk}>
                            Post
                        </Button></div>
                    ]}>
                    {/* Text popup */}
                    {modal === 'Text' ? <TextBox /> : null}
                    {/* Image popup */}
                    {modal === 'Images' ? <ImageBox customprops={props} /> : null}
                    {/* Audio popup */}
                    {modal === 'Audio' ? <AudioBox customprops={props} /> : null}
                    {/* document popup */}
                    {modal === 'Docs' ? <DocumentsBox customprops={props} /> : null}
                    {/* Gif popup */}
                    {modal === 'Gif' ? <GifBox customprops={props} /> : null}
                    {/* Video popup */}
                    {modal === 'Video' ? <VideoBox customprops={props} /> : null}
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