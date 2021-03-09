import React, { useEffect, useState } from 'react';
import { getfriendsStories } from '../api/apiServer';
import { Link } from 'react-router-dom';
import connectStateProps from '../stateConnect';
import StoryModal from './storymodal';


const AllStories = ({ profile }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    let [stories, setStories] = useState([]);

    useEffect(() => {
        getAllStories();
    }, [])

    const getAllStories = async () => {
        const response = await getfriendsStories(profile.Id, 0, 4);
        if (response.ok) {
            stories = response.data;
            setStories([...stories]);
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
        setIsModalVisible(false);
    }
    
    return (
        <>
            <ul className="stories">
                <li className="story-card">
                    <div onClick={showModal}>
                        <div className="story-image">
                            <div className="add-story">
                                <span className="add-story-icon" />
                            </div>
                        </div>
                        <p className="name">Add Story</p>
                    </div>
                </li>
                {stories.length > 0 && stories?.map((story) => {
                    return <li className="story-card" key={story.UserId}>
                        <Link to={`stories/${story.UserId}`}>
                            <div className="story-image">
                                <img src={story.Image} />
                            </div>
                            <p className="name">{story.Firstname} {story.LastName}</p>
                        </Link>
                    </li>
                })}
                {stories.length >= 5 && <Link className="more-frnd-btn" to="/stories"><span className="icon right-arrow mr-0"></span></Link>}
            </ul>
            <StoryModal visible={isModalVisible} cancel={handleCancel} saved={handleSave}/>
            

        </>
    )
}
export default connectStateProps(AllStories);