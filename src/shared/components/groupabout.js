import React, { Component } from 'react';
import { Button, Card, Divider, Row, Col, Form, Input, Select, List, Avatar, Tooltip } from 'antd'
import { Link } from 'react-router-dom';
import { store } from '../../store'
import '../../index.css';
import '../../App.css';
import moment from "moment";
import TextArea from 'antd/lib/input/TextArea';
import user from '../../styles/images/user.jpg';
import { getMembers } from '../api/apiServer';
import defaultUser from '../../styles/images/defaultuser.jpg';
import { connect } from 'react-redux';
const { Option } = Select;
const joingroup = <div className="join-grp-title">John Doe <span className="join-grp-txt">has Created a group name is</span> Mech Mantra</div>
const data = {

    "Public": {
        title: 'Public',
        description: "Anyone can see who's in the group and what they post.",
        img: 'left-menu public-icon',
    },


    "College": {
        title: 'Public',
        description: "Anyone can see who's in the group and what they post.",
        img: 'left-menu public-icon',
    },


    "Private": {
        title: 'Private',
        description: 'Only members can see whos in the group and what they post',
        img: 'left-menu private-icon',
    },


    "Visible": {
        title: 'Visible',
        description: 'Anyone can find this group.',
        img: 'left-menu visible-icon',
    },



    "Hidden": {
        title: "Hidden",
        img: "icons hidden-icon",
        description: "Only members can find this group."
    }
    ,
};
class GroupAbout extends Component {
    state = {
        aboutData: this.props.aboutData,
        AdminUsers: this.props.aboutData.AdminUsers,
        Members: [],
        users: [],
        size: 5,
        MutualFriendsCount: 0,
        mutualFriends: []

    }
    componentDidMount() {
        getMembers(this.props.aboutData.GroupId, this.props.profile?.Id, this.props.aboutData.Members, 0).then(res => {
            this.setState({ ...this.state, Members: (res.data[0].Members.concat(this.props.aboutData.AdminUsers)), MutualFriendsCount: res.data[0].MutualFriendsCount, MutualFriends: res.data[0].MutualFriends })

        });
    }
    showMore = () => {
        let { size } = this.state;
        size = size + 5;
        this.setState({ ...this.state, size })
    }
    location = (location, type) => {
        return {
            title: location,
            img: type ? "left-menu history-icon" : "left-menu location-icon",
        }
    }
    render() {
        const { user } = store.getState().oidc;
        const grouppost = { ...this.state };
        const { aboutData, Members, AdminUsers, size, MutualFriendsCount, MutualFriends } = this.state;
        return (
            <div className="custom-card group-member ">
                <Card title="About This Group" bordered={false}>
                    <div>
                        {aboutData.Description && <p>{aboutData.Description}</p>}
                        <div>
                            {(aboutData.Type == 'Private' || aboutData.Type == 'Public') && <List
                                itemLayout="horizontal"
                                dataSource={[data[aboutData.Type]]}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<span className={item.img} />}
                                            title={item.title}
                                            description={item.description}
                                        />
                                    </List.Item>
                                )}
                            />}
                            {aboutData.Hide && <List
                                itemLayout="horizontal"
                                dataSource={[data[aboutData.Hide]]}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<span className={item.img} />}
                                            title={item.title}
                                            description={item.description}
                                        />
                                    </List.Item>
                                )}
                            />
                            }
                            {aboutData.Location && <List
                                itemLayout="horizontal"
                                dataSource={[this.location(aboutData.Location)]}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<span className={item.img} />}
                                            title={item.title}
                                            description={item.description ? item.description : ''}
                                        />
                                    </List.Item>
                                )}
                            />
                            }
                            {aboutData.CreatedDate && <List
                                itemLayout="horizontal"
                                dataSource={[this.location(aboutData.CreatedDate, 'History')]}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<span className={item.img} />}
                                            title={'History'}
                                            description={(`Group created on ${moment(aboutData.CreatedDate).format('ll')}`)}
                                        />
                                    </List.Item>
                                )}
                            />
                            }
                        </div>

                    </div>
                </Card>
                {/* <Card title="Recommended by the Admins" bordered={false} actions={[
                    <Button type="primary" >See All Groups</Button>
                ]}>
                       
                        <div>
                        <List
                        itemLayout="horizontal"
                        dataSource={this.state.data}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.image} />}
                                    title={<div className="d-flex align-items-center"><span className="overflow-text" title={item.name}>{item.name}</span></div>}
                                    description={<div><div className="overflow-text">{item.description}</div>
                                    <div className="text-overflow">
                                    <span>
                                        <span className="mr-4" style={{ color: 'var(--textprimary)',fontWeight: '500' }}>{item.members}</span> 
                                         Members
                                    </span> | <span>
                                        <span className="mr-4" style={{ color: 'var(--textprimary)',fontWeight: '500' }}>5</span> 
                                         posts
                                    </span></div>
                                    </div>}
                                />
                                <Link className="ml-8 f-12 list-link ml-16" onClick={() => this.joinGroup(item)}>Join Group</Link>
                            </List.Item>
                        )}
                    />
                        </div>
                </Card>  Please don't delete*/}
                {Members.length > 0 && <Card title="Members" bordered={false} actions={(size > 4 && size < Members?.length) ? [
                    <Button type="primary" onClick={() => this.showMore()}>See More</Button>
                ] : []}>
                    <div>

                        {Members.length > 0 && <div className=" pb-16">
                            <Avatar.Group
                                maxCount={4}
                                size="large"
                                maxStyle={{ color: 'var(--primary)', backgroundColor: 'var(--secondary)' }}
                            >
                                {Members.slice(0, size).map((user, index) => {
                                    return <Tooltip title={user.Firstname ? user.Firstname : user.FirstName} placement="top">
                                        <Avatar src={user.Image || defaultUser} key={index} style={{ backgroundColor: user.colorbc }}>
                                        </Avatar>
                                    </Tooltip>
                                })}
                            </Avatar.Group>
                            {MutualFriends?.length > 1 && <p>{MutualFriends[0].FirstName}, {MutualFriends[1].FirstName} {MutualFriends?.length > 2 && `and other ${MutualFriendsCount - 2} friends`} are members.</p>}
                        </div>
                        }
                        {AdminUsers?.length > 0 && <div className="">
                            <Avatar.Group
                                maxCount={size - 1}
                                size="large"
                                maxStyle={{ color: 'var(--primary)', backgroundColor: 'var(--secondary)' }}
                            >
                                {AdminUsers?.map((user, index) => {
                                    return <Tooltip title={user.Firstname ? user.Firstname : user.FirstName} placement="top">
                                        <Avatar src={user.Image || defaultUser} key={index} style={{ backgroundColor: user.colorbc }}>
                                        </Avatar>
                                    </Tooltip>
                                })}
                            </Avatar.Group>
                            <p>Admins</p>
                        </div>}

                    </div>
                </Card>
                }

            </div>
        )
    }
}
const mapStateToProps = ({ oidc }) => {
    return { profile: oidc.profile }
}
export default connect(mapStateToProps)(GroupAbout);