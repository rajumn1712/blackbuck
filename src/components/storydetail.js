import React, { useEffect } from 'react';
import { useState } from 'react';
import { getfriendsStories } from '../shared/api/apiServer';
import connectStateProps from '../shared/stateConnect';

const StoryDetail = ({profile})=>{
    const [allStories,setAllStories] = useState([]);
    let [page,setPage] = useState(0);
    let [size,setSize] = useState(10);

    useEffect(()=>{
        getAllStories();
    },[])

    const getAllStories = async ()=>{
        const response = await getfriendsStories(profile.Id,page,size);
        if(response.ok){
            setAllStories(getdata => getdata,...response.data);
        }
    }
    return (
        <div>Welcome to Story detail</div>
    )
}

export default connectStateProps(StoryDetail);