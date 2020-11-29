import { Card, Carousel, Col, Empty, Modal, Row, Tag, Typography, message, Avatar } from 'antd';
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
const { Meta } = Card;



class PostCardModal extends Component {

    slider = createRef(null);
    componentDidMount() { }
    componentWillReceiveProps(props) {
        this.setState({ post: props.postData, visible: props.visible })
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
    titleAvatar = (user, date) => {
        return <Meta
            avatar={
                <Avatar src={user.Image || defaultUser} />
            }
            title={user.Firstname}
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
        // const result = user.UserId === this.props.profile.Id ? ownerActions.concat(actionsList) : actionsList;
        const result =  actionsList;
        return result;
    }
    goToPrevSlide = () => {
        this.slider.current.prev();
    }

    goToNextSlide = () => {
        this.slider.current.next();
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
            post: {
                ...this.state.post,
                lovesCount: lovescount
            }
        })
    }

    updateClapsCount = (clapscount) => {
        this.setState({
            post: {
                ...this.state.post,
                clapsCount: clapscount
            }
        })
    }

    updateWhistlesCount = (whistlescount) => {
        this.setState({
            post: {
                ...this.state.post,
                whistlesCount: whistlescount
            }
        })
    }

    showComment = () => {
        this.setState({ commentsection: true })
    }
    handleEvent = (e, name, post) => {
        switch (name) {
            case "Delete":
                break;
            case "Edit":
                break;
            case "Save Post":
                break;
            default:
                break;
        }
    }

    render() {

        const { post, submitting, comments, value, commentsection } = this.state;

        const { Title, Paragraph } = Typography;

        const carouselData = (
            <div className="preview-image">
                <a className="more-frnd-btn prev" onClick={() => this.goToPrevSlide()}><span className="icon left-arrow mr-0"></span></a>
                <Carousel ref={this.slider}>
                    {post.image?.map((image, index) => {
                        return <div key={index}>
                            <img src={image.image} />
                        </div>
                    })}
                </Carousel>
                <a className="more-frnd-btn next" onClick={() => this.goToNextSlide()}><span className="icon right-arrow mr-0"></span></a>
            </div>
        )

        const noCarousel = (
            <div className="preview-image">
                { post.image && <Carousel>
                    <div>
                        <img src={post.image[0].image} />
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
                        <Col xs={24} sm={16} md={16} lg={17}>
                            {post.image && post.image.length > 1 ? carouselData : noCarousel}
                        </Col>
                        <Col xs={24} sm={8} md={8} lg={7}>
                            <div className="preview-content">
                                <Card title={this.titleAvatar(post.userdetails, post.date)} style={{ width: '100%', borderRadius: 10 }} bordered={false}
                                    extra={
                                        <SideAction clickedEvent={(event, name) => this.handleEvent(event, name, post)} actionsList={this.fetchCardActions(post.userdetails)} />
                                    }
                                    actions={[<EmojiAction key="emoji" mystate={post} clickedEvent={(event, name, count) => this.handleEmojiEvent(event, name, count)} />,
                                    <CommentAction key="comment" clickedEvent={() => this.showComment()} />,
                                    <ShareAction key="share" />
                                    ]}
                                >
                                    <div className="p-16">
                                        <Title level={5} className="post-title f-16">{post.title}</Title>
                                        <Paragraph className="f-14 post-desc">{post.meassage}</Paragraph>
                                        <ul className="card-actions-count pl-0">
                                            <li><span className="counter-icon loves"></span>{post.lovesCount}<span> Loves</span></li>
                                            <li><span className="counter-icon claps"></span>{post.clapsCount}<span> Claps</span></li>
                                            <li><span className="counter-icon whistles"></span>{post.whistlesCount}<span> Whistles</span></li>
                                        </ul>
                                        <div className="post-tag">
                                            {post.tags?.map((tag, index) => {
                                                return <Tag key={index} className="f-14 px-16">{tag.tagname}</Tag>
                                            })}
                                        </div>
                                    </div>
                                </Card>
                                {commentsection ? <Comments comments={comments} submitting={submitting} value={value}
                                    submitted={this.handleSubmit} changed={this.handleChange} /> : null}
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