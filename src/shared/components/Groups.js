import React, { Component } from 'react';
import { Button, Layout, Card, Avatar, List, message, Spin } from 'antd'
import GroupImage from '../../styles/images/groupimage.png';
import notify from './notification';
import { apiClient } from '../api/clients'
class Groups extends Component {
    state = {
        data: [
            {
                Group: 'IT Group',
                id: 1,
                Avatar: GroupImage,
                Description: 'Good',
                Members: 156,
                Posts: 143
            },
            {
                Group: 'Cse Group',
                id: 1,
                Avatar: GroupImage,
                Description: 'Good',
                Members: 156,
                Posts: 143
            }
        ],
    };
    joinGroup = (item) => {
        apiClient.get('/repos/skellock/apisauce/commits').then(res => {
            this.getAllGroups();
            notify({ placement: 'topRight', message: 'Join', description: 'Join group successfully.' });
        });
    }
    newGroup = () => {

    }
    componentDidMount() {
        this.getAllGroups();
    }
    getAllGroups = () => {
        apiClient.get('/repos/skellock/apisauce/commits').then(res => {
            // this.setState({ data: res.data });
        });
    }
    render() {
        return (
            <div className="reight-rail group-card">
                <Card title="Groups" extra={<a href="#">View all</a>} >
                    <List
                        dataSource={this.state.data}
                        renderItem={item => (
                            <List.Item key={item.id} actions={[<a className="link-color" key="list-loadmore-more" onClick={() => this.joinGroup(item)}>Join Group</a>]}>
                                <List.Item.Meta
                                    avatar={<Avatar className="mt-4" src={item.Avatar} />}
                                    title={<div>{item.Group}<span className="icons-small lock-icon"></span></div>}
                                    description={<div className="f-12 text-overflow text-hash"><span className="fw-400">{item.Members}</span> Members | <span className="fw-400">{item.Posts}</span> Posts</div>}
                                />
                            </List.Item>
                        )} >
                    </List>
                    <div className="m-16 text-center">
                        <Button type="primary" onClick={() => this.newGroup()}>Create a Group</Button>
                    </div>

                </Card>
            </div>
        )
    }
}
export default Groups;