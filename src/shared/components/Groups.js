import React, { Component } from 'react';
import { Button, Card, Avatar, List } from 'antd'
import notify from './notification';
import { apiClient } from '../api/clients'
import { Link } from 'react-router-dom';
import { cancelGroupRequest, fetchGroupSuggestions, joinGroup } from '../api/apiServer';
import { connect } from 'react-redux';
import { profileSuccess } from '../../reducers/auth'
import CommonModal from "../../components/ProfileComponents/CommonModal";
import creategroup from '../../group/creategroup';
import CreateGroup from '../../group/creategroup'

class Groups extends Component {
    showModal = (e) => {
        e.preventDefault();
        this.setState({
            visible: true,
        });
    };
    state = {
        data: [],
        loading: true,
        page: 1,
        pageSize: 5,
        size: 0
    };
    handleCancel = e => {
        this.setState({
            visible: false,
        });
    }
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
            notify({ message: "Group join", description: item.type === "Private" ? "Request sent" : "Joined to group" });
            if (item.type !== 'Private') {
                this.props.profile.Groups = (this.props.profile.Groups ? this.props.profile.Groups : 0) + 1;
                this.props.updateProfile(this.props.profile)
            }
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
    loadGroups = (take) => {
        let { page, pageSize } = this.state;
        page = page + 1;
        pageSize = take;
        this.setState({ ...this.state, page, pageSize }, () => {
            this.getAllGroups();
        })
    }
    getAllGroups = async () => {
        const response = await fetchGroupSuggestions((this.props.userId ? this.props.userId : (this.props?.profile?.Id)), this.state.page, this.state.pageSize);
        if (response.ok) {
            let { data, size } = this.state;
            this.setState({ loading: false, data: data.concat(response.data), size: response.data?.length });
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
    saveGroup = () => {
        this.creategroup.handleSave();
    }
    render() {
        const { visible, size } = this.state;
        return (
            <div className="custom-card sub-text card-scroll">
                <Card title="Groups" bordered={true} extra={<Link to="/commingsoon">View all</Link>} actions={[
                    <Button type="primary" onClick={this.showModal}>Create a Group</Button>
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
                    <div className="text-center"> 
                        {size >= 5 && <a className="more-comments" onClick={() => this.loadGroups(5)}>View more groups</a>}
                    </div>

                </Card>
                <CommonModal
                    className="creategroup-popup"
                    visible={visible}
                    title="Create group"
                    cancel={this.handleCancel}
                    saved={this.saveGroup}
                // isHideFooter={true}

                >
                    {visible && <CreateGroup Type={"Add"} handleCancel={this.handleCancel} onRef={creategroup => this.creategroup = creategroup} />}

                </CommonModal>
            </div>
        )
    }
}

const mapStateToProps = ({ oidc }) => {
    return { profile: oidc.profile }
}
const mapDispatchToProps = dispatch => {
    return { updateProfile: (info) => { dispatch(profileSuccess(info)) } }
}
export default connect(mapStateToProps, mapDispatchToProps)(Groups);