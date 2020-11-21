import { Avatar, Card, Tag, Typography } from 'antd';
import React, { Component } from 'react';
import PostImage from '../../../styles/images/post-image.jpg';
import user from '../../../styles/images/user.jpg';
import CommentAction from './Actions/CommentAction';
import EmojiAction from './Actions/EmojiActions';
import ShareAction from './Actions/ShareActions';
import SideAction from './Actions/SideActions';
import Comments from './Comments/Comments';
import PostCardModal from './PostModal';
import moment from 'moment';

const { Meta } = Card;
const { Title, Paragraph } = Typography;

const title = <Meta
    avatar={
        <Avatar src={user} />
    }
    title="Nora Briggs"
    description="24-10-2020 09:50 am"
/>

class TextPostCard extends Component {

    state = {
        postimage: {
            post: title,
            imageData: [
                { image: PostImage, classname: 'image-box' }
            ],
            postTitle: 'Do you miss seeing the friendly faces of your fellow Colony Brands’ employees?',
            postDescription: `Although social distancing has created many changes with CBU courses, we are still offering a
            wide range of classes virtually.  You read correctly`,
            lovesCount: 10,
            clapsCount: 0,
            whistlesCount: 0,
            postTags: [
                { tagname: '#CSC Tech' },
                { tagname: '#Computer' },
                { tagname: '#Techee' }
            ]
        },
        textposts: this.props.texts,
        comments: [],
        commentsection: false,
        submitting: false,
        value: '',
        visible: false
    }

    handleSubmit = () => {

    }
    componentDidMount = ()=>{ //temporary code
        const allposts = [...this.state.textposts];
        allposts.map(post=>{
            post.comments.map(comment=>{
                comment['author'] = comment.Firstname;
                comment['avatar'] = comment.Image;
                comment['content'] = comment.Comment;
                comment['datetime'] = moment().fromNow(comment.CreatedDate);
                comment.Replies.map(reply=>{
                    reply['author'] = reply.Firstname;
                    reply['avatar'] = reply.Image;
                    reply['content'] = reply.Comment;
                    reply['datetime'] = moment().fromNow(reply.CreatedDate)
                    })
            })
        })
        this.setState({textposts:allposts})
    }

    handleChange = e => {
        this.setState({
            value: e.target.value,
        });
    };

    handleDeletePost = () => {
        this.setState({ submitting: true });
    }

    handleEvent = (event, name) => {
        if (name == 'Delete') {
            this.handleDeletePost();
        }
        // switch (name) {
        //     case 'Save Post':
        //         handleSavePost();
        //         break;
        //     case 'Edit':
        //         handleEditPost();
        //         break;
        //     case 'Turn on Notifications':
        //         handleNotifications();
        //         break;
        //     case 'Delete':
        //         handleDeletePost();
        //         break;
        //     default:
        //         handleSavePost();
        // }
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
            postimage: {
                ...this.state.postimage,
                lovesCount: lovescount
            }
        })
    }

    updateClapsCount = (clapscount) => {
        this.setState({
            postimage: {
                ...this.state.postimage,
                clapsCount: clapscount
            }
        })
    }

    updateWhistlesCount = (whistlescount) => {
        this.setState({
            postimage: {
                ...this.state.postimage,
                whistlesCount: whistlescount
            }
        })
    }

    showComment = () => {
        this.setState({ commentsection: true })
    }

    showModal = () => {
        this.setState({ visible: true });
    }

    render() {

        const { postimage, textposts, commentsection, comments, submitting, value } = this.state;

        return (
            textposts.map(textpost => {
                return <div className="post-card comment-show">
                    <Card title={<Meta
                        avatar={
                            <Avatar src={textpost.userdetails.Image} />
                        }
                        title={
                            [textpost.userdetails.Firstname, textpost.userdetailsLastname].join(" ")
                        }
                        description="24-10-2020 09:50 am"
                    />} style={{ width: '100%' }} bordered={false} extra={
                        <SideAction clickedEvent={(event, name) => this.handleEvent(event, name)} />
                    }
                        actions={[<EmojiAction key="emoji" mystate={postimage} clickedEvent={(event, name, count) => this.handleEmojiEvent(event, name, count)} />,
                        <CommentAction key="comment" clickedEvent={() => this.showComment()} />,
                        <ShareAction key="share" />
                        ]}
                    >
                        <div className="p-16">
                            <Title level={5} className="post-title f-16">{postimage.postTitle}</Title>
                            <Paragraph className="f-14 post-desc">{postimage.postDescription}</Paragraph>
                            <ul className="card-actions-count pl-0">
                                <li><span className="counter-icon loves"></span>{postimage.lovesCount}<span> Loves</span></li>
                                <li><span className="counter-icon claps"></span>{postimage.clapsCount}<span> Claps</span></li>
                                <li><span className="counter-icon whistles"></span>{postimage.whistlesCount}<span> Whistles</span></li>
                            </ul>
                            <div className="post-tag">
                                {postimage.postTags.map((tag, index) => {
                                    return <Tag key={index} className="f-14 px-16">{tag.tagname}</Tag>
                                })}
                            </div>
                        </div>
                    </Card>
                    {(commentsection || textpost.comments.length > 0) ? <Comments comments={textpost.comments} submitting={submitting} value={value}
                        submitted={this.handleSubmit} changed={this.handleChange} /> : null}
                    <PostCardModal {...this.state} closed={() => { this.setState({ visible: false }) }} />
                </div>
            })
        )
    }
}

export default TextPostCard;