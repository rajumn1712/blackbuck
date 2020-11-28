import React, { Component } from 'react';
import { Avatar, Comment, Form, Button, List, message } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import user from '../../../../styles/images/user.jpg';
import { connect } from 'react-redux';
import { postComment } from '../../../api/postsApi';
import defaultUser from '../../../../styles/images/defaultuser.jpg';
import Moment from 'react-moment'

const CommentList = ({ comments }) => (
    <List
        className="comment-list"
        dataSource={comments}
        header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
        itemLayout="horizontal"
        renderItem={item => <Comment content={item.Comment} author={item.Firstname} datetime={<Moment fromNow>{item.CreatedDate}</Moment>} avatar={<Avatar src={item.Image} />}>
            {/* {item.Replies.map(reply=>{return <Comment {...reply}></Comment>})}
            {/* <Comment style={{ marginLeft: 10 }} className="reply-comment"
                avatar={
                    <Avatar src={item.Image} />
                }
                content={
                    <Editor />
                }
            /> */}
        </Comment>
        }
    />
);
class Comments extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        Comment: "",
        comments: this.props.comments || []
    }
    onChange = ({ target }) => {
        let { Comment } = this.state;
        Comment = target.value;
        this.setState({ Comment });
    }
    onSubmit = async () => {
        const object = {
            "UserId": this.props.profile?.Id,
            "Firstname": this.props.profile?.FirstName,
            "Lastname": this.props.profile?.LastName,
            "Image": this.props.profile?.ProfilePic,
            "Email": this.props.profile?.Email,
            "Comment": this.state.Comment,
            "CreatedDate": new Date(),
            "Replies": []
        }
        debugger
        const saveResponse = await postComment(this.props.postId, object);
        if (saveResponse.ok) {
            let { comments } = this.state;
            comments.push(object);
            this.setState({ ...this.state, comments,Comment:"" });
        }
    }
    render() {
        const { comments } = this.state;
        return (
            <div className="post-comment px-16">

                <Comment
                    avatar={
                        <Avatar src={this.props.profile?.ProfilePic||defaultUser} />
                    }
                    content={
                        <Form.Item><TextArea onChange={this.onChange} value={this.state.Comment} />
                            <Button disabled={!this.state.Comment} htmlType="submit" onClick={this.onSubmit} shape="circle" type="link" className="post-btn">
                                <span className="post-icons send-icon mr-0"></span>
                            </Button></Form.Item>
                    }
                />
                {comments.length > 0 && <CommentList comments={comments} />}
            </div>
        )
    }
}

const mapStateToProps = ({ oidc }) => {
    const { user, profile } = oidc;
    return { user, profile }
}
export default connect(mapStateToProps)(Comments);