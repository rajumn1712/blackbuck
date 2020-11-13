import React, { Component } from 'react';
import { Avatar, Card, Dropdown, Popover, Tag, Tooltip, Typography } from 'antd';
import PostImage from '../../../styles/images/post-image.jpg';
import Post_Image from '../../../styles/images/post-image.jpg';
import Love from '../../../styles/images/love.gif';
import Claps from '../../../styles/images/claps.gif';
import Whistle from '../../../styles/images/whistle.gif';
import user from '../../../styles/images/user.jpg';
import Comments from './Comments/Comments';
import SideAction from './Actions/SideActions';
import EmojiAction from './Actions/EmojiActions';
import CommentAction from './Actions/CommentAction';
import ShareAction from './Actions/ShareActions';

const { Meta } = Card;
const { Title, Paragraph } = Typography;

const title = <Meta
    avatar={
        <Avatar src={user} />
    }
    title="Nora Briggs"
    description="24-10-2020 09:50 am"
/>

class ImagePost extends Component {

    state = {
        postimage: {
            post: title,
            imageData: [
                { image: PostImage, classname: 'image-box' },
                { image: Post_Image, classname: 'image-box four' },
                { image: PostImage, classname: 'image-box four' },
                { image: Post_Image, classname: 'image-box four' }
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
        comments: [],
        commentsection:false,
        submitting: false,
        value: '',


    }

    handleSubmit = () => {

    }

    handleChange = () => {

    }

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

    handleEmojiEvent = (event, name,count) => {
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

    showComment = ()=>{
        this.setState({commentsection:true})
    }

    render() {

        const { postimage, commentsection,comments, submitting, value } = this.state;

        return (
            !submitting ? <div className="post-card comment-show">
                <Card title={postimage.post} style={{ width: '100%' }} bordered={false} extra={
                    <SideAction clickedEvent={(event, name) => this.handleEvent(event, name)} />
                }
                    actions={[<EmojiAction key="emoji" mystate={postimage} clickedEvent={(event, name,count) => this.handleEmojiEvent(event, name,count)} />,
                    <CommentAction key="comment" clickedEvent={()=>this.showComment()}/>,
                    <ShareAction key="share" />
                    ]}
                    // cover={<div style={{width: '100%', position: 'relative'}}><ReactPhotoGrid
                    //     onImageClick={this.showModal}
                    //     data={imageData}
                    //     containerWidth={562}
                    //     girdSize="562x562"
                    // /><span className="more-images">+2</span></div>}
                    cover={<div style={{ width: '100%', position: 'relative' }}>
                        <div class="images" onClick={this.showModal}>
                            {postimage.imageData.map((image, index) => {
                                return <div key={index} className={image.classname}>
                                    <img src={image.image} />
                                </div>
                            })}
                            {postimage.imageData.length > 4 ? <span class="more-images">+2</span> : null}
                        </div>
                    </div>}
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
                {commentsection ? <Comments comments={comments} submitting={submitting} value={value}
                    submitted={this.handleSubmit} changed={this.handleChange} /> : null}
            </div> : null
        )
    }

}

export default ImagePost;