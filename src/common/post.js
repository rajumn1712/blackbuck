import React, { Component } from 'react';

class Post extends Component {

    render() {
        return (
            <h1>Post {this.props.route?.params?.name}</h1>
        )
    }
}

export default Post;