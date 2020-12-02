import React, { Component } from 'react';
import { Typography, Button } from 'antd';
import { apiClient } from '../api/clients';
import notify from './notification';
import { getFriendSuggestions, sendFirendRequest } from '../api/apiServer';
import { Link } from 'react-router-dom'
import connectStateProps from '../stateConnect';
import defaultUser from '../../styles/images/defaultuser.jpg';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
const { Title, Paragraph } = Typography;
class FriendSuggestions extends Component {
    carouselRef;
    className = ["one", "two", "three"]
    state = {
        friends: []
    }
    addFriend = async (friend) => {
        const obj = {
            "UserId": this.props?.profile?.Id,
            "Firstname": this.props?.profile?.FirstName,
            "Lastname": this.props?.profile?.LastName,
            "Image": null,
            "Email": this.props?.profile?.Email,
            "Type": "request"
        }
        sendFirendRequest(friend.UserId, obj).then(() => {
            notify({ message: "Friend request", description: "Request sent successfully" });
            this.removeSuggestion(friend)
        })
    }
    componentDidMount() {
        this.loadSuggestions();
    }
    async loadSuggestions() {
        const response = await getFriendSuggestions(this.props?.profile?.Id, 1, 100);
        if (response.ok) {
            this.setState({ ...this.state, friends: response.data });
        }
    }
    removeSuggestion = (friend) => {
        let { friends } = this.state;
        friends = friends.filter(item => item.UserId !== friend.UserId);
        this.setState({ friends })
    }
    goToFriendsSuggestions = () => {

    }
    render() {
        const { friends } = this.state;
        if (!friends || friends.length === 0) { return null; }
        return (
            <div>
                <div className="friends-thead">
                    <Title level={5} style={{ fontWeight: 500 }}>Friend Suggestions</Title><div className="link-color"><Link to="/commingsoon" className="link-color">View all</Link></div>
                </div>
                <div className="friends">
                    {/* {friends.map((friend, index) => {
                        return <div className={"friends-list "+this.className[Math.floor(Math.random() * this.className.length)]}>
                            <img src={friend.Image || defaultUser} width="100%" height="100%" />
                            <div className="friends-list--name">
                                <Paragraph>{friend.FirstName}</Paragraph>
                                <Paragraph className="friends-list--course">{friend.Dept}</Paragraph>
                            </div>
                            <a className="addfrnd-btn" onClick={() => this.addFriend(friend)}>
                                <span className="post-icons addfriend-icon mr-0"></span>
                            </a>
                            <a className="removefrnd-btn" onClick={() => this.removeSuggestion(friend)}></a>
                        </div>
                    }) 
                    }*/}
                    {friends.length > 4 && <Link className="more-frnd-btn" onClick={() => {this.carouselRef.next()}}><span className="icon right-arrow mr-0"></span></Link>}
                    <OwlCarousel items={5} autoWidth={true} loop ref={(ref)=>this.carouselRef=ref}>
                        {friends.map((friend, index) => {
                            return <div className="frnds-list-item">
                                <div className="frnds-img">
                                    <img src={friend.Image || defaultUser} width="100%" height="100%" />
                                    <a className="removefrnd-btn" onClick={() => this.removeSuggestion(friend)}></a>
                                </div>
                                <div style={{ padding: 16 }}>
                                    <Paragraph className="frnd-name text-overflow">{friend.FirstName}</Paragraph>
                                    <Paragraph className="m-frnds">{friend.MutualFriendsCount||"No"} Mutual friends</Paragraph>
                                    <Paragraph className="friends-list--course">{friend.Dept}</Paragraph>
                                    <div className="text-center">
                                        <Button type="default" className="addfrnd semibold" onClick={() => this.addFriend(friend)}><span className="post-icons addfriend-icon"></span>Add Friend</Button>
                                    </div>
                                </div>
                            </div>
                        })
                        }
                    </OwlCarousel>
                </div>
            </div>
        )
    }
}
export default connectStateProps(FriendSuggestions);