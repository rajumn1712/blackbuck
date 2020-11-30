import React, { Component } from 'react';
import { Button, Card, Avatar, List } from 'antd'
import notify from './notification';
import { apiClient } from '../api/clients'
import { Link } from 'react-router-dom';
import { fetchGroupSuggestions } from '../api/apiServer';
import { connect } from 'react-redux';


class Groups extends Component {
    state = {
        data: [],
        loading: true,
        page:1,
        pageNo:5
    };
    joinGroup = (item) => {
        apiClient.get('/repos/skellock/apisauce/commits').then(res => {
            this.getAllGroups();
            notify({ placement: 'topRight', message: 'Join', description: 'Request sent to join group' });
        });
    }
    newGroup = () => {

    }
    componentDidMount() {
        this.getAllGroups();
    }
    getAllGroups = async () => {
        const response = await fetchGroupSuggestions((this.props.userId?this.props.userId:(this.props?.profile?.Id)),this.state.page,this.state.pageNo);
        if (response.ok) {
            this.setState({ loading: false, data: response.data });
        }
    }
    render() {
        return (
            <div className="custom-card sub-text">
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
                                    title={<div className="d-flex align-items-center"><span className="overflow-text" title={item.name}>{item.name}</span></div>}
                                    description={<div><div className="overflow-text">{item.description}</div>
                                    <div className="text-overflow">
                                    <span>
                                        <span className="mr-4" style={{ color: 'var(--textprimary)',fontWeight: '400' }}>{item.members}</span> 
                                         Members
                                    </span> | <span>
                                        <span className="mr-4" style={{ color: 'var(--textprimary)',fontWeight: '400' }}>5</span> 
                                         Posts
                                    </span></div>
                                    </div>}
                                />
                                <Link className="ml-8 f-12 list-link ml-16" onClick={() => this.joinGroup(item)}>Join Group</Link>
                            </List.Item>
                        )}
                    />
                </Card>
            </div>
        )
    }
}

const mapStateToProps = ({oidc})=>{
    return {profile:oidc.profile}
}
export default connect(mapStateToProps)(Groups);