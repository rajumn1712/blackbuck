import { Card, Carousel, Col, Modal, Row, Tag, Typography, Avatar, Tooltip, Spin } from 'antd';
import React, { Component, createRef } from 'react';
import CommentAction from '../shared/components/postings/Actions/CommentAction';
import EmojiAction from '../shared/components/postings/Actions/EmojiActions';
import ShareAction from '../shared/components/postings/Actions/ShareActions';
import Comments from '../shared/components/postings/Comments/Comments';
import defaultUser from '../styles/images/defaultuser.jpg';
import { fetchPostReactions, getPostDetails, saveActions, saveUserPosts } from '../shared/api/postsApi';
import SideAction from '../shared/components/postings/Actions/SideActions';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import '../components/postcard/post.css'
import AudioPlayer from "react-h5-audio-player";
import ShowMoreText from 'react-show-more-text';
import notify from '../shared/components/notification';
import { uuidv4 } from "../utils";
const { Meta } = Card;
class MediaPreview extends Component {
    slider = createRef(null);
    state = {
        post: {},
        visible: false,
        commentselection: [],
        submitting: false,
        loading: true,
        comments: [],
        commentsection: false,
        reactionsLoading: false,
        postReactions: [],
        index: 0
    }
    componentDidMount() {
        this.props.onRef(this);
    }
    openFullview = (item, type) => {
        getPostDetails(item.PostId, this.props.profile?.Id).then(res => {
            let { post } = this.state;
            post = res.data[0];
            post.image = post.image ? (Array.isArray(post.image) ? post.image : [post.image]) : post.image;
            this.setState({ post, visible: true, index: 0 }, () => {
                if (this.state.post.commentsCount > 0 && this.state.commentselection.length == 0) {
                    this.showComment(this.state.post)
                }
            })
        });
    }
    closed = () => {
        this.setState({
            post: {},
            visible: false,
            commentselection: [],
            submitting: false,
            loading: true,
            comments: [],
            commentsection: false,
            reactionsLoading: false,
            postReactions: [],
            index: 0
        });
    }
    fetchPostReactions = async (id) => {
        this.setState({ ...this.state, reactionsLoading: true });
        let actions = {};
        const reactionsResponse = await fetchPostReactions(id);
        if (reactionsResponse.ok) {
            const data = reactionsResponse.data[0].Likes;
            actions = {
                Likes: data.filter(item => item.Type === "Likes"),
                Claps: data.filter(item => item.Type === "Claps"),
                Loves: data.filter(item => item.Type === "Loves"),
                Whistiles: data.filter(item => item.Type === "Whistiles"),
                PostActions: data.filter(item => item.Type === "Likes" || item.Type === "Claps" || item.Type === "Loves" || item.Type === "Whistiles"),
            }
            this.setState({ reactionsLoading: false, postReactions: actions })
        }
    }
    updatePost = (postObj, prop, value, object) => {
        let { post } = this.state;
        post[prop] = value
        this.setState({ ...this.state, post });
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
        return <Link to={(this.props?.profile.Id == user.UserId ? ("/profile/IsProfileTab") : ("/profileview/" + user.UserId))}>
            <Meta
                avatar={<Avatar src={user.Image || defaultUser} />}
                title={<span className="overflow-text post-title">{user.Firstname}</span>}
                description={<Moment fromNow>{date}</Moment>}
            />
        </Link>
    }
    fetchCardActions = (user) => {
        const ownerActions = [
            { action: 'Delete', icons: 'post-icons delete-icon', subTitle: "Delete your post" }
        ]
        const groupActions = [
            { action: 'Delete', icons: 'post-icons delete-icon', subTitle: "Delete your post" }
        ]
        const actionsList = [
            { action: 'Save Post', icons: 'post-icons savepost-icon', subTitle: "Save this item for later" },
            { action: 'Turn on Notifications', icons: 'post-icons notify-icon', subTitle: "Keep notify from this user" },
        ]
        const result = user.UserId === this.props.profile.Id ? ownerActions.concat(actionsList) : ((this.props.groupData?.IsAdmin) ? groupActions.concat(actionsList) : actionsList);
        return result;
    }
    handleEvent = async (e, name, post) => {
        switch (name) {
            case "Delete":
                Modal.confirm({ title: 'Alert', icon: '', content: 'Are you sure want to delete post?', okText: 'Delete', cancelText: 'Cancel', onOk: () => this.deletePost(post) });
                break;
            case "Save Post":
                const obj = {
                    "Id": uuidv4(),
                    "PostId": post.id,
                    "UserId": this.props?.profile?.Id,
                    "CreatedDate": new Date()
                }
                const saveResponse = await saveUserPosts(obj);
                if (saveResponse.ok) {
                    notify({ description: "Post saved in 'Saved Posts'", message: "Post save" });
                } else {
                    notify({ description: "Something went wrong'", message: "Error", type: "error" })
                }
                break;
            default:
                break;
        }
    }
    renderPostImages = (imageObj, type) => {
        const _result = {
            Video: () => {
                return <div className="video-post" >
                    <video controls>
                        <source src={imageObj} />
                    </video>
                </div>
            },
            Audio: () => {
                return <div style={{ width: '100%', position: 'relative' }}>
                    <div class="audio">
                        <AudioPlayer
                            src={imageObj}
                            onPlay={e => console.log("onPlay")}
                            layout="horizontal-reverse"
                        />
                    </div>
                </div>
            },
        }


        return imageObj ? (_result[type] ? _result[type]() : null) : null;
    }

