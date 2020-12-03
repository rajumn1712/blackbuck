import React, { Component } from 'react';
import Posting from './index'
class SavedPostsComponent extends Component {
    render() {
        return <Posting sharebox={true} friendsSuggestions={false} postingsType="saved" />
    }
}

export default SavedPostsComponent;