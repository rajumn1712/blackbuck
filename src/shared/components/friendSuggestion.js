import React, { Component } from 'react';
import { Typography, Button } from 'antd';
import { apiClient } from '../api/clients';
import notify from './notification';
import { cancelFriendRequest, getFriendSuggestions, sendFirendRequest } from '../api/apiServer';
import { Link } from 'react-router-dom'
import connectStateProps from '../stateConnect';
import defaultUser from '../../styles/images/defaultuser.jpg';
import OwlCarousel from 'react-owl-carousel2';
import 'react-owl-carousel2/src/owl.carousel.css';
import 'react-owl-carousel2/src/owl.theme.default.css'
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
            "Image": friend.Image,
            "Email": this.props?.profile?.Email,
            "Type": "request"
        }
        sendFirendRequest(friend.UserId, obj).then(() => {
            this.updateFriendSuggestions(friend.UserId, "Type", "request");
            notify({ message: "Friend request", description: "Request sent successfully" });
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
    cancelRequest = async (friend) => {
        const cancelResponse = await cancelFriendRequest(this.props?.profile?.Id, friend.UserId);
        if (cancelResponse.ok) {
            notify({ message: "Friend request", description: "Request cancelled" });
            this.updateFriendSuggestions(friend.UserId, "Type", null);
        } else {
            notify({ message: "Friend request", description: "Something went wrong:)", type: "error" });
        }
    }
    updateFriendSuggestions(id, prop, val) {
        let { friends } = this.state;
        for (const i in friends) {
            if (id === friends[i].UserId) {
                friends[i][prop] = val;
            }
        }
        this.setState({ ...this.state, friends }, () => {

        });
    }
    render() {
        if (!this.state.friends || this.state.friends.length === 0) { return null; }
        return (
            <div>
                <div className="friends-thead px-4">
                    <Title level={5} style={{ fontWeight: 500 }}>Friend Suggestions</Title><Link to="/commingsoon" className="link-color d-flex align-items-center">View all</Link>
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
                    {this.state.friends.length > 4 && <><Link className="more-frnd-btn left" onClick={() => { this.carouselRef.prev() }}><span className="icon left-arrow mr-0"></span></Link><Link className="more-frnd-btn" onClick={() => { this.carouselRef.next() }}><span className="icon right-arrow mr-0"></span></Link></>}
                    <OwlCarousel margin="15px" items={3} autoWidth={true} ref={(ref) => this.carouselRef = ref} key={`carousel_${this.state.friends.length}`}>
                        {this.state.friends.map((friend, index) => <div className="frnds-list-item" key={index}>
                            <div className="frnds-img">
                                <img src={friend.Image || defaultUser} width="100%" height="100%" />
                                <a className="removefrnd-btn" onClick={() => this.removeSuggestion(friend)}></a>
                            </div>
                            <div style={{ padding: 16 }}>
                                <Paragraph className="frnd-name text-overflow">{friend.FirstName}</Paragraph>
                                <Paragraph className="m-frnds">{friend.MutualFriendsCount || "No"} Mutual friends</Paragraph>
                                <Paragraph className="friends-list--course">{friend.Dept}</Paragraph>
                                <div className="text-center">
                                    {friend.Type == null && <Button type="default" className="addfrnd semibold" onClick={() => this.addFriend(friend)}><span className="post-icons addfriend-icon"></span>Add Friend</Button>}
                                    {friend.Type == "request" && <Button type="default" className="addfrnd semibold" onClick={() => this.cancelRequest(friend)}>Cancel Request</Button>}
                                </div>
                            </div>
                        </div>)}
                        <div className="frnds-list-item viewall-item">
                            <Link to="/commingsoon"><Button type="default" className="addfrnd semibold">View all</Button></Link>
                        </div>
                    </OwlCarousel>
                </div>
            </div>
        )
    }
}
export default connectStateProps(FriendSuggestions);