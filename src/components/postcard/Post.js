import React, { Component } from 'react';
import { Card, Avatar, Typography, Image, Tag, Tooltip, Dropdown, Menu, Comment, Input, Form, Button, List } from 'antd';
import moment from 'moment';
// import FbImageLibrary from 'react-fb-image-grid';
import user from '../../styles/images/user.jpg';
import PostImage from '../../styles/images/postimage.jpg';
import Love from '../../styles/images/love.gif';
import Claps from '../../styles/images/claps.gif';
import Whistle from '../../styles/images/whistle.gif';
import './post.css';
import '../../index.css'
import '../../styles/theme.css'

const { Meta } = Card;
const { Title, Paragraph } = Typography;
const { TextArea } = Input;
const images = [
    PostImage,
    'https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.bmbf.de%2Fen%2Fmicrosystems-technology-2445.html&psig=AOvVaw3IZ3jCI96_Zpxt01NjnV45&ust=1604478377148000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCLDsou_55ewCFQAAAAAdAAAAABAD',
]
const menu = (
    <Menu>
        <Menu.Item key="0">
            <a href="">View</a>
        </Menu.Item>
        <Menu.Item key="1">
            <a href="">Edit</a>
        </Menu.Item>
        <Menu.Item key="3">
            <a href="">Delete</a>
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
        renderItem={props => <Comment {...props} />}
    />
);

const title = <Meta
    avatar={
        <Avatar src={user} />
    }
    title="Nora Briggs"
    description="24-10-2020 09:50 am"
/>

class  PostCard extends Component {
    state = {
        comments: [],
        submitting: false,
        value: '',
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
        const { comments, submitting, value } = this.state;
        return (
            <div className="post-card comment-show">
                <Card title={title} style={{ width: '100%', borderRadius: 10 }} bordered={false} extra={
                <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                <span className="post-icons more-icon mr-0"></span>
                </a>
              </Dropdown>}
                    actions={[
                        <a className="like-emojis">
                            <ul class="l-emojis">
                                {/* <li><Tooltip title="Love"><a>❤️</a></Tooltip></li>
                                <li><Tooltip title="Claps"><a>👍</a></Tooltip></li>
                                <li><Tooltip title="Whistle"><a>😍</a></Tooltip></li> */}
                                <li><Tooltip title="Love"><a><img src={Love} /></a></Tooltip></li>
                                <li><Tooltip title="Claps"><a><img src={Claps} /></a></Tooltip></li>
                                <li><Tooltip title="Whistle"><a><img src={Whistle} /></a></Tooltip></li>
                            </ul>
                            <span className="post-icons like-icon like-emojis"></span>Like</a>,
                        <a><span className="post-icons comment-icon"></span>Comment</a>,
                        <a><span className="post-icons share-icon"></span>Share</a>
                    ]}
                >
                    <div>
                        <Image src={PostImage} />
                    {/* <FbImageLibrary
                        images={images}
                        countFrom={5}
                    /> */}
                    </div>
                    <div className="p-16">
                        <Title level={5} className="post-title f-14">Do you miss seeing the friendly faces of your fellow Colony Brands’ employees?</Title>
                        <Paragraph className="f-12 post-desc">Although social distancing has created many changes with CBU courses, we are still offering a
wide range of classes virtually.  You read correctly</Paragraph>
                        <div className="post-tag">
                            <Tag className="f-12 px-16">#CSC Tech</Tag>
                            <Tag className="f-12 px-16">#Computer</Tag>
                            <Tag className="f-12 px-16">#Techee</Tag>
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
        )
    }
}
export default PostCard;