import { Card, Carousel, Col, Empty, Modal, Row, Tag, Typography, message, Avatar,Tooltip } from 'antd';
import React, { Component, createRef } from 'react';
import CommentAction from './Actions/CommentAction';
import EmojiAction from './Actions/EmojiActions';
import ShareAction from './Actions/ShareActions';
import Comments from './Comments/Comments';
import defaultUser from '../../../styles/images/defaultuser.jpg';
import { deletePost, getPosts, saveActions } from '../../api/postsApi';
import SideAction from '../../components/postings/Actions/SideActions';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import '../../../components/postcard/post.css'
import AudioPlayer from "react-h5-audio-player";
const { Meta } = Card;



class PostCardModal extends Component {

    slider = createRef(null);
    componentDidMount() { }
    componentWillReceiveProps(props) {
        this.setState({ ...this.state, post: props.postData, visible: props.visible })
    }
    state = {
        post: this.props.postData,
        visible: this.props.visible,
        commentselection: [],
        submitting: false,
        loading: true,
        comments: [],
        commentsection: false
    }
    showComment = (post) => {
        const { commentselection } = this.state;
        const idx = commentselection.indexOf(post.id);
        if (idx > -1) {
            commentselection.splice(idx, 1);
        } else {
            commentselection.push(post.id);
        }
        this.setState({ ...this.state, commentselection })
    }
    titleAvatar = (user, date) => {
        return <Meta
            avatar={
                <Avatar src={user.Image || defaultUser} />
            }
            title={<Link to={"/profileview/" + user.UserId}><span className="overflow-text post-title">{user.Firstname}</span></Link>}
            description={<Moment fromNow>{date}</Moment>}
        />
    }
    fetchCardActions = (user) => {
        const ownerActions = [
            { action: 'Edit', icons: 'post-icons edit-icon' },
            { action: 'Delete', icons: 'post-icons delete-icon' }
        ]
        const actionsList = [
            { action: 'Save Post', icons: 'post-icons savepost-icon' },
            { action: 'Turn on Notifications', icons: 'post-icons notify-icon' },
        ]
        const result = user.UserId === this.props.profile.Id ? ownerActions.concat(actionsList) : actionsList;
        return result;
    }
    goToPrevSlide = () => {
        this.slider.current.prev();
    }

    goToNextSlide = () => {
        this.slider.current.next();
    }
    renderPostImages = (imageObj, type) => {
        const _result = {
            Video: () => {
                return <div className="video-post">
                    <video width="100%" controls>
                        <source src={imageObj} />
                    </video>
                    <div className="play"></div>
                </div>
            },
            Document: () => {
                return null
            },
            Audio: () => {
                return <div style={{ width: '100%', position: 'relative' }}>
                    <div class="audio">
                        <AudioPlayer
                            src={imageObj[0]}
                            onPlay={e => console.log("onPlay")}
                            layout="horizontal-reverse"
                        />
                    </div>
                </div>
            },
        }


        return imageObj ? (_result[type] ? _result[type]() : null) : null;
    }

    render() {

        const { post } = this.state;

        const { Title, Paragraph } = Typography;

        const carouselData = (
            <div className="preview-image">
                <a className="more-frnd-btn prev" onClick={() => this.goToPrevSlide()}><span className="icon left-arrow mr-0"></span></a>
                <Carousel ref={this.slider}>
                    {(post.type == 'Image' || post.type == 'Gif') && post.image?.map((image, index) => {
                        return <div key={index}>
                            <img src={image} />
                        </div>
                    })}
                </Carousel>
                <a className="more-frnd-btn next" onClick={() => this.goToNextSlide()}><span className="icon right-arrow mr-0"></span></a>
            </div>
        )

        const noCarousel = (
            <div className="preview-image">
                {(post.type == 'Image' || post.type == 'Gif') && post.image && <Carousel>
                    <div>
                        <img src={post.image[0]} />
                    </div>
                </Carousel>
                }
            </div>
        )


        return (
            <Modal
                className="post-preview"
                visible={this.props.visible}
                // title="Title"
                // onOk={this.handleOk}
                onCancel={this.props.closed}
                footer={null}
                width="100%"
            >
                 <div className="post-preview-box post-card comment-show">
                    <Row align="middle">
                        <Col xs={24} sm={16} md={16} lg={17} >
                            {(post.type == 'Image' || post.type == 'Gif') && post.image.length > 1 ? carouselData : noCarousel}
                            {(post.type !== 'Image' && post.type !== 'Gif') && <div>{this.renderPostImages(post.image, post.type)}</div>}
                        </Col>
                        <Col xs={24} sm={8} md={8} lg={7}>
                            <div className="preview-content">
                                <Card title={this.titleAvatar(post.userdetails, post.date)} style={{ width: '100%', borderRadius: 10 }} bordered={false}
                                    extra={
                                        <SideAction clickedEvent={(event, name) => this.props.handleEvent(event, name, post)} actionsList={this.fetchCardActions(post.userdetails)} />
                                    }
                                    actions={[<EmojiAction key="emoji" mystate={post} clickedEvent={(event, name) => this.props.handleActions(event, name, post)} />,
                                    <CommentAction key="comment" clickedEvent={() => this.showComment(post)} />,
                                    <ShareAction key="share" />
                                    ]}
                                >
                                    <div className="p-16">
                                        <Title level={5} className="post-title">{post.title}</Title>
                                        <Paragraph className="post-desc">{post.meassage}</Paragraph>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            {<ul className="card-actions-count pl-0">
                                                <li><span className="counter-icon likes"></span></li>
                                                <li><span className="counter-icon loves"></span></li>
                                                <li ><span className="counter-icon claps"></span></li>
                                                <li><span className="counter-icon whistles"></span></li>
                                                <li>
                                                    <Tooltip title="">
                                                        <a> {(post.loves || 0) + (post.claps || 0) + (post.whistiles || (post.likes || 0))}</a>
                                                    </Tooltip>
                                                </li>
                                            </ul>}
                                            <ul className="card-actions-count">
                                                {/* {(post.likes != null && post?.likes != 0) && <li><span></span>{post.likes} <span> Likes</span></li>} */}
                                                {post.commentsCount != null && <li style={{ cursor: "pointer" }} onClick={() => this.showComment(post)}><span></span>{post.commentsCount} <span> Comments</span></li>}
                                                {/* <li><span></span>2 <span> Shares</span></li> */}
                                            </ul>
                                        </div>
                                        {(post.tags != null && post.tags?.length > 0) && <div className="post-tag">
                                            {post.tags?.map((tag, index) => {
                                                return <>{(tag != undefined && tag != null) && <Tag key={index}><Link to="/commingsoon">{`#${tag?.Name || ""}`}</Link></Tag>}</>
                                            })}
                                        </div>}
                                    </div>
                                </Card>
                                {this.state.commentselection.indexOf(post.id) > -1 && <Comments postId={post.id} count={post.commentsCount} onUpdate={(prop, value) => { this.props.updatePost(post, prop, value) }}
                                />}
                            </div>
                        </Col>
                    </Row>
                </div>
            </Modal>
        )
    }
}
const mapStateToProps = ({ oidc }) => {
    return { profile: oidc.profile }
}
export default connect(mapStateToProps)(PostCardModal);