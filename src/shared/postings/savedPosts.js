import React, { Component } from 'react';
import notify from '../components/notification';
import Posting from './index'
class SavedPostsComponent extends Component {
    render() {
        return <Posting sharebox={true} friendsSuggestions={false} postingsType="saved" onPostDelete={(post) => { notify({ message: "Delete", description: "This feature will be available in next release",type:'info' }) }} />
    }
}

export default SavedPostsComponent;