    handleActions = async (event, type, post) => {
        event.stopPropagation();
        type = type === "Whistles" ? "Whistiles" : type;
        type = type === "Love" ? "Loves" : type;
        const { Id, ProfilePic, FirstName, Email, LastName } = this.props.profile;
        const saveObj = {
            "UserId": Id,
            "Firstname": FirstName,
            "Lastname": LastName,
            "Image": ProfilePic,
            "Email": Email,
            "Type": type
        }
        const saveResponse = await saveActions(post.id, saveObj);
        if (saveResponse.ok) {
            let { post } = this.state;

            if (post.IsUserLikes && type == post.UserLikesType) {
                const _type = post.UserLikesType ? post.UserLikesType.toLowerCase() : "likes";
                if (post[_type] > 0) {
                    post[_type] = post[_type] - 1;
                    post.UserLikesType = null;
                }
                post.IsUserLikes = !post.IsUserLikes;
            } else {
                if (post.IsUserLikes) {
                    const _type = post.UserLikesType.toLowerCase();
                    post[_type] = post[_type] - 1;
                } else {
                    post.IsUserLikes = !post.IsUserLikes;
                }
                post[type.toLowerCase()] = post[type.toLowerCase()] ? post[type.toLowerCase()] + 1 : 1;
                post.UserLikesType = type;
            }



            this.setState({ ...this.state, post })
        } else {
            notify({ message: "Error", description: "Something went wrong :)", type: "error" });
        }
    }
    goToPrevSlide = () => {
        let { index } = this.state;
        this.setState({ ...this.state, index: index - 1 }, () => {
            this.slider.current.prev();
        });
    }
    goToNextSlide = () => {
        let { index } = this.state;
        this.setState({ ...this.state, index: index + 1 }, () => {
            this.slider.current.next();
        });
    }

