import React, { Component } from "react";
import {
    Row,
    Col,
    Tabs,
    Tooltip,
    Button,
    message,
    Upload,
    Typography,
    Menu,
    Dropdown,
} from "antd";
import Postings from "../shared/postings/index";
import PadLock from "../styles/images/padlock.svg";
import ContestAbout from "./contestabout";
import CommonModal from "../components/ProfileComponents/CommonModal";
import { saveGroupImage, editContest } from "../shared/api/apiServer";
import { connect } from "react-redux";
import { profileSuccess } from "../reducers/auth";
import notify from "../shared/components/notification";
import ImgCrop from "antd-img-crop";
import Loader from "../common/loader";
import defaultCover from "../styles/images/defaultcover.png";
import CreateContest from "./createcontest";
import { apiClient } from "../shared/api/clients";
let GroupEditObj = {};
const { TabPane } = Tabs;
const { Title } = Typography;
class ContestView extends Component {
    imageObject = {};
    state = {
        contestData: {},
        isProfilePic: false,
        disabled: false,
        visible: false,
        loading: true,
        search: null,
        friendsLu: [],
        userFndsLu: [],
        tabkey: "1",
        imageLoader: false,
        dataLoading: true
    };
    handleBeforUpload = (file) => {
        const isJPG = file.type === "image/jpeg" || file.type === "image/png";
        if (!isJPG) {
            message.error("You can only upload JPG or PNG file!");
            return false;
        } else {
            return true;
        }
    };
    handleImageOk = () => {
        this.setState({ ...this.state, imageLoader: true })
        const imageType = this.state.isProfilePic ? "ProfilePic" : "CoverPic";
        saveGroupImage(
            this.props?.match?.params.id,
            imageType,
            this.imageObject
        ).then((res) => {
            this.imageObject = {};
            this.getContestData();
            this.setState({ ...this.state, imageLoader: false }, () => {
                notify({
                    description: `${this.state.isProfilePic ? "Profil picture" : "Cover picture"
                        } uploaded successfully.`,
                    message: "Upload",
                });
            })
        });
    };
    uploadProps = {
        name: "file",
        multiple: false,
        fileList: [],
        customRequest: ({ file }) => {
            let formData = new FormData();
            formData.append(
                "file",
                file,
                file.name +
                `${this.state.isProfilePic ? "groupprofile_" : "groupcover_"}${this.props?.profile?.Id
                }`
            );
            apiClient
                .post(process.env.REACT_APP_AUTHORITY + "/Home/UploadFile", formData)
                .then((res) => {
                    if (res.ok) {
                        this.imageObject.ImageUrl = res.data[0];
                        this.handleImageOk();
                    }
                    else {
                        notify({
                            message: "Error",
                            description: 'Something went wrong',
                            type: 'error'
                        })
                    }
                });
        },
    };
    editContest = (group) => {
        GroupEditObj = group;
        this.setState({
            visible: true,
        });
    };
    joinContest = async (item) => {
        const obj = {
            UserId: this.props?.profile?.Id,
            Firstname: this.props?.profile?.FirstName,
            Lastname: this.props?.profile?.LastName,
            Image: this.props?.profile?.ProfilePic,
            Email: this.props?.profile?.Email,
        };
        if (item.Type == "Private") {
            obj.Type = "request";
        }
        let joinResponse;
        //const joinResponse = await joinGroup(item.GroupId, obj);
        if (joinResponse?.ok) {
            notify({
                message: "Contest join",
                description:
                    "Joined to contest",
            });
            this.props.history.push("/profile/IsProfileContestTab");

        } else {
            notify({
                message: "Error",
                description: "Something went wrong :)",
                type: "error",
            });
        }
    };

