import React, { Component } from 'react';
import { Typography, Button, Row, Col, Skeleton } from 'antd';
import { apiClient } from '../api/clients';
import notify from './notification';
import { cancelFriendRequest, getFriendSuggestions, sendFirendRequest, sendNotification } from '../api/apiServer';
import { Link } from 'react-router-dom'
import connectStateProps from '../stateConnect';
import defaultUser from '../../styles/images/defaultuser.jpg';
import OwlCarousel from 'react-owl-carousel2';
import 'react-owl-carousel2/src/owl.carousel.css';
import 'react-owl-carousel2/src/owl.theme.default.css'
import Loader from '../../common/loader';
import Sharebox from '../../components/SavePostBox/sharebox';
const { Title, Paragraph } = Typography;
const options = {
    responsiveClass: true,
    responsive: {
        0: {
            items: 2
        },
        576: {
            items: 2
        },
        768: {
            items: 3
        },

        992: {
            items: 3
        }
    }

}
class FriendSuggestions extends Component {
    carouselRef;
    className = ["one", "two", "three"]
    state = {
        friends: [],
        isViewAllPage: window.location.href.indexOf("friendsuggestions") > -1,
        loading: true,
        page: 1,
        pageSize: window.location.href.indexOf("friendsuggestions") > -1 ? 9 : 10,
        loadMore: true
    }
    handleScroll = () => {
        const windowHeight =
            "innerHeight" in window
                ? window.innerHeight
                : document.documentElement.offsetHeight;
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(
            body.scrollHeight,
            body.offsetHeight,
            html.clientHeight,
            html.scrollHeight,
            html.offsetHeight
        );
        const windowBottom = Math.ceil(windowHeight + window.pageYOffset);
        if (windowBottom >= docHeight) {
            this.loadMore();
        } else {
        }
    };
    loadMore(e) {
        if (this.state.loadMore && !this.state.loading) {
            let { page } = this.state;
            page += 1;
            this.setState({ ...this.state, page, loading: true }, () => {
                this.loadSuggestions();
            });
        }
    }
    addFriend = async (friend) => {
        const obj = {
            "UserId": this.props?.profile?.Id,
            "Firstname": this.props?.profile?.FirstName,
            "Lastname": this.props?.profile?.LastName,
            "Image": this.props?.profile?.ProfilePic,
            "Email": this.props?.profile?.Email,
            "Type": "request",
            "CreatedDate": new Date()
        }
        sendFirendRequest(friend.UserId, obj).then(() => {
            this.updateFriendSuggestions(friend.UserId, "Type", "request");
            sendNotification({ to: friend.UserId, message: `${this.props?.profile?.FirstName} sent you friend request`, from: this.props?.profile?.Id });
            notify({ message: "Friend request", description: "Request sent successfully" });
        })
    }
    componentDidMount() {
        window.addEventListener("scroll", this.handleScroll);
        this.loadSuggestions();
    }
    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    }
    async loadSuggestions() {
        const response = await getFriendSuggestions(this.props?.profile?.Id, this.state.page, this.state.pageSize);
        if (response.ok) {
            this.setState({ ...this.state, friends: this.state.isViewAllPage ? this.state.friends.concat(response.data) : response.data, loading: false, loadMore: response.data.length === this.state.pageSize });
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
        const { loading } = this.state;
        if (!this.state.friends || this.state.friends.length === 0) {
            return <>{loading && <Row gutter={8} >
                <Col xs={12} md={8}>
                    <div className="cards-list-skelton" >
                        <Skeleton.Image active shape='square' />
                        <Skeleton active paragraph={{ rows: 1 }} />
                        <Skeleton.Button active shape='square' />
                    </div>
                </Col>
                <Col xs={12} md={8}>
                    <div className="cards-list-skelton" >
                        <Skeleton.Image active shape='square' />
                        <Skeleton active paragraph={{ rows: 1 }} />
                        <Skeleton.Button active shape='square' />
                    </div>
                </Col>
                <Col xs={12} md={8}>
                    <div className="cards-list-skelton" >
                        <Skeleton.Image active shape='square' />
                        <Skeleton active paragraph={{ rows: 1 }} />
                        <Skeleton.Button active shape='square' />
                    </div>
                </Col>
            </Row>
            }
                {!loading && null}
            </>
        }
        if (this.state.isViewAllPage) {
            return (
                <>
                    {/* <Sharebox dataRefreshed={() => { }} /> */}
                    <div className="friends-thead px-4">
                        <Title level={5} style={{ fontWeight: 500 }}>Friend Suggestions</Title>
                    </div>
                    <Row gutter={8} >
                        {this.state.friends.map((friend, index) => <Col xs={12} md={8} lg={8}>
                            <div className="frnds-list-item m-0 mb-8" key={index}>
                                <div className="frnds-img ">
                                    <Link to={"/profileview/" + friend.UserId}><img src={friend.Image || defaultUser} width="100%" height="100%" /></Link>
                                    <a className="removefrnd-btn" onClick={() => this.removeSuggestion(friend)}></a>
                                </div>
                                <div style={{ padding: 16 }}>
                                    <Paragraph className="frnd-name text-overflow"> <Link className="overflow-text post-title" to={"/profileview/" + friend.UserId}>{friend.FirstName}</Link></Paragraph>
                                    <Paragraph className="m-frnds">{friend.MutualFriendsCount || "No"} Mutual friends</Paragraph>
                                    <Paragraph className="friends-list--course">{friend.Dept}</Paragraph>
                                    <div className="text-center">
                                        {friend.Type == null && <Button type="default" className="addfrnd semibold" onClick={() => this.addFriend(friend)}><span className="post-icons addfriend-icon"></span>Add Friend</Button>}
                                        {friend.Type == "request" && <Button type="default" className="addfrnd semibold" onClick={() => this.cancelRequest(friend)}>Cancel Request</Button>}
                                    </div>
                                </div>
                            </div>

                        </Col>)}
                    </Row>
                    {this.state.isViewAllPage && this.state.loading &&  <Row gutter={8} >
                        <Col xs={12} md={8}>
                            <div className="cards-list-skelton" >
                                <Skeleton.Image active shape='square' />
                                <Skeleton active paragraph={{ rows: 1 }} />
                                <Skeleton.Button active shape='square' />
                            </div>
                        </Col>
                        <Col xs={12} md={8}>
                            <div className="cards-list-skelton" >
                                <Skeleton.Image active shape='square' />
                                <Skeleton active  paragraph={{ rows: 1 }} />
                                <Skeleton.Button active shape='square' />
                            </div>
                        </Col>
                        <Col xs={12} md={8}>
                            <div className="cards-list-skelton" >
                                <Skeleton.Image active shape='square' />
                                <Skeleton active paragraph={{ rows: 1 }} />
                                <Skeleton.Button active shape='square' />
                            </div>
                        </Col>
                    </Row>}
                </>
            )
        }
        return (
            <div>
                <div className="friends-thead px-4">
                    <Title level={5} style={{ fontWeight: 500 }}>Friend Suggestions</Title><Link to="/friendsuggestions" className="link-color d-flex align-items-center">View all</Link>
                </div>
                <Row gutter={8}>
                    <div className="friends">
                        {this.state.friends.length > 4 && <><Link className="more-frnd-btn left" onClick={() => { this.carouselRef.prev() }}><span className="icon left-arrow mr-0"></span></Link><Link className="more-frnd-btn" onClick={() => { this.carouselRef.next() }}><span className="icon right-arrow mr-0"></span></Link></>}
                        <OwlCarousel items={3} options={options} autoWidth={true} ref={(ref) => this.carouselRef = ref} key={`carousel_${this.state.friends.length}`}>
                            {this.state.friends.map((friend, index) => <div className="frnds-list-item" key={index}>
                                <div className="frnds-img">
                                    <Link to={"/profileview/" + friend.UserId}><img src={friend.Image || defaultUser} width="100%" height="100%" /></Link>
                                    <a className="removefrnd-btn" onClick={() => this.removeSuggestion(friend)}></a>
                                </div>
                                <div style={{ padding: 16 }}>
                                    <Paragraph className="frnd-name text-overflow"> <Link className="overflow-text post-title" to={"/profileview/" + friend.UserId}>{friend.FirstName}</Link></Paragraph>
                                    <Paragraph className="m-frnds">{friend.MutualFriendsCount || "No"} Mutual friends</Paragraph>
                                    <Paragraph className="friends-list--course">{friend.Dept}</Paragraph>
                                    <div className="text-center">
                                        {friend.Type == null && <Button type="default" className="addfrnd semibold" onClick={() => this.addFriend(friend)}><span className="post-icons addfriend-icon"></span>Add Friend</Button>}
                                        {friend.Type == "request" && <Button type="default" className="addfrnd semibold" onClick={() => this.cancelRequest(friend)}>Cancel Request</Button>}
                                    </div>
                                </div>
                            </div>)}
                            <div className="frnds-list-item viewall-item">
                                <Link to="/friendsuggestions"><Button type="default" className="addfrnd semibold">View all</Button></Link>
                            </div>
                        </OwlCarousel>
                    </div>
                </Row>
            </div>
        )
    }
}
export default connectStateProps(FriendSuggestions);