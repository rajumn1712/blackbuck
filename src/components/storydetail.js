import moment from 'moment';
import React, { useEffect } from 'react';
import { useState } from 'react';
import ReactInstaStories from 'react-insta-stories';
import { withRouter } from 'react-router';
import { getfriendsStories, userStories } from '../shared/api/apiServer';
import connectStateProps from '../shared/stateConnect';

const StoryDetail = ({profile,match})=>{
    const [allStories,setAllStories] = useState([]);
    let [page,setPage] = useState(0);
    let [size,setSize] = useState(10);
    let [storyByUser,setStoryByUser] = useState([]);

    let storyObject = {
        url:'',
        header: {
            heading: '',
            subheading: '',
            profileImage: '',
        },
    }

    useEffect(()=>{
        getAllStories();
        if(match.params.id){
            getuserStories();
        }
    },[])

    const getAllStories = async ()=>{
        const response = await getfriendsStories(profile.Id,page,size);
        if(response.ok){
            setAllStories(getdata => getdata,...response.data);
        }
    }
    const getuserStories = async ()=>{
        const response = await userStories(match.params.id,0,10);
        if(response.ok){
            response.data.forEach(story=>{
                storyObject.url = story.url;
                storyObject.header.heading = story.FirstName;
                storyObject.header.subheading = moment(story.Createddate).startOf('day').fromNow();
                storyObject.header.profileImage = story.Image;
                storyByUser.push(storyObject);
                setStoryByUser([...storyByUser]);
            })
        }
    }
    return (
        <div>
            {storyByUser.length > 0 && <ReactInstaStories stories={storyByUser} defaultInterval={1500}
            width={432}
            height={768}/>}
        </div>
    )
}

export default connectStateProps(withRouter(StoryDetail));