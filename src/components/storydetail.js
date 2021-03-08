import moment from 'moment';
import React, { useEffect } from 'react';
import { useState } from 'react';
import ReactInstaStories from 'react-insta-stories';
import { withRouter } from 'react-router';
import { getfriendsStories, userStories } from '../shared/api/apiServer';
import connectStateProps from '../shared/stateConnect';
import { Card, Avatar, List } from 'antd';
const data = [
    {
        title: 'William Smith',
        time: '2 minutes ago',
    },
    {
        title: 'John Doe',
        time: '5 minutes ago',
    },
    {
        title: 'Sherlyn Chopra',
        time: '10 minutes ago',
    },
    {
        title: 'Malavika Nayar',
        time: '1 hour ago',
    },
    {
        title: "Farina",
        time: '5 hours ago',
    },

];


const StoryDetail = ({ profile, match }) => {
    const [allStories, setAllStories] = useState([]);
    let [page, setPage] = useState(0);
    let [size, setSize] = useState(10);
    let [storyByUser, setStoryByUser] = useState([]);

    let storyObject = {
        url: '',
        header: {
            heading: '',
            subheading: '',
            profileImage: '',
        },
    }

    useEffect(() => {
        getAllStories();
        if (match.params.id) {
            getuserStories();
        }
    }, [])

    const getAllStories = async () => {
        const response = await getfriendsStories(profile.Id, page, size);
        if (response.ok) {
            setAllStories(getdata => getdata, ...response.data);
        }
    }
    const getuserStories = async () => {
        const response = await userStories(match.params.id, 0, 10);
        if (response.ok) {
            response.data.forEach(story => {
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
        <>
             <div className="viewall-stories">
               <Card title="Watch Stories" className="custom-card" bordered={true}>
                    <div className="px-12 py-8 d-flex align-items-center">
                        <div className="story-card mr-8">
                            <div className="story-image">
                                <div className="add-story">
                                    <span className="add-story-icon" />
                                </div>
                            </div>
                        </div>
                        <p className="f-16 mb-0 fw-500">Add Story</p>
                    </div>
                    <List className="stories-list" bordered={false} split={false} itemLayout="horizontal" dataSource={data}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar className src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                    title={<span className="f-16 mb-0 overflow-text">{item.title}</span>}
                                    description={<span className="f-12">{item.time}</span>}
                                />
                            </List.Item>
                        )}
                    />
                </Card>
                {storyByUser.length > 0 && <div className="stories-view"> 
                <ReactInstaStories height="100%" stories={storyByUser} defaultInterval={1500}/>

                </div>}
                <span className="close-icon"></span>
            </div>
        </>
    )
}

export default connectStateProps(withRouter(StoryDetail));