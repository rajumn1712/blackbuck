import React, { Component } from 'react';
import { Button, Layout, Card, Avatar, List, message, Spin, Tag, Typography } from 'antd'
import user from '../../../styles/images/user.jpg';
import Comments from './Comments/Comments';
import SideAction from './Actions/SideActions';
import EmojiAction from './Actions/EmojiActions';
import CommentAction from './Actions/CommentAction';
import ShareAction from './Actions/ShareActions';
const { Meta } = Card;
const { Title, Paragraph } = Typography;
class PostVideo extends Component {
    state = {
        video: {
            src: "https://archive.org/download/Popeye_forPresident/Popeye_forPresident_512kb.mp4",
            postTitle: 'Computer Science And Engineering(CSE) Mini Projects - Engineering',
            postDescription: `Although social distancing has created many changes with CBU courses, we are still offering a wide range of classes virtually. You read correctly`,
            lovesCount: 10,
            clapsCount: 0,
            whistlesCount: 0,
            postTags: [
                { tagname: '#CSC Tech' },
                { tagname: '#Computer' },
                { tagname: '#Techee' }
            ]
        },
        comments: [],
        commentsection: false,
        submitting: false,
        value: '',
        visible: false
    };
    handleSubmit = () => {

    }
    showComment = () => {
        this.setState({ commentsection: true })
    }

    handleEmojiEvent = (event, name, count) => {
        switch (name) {
            case 'Love':
                this.updateLoveCount(count);
                break;
            case 'Claps':
                this.updateClapsCount(count);
                break;
            case 'Whistles':
                this.updateWhistlesCount(count);
                break;
            default:
                break;
        }
    }

    updateLoveCount = (lovescount) => {
        this.setState({
            video: {
                ...this.state.video,
                lovesCount: lovescount
            }
        })
    }

    updateClapsCount = (clapscount) => {
        this.setState({
            video: {
                ...this.state.video,
                clapsCount: clapscount
            }
        })
    }

    updateWhistlesCount = (whistlescount) => {
        this.setState({
            video: {
                ...this.state.video,
                whistlesCount: whistlescount
            }
        })
    }
    render() {
        const title = <Meta
            avatar={
                <Avatar src={user} />
            }
            title="CSC Champions Group"
            description={<div><a className="mr-8 grp-type"><span className="grp-type-icon public mr-4"></span>Public Group</a><span>24-10-2020 09:50 am</span></div>}
        />

        const { video, submitting, commentsection, comments, value } = this.state;

        return (
            !submitting ? <div className="post-card comment-show">
                <Card title={title} style={{ width: '100%' }} bordered={false} extra={
                    <SideAction clickedEvent={(event, name) => this.handleEvent(event, name)} />
                }
                    actions={[<EmojiAction key="emoji" mystate={video} clickedEvent={(event, name, count) => this.handleEmojiEvent(event, name, count)} />,
                    <CommentAction key="comment" clickedEvent={() => this.showComment()} />,
                    <ShareAction key="share" />
                    ]}
                    cover={<div> <video width="100%" controls src="https://archive.org/download/Popeye_forPresident/Popeye_forPresident_512kb.mp4">
                    </video></div>}
                >
                    <div className="p-16">
                        <Title level={5} className="post-title f-16">{video.postTitle}</Title>
                        <Paragraph className="f-14 post-desc">{video.postDescription}</Paragraph>
                        <ul className="card-actions-count pl-0">
                            <li><span className="counter-icon loves"></span>{video.lovesCount}<span> Loves</span></li>
                            <li><span className="counter-icon claps"></span>{video.clapsCount}<span> Claps</span></li>
                            <li><span className="counter-icon whistles"></span>{video.whistlesCount}<span> Whistles</span></li>
                        </ul>
                        <div className="post-tag">
                            {video.postTags.map((tag, index) => {
                                return <Tag key={index} className="f-14 px-16">{tag.tagname}</Tag>
                            })}
                        </div>
                    </div>
                </Card>
                {commentsection ? <Comments comments={comments} submitting={submitting} value={value}
                    submitted={this.handleSubmit} changed={this.handleChange} /> : null}
            </div> : null
        )
    }
}
export default PostVideo;