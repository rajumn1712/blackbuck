import React, { Component } from 'react';
import { Row, Col, Card, Avatar, Typography, Image, Tag, Tooltip, Dropdown, Menu, Comment, Input, Form, Button, List, Modal, videoFile, Popover, Carousel } from 'antd';
import moment from 'moment';
// import FbImageLibrary from 'react-fb-image-grid';
import user from '../../styles/images/user.jpg';
import PostImage from '../../styles/images/postimage.jpg';
import Post_Image from '../../styles/images/post-image.jpg';
import Love from '../../styles/images/love.gif';
import Claps from '../../styles/images/claps.gif';
import Whistle from '../../styles/images/whistle.gif';
import Video from '../../styles/images/video.mp4';
import Warning from '../../styles/images/warning.png';
import './post.css';
import '../../index.css';
import '../../styles/theme.css';
import ReactPhotoGrid from 'react-photo-grid';
import Alert from '../Alert';
import {
    FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    ViberShareButton,
    WhatsappShareButton,
} from "react-share";
import {
    FacebookIcon,
    LinkedinIcon,
    TwitterIcon,
    WhatsappIcon,
} from "react-share";

const { Meta } = Card;
const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const images = [
    PostImage,
    'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.bmbf.de%2Fen%2Fmicrosystems-technology-2445.html&psig=AOvVaw3IZ3jCI96_Zpxt01NjnV45&ust=1604478377148000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCLDsou_55ewCFQAAAAAdAAAAABAD',
]

const menu = (
    <Menu className="custom-dropdown more-opt">
        <Menu.Item key="0">
            <a><span className="post-icons edit-icon"></span>Save Post</a>
        </Menu.Item>
        <Menu.Item key="1">
            <a><span className="post-icons savepost-icon"></span>Edit</a>
        </Menu.Item>
        <Menu.Item key="2">
            <a><span className="post-icons notify-icon"></span>Turn on Notifications</a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="3">
            <a><span className="post-icons delete-icon"></span>Delete</a>
        </Menu.Item>
    </Menu>
);

const Editor = ({ onChange, onSubmit, submitting, value }) => (
    <>
        <Form.Item>
            <TextArea onChange={onChange} value={value} />
            <Button htmlType="submit" onClick={onSubmit} shape="circle" type="link" className="post-btn">
                <span className="post-icons send-icon mr-0"></span>
            </Button>
        </Form.Item>
    </>
);

const CommentList = ({ comments }) => (
    <List
        dataSource={comments}
        header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
        itemLayout="horizontal"
        renderItem={props => <Comment {...props}>
            <Comment style={{ marginLeft: 10 }} className="reply-comment"
                avatar={
                    <Avatar src={user} />
                }
                content={
                    <Editor
                    //onChange={this.handleChange}
                    //onSubmit={this.handleSubmit}
                    //submitting={submitting}
                    //value={value}
                    />
                }
            />
        </Comment>}
    />
);

// const sharemenu = (
//     <Menu className="custom-dropdown">
//         <Menu.Item key="0">
//             <FacebookIcon size={24} borderRadius={24} />Facebook
//       </Menu.Item>
//         <Menu.Item key="1">
//             <TwitterIcon size={24} borderRadius={24} />Twitter
//       </Menu.Item>
//         <Menu.Item key="3">
//             <LinkedinIcon size={24} borderRadius={24} />LinkedIn
//       </Menu.Item>
//         <Menu.Item key="4">
//             <WhatsappIcon size={24} borderRadius={24} />Whatsapp
//       </Menu.Item>
//         <Menu.Divider />
//         <Menu.Item key="5">
//             <span className="post-icons sharenow-icon"></span>&nbsp;Share Now
//       </Menu.Item>
//         <Menu.Item key="6">
//             <span className="post-icons copylink-icon"></span>&nbsp;Copy Link
//       </Menu.Item>
//     </Menu>
// );
const sharepost = (
    <Menu className="share-pop">
      <Menu.Item key="0">
        <FacebookIcon size={24} borderRadius={24} />Facebook
      </Menu.Item>
      <Menu.Item key="1">
        <TwitterIcon size={24} borderRadius={24} />Twitter
      </Menu.Item>
      <Menu.Item key="3">
        <LinkedinIcon size={24} borderRadius={24} />LinkedIn
      </Menu.Item>
      <Menu.Item key="4">
        <WhatsappIcon size={24} borderRadius={24} />Whatsapp
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="5">
        <span className="post-icons sharenow-icon"></span>&nbsp;Share Now
      </Menu.Item>
      <Menu.Item key="6">
      <span className="post-icons copylink-icon"></span>&nbsp;Copy Link
      </Menu.Item>
    </Menu>
  );

