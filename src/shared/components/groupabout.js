import React, { Component } from 'react';
import { Button, Card, Divider, Row, Col, Form, Input, Select, List, Avatar } from 'antd'
import { Link } from 'react-router-dom';
import { store } from '../../store'
import '../../index.css';
import '../../App.css';
import moment from "moment";
import TextArea from 'antd/lib/input/TextArea';
import user from '../../styles/images/user.jpg';
const { Option } = Select;
const joingroup = <div className="join-grp-title">John Doe <span className="join-grp-txt">has Created a group name is</span> Mech Mantra</div>
const data = {

    "Public": {
        title: 'Public',
        description: "Anyone can see who's in the group and what they post.",
        img: 'icons public-icon m-0',
    },


    "College": {
        title: 'Public',
        description: "Anyone can see who's in the group and what they post.",
        img: 'icons public-icon m-0',
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
        users: [
            { image: user, id: 1, initial: '', colorbc: '' },
            { image: user, id: 2, initial: '', colorbc: '' },
            { image: user, id: 3, initial: '', colorbc: '' },
            { image: '', id: 4, initial: 'NM', colorbc: '#f56a00' },
            { image: '', id: 5, initial: 'NM', colorbc: '#f56a00' },
            { image: '', id: 6, initial: 'NM', colorbc: '#f56a00' },
            { image: '', id: 7, initial: 'NM', colorbc: '#f56a00' }
        ]

    }
    componetDidMount() {

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
        const { aboutData } = this.state;
        return (
            <div className="custom-card group-member ">
                <Card title="About This Group" bordered={false}>
                    <div>
                        {aboutData.Description && <p>{aboutData.Description}</p>}
                        <div>
                           {(aboutData.Type=='Private'||aboutData.Type=='Public') &&  <List
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
                            />
                                }
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
                <Card title="Members" bordered={false} actions={[
                    <Button type="primary" >See More</Button>
                ]}>
                    <div>

                        <div className=" pb-16">
                            <Avatar.Group
                                maxCount={4}
                                size="large"
                                maxStyle={{ color: 'var(--primary)', backgroundColor: 'var(--secondary)' }}
                            >
                                {grouppost.users.map(user => {
                                    return <Avatar src={user.image} key={user.id} style={{ backgroundColor: user.colorbc }}>
                                        {user.image ? null : user.initial}
                                    </Avatar>
                                })}
                            </Avatar.Group>
                            <p>Gunji, Poojanil and 13 other friends are members.</p>
                        </div>
                        <div className="">
                            <Avatar.Group
                                maxCount={4}
                                size="large"
                                maxStyle={{ color: 'var(--primary)', backgroundColor: 'var(--secondary)' }}
                            >
                                {grouppost.users.map(user => {
                                    return <Avatar src={user.image} key={user.id} style={{ backgroundColor: user.colorbc }}>
                                        {user.image ? null : user.initial}
                                    </Avatar>
                                })}
                            </Avatar.Group>
                            <p>Admins</p>
                        </div>

                    </div>
                </Card>

            </div>
        )
    }
}
export default GroupAbout;