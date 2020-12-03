import React, { Component } from 'react';
import { Avatar, Comment, Form, Button, List, message, Menu, Dropdown } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import user from '../../../../styles/images/user.jpg';
import { connect } from 'react-redux';
import { fetchComments, postComment } from '../../../api/postsApi';
import defaultUser from '../../../../styles/images/defaultuser.jpg';
import Moment from 'react-moment'
import { uuidv4 } from '../../../../utils';
const commentEdit = (
    <Menu className="custom-dropdown">
      <Menu.Item key="0">
        <a><span className="post-icons edit-icon" />Edit</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a><span className="post-icons delete-icon" />Delete</a>
      </Menu.Item>
    </Menu>
  );
class Comments extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        Comment: "",
        comments: [],
        count: this.props.count
    }
    onChange = ({ target }) => {
        let { Comment } = this.state;
        Comment = target.value;
        this.setState({ Comment });
    }
    componentDidMount() {
        this.loadComments(2, 0);
    }
    async loadComments(take, skip) {
        const commentResponse = await fetchComments(this.props.postId, take, skip);
        if (commentResponse.ok) {
            let { comments } = this.state
            this.setState({ ...this.state, comments: comments.concat(commentResponse.data[0].Comments) });
        }
    }
    onSubmit = async () => {
        const object = {
            "CommentId":uuidv4(),
            "UserId": this.props.profile?.Id,
            "Firstname": this.props.profile?.FirstName,
            "Lastname": this.props.profile?.LastName,
            "Image": this.props.profile?.ProfilePic,
            "Email": this.props.profile?.Email,
            "Comment": this.state.Comment,
            "CreatedDate": new Date(),
            "Replies": []
        }
        const saveResponse = await postComment(this.props.postId, object);
        if (saveResponse.ok) {
            let { comments } = this.state;
            comments.unshift(object);
           if(this.props.onUpdate){ this.props.onUpdate("commentsCount", this.state.count + 1);}
            this.setState({ ...this.state, comments, Comment: "", count: this.state.count + 1 });
        }
    }
    render() {
        const { comments, count } = this.state;
        return (
            <div className="post-comment">

                <Comment
                    avatar={
                        <Avatar src={this.props.profile?.ProfilePic || defaultUser} />
                    }
                    content={
                        <Form.Item><TextArea onChange={this.onChange} value={this.state.Comment}  autoSize={{ minRows: 1, maxRows: 6 }} />
                            <Button disabled={!this.state.Comment} htmlType="submit" onClick={this.onSubmit} shape="circle" type="link" className="post-btn">
                                <span className="post-icons send-icon mr-0"></span>
                            </Button></Form.Item>
                    }
                />
                {comments.length > 0 && <> <List
                    className="comment-list"
                    dataSource={comments}
                    header={`${count} ${count > 1 ? 'Comments' : 'Comment'}`}
                    itemLayout="horizontal"
                renderItem={item => <Comment content={item.Comment} author={item.Firstname} datetime={<><Moment fromNow>{item.CreatedDate}</Moment>{this.props.profile?.Id==item.UserId && <Dropdown placement="bottomRight" overlay={commentEdit} trigger={['click']}><a className="ant-dropdown-link"><span class="post-icons h-more-icon mr-0 ml-8 c-pointer"></span></a></Dropdown>}</>} avatar={<Avatar src={item.Image || defaultUser} />}>
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
                /> {comments.length !== count && <a className="more-comments mt-16" onClick={() => this.loadComments(5, comments.length)}>View more comments</a>}</>}
            </div>
        )
    }
}

const mapStateToProps = ({ oidc }) => {
    const { user, profile } = oidc;
    return { user, profile }
}
export default connect(mapStateToProps)(Comments);