const title = <Meta
    avatar={
        <Avatar src={user} />
    }
    title="Nora Briggs"
    description="24-10-2020 09:50 am"
/>
const publicgrp = <Meta
    avatar={
        <Avatar src={user} />
    }
    title="CSC Champions Group"
    description={<div><a className="mr-8 grp-type"><span className="grp-type-icon public mr-4"></span>Public Group</a><span>24-10-2020 09:50 am</span></div>}
/>
const privategrp = <Meta
avatar={
    <Avatar src={user} />
}
title="CSC Champions Group"
description={<div><a className="mr-8 grp-type"><span className="grp-type-icon private mr-4"></span>Private Group</a><span>24-10-2020 09:50 am</span></div>}
/>
const joingroup = <div className="join-grp-title">John Doe <span className="join-grp-txt">has Created a group name is</span> Mech Mantra</div>

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
class PostCard extends React.Component {
    state = {
        comments: [],
        submitting: false,
        value: '',
        loading: false,
        visible: false,
    };
    showAlert = () => {
        this.setState({
            visible: true,
        });
    };

    hideAlert = () => {
        this.setState({
            visible: false,
        });
    };
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    handleOk = () => {
        this.setState({ loading: true });
        setTimeout(() => {
            this.setState({ loading: false, visible: false });
        }, 3000);
    };
    handleCancel = () => {
        this.setState({ visible: false });
    };
    handleSubmit = () => {
        if (!this.state.value) {
            return;
        }

        this.setState({
            submitting: true,
        });

        setTimeout(() => {
            this.setState({
                submitting: false,
                value: '',
                comments: [
                    {
                        author: 'John Doe',
                        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                        content: <>{this.state.value}</>,
                        datetime: moment().fromNow(),
                    },
                    ...this.state.comments,

                ],

            });
        }, 1000);
    };
    handleChange = e => {
        this.setState({
            value: e.target.value,
        });
    };
    render() {
        const { comments, submitting, value, visible, loading } = this.state;
        const imageData = [
            PostImage,
            Post_Image,
            PostImage,
            Post_Image,
        ];
        return (
            <div>
                <div className="post-card comment-show">
                    <Card title={title} style={{ width: '100%'}} bordered={false} extra={
                        <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                <span className="post-icons more-icon mr-0"></span>
                            </a>
                        </Dropdown>}
                        actions={[
                            <a className="like-emojis">
                                <ul class="l-emojis">
                                    <li><Tooltip title="Love"><a><img src={Love} /></a></Tooltip></li>
                                    <li><Tooltip title="Claps"><a><img src={Claps} /></a></Tooltip></li>
                                    <li><Tooltip title="Whistle"><a><img src={Whistle} /></a></Tooltip></li>
                                </ul>
                                <span className="post-icons like-icon like-emojis"></span>Like</a>,
                            <a><span className="post-icons comment-icon"></span>Comment</a>,
                            <Popover content={sharepost} trigger="click">
                                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}><span className="post-icons share-icon"></span>Share</a>
                            </Popover>,
                        ]}
                        cover={<div style={{width: '100%', position: 'relative'}}><ReactPhotoGrid
                            onImageClick={this.showModal}
                            data={imageData}
                            containerWidth={562}
                            girdSize="562x562"
                        /><span className="more-images">+2</span></div>}
                    >
                        <div className="p-16">
                            <Title level={5} className="post-title f-16">Do you miss seeing the friendly faces of your fellow Colony Brands’ employees?</Title>
                            <Paragraph className="f-14 post-desc">Although social distancing has created many changes with CBU courses, we are still offering a
wide range of classes virtually.  You read correctly</Paragraph>
                            <ul className="card-actions-count pl-0">
                                <li><span className="counter-icon loves"></span>25<span> Loves</span></li>
                                <li><span className="counter-icon claps"></span>5<span> Claps</span></li>
                                <li><span className="counter-icon whistles"></span>10<span> Whistles</span></li>
                            </ul>
                            <div className="post-tag">
                                <Tag className="f-14 px-16">#CSC Tech</Tag>
                                <Tag className="f-14 px-16">#Computer</Tag>
                                <Tag className="f-14 px-16">#Techee</Tag>
                            </div>
                        </div>
                    </Card>
                    <div className="post-comment px-16">
                        {comments.length > 0 && <CommentList comments={comments} />}
                        <Comment
                            avatar={
                                <Avatar src={user} />
                            }
                            content={
                                <Editor
                                    onChange={this.handleChange}
                                    onSubmit={this.handleSubmit}
                                    submitting={submitting}
                                    value={value}
                                />
                            }
                        />
                    </div>
                    <Modal
                        className="post-preview"
                        visible={visible}
                        // title="Title"
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        footer={null}
                        width="100%"
                    >
                        <div className="post-preview-box post-card comment-show">
                            <Row align="middle">
                            <Col xs={24} sm={16} md={16} lg={17}>
                                {/* <img src={PostImage} className="overlayimage" /> */}
                                {/* <img src={PostImage} /> */}
                                <div className="preview-image">
                                    <a className="more-frnd-btn prev"><span className="icon left-arrow mr-0"></span></a>
                                    <Carousel>
                                        <div>
                                            <img src={PostImage} />
                                        </div>
                                        <div>
                                            <img src={PostImage} />
                                        </div>
                                        <div>
                                            <img src={PostImage} />
                                        </div>
                                        <div>
                                            <img src={PostImage} />
                                        </div>
                                    </Carousel>
                                    <a className="more-frnd-btn next"><span className="icon right-arrow mr-0"></span></a>
                                </div>
                            </Col>
                            <Col xs={24} sm={8} md={8} lg={7}>
                                <div className="preview-content">
                                <Card title={title} style={{ width: '100%', borderRadius: 10 }} bordered={false} extra={
                                    <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                            <span className="post-icons more-icon mr-0"></span>
                                        </a>
                                    </Dropdown>}
                                    actions={[
                                        <a className="like-emojis">
                                            <ul class="l-emojis">
                                                <li><Tooltip title="Love"><a><img src={Love} /></a></Tooltip></li>
                                                <li><Tooltip title="Claps"><a><img src={Claps} /></a></Tooltip></li>
                                                <li><Tooltip title="Whistle"><a><img src={Whistle} /></a></Tooltip></li>
                                            </ul>
                                            <span className="post-icons like-icon like-emojis"></span>Like</a>,
                                        <a><span className="post-icons comment-icon"></span>Comment</a>,
                                        <a><span className="post-icons share-icon"></span>Share</a>
                                    ]}
                                >
                                    <div className="p-16">
                                        <Title level={5} className="post-title f-16">Do you miss seeing the friendly faces of your fellow Colony Brands’ employees?</Title>
                                        <Paragraph className="f-14 post-desc">Although social distancing has created many changes with CBU courses, we are still offering a wide range of classes virtually.  You read correctly</Paragraph>
                                        <ul className="card-actions-count pl-0">
                                            <li>25<span> Loves</span></li>
                                            <li>5<span> Claps</span></li>
                                            <li>10<span> Whistles</span></li>
                                        </ul>
                                        <div className="post-tag">
                                            <Tag className="f-14 px-16">#CSC Tech</Tag>
                                            <Tag className="f-14 px-16">#Computer</Tag>
                                            <Tag className="f-14 px-16">#Techee</Tag>
                                        </div>
                                    </div>
                                </Card>
                                <div className="post-comment px-16">
                                    {comments.length > 0 && <CommentList comments={comments} />}
                                    <Comment
                                        avatar={
                                            <Avatar src={user} />
                                        }
                                        content={
                                            <Editor
                                                onChange={this.handleChange}
                                                onSubmit={this.handleSubmit}
                                                submitting={submitting}
                                                value={value}
                                            />
                                        }
                                    />
                                </div>
                                </div>
                            </Col>
                            </Row>
                        </div>
                    </Modal>
                    {/* Alert */}
                    {/* <Modal
                    title="Alert"
                    visible={this.state.visible}
                    onOk={this.hideAlert}
                    onCancel={this.hideAlert}
                    className="alert-popup"
                    footer={[<div className="justify-content-between">
                        <Button key="back" onClick={this.popupOk} className="btn-cancel">
                            Close
                        </Button>
                        <Button key="submit" type="primary" onClick={this.popupOk}>
                            Post
                        </Button></div>
                    ]}
                >
                        <div style={{display: "flex"}}>
                            <div className="alert-icon mr-16">
                                <img src={Warning} alt="Warning"/>
                            </div>
                            <div><Title level={5} className="mb-4" style={{ fontWeight: 500 }}>Are you sure want to delete this post?</Title>
                                <p style={{ color: 'var(--textsecondary)' }} className="mb-0">Although social distancing has created many changes with CBU courses, we are still
offering a wide range of classes virtually.  You read correctly</p>
                            </div>
                        </div>
                </Modal> */}
                </div>
                <div className="post-card mb-16">
                    <Card title={joingroup} style={{ width: '100%', borderRadius: 10 }} bordered={false}
                        actions={[
                            <a className="like-emojis">
                                <ul class="l-emojis">
                                    <li><Tooltip title="Love"><a><img src={Love} /></a></Tooltip></li>
                                    <li><Tooltip title="Claps"><a><img src={Claps} /></a></Tooltip></li>
                                    <li><Tooltip title="Whistle"><a><img src={Whistle} /></a></Tooltip></li>
                                </ul>
                                <span className="post-icons like-icon like-emojis"></span>Like</a>,
                            <a><span className="post-icons comment-icon"></span>Comment</a>,
                            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}><span className="post-icons share-icon"></span>Share</a>,
                        ]}
                    >
                        <div className="p-16 text-center">
                            <div className="mb-16">
                                <Avatar.Group
                                    maxCount={4}
                                    size="large"
                                    maxStyle={{ color: 'var(--primary)', backgroundColor: 'var(--secondary)' }}
                                >
                                    <Avatar src={user} />
                                    <Avatar src={user} />
                                    <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                    <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                    <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                </Avatar.Group>
                            </div>
                            <Button type="primary">Join Group</Button>
                        </div>
                    </Card>
                </div>
                {/* Video post */}
                <div className="post-card">
                    <Card title={publicgrp} style={{ width: '100%' }} bordered={false} extra={
                        <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                <span className="post-icons more-icon mr-0"></span>
                            </a>
                        </Dropdown>}
                        actions={[
                            <a className="like-emojis">
                                <ul class="l-emojis">
                                    <li><Tooltip title="Love"><a><img src={Love} /></a></Tooltip></li>
                                    <li><Tooltip title="Claps"><a><img src={Claps} /></a></Tooltip></li>
                                    <li><Tooltip title="Whistle"><a><img src={Whistle} /></a></Tooltip></li>
                                </ul>
                                <span className="post-icons like-icon like-emojis"></span>Like</a>,
                            <a><span className="post-icons comment-icon"></span>Comment</a>,
                            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}><span className="post-icons share-icon"></span>Share</a>,
                        ]}
                        cover={<div> <video width="100%" controls>
                            <source src={Video} /></video></div>}
                    >
                        <div>
                        </div>
                        <div className="p-16">
                            <Title level={5} className="post-title f-16">Computer Science And Engineering(CSE) Mini Projects - Engineering </Title>
                            <Paragraph className="f-14 post-desc">Although social distancing has created many changes with CBU courses, we are still offering a
                                wide range of classes virtually.  You read correctly</Paragraph>
                            <ul className="card-actions-count pl-0">
                                <li><span className="counter-icon loves"></span>25<span> Loves</span></li>
                                <li><span className="counter-icon claps"></span>5<span> Claps</span></li>
                                <li><span className="counter-icon whistles"></span>10<span> Whistles</span></li>
                            </ul>
                            <div className="join-grp">
                                <Avatar.Group
                                    maxCount={4}
                                    size="large"
                                    maxStyle={{ color: 'var(--primary)', backgroundColor: 'var(--secondary)' }}
                                >
                                    <Avatar src={user} />
                                    <Avatar src={user} />
                                    <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                    <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                    <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                </Avatar.Group>
                                <Button type="primary">Join Group</Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Documents Post */}
                <div className="post-card comment-show">
                    <Card title={privategrp} style={{ width: '100%', borderRadius: 10 }} bordered={false} extra={
                        <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                <span className="post-icons more-icon mr-0"></span>
                            </a>
                        </Dropdown>}
                        actions={[
                            <a className="like-emojis">
                                <ul class="l-emojis">
                                    <li><Tooltip title="Love"><a><img src={Love} /></a></Tooltip></li>
                                    <li><Tooltip title="Claps"><a><img src={Claps} /></a></Tooltip></li>
                                    <li><Tooltip title="Whistle"><a><img src={Whistle} /></a></Tooltip></li>
                                </ul>
                                <span className="post-icons like-icon like-emojis"></span>Like</a>,
                            <a><span className="post-icons comment-icon"></span>Comment</a>,
                            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}><span className="post-icons share-icon"></span>Share</a>,
                        ]}
                    >
                        <div>
                        </div>
                        <div className="p-16">
                            <Title level={5} className="post-title f-16">IT And Engineering(CSE) Mini Projects - Engineering </Title>
                            <Paragraph className="f-14 post-desc">Although social distancing has created many changes with CBU courses, we are still offering a
                                    wide range of classes virtually.  You read correctly</Paragraph>
                            <div className="docs mb-16">
                                <List
                                    itemLayout="horizontal"
                                    dataSource={docs}
                                    renderItem={item => (
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={item.avatar}
                                                title={item.title}
                                                description={<div className="file-size f-12">{item.fileSize}</div>}
                                            />
                                        </List.Item>
                                    )}
                                />                          
                            </div>
                            <ul className="card-actions-count pl-0">
                                <li><span className="counter-icon loves"></span>25<span> Loves</span></li>
                                <li><span className="counter-icon claps"></span>5<span> Claps</span></li>
                                <li><span className="counter-icon whistles"></span>10<span> Whistles</span></li>
                            </ul>
                            <div className="join-grp">
                                <Avatar.Group
                                    maxCount={4}
                                    size="large"
                                    maxStyle={{ color: 'var(--primary)', backgroundColor: 'var(--secondary)' }}
                                >
                                    <Avatar src={user} />
                                    <Avatar src={user} />
                                    <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                    <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                    <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
                                </Avatar.Group>
                                <Button type="primary">Join Group</Button>
                            </div>
                        </div>
                    </Card>
                    <div className="post-comment px-16">
                        {comments.length > 0 && <CommentList comments={comments} />}
                        <Comment
                            avatar={
                                <Avatar src={user} />
                            }
                            content={
                                <Editor
                                    onChange={this.handleChange}
                                    onSubmit={this.handleSubmit}
                                    submitting={submitting}
                                    value={value}
                                />
                            }
                        />
                    </div>
                </div>
    {/* Reply card */}
            </div>
        )
    }
}
export default PostCard;