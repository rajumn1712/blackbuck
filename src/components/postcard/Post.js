import React, { Component } from 'react';
import { Card, Avatar, Typography, Tooltip, Dropdown, Menu, Comment, Input, Form, Button, List, Popover } from 'antd';
import moment from 'moment';
import _ from 'lodash';
// import FbImageLibrary from 'react-fb-image-grid';
import user from '../../styles/images/user.jpg';
import PostImage from '../../styles/images/postimage.jpg';
import Post_Image from '../../styles/images/post-image.jpg';
import Love from '../../styles/images/love.gif';
import Claps from '../../styles/images/claps.gif';
import Whistle from '../../styles/images/whistle.gif';
import Video from '../../styles/images/video.mp4';
import './post.css';
import {
    FacebookIcon,
    LinkedinIcon,
    TwitterIcon,
    WhatsappIcon,
} from "react-share";
import ImagePost from '../../shared/components/postings/PostingImage';
import SingleImageCard from '../../shared/components/postings/SingleImageCard';
import DocumentPost from '../../shared/components/postings/DocumentsPost';
import GroupCard from '../../shared/components/postings/GroupPost';
import { apiClient } from '../../shared/api/clients';
import TextPostCard from '../../shared/components/postings/TextPost';

const { Meta } = Card;
const { Title, Paragraph } = Typography;
const { TextArea } = Input;


const menu = (
    <Menu className="custom-dropdown more-opt">
        <Menu.Item key="0">
            <a><span className="post-icons savepost-icon"></span>Save Post</a>
        </Menu.Item>
        <Menu.Item key="1">
            <a><span className="post-icons edit-icon"></span>Edit</a>
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
class PostCard extends React.Component {
    state = {
        allPosts: {},
        comments: [],
        submitting: false,
        value: '',
        loading: false,
        visible: false,
    };

    componentDidMount = () => {
        this.getAllPosts();
    }

    getAllPosts = () => {
        apiClient.get(this.props.user ? 'service/api/posts/getUsersPosts/4/5/0' : 'service/api/posts/getAllPosts/1/5/0').then(res => {
            const allPosts = res.data;
            const grouped = _.groupBy(allPosts, post => post.type);
            this.setState({ allPosts: grouped })
        })
    }

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
        const { allPosts, comments, submitting, value, visible, loading } = this.state;
        return (
            <div>
                {allPosts.Text ? <TextPostCard texts={allPosts.Text} /> : null}
                {allPosts.Group ? <DocumentPost groups={allPosts.Group} /> : null}
                <SingleImageCard />
                <ImagePost />
                <GroupCard />
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
                            <Popover content={sharepost} trigger="click">
                                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}><span className="post-icons share-icon"></span>Share</a>
                            </Popover>,
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
                            <Popover content={sharepost} trigger="click">
                                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}><span className="post-icons share-icon"></span>Share</a>
                            </Popover>,
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