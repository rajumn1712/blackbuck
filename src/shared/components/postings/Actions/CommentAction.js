import React, { Component } from 'react';

class CommentAction extends Component{
    render(){
        return(
            <a onClick={()=>this.props.clickedEvent()}><span className="post-icons comment-icon"></span>Comment</a>
        )
    }
}

export default CommentAction;