import React, { Component } from 'react';
import { Button, Card, Avatar, List } from 'antd'
import notify from './notification';
import { apiClient } from '../api/clients'
import { Link } from 'react-router-dom';
import { fetchGroupSuggestions } from '../api/apiServer';


class Groups extends Component {
    state = {
        data: [],
        loading: true
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
    getAllGroups = async () => {
        const response = await fetchGroupSuggestions(1, 1, 5);
        if (response.ok) {
            this.setState({ loading: false, data: response.data });
        }
    }
    render() {
        return (
            <div className="custom-card">
                <Card title="Groups" bordered={false} extra={<Link to="/commingsoon">View all</Link>} actions={[
                    <Button type="primary" onClick={() => this.newGroup()}>Create a Group</Button>
                ]} >
                    <List
                        itemLayout="horizontal"
                        dataSource={this.state.data}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.image} />}
                                    title={<div className="d-flex align-items-center"><span className="overflow-text">{item.name}</span><span className="icons-small lock-icon ml-4" /></div>}
                                    description={<div><div className="overflow-text">{item.description}</div><div><span style={{ color: 'var(--textprimary)' }}>{item.members}</span> Members</div></div>}
                                />
                                <Link className="f-12 list-link" onClick={() => this.joinGroup(item)}>Join group</Link>
                            </List.Item>
                        )}
                    />
                </Card>
            </div>
        )
    }
}
export default Groups;