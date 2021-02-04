import React, { Component } from 'react';
import notify from '../components/notification';
import Posting from './index'
import { deleteUserSavedPost } from "../api/postsApi";
class SavedPostsComponent extends Component {
    state = {
        count: 0
    }
    deletePost = (post) => {
        deleteUserSavedPost(post.id).then(() => {
            let { count } = this.state;
            count = count + 1;
            this.setState({ count });
            notify({ message: "Delete", description: "Saved post deleted successfully" });
        });
    };
    render() {
        return <Posting sharebox={true} key={this.state.count} friendsSuggestions={false} postingsType="saved" onPostDelete={(post) => {
            this.deletePost(post)
        }} />
    }
}

export default SavedPostsComponent;