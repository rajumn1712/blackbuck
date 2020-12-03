import React, { Component } from 'react';
import { Button, Card, Avatar, List } from 'antd'
import notify from './notification';
import { apiClient } from '../api/clients'
import { Link } from 'react-router-dom';
import { cancelGroupRequest, fetchGroupSuggestions, joinGroup } from '../api/apiServer';
import { connect } from 'react-redux';


class Groups extends Component {
    state = {
        data: [],
        loading: true,
        page: 1,
        pageNo: 5
    };
    joinGroup = async (item) => {
        const obj = {
            "UserId": this.props?.profile?.Id,
            "Firstname": this.props?.profile?.FirstName,
            "Lastname": this.props?.profile?.LastName,
            "Image": this.props?.profile?.ProfilePic,
            "Email": this.props?.profile?.Email
        }
        if (item.type == "Private") { obj.Type = "request" }
        const joinResponse = await joinGroup(item.id, obj);
        if (joinResponse.ok) {
            notify({ message: "Group join", description: item.type==="Private" ? "Request sent" : "Joined to group" });
            this.updateGroup(item)
        } else {
            notify({ message: "Error", description: "Something went wrong :)", type: "error" });
        }
    }
    newGroup = () => {

    }
    updateGroup(item) {
        let { data } = this.state;
        if (item.type === "Private") {
            for (const i in data) {
                let _item = data[i];
                if (_item.id === item.id) {
                    _item.requestJoin = _item.requestJoin ? null : "request";
                }
            }
            this.setState({ ...this.state, data });
        } else {
            this.getAllGroups();
        }
    }
    componentDidMount() {
        this.getAllGroups();
    }
    getAllGroups = async () => {
        const response = await fetchGroupSuggestions((this.props.userId ? this.props.userId : (this.props?.profile?.Id)), this.state.page, this.state.pageNo);
        if (response.ok) {
            this.setState({ loading: false, data: response.data });
        }
    }
    async cancelGroupRequest(item) {
        const joinResponse = await cancelGroupRequest(item.id, this.props?.profile?.Id);
        if (joinResponse.ok) {
            notify({ message: "Group Request", description: "Request cancelled" });
            this.updateGroup(item)
        } else {
            notify({ message: "Error", description: "Something went wrong :)", type: "error" });
        }
    }
    render() {
        return (
            <div className="custom-card sub-text">
                <Card title="Groups" bordered={true} extra={<Link to="/commingsoon">View all</Link>} actions={[
                    <Link to="/commingsoon"><Button type="primary" onClick={() => this.newGroup()}>Create a Group</Button></Link>
                ]} >
                    <List
                        itemLayout="horizontal"
                        split={false}
                        dataSource={this.state.data}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={item.image} />}
                                    title={<div className="d-flex align-items-center"><span className="overflow-text" title={item.name}>{item.name}{item.type == "Private" && <span className="icons-small lock-icon ml-4" />}</span></div>}
                                    description={<div><div className="overflow-text">{item.description}</div>
                                        <div className="text-overflow">
                                            <span>
                                                <span className="mr-4">{item.members}</span>
                                         Members
                                    </span> | <span>
                                                <span className="mr-4">0</span>
                                         Posts
                                    </span></div>
                                    </div>}
                                />
                                {item.requestJoin === "request" ? <Link className="ml-8 f-12 list-link ml-16" onClick={() => this.cancelGroupRequest(item)}>Cancel request</Link> : <Link className="ml-8 f-12 list-link ml-16" onClick={() => this.joinGroup(item)}>Join</Link>}
                            </List.Item>
                        )}
                    />
                </Card>
            </div>
        )
    }
}

const mapStateToProps = ({ oidc }) => {
    return { profile: oidc.profile }
}
export default connect(mapStateToProps)(Groups);