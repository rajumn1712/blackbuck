import moment from 'moment';
import React, { useEffect } from 'react';
import { useState } from 'react';
import Stories from 'react-insta-stories';
import { withRouter } from 'react-router';
import { getfriendsStories, userStories } from '../shared/api/apiServer';
import connectStateProps from '../shared/stateConnect';
import { Card, Avatar, List } from 'antd';
import { Link } from 'react-router-dom';
import StoryModal from '../shared/components/storymodal';


const StoryDetail = ({ profile, match }) => {
    let [allStories, setAllStories] = useState([]);
    let [page, setPage] = useState(0);
    let [size, setSize] = useState(10);
    let [storyByUser, setStoryByUser] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        getAllStories();
        if (match.params.id) {
            getuserStories();
        }
    }, [match.params.id])


    const getAllStories = async () => {
        const response = await getfriendsStories(profile.Id, page, size);
        if (response.ok) {
            allStories = response.data;
            setAllStories([...allStories]);
        }
    }
    const getuserStories = async () => {
        let storyObject = {
            url: '',
            type:'',
            header: {
                heading: '',
                subheading: '',
                profileImage: '',
            },
        }
        storyByUser = [];
        setStoryByUser(storyByUser)
        const response = await userStories(match.params.id, 0, 10);
        if (response.ok) {
            response.data.forEach(story => {
                storyObject.url = story.Url;
                storyObject.type = story.Type;
                storyObject.header.heading = story.Firstname;
                storyObject.header.subheading = moment(story.Createddate).startOf('day').fromNow();
                storyObject.header.profileImage = story.Image;
                storyByUser.push(storyObject);
            })
            setStoryByUser([...storyByUser]);
        }
    }
    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const handleSave = () =>{
        getAllStories();
    }

    return (
        <>
             <div className="viewall-stories">
               <Card title="Watch Stories" className="custom-card" bordered={true}>
                    <div className="px-12 py-8 d-flex align-items-center">
                        <div className="story-card mr-8" onClick={showModal}>
                            <div className="story-image">
                                <div className="add-story">
                                    <span className="add-story-icon" />
                                </div>
                            </div>
                        </div>
                        <p className="f-16 mb-0 fw-500">Add Story</p>
                    </div>
                    <List className="stories-list" bordered={false} split={false} itemLayout="horizontal" dataSource={allStories}
                        renderItem={story => (
                            <Link to={`/stories/${story.UserId}`}>
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar className src={story.Image} />}
                                    title={<span className="f-16 mb-0 overflow-text">{story.Firstname} {story.LastName}</span>}
                                    // description={<span className="f-12">{item.time}</span>}
                                />
                            </List.Item>
                            </Link>
                        )}
                    />
                    
                </Card>
                {storyByUser.length > 0 && <div className="stories-view"> 
                <Stories loop keyboardNavigation defaultInterval={8000} stories={storyByUser} onStoryEnd={(s, st) => console.log('story ended', s, st)} onAllStoriesEnd={(s, st) => console.log('all stories ended', s, st)} onStoryStart={(s, st) => console.log('story started', s, st)} />
                <StoryModal visible={isModalVisible} cancel={handleCancel} saved={handleSave}/>

                </div>}
                <Link to="/"><span className="close-icon"></span></Link>
            </div>
        </>
    )
}

export default connectStateProps(withRouter(StoryDetail));