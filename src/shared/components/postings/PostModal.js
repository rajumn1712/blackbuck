import { Card, Carousel, Col, Modal, Row, Tag, Typography } from 'antd';
import React, { Component, createRef } from 'react';
import CommentAction from './Actions/CommentAction';
import EmojiAction from './Actions/EmojiActions';
import ShareAction from './Actions/ShareActions';
import Comments from './Comments/Comments';



class PostCardModal extends Component {

    slider = createRef(null);

    state = {
        postimage: this.props.postimage,
        comments: this.props.comments,
        commentsection: this.props.commentsection,
        submitting: this.props.submitting,
        value: this.props.value
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

    render() {

        const { postimage, commentsection, comments, submitting, value } = this.state;

        const { Title, Paragraph } = Typography;

        const carouselData = (
            <div className="preview-image">
                <a className="more-frnd-btn prev" onClick={() => this.goToPrevSlide()}><span className="icon left-arrow mr-0"></span></a>
                <Carousel ref={this.slider}>
                    {postimage.imageData.map((image, index) => {
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
                <Carousel>
                    <div>
                        <img src={postimage.imageData[0].image} />
                    </div>
                </Carousel>
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
                            {postimage.imageData.length > 1 ? carouselData : noCarousel}
                        </Col>
                        <Col xs={24} sm={8} md={8} lg={7}>
                            <div className="preview-content">
                                <Card title={postimage.post} style={{ width: '100%', borderRadius: 10 }} bordered={false}
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

export default PostCardModal;