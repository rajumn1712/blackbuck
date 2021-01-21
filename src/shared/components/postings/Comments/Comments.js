import React, { Component } from 'react';
import { Avatar, Comment, Form, Button, List, message, Menu, Dropdown } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import user from '../../../../styles/images/user.jpg';
import { connect } from 'react-redux';
import { fetchComments, postComment } from '../../../api/postsApi';
import defaultUser from '../../../../styles/images/defaultuser.jpg';
import Moment from 'react-moment'
import { uuidv4 } from '../../../../utils';
import { fetchLMSComments, saveLMSComment } from '../../../../lms/api';
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
    componentWillReceiveProps(newProps) {
        if ((this.props.object !== newProps.object) && Object.keys(newProps.object).length > 0) {
            let { comments } = this.state;
            comments.unshift(newProps.object);
            this.setState({ ...this.state, comments, count: this.state.count + 1 })
        }
    }
    async loadComments(take, skip) {
        const commentResponse = await (this.props.isLMSComment ? fetchLMSComments : fetchComments)(this.props.postId, take, skip);
        if (commentResponse.ok) {
            let { comments } = this.state
            if(commentResponse.data.length > 0){
                this.setState({ ...this.state, comments: comments.concat(commentResponse.data[0].Comments) });
            }
        }
    }
    onSubmit = async () => {
        let lmscommentObj = {ReferenceId:'',Comments:[]}
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
        if(this.props.isLMSComment){
            lmscommentObj.ReferenceId = this.props.postId;
            lmscommentObj.Comments.push(object);
        }
        const saveResponse = await (this.props.isLMSComment ? saveLMSComment(lmscommentObj) : postComment(this.props.postId, object));
        if (saveResponse.ok) {
            let { comments } = this.state;
            comments.unshift(object);
          if(this.props.onUpdate){ this.props.onUpdate("commentsCount", this.state.count + 1, object); }
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
                {(comments.length > 0) && <> <List
                    className="comment-list"
                    dataSource={comments}
                    header={!this.props.isLMSComment ? `${count} ${count > 1 ? 'Comments' : 'Comment'}` : ''}
                    itemLayout="horizontal"
                renderItem={item => <Comment content={item.Comment} author={item.Firstname} datetime={<><Moment fromNow>{item.CreatedDate}</Moment>{this.props.profile?.Id==item.UserId && <Dropdown placement="bottomRight" overlay={commentEdit} trigger={['click']}><a className="ant-dropdown-link"><span class="post-icons h-more-icon mr-0 ml-8 cursor-pointer"></span></a></Dropdown>}</>} avatar={<Avatar src={item.Image || defaultUser} />}>
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