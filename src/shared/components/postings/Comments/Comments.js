import React, { Component } from 'react';
import { Avatar, Comment, Form, Button, List } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import user from '../../../../styles/images/user.jpg';


const CommentList = ({ comments }) => (
    <List
        dataSource={comments}
        header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
        itemLayout="horizontal"
        renderItem={item => <Comment {...item}>
            {item.Replies.map(reply=>{return <Comment {...reply}></Comment>})}
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

const Editor = ({ onChange, onSubmit, submitting, value }) => (
    <>
        <Form.Item>
            <TextArea onChange={onChange} value={value} />
            {value ? <Button htmlType="submit" onClick={onSubmit} shape="circle" type="link" className="post-btn">
                <span className="post-icons send-icon mr-0"></span>
            </Button> : null}
        </Form.Item>
    </>
);

class Comments extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { comments, submitting, value, submitted, changed } = { ...this.props }
        return (
            <div className="post-comment px-16">
                {comments.length > 0 && <CommentList comments={comments} />}
                <Comment
                    avatar={
                        <Avatar src={user} />
                    }
                    content={
                        <Editor
                            onChange={changed}
                            onSubmit={submitted}
                            submitting={submitting}
                            value={value}
                        />
                    }
                />
            </div>
        )
    }
}

export default Comments;