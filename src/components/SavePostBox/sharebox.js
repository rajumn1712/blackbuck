import React, { Component } from 'react';
import { Button, Menu, Modal, Card, Avatar, Dropdown, Checkbox, message, Tag, Divider, Image, Input, Tooltip, Upload, List, Alert } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import { TweenOneGroup } from 'rc-tween-one';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import AudioPlayer from "react-h5-audio-player";
import 'react-h5-audio-player/lib/styles.css';
import { Formik } from 'formik';
import { savePost } from '../../shared/api/postsApi';

const { Dragger } = Upload;
const { TextArea } = Input;


const { Meta } = Card;

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
const docs = [
    {
        avatar: [<span className="doc-icons word"></span>],
        title: 'Mini Project.Doc',
        fileSize: '150 KB'
    },
    {
        avatar: [<span className="doc-icons excel"></span>],
        title: 'Project Members list.xl...',
        fileSize: '40 KB'
    },
    {
        avatar: [<span className="doc-icons ppt"></span>],
        title: 'Power Point Slides of students.PPT',
        fileSize: '10MB'
    }
];

class ShareBox extends Component {
    postObject;
    state = {
        visible: false, modal: '', tags: [],
        inputVisible: false,
        inputValue: '',
        uploadSources: [],
        post: { Title: "", Message: "", IsAnonymous: false },
        errors: null
    }
    createObject = () => {
        return {
            "PostId": this.uuidv4(),
            "Type": "Text",
            "Message": "",
            "Title": "",
            "IsAnonymous": false,
            "ImageUrl": null,
            "CreatedDate": null,
            "UserDetails": {
                "UserId": 1,
                "Firstname": this.props.profile?.FirstName,
                "Lastname": "",
                "Image": this.props.profile?.ProfilePic,
                "Email": this.props.user?.profile?.email
            },
            "Tags": [],
            "Likes": [],
            "Claps": [],
            "whistiles": [],
            "Comments": [],
            "Group": {
                "GroupId": null,
                "GroupName": null,
                "GroupImage": null
            },
            "Shares": []
        }
    }
    uploadProps = {
        name: 'file',
        accept:".png,.jpg,.jpeg",
        multiple: false,
        action: 'http://138.91.35.185/tst.blackbuck.identity/Home/UploadFile',
        onChange:(info)=> {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
                this.postObject.ImageUrl = info.file.response
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };
    openpopup = (modal) => {
        this.clearUploaddata();
        this.postObject = this.createObject();
        this.postObject.Type = modal==="Images"?"Image":modal;
        this.setState({ visible: true, modal: modal })
    }
    popupOk = async e => {
        const validateResponse = this.validate();
        if (!validateResponse.validate) {

        } else {
            this.postObject.CreatedDate = new Date();
            this.postObject.Tags = this.state.tags;
            const response = await savePost(this.postObject);
            console.log(JSON.stringify(this.postObject))
            this.setState({
                visible: false,
            }, () => {
                message.success("Posting completed successfully")
            });
        }
    };
    clearUploaddata = ()=>{
        let { post } = this.state;
        post.IsAnonymous = false;
        post.Message = "";
        post.Title = "";
        this.setState({
           ...this.state,
            post,
            errors:null
        });
    }
    handleCancel = e => {
       this.clearUploaddata();
        this.setState({
            visible: false
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

    renderUploadType = (type) => {
        const types = {
            Text: <div>

            </div>,
            Images: <div>
                <Dragger className="upload" {...this.uploadProps}>
                    <span className="sharebox-icons photo-upload"></span>
                    <p className="ant-upload-text mt-8 mb-0">Upload Image</p>
                </Dragger>
                {this.state.uploadSources?.map((image, indx) => <div key={indx} className="mb-16 upload-preview">
                    <Image src={image} />
                    <a class="item-close">
                        <Tooltip title="Remove">
                            <span className="close-icon"></span>
                        </Tooltip>
                    </a>
                </div>)}
            </div>,
            Video: <div>
                <Dragger className="upload" {...this.uploadProps}>
                    <span className="sharebox-icons video-upload"></span>
                    <p className="ant-upload-text mt-8 mb-0">Upload Video</p>
                </Dragger>
                {this.state.uploadSources?.map((image, indx) => <div key={indx} className="mb-16 upload-preview">
                    <video width="100%" controls>
                        <source src={image} />
                    </video>
                    <a class="item-close">
                        <Tooltip title="Remove">
                            <span className="close-icon"></span>
                        </Tooltip>
                    </a>
                </div>)}

            </div>,
            Audio: <div>
                <Dragger className="upload" {...this.uploadProps}>
                    <span className="sharebox-icons audio-upload"></span>
                    <p className="ant-upload-text mt-8 mb-0">Upload Audio</p>
                </Dragger>
                {this.state.uploadSources?.map((image, indx) => <div key={indx} className="mb-16 upload-preview">
                    <AudioPlayer
                        autoPlay
                        src={image}
                        onPlay={e => console.log("onPlay")}
                        layout="horizontal-reverse"
                    />
                </div>)}
            </div>,
            Docs: <div>

                <Dragger className="upload" {...this.uploadProps}>
                    <span className="sharebox-icons docs-upload"></span>
                    <p className="ant-upload-text mt-8 mb-0">Upload Documents</p>
                </Dragger>
                <div className="docs mb-16">
                    <List
                        itemLayout="horizontal"
                        dataSource={this.state.uploadSources}
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
            </div>,
            Gif: <div>
                <Dragger className="upload" {...this.uploadProps}>
                    <span className="sharebox-icons gif-upload"></span>
                    <p className="ant-upload-text mt-8 mb-0">Upload Gif</p>
                </Dragger>
                {this.state.uploadSources?.map((image, indx) => <div key={indx} className="mb-16 upload-preview">
                    <Image src={image} />
                    <a class="item-close">
                        <Tooltip title="Remove">
                            <span className="close-icon"></span>
                        </Tooltip>
                    </a>
                </div>)}
            </div>
        }
        return type ? types[type] : null;
    }
    handleChange = ({ target }) => {
        let { post } = this.state;
        post[target.name] = target.type === "checkbox" ? target.checked : target.value;
        this.postObject[target.name] = target.type === "checkbox" ? target.checked : target.value;
        this.setState({ ...this.state, post });
    }
    uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
    validate = () => {
        let { errors, post } = this.state;
        errors = { validate: true };
        if (!post.Title || !post.Message) {
            errors.validate = false
            if (!post.Title) { errors.Title = "Title is required" }
            if (!post.Message) { errors.Message = "Caption is required" } 
        }
        this.setState({ ...this.state, errors })
        return errors;
    }
    render() {
        const { tags, inputVisible, inputValue, visible, modal } = this.state;
        const tagChild = tags?.map(this.forMap);
        const menu = (
            <Menu className="custom-droupdown">
                <Menu.Item key="0"><a href="">Public</a></Menu.Item>
                {/* <Menu.Item key="1"><a href="">Friends</a></Menu.Item>
                <Menu.Item key="2"><a href="">College</a></Menu.Item>
                <Menu.Item key="3"><a href="">Groups</a></Menu.Item> */}
            </Menu>
        );
        const title = <div className="d-flex justify-content-between">
            <Meta
                avatar={<Avatar src={this.props.profile?.ProfilePic} />}
                title={<h4 className="f-16 mb-0">{this.props.profile?.FirstName}</h4>}
                description={<div className="mb-0 f-14"><Dropdown overlay={menu} trigger={['click']}>
                    <a className="ant-dropdown-link" style={{ color: '#9B9B9B' }} onClick={e => e.preventDefault()}>
                        Public
                    </a>
                </Dropdown></div>} />
            <div style={{ display: 'flex' }}>
                <div><span className="f-14" style={{ color: 'var(--textlightcolor)' }}>Post</span><div className="f-14" style={{ marginTop: -6 }}>Anonymous</div></div>
                <Checkbox onChange={this.handleChange} value={this.state.IsAnonymous} name="IsAnonymous" className="ml-16 mt-8 mr-8 anonymous-check"></Checkbox>
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
                        <Button key="back" onClick={this.handleCancel} className="btn-cancel">
                            Close
                        </Button>
                        <Button key="submit" type="primary" onClick={this.popupOk}>
                            Post
                        </Button></div>
                    ]}>
                    <div className="upload-image">
                {this.state.errors&&!this.state.errors.validate&&<Alert showIcon type="error" message={<>{Object.keys(this.state.errors).map((value,indx)=><>{this.state.errors[value]&&<><span>{this.state.errors[value]}</span><br/></>}</>)}</>}/>}
                        {this.renderUploadType(modal)}
                        <form >
                            <div className="title-img">
                                <TextArea
                                    placeholder={`Title of the ${modal} here`}
                                    autoSize={{ minRows: 1, maxRows: 6 }}
                                    style={{ resize: 'none' }}
                                    name="Title"
                                    onChange={this.handleChange}
                                    value={this.state.post.Title}
                                    required={true}
                                />
                            </div>
                            <div className="caption-image">
                                <TextArea
                                    placeholder={`Add a caption of ${modal}, if you like`}
                                    autoSize={{ minRows: 1, maxRows: 6 }}
                                    style={{ resize: 'none' }}
                                    name="Message"
                                    onChange={this.handleChange}
                                    value={this.state.post.Message}
                                    required={true}
                                />
                            </div>
                        </form>
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
const mapStateToProps = ({ oidc }) => {
    return { profile: oidc.profile, user: oidc.user }
}
export default connect(mapStateToProps)(ShareBox);