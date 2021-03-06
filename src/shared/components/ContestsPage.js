import React, { Component } from "react";
import { Card, Avatar, Col, Row, Typography, Empty, Skeleton } from "antd";
import { Link, withRouter } from "react-router-dom";
import { store } from "../../store";
import { connect } from "react-redux";
import connectStateProps from "../stateConnect";
import { fetchUserGroups, deleteUserGroup, cancelGroupRequest } from "../api/apiServer";
import notify from '../../shared/components/notification';
import CommonModal from "../../components/ProfileComponents/CommonModal";
import CreateGroup from "../../group/creategroup";
import SideAction from "../../shared/components/postings/Actions/SideActions";
import defaultUser from "../../styles/images/defaultuser.jpg";
import defaultguser from "../../styles/images/default-cover.png";
import Loader from "../../common/loader";
import { profileSuccess } from "../../reducers/auth";
const { Meta } = Card;
let GroupEditObj = {};
const ownerActions = [
    {
        action: "Edit",
        icons: "post-icons edit-icon",
        subTitle: "Edit Group",
    },
    {
        action: "Delete",
        icons: "post-icons delete-icon",
        subTitle: "Delete Group",
    },
];
class ContestsPage extends Component {
    state = {
        Groups: [],
        page: 1,
        pageSize: 20,
        loading: false,
        loadMore: true,
        visible: false,
    };
    componentDidMount() {
        window.addEventListener("scroll", this.handleScroll);
        if (this.props.onRef) this.props.onRef(this);
        this.getGroups();
    }
    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    }
    saveGroup = () => {
        this.creategroup.handleSave();
    };
    getGroups(type) {
        this.setState({ ...this.state, loading: true });
        fetchUserGroups(
            this.props.userId ? this.props.userId : this.props?.profile?.Id,
            this.state.pageSize,
            this.state.page * this.state.pageSize - this.state.pageSize
        ).then((res) => {
            if (res.ok) {
                let { Groups } = this.state;
                if (type !== 'Update')
                    Groups = Groups.concat(res.data);
                else
                    for (var i in res.data) {
                        for (var j in Groups) {
                            if (Groups[j].id == res.data[i].id) {
                                Groups[j] = res.data[i];
                            }
                        }
                    }
                this.setState({
                    ...this.state,
                    loading: false,
                    Groups: Groups,
                    loadMore: res.data.length === this.state.pageSize,
                });
            }
        });
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
        if (this.state.loadMore) {
            let { page } = this.state;
            page += 1;
            this.setState({ ...this.state, page, loading: true }, () => {
                this.getGroups();
            });
        }
    }
    handleCancel = (e) => {
        GroupEditObj = {};
        this.setState({
            visible: false,
        });
    };
    editGroup = (group) => {
        GroupEditObj = group;
        this.setState({
            visible: true,
        });
    };
    deleteGroup = async (group) => {
        const joinResponse = await deleteUserGroup(
            group.id,
        );
        if (joinResponse.ok) {
            notify({
                message: "Delete group",
                description: "Group deleted successfully",
            });
            this.props.profile.Groups =
                this.props.profile.Groups >= 1 ? this.props.profile.Groups - 1 : 0;
            this.props.upadateProfile(this.props.profile);
            this.setState({
                Groups: [],
                page: 1,
                pageSize: 20,
                loading: false,
                loadMore: true,
                visible: false,
            }, () => {
                window.scroll(0, 0);
                this.getGroups()
            });
        } else {
            notify({
                message: "Error",
                description: "Something went wrong :)",
                type: "error",
            });
        }
    };
    leaveGroup = async (group) => {
        const joinResponse = await cancelGroupRequest(
            group.id,
            this.props?.profile?.Id
        );
        if (joinResponse.ok) {
            notify({
                message: "Leave group",
                description: "Group left done successfully",
            });
            this.props.profile.Groups =
                this.props.profile.Groups >= 1 ? this.props.profile.Groups - 1 : 0;
            this.props.upadateProfile(this.props.profile);
            this.setState({
                Groups: [],
                page: 1,
                pageSize: 20,
                loading: false,
                loadMore: true,
                visible: false,
            }, () => {
                window.scroll(0, 0);
                this.getGroups()
            });
        } else {
            notify({
                message: "Error",
                description: "Something went wrong :)",
                type: "error",
            });
        }
    };
    handleEvent = async (e, name, item) => {
        switch (name) {
            case "Edit":
                this.editGroup(item);
                break;
            case "Delete":
                this.deleteGroup(item);
                break;
            default:
                break;
        }
    };
    render() {
        const { user } = store.getState().oidc;
        const { Groups, visible, loading } = this.state;
        const { IsHideAction } = this.props;
        return (
            <div className="group-page p-12 pb-0 mb-6">
                {loading && <Row gutter={16} >
                    <Col xs={12} md={8}>
                        <div className="groupcard-skelton" >
                            <Skeleton.Image active shape='square' />
                            <Skeleton.Avatar active shape='circle' />
                            <Skeleton active paragraph={{ rows: 1 }} />
                            <Skeleton.Button active shape='square' />
                        </div>
                    </Col>
                    <Col xs={12} md={8}>
                        <div className="groupcard-skelton">
                            <Skeleton.Image active shape='square' />
                            <Skeleton.Avatar active shape='circle' />
                            <Skeleton active paragraph={{ rows: 1 }} />
                            <Skeleton.Button active shape='square' />
                        </div>
                    </Col>
                    <Col xs={12} md={8}>
                        <div className="groupcard-skelton" >
                            <Skeleton.Image active shape='square' />
                            <Skeleton.Avatar active shape='circle' />
                            <Skeleton active paragraph={{ rows: 1 }} />
                            <Skeleton.Button active shape='square' />
                        </div>
                    </Col>
                </Row>}

                <Row gutter={16} className="">
                    <Col xs={24} md={12} lg={8} xl={8} xxl={6} className="mb-12">
                        <Card
                            className="h-100p custom-card"
                            cover={<img className="obj-fit group-banner" src={defaultguser} />}
                            actions={ [<Link className="text-center f-12 list-link">Join Contest</Link>]}>
                            <Meta
                                className="contest-card-item"
                                title={<Link to={"/contestview/new"} className="post-title" >Software Construction</Link>}
                                description={
                                    <div>
                                        <p className="mb-16 f-12 text-overflow">
                                            Cool, you’ve got your contest offers all ready to go. Now you...
                                        </p>
                                        <div className="contest-date mb-4">
                                            <h6 className="mb-0 f-12">Start & End Date</h6>
                                            <p>3 MAR at 11:00 – 4 MAR at 17:00</p>
                                        </div>
                                        <div>
                                            <span>6 Interested </span>| <span> 20 going</span>
                                        </div>
                                    </div>
                                }
                            />
                        </Card>
                        <span className="card-options-right" onClick={(event) => { event.stopPropagation() }}>
                            <SideAction
                                horclass="icons more"
                                actionsList={ownerActions}
                            />
                        </span>
                    </Col>
                </Row>
                {/* <CommonModal
                    className="creategroup-popup"
                    visible={visible}
                    title="Edit group"
                    cancel={this.handleCancel}
                    saved={this.saveGroup}
                // isHideFooter={true}
                >
                    {visible && (
                        <CreateGroup
                            Type={"Edit"}
                            GroupId={GroupEditObj.id}
                            handleCancel={this.handleCancel}
                            onRef={(creategroup) => (this.creategroup = creategroup)}
                            refreshSave={() => this.getGroups('Update')}
                        />
                    )}
                </CommonModal> */}
            </div>
        );
    }
}
const mapStateToProps = ({ oidc }) => {
    return { user: oidc.user, profile: oidc.profile };
};
const mapDispatchToProps = (dispatch) => {
    return {
        upadateProfile: (info) => {
            dispatch(profileSuccess(info));
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ContestsPage));