    render() {

        const { post, visible, index } = this.state;

        const { Paragraph } = Typography;

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
        const carouselData = (
            <div className="preview-image">
                {<a className="more-frnd-btn prev" onClick={() => this.goToPrevSlide()}><span className="icon left-arrow mr-0"></span></a>}
                <Carousel ref={this.slider}>
                    {(post.type == 'Image' || post.type == 'Gif') && post.image?.map((image, index) => {
                        return <div key={index}>
                            <img src={image} />
                        </div>
                    })}
                </Carousel>
                {  <a className="more-frnd-btn next" onClick={() => this.goToNextSlide()}><span className="icon right-arrow mr-0"></span></a>}
            </div>
        )


        return (
            <Modal
                className="post-preview"
                visible={visible}
                onCancel={this.closed}
                footer={null}
                width="100%"
                destroyOnClose
            >
                { visible && <div className="post-preview-box post-card comment-show">
                    <Row align="middle">
                        <Col xs={24} sm={16} md={16} lg={17} >
                            {(post.type == 'Image' || post.type == 'Gif') && post.image?.length > 1 ? carouselData : noCarousel}
                            {(post.type !== 'Image' && post.type !== 'Gif') && <div >{this.renderPostImages(post.image, post.type)}</div>}
                        </Col>
                        <Col xs={24} sm={8} md={8} lg={7}>
                            <div className="preview-content">
                                <Card title={this.titleAvatar(post.userdetails, post.date)} bordered={true}
                                    extra={
                                        <SideAction clickedEvent={(event, name) => this.handleEvent(event, name, post)} actionsList={this.fetchCardActions(post.userdetails)} />
                                    }
                                    actions={[<EmojiAction key="emoji" IsUserLikes={post.IsUserLikes} mystate={post} clickedEvent={(event, name) => this.handleActions(event, name, post)} />,
                                    <CommentAction key="comment" clickedEvent={() => this.showComment(post)} />,
                                    <ShareAction post={post} key="share" url={`${process.env.REACT_APP_HOSTURL}post_view/${post.id}`} imgUrl={post.image} />
                                    ]}
                                >
                                    <div className="">
                                        <Paragraph className="post-desc">
                                            <ShowMoreText
                                                lines={3}
                                                more='see more'
                                                less='see less'
                                            >
                                                {post.meassage}
                                            </ShowMoreText>
                                            {(post.tags != null && post.tags?.length > 0) && <div className="post-tag">
                                                {post.tags?.map((tag, index) => {
                                                    return <>{(tag != undefined && tag != null) && <Tag key={index}><Link to="/commingsoon">{`#${tag?.Name || ""}`}</Link></Tag>}</>
                                                })}
                                            </div>}
                                        </Paragraph>
                                        <div className="d-flex justify-content-between mx-16 py-16">
                                            {<span onMouseEnter={() => this.fetchPostReactions(post.id)}>
                                                <ul className="card-actions-count pl-0">
                                                    {post.likes > 0 && <Tooltip overlayClassName="like-tabs" title={<div >{this.state.reactionsLoading ? <Spin /> : <div className="likes-counters"><h4>Likes</h4>{this.state.postReactions?.Likes?.map((item, indx) => <p key={indx}>{item.Firstname}</p>)} </div>} </div>}><li><span className="counter-icon likes"></span></li></Tooltip>}
                                                    {post.loves > 0 && <Tooltip overlayClassName="like-tabs" title={<div >{this.state.reactionsLoading ? <Spin /> : <div className="likes-counters"><h4>Loves</h4> {this.state.postReactions?.Loves?.map((item, indx) => <p key={indx}>{item.Firstname}</p>)} </div>} </div>}><li><span className="counter-icon loves"></span></li></Tooltip>}
                                                    {post.claps > 0 && <Tooltip overlayClassName="like-tabs" title={<div >{this.state.reactionsLoading ? <Spin /> : <div className="likes-counters"><h4>Claps</h4>{this.state.postReactions?.Claps?.map((item, indx) => <p key={indx}>{item.Firstname}</p>)} </div>}</div>}><li><span className="counter-icon claps"></span></li></Tooltip>}
                                                    {post.whistiles > 0 && <Tooltip overlayClassName="like-tabs" title={<div>{this.state.reactionsLoading ? <Spin /> : <div className="likes-counters"><h4>Whistiles</h4> {this.state.postReactions?.Whistiles?.map((item, indx) => <p key={indx}>{item.Firstname}</p>)} </div>}</div>}><li><span className="counter-icon whistles"></span></li></Tooltip>}
                                                    {((post.loves || 0) + (post.claps || 0) + (post.whistiles || 0) + (post.likes || 0)) > 0 && <Tooltip overlayClassName="like-tabs" title={<div className="likes-counters">{this.state.reactionsLoading ? <Spin /> : <div> {this.state.postReactions?.PostActions?.map((item, indx) => <p key={indx}>{item.Firstname}</p>)} </div>}</div>}> <li ><a> {(post.loves || 0) + (post.claps || 0) + (post.whistiles || 0) + (post.likes || 0)}</a></li></Tooltip>}
                                                </ul>
                                            </span>}
                                            <ul className="card-actions-count">
                                                {post.commentsCount != null && <li className="mr-0" onClick={() => this.showComment(post)}><span></span>{post.commentsCount} <span> Comments</span></li>}
                                            </ul>
                                        </div>
                                    </div>
                                </Card>
                                {this.state.commentselection.indexOf(post.id) > -1 && <Comments postId={post.id} count={post.commentsCount} onUpdate={(prop, value, object) => { this.updatePost(post, prop, value, object) }}
                                />}
                            </div>
                        </Col>
                    </Row>
                </div>
                }
            </Modal>
        )
    }
}
const mapStateToProps = ({ oidc }) => {
    return { profile: oidc.profile }
}
export default connect(mapStateToProps)(MediaPreview);