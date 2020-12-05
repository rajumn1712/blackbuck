import React, { Component } from 'react';
import { Button, Card, Divider, Row, Col, Form, Input, Select, List, Avatar } from 'antd'
import { Link } from 'react-router-dom';
import { store } from '../../store'
import '../../index.css';
import '../../App.css';
import TextArea from 'antd/lib/input/TextArea';
import user from '../../styles/images/user.jpg';
const { Option } = Select;
const joingroup = <div className="join-grp-title">John Doe <span className="join-grp-txt">has Created a group name is</span> Mech Mantra</div>
const data = [
    {
        title: 'Public',
        description: 'Only members can see whos in the group and what they post',
    },
    {
        title: 'Visible',
        description: 'Anyone can find this group.',
    },
    {
        title: 'General Group',
    },
    {
        title: 'History',
        description: 'Group created on March 17, 2012  ',
    },
];
class GroupAbout extends Component {
    state = {
        post: joingroup,
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

    render() {
        const { user } = store.getState().oidc;
        const grouppost = { ...this.state };
        return (
            <div className="custom-card group-member ">
                <Card title="About This Group" bordered={false}>
                    <div>
                        <p>Programming is the process of creating a set of instructions that tell a computer how to perform a task</p>
                        <div>
                            <List
                                itemLayout="horizontal"
                                dataSource={data}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<span className="left-menu camera-icon" />}
                                            title={item.title}
                                            description={item.description}
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>

                    </div>
                </Card>
                <Card title="Recommended by the Admins" bordered={false} actions={[
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
                </Card>
                <Card title="Members" bordered={false} actions={[
                    <Button type="primary" >See All</Button>
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