    componentDidMount() {
        this.getContestData();
    }
    getContestData = async (id) => {
        let { contestData, dataLoading } = this.state;
        let res = await editContest(
            id ? id : (this.props?.match?.params.id),
        );
        if (res.ok) {
            // contestData = res.data[0];
            contestData = { "ContestId": "f7116375-134a-40eb-86dc-366b1d125a82", "ContestName": "1st Contest Company", "PrivacyType": "Public", "CoverPic": "", "StartDate": "2021-03-09T00:00:00+05:30", "EndDate": "2021-03-26T00:00:00+05:30", "Description": "https://www.youtube.com/watch?v=6NjPe9xwJpI", "AdminUsers": [{ "UserId": "c7fa619c-662f-4d79-b590-3c3413bacf5a", "Firstname": "Blackbuck", "Lastname": "", "Email": "blackbuckengineers@gmail.com" }], "CreatedDate": "2021-03-09T09:46:45.546Z", "Members": [], "ContestLink": ["https://www.youtube.com/watch?v=6NjPe9xwJpI"] }
            dataLoading = false;
            // contestData.IsAdmin = res.data[0]?.IsGroupAdmin;
            this.setState({ ...this.state, contestData, dataLoading });
        }
        else {
            notify({
                message: "Error",
                description: "Something went wrong :)",
                type: "error",
            });
            dataLoading = false;
            this.setState({ ...this.state, dataLoading });
        }
    };
    refreshSave = () => {
        this.getContestData();
    };
    handleCancel = (e) => {
        GroupEditObj = {};
        this.setState({
            visible: false,
        });
    };
    saveGroup = () => {
        this.createcontest.handleSave();
    };
    handleDomNavigate = (navigate) => {
        navigate.current.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
        });
    };

    render() {
        const menu1 = (
            <Menu className="dropdown-align">
                <Menu.Item key="1">
                    {this.state.contestData?.IsAdmin && (
                        <a onClick={() => this.editContest(this.state.contestData)}>
                            <span className="post-icons edit-icon"></span> Edit Contest
                        </a>
                    )}
                </Menu.Item>
            </Menu>
        );
        const operations = (
            <div className="mb-8 mr-12 share-option">
                <button className="">
                    <Dropdown overlay={menu1} trigger={["click"]}>
                        <a
                            className="ant-dropdown-link"
                            onClick={(e) => e.preventDefault()}
                        >
                            {(this.state.contestData?.IsAdmin || this.state.contestData?.IsGroupMember) && <span className="icons h-more-icon m-0"></span>}
                        </a>
                    </Dropdown>
                </button>
            </div>
        );
        const {
            contestData,
            visible,
            tabkey,
            dataLoading
        } = this.state;
        return contestData ? (
            <div className="main">
                {dataLoading && <Loader className="loader-middle" />}
                <Row gutter={16}>
                    <Col xs={24} sm={12} md={16} lg={16} xl={17} xxl={17}>
                        <div className="coverpage">
                            <img
                                className="center-focus"
                                src={contestData.GroupCoverPic || defaultCover}
                                alt="profilecover"
                            />
                            <span className="padlock">
                                <img src={PadLock} />
                            </span>
                            <ImgCrop
                                aspect={6 / 2}
                                grid={true}
                                beforeCrop={this.handleBeforUpload}
                                cropperProps={{
                                    cropSize: { width: 1000, height: 400 },
                                    cropShape: "round",
                                }}
                            >
                                <Upload {...this.uploadProps}>
                                    {contestData?.IsGroupAdmin && (
                                        <Tooltip title="Change Coverphoto">
                                            <a
                                                className="editpost"
                                                onClick={() => this.setState({ isProfilePic: false })}
                                            >
                                                <span className="left-menu camera-icon" />
                                            </a>
                                        </Tooltip>
                                    )}
                                </Upload>
                            </ImgCrop>
                        </div>

                        <div className="user-statistic">
                            <div className="left-statistic group-leftext">
                                <Title className="mb-4 f-16 text-primary" level={5}>
                                    {contestData.ContestName}
                                </Title>
                                <div className="f-12 text-secondary">{contestData.PrivacyType} Contest</div>
                            </div>
                            <CommonModal
                                className="creategroup-popup"
                                visible={visible}
                                title="Edit group"
                                cancel={this.handleCancel}
                                saved={this.saveGroup}
                            >
                                {visible && (
                                    <CreateContest
                                        Type={"Edit"}
                                        ContestId={GroupEditObj.ContestId}
                                        handleCancel={this.handleCancel}
                                        onRef={(createcontest) => (this.createcontest = createcontest)}
                                        refreshSave={() => this.refreshSave()}
                                    />
                                )}
                            </CommonModal>
                            <div className="right-statistic group-right">
                                {contestData.Members > 0 && (
                                    <span className="text-center">
                                        <span className="f-20 mt-4 fw-400">
                                            {contestData.Members}
                                        </span>{" "}
                                        {contestData.Members > 1 ? "Members" : "Member"}
                                    </span>
                                )}
                                {(!contestData.Member) && <Button type="primary" onClick={() => this.joinContest(contestData)}>
                                    Join
                </Button>}
                            </div>
                        </div>
                        <Tabs
                            defaultActiveKey="1"
                            className="profile-tabs"
                            tabBarExtraContent={(!contestData?.IsGroupAdmin && !contestData?.IsGroupMember) ? [] : (operations)}
                            onChange={(e) => this.setState({ ...this.state, tabkey: e })}
                        >
                            <TabPane tab="About" key="3">
                                <Row gutter={16}>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        {Object.keys(contestData).length > 0 && <ContestAbout aboutData={contestData} key={this.props?.match?.params.id} />}
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tab="Posts" key="1">
                                <Row gutter={16}>
                                    <Col xs={24} sm={contestData?.IsGroupAdmin ? 24 : 24} md={contestData?.IsGroupAdmin ? 24 : 24} lg={contestData?.IsGroupAdmin ? 16 : 16} xl={contestData?.IsGroupAdmin ? 16 : 16}>
                                        {contestData?.ContestId && tabkey == "1" && (
                                            <Postings
                                                sharebox={contestData?.IsMember}
                                                friendsSuggestions={false}
                                                postingsType="user"
                                                contestData={contestData}
                                            />
                                        )}
                                    </Col>
                                </Row>
                            </TabPane>
                        </Tabs>
                    </Col>
                </Row>
            </div>
        ) : null;
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
export default connect(mapStateToProps, mapDispatchToProps)(ContestView);
