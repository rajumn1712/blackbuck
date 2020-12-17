import React, { Component } from 'react';
import { Row, Col, Tabs, Card, Avatar, Tooltip, Slider, List, Button, message, Upload, Image, Input, Typography, Checkbox, Descriptions, Divider, Menu, Dropdown } from 'antd';
import Invite from '../shared/components/Invite';
import Ads from '../components/ads';
import Postings from '../shared/postings/index';
import './groupstyle.css'
import PadLock from '../styles/images/padlock.svg'
import GroupAbout from '../shared/components/groupabout';
import Media from '../shared/components/media';
import CommonModal from '../components/ProfileComponents/CommonModal';
import { profileDetail, joinGroup, saveProfileImage, editGroup, getAdminFriends, saveInvitations } from '../shared/api/apiServer';
import { connect } from 'react-redux';
import { profileSuccess } from '../reducers/auth';
import notify from '../shared/components/notification';
import ImgCrop from 'antd-img-crop';
import defaultUser from '../styles/images/defaultuser.jpg';
import Loader from "../common/loader";
const { Search } = Input;
const { TabPane } = Tabs;
const data = [
    { title: 'Jhon Se' }
];
const { Title } = Typography;
class Group extends Component {
    imageObject = {};
    state = {
        groupData: {
            lstDetails: [
                {
                    title: "Programmers",
                    Type: "Private Group",
                    CreatedDate: '2020-10-11',
                    Members: '2.5k'
                }
            ],
            isProfilePic: false,
        },
        disabled: false,
        visible: false,
        loading: false,
        search: null,
        friendsLu: [],
        saveObj: {
            GroupId: this.props?.match?.params.id,
            Invitations: []
        }
    };
    onSearch = (e) => {
        let keyword = e.target.value;
        this.setState({ search: keyword });
    }

    onChange = (e, item, index) => {
        let Obj = { UserName: this.props?.profile.FirstName, FriendId: item.UserId, Image: this.props?.profile.ProfilePic };
        let { saveObj } = this.state;
        item.IsChecked = e.target.checked;
        if (item.IsChecked)
            saveObj.Invitations.push(Obj);
        else
            saveObj.Invitations.splice(saveObj.Invitations.indexOf(Obj), 1)

    }
    handleDisabledChange = disabled => {
        this.setState({ disabled });
    };
    handleBeforUpload = (file) => {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJPG) {
            message.error('You can only upload JPG or PNG file!');
            return false;
        } else {
            return true;
        }

    }
    handleImageOk = () => {
        const imageType = this.state.isProfilePic ? 'ProfilePic' : 'CoverPic';
        saveProfileImage(this.props?.profile?.Id, imageType, this.imageObject)
            .then(res => {
                if (this.state.isProfilePic) {
                    this.props.profile.ProfilePic = this.imageObject.ImageUrl;
                } else {
                    this.props.profile.CoverPic = this.imageObject.ImageUrl;
                }
                this.imageObject = {};
            })

    }
    uploadProps = {
        name: 'file',
        multiple: false,
        fileList: [],
        action: 'http://138.91.35.185/tst.blackbuck.identity/Home/UploadFile',
        onChange: ({ file }) => {
            const { status } = file;
            if (status !== 'uploading') {
                this.imageObject.ImageUrl = file.response[0];
                this.handleImageOk();
            }
            if (status === 'done') {
                message.success(`${this.state.isProfilePic ? 'Profil picture' : 'Cover picture'} uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`File upload failed.`);
            }
        },

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
            notify({ message: "Group join", description: item.type === "Private" ? "Request sent" : "Joined to group" });
            if (item.type !== 'Private') {
                this.props.profile.Groups = (this.props.profile.Groups ? this.props.profile.Groups : 0) + 1;
                this.props.updateProfile(this.props.profile)
            }
        } else {
            notify({ message: "Error", description: "Something went wrong :)", type: "error" });
        }
    }

    componentDidMount() {
        let { groupData } = this.state;
        editGroup(this.props?.match?.params.id, this.props?.profile.Id).then(res => {
            groupData = res.data[0].Group;
            groupData.IsAdmin = res.data[0].IsGroupAdmin;
            this.setState({ ...this.state, groupData });
        });
    }
    showModal = () => {
        this.setState({
            visible: true,
            friendsLu: [],
            loading: true,
        }, () => {
            this.getAdminFriends();
        });
    };
    getAdminFriends = () => {
        let { friendsLu, groupData } = this.state;
        getAdminFriends(this.props?.profile?.Id, groupData?.GroupId).then(res => {
            this.setState({
                ...this.state,
                friendsLu: res.data,
                loading: false
            });
        });
    }
    handleOk = async (e) => {
        this.setState({ ...this.state, loading: true });
        const response = await saveInvitations(this.state.saveObj);
        if (response.ok) {
            this.setState(
                {
                    visible: false,
                    loading: false,
                },
                () => {
                    notify({
                        description: "Invitations added successfully",
                        message: "Invitations",
                    });
                }
            );
        } else {
            this.setState(
                {
                    ...this.state,
                    loading: false,
                }
            );

            notify({
                description: "Something went wrong :)",
                message: "Error",
                type: "error",
            });
        }
    };
    handleCancel = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }
    handleDomNavigate = (navigate) => {
        navigate.current.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    }

    render() {
        const menu = (
            <Menu className="dropdown-align">
                <Menu.Item key="0">
                    <a><span className="post-icons post-icon mr-4"></span> Share in a post</a>
                </Menu.Item>
                <Menu.Item key="1">
                    <a><span className="post-icons sendmessage-icon"></span> Send in a message</a>
                </Menu.Item>
                <Menu.Item key="2">
                    <a><span className="post-icons sharenow-icon"></span> Copy link</a>
                </Menu.Item>
            </Menu>
        );
        const menu1 = (
            <Menu className="dropdown-align">
                {/* <Menu.Item key="0">
                    <a><span className="post-icons settings-icon"></span> Update your settings</a>
                </Menu.Item> please don't delete */}
                <Menu.Item key="1">
                    <a><span className="post-icons Leavegroup-icon"></span> Leave this group</a>
                    <a><span className="post-icons edit-icon"></span> Edit group</a>
                </Menu.Item>
                {/* <Menu.Item key="2">
                    <a><span className="post-icons groupshare-icon"></span> Unfollow Group</a>
                </Menu.Item> please don't delete*/ }
            </Menu>
        );
        function onChange(e) {
            console.log(`checked = ${e.target.checked}`);
        }
        const operations = <div className="mb-8 mr-12 share-option">
            {/* <button type="primary" className=""><Dropdown overlay={menu} trigger={['click']}>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                    <span className="post-icons groupshare-icon m-0"></span>
                </a>
            </Dropdown></button>  please don't delete*/}
            <button className=""><Dropdown overlay={menu1} trigger={['click']}>
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                    <span className="icons h-more-icon m-0"></span>
                </a>
            </Dropdown></button>

        </div>;
        const { groupData, disabled, visible, friendsLu, loading } = this.state;
        const friendsData = friendsLu
            .filter((item) => {
                if (this.state.search == null) {
                    return item;
                } else if (
                    item.Firstname.toLowerCase().includes(this.state.search.toLowerCase())
                ) {
                    return item;
                }
            })
            .map((item, index) => {
                return (
                    <List.Item key={index}>
                        <List.Item.Meta
                            avatar={<Avatar src={item.Image || defaultUser} />}
                            title={item.Firstname}

                        /><Checkbox value={item.IsChecked} onChange={(e) => this.onChange(e, item, index)}></Checkbox>
                    </List.Item>
                );
            });
        return (
            groupData ? <div className="main">
                <Row gutter={16}>
                    <Col xs={24} sm={16} md={16} lg={18} xl={18}>
                        <div className="coverpage">
                            <img className="center-focus" src={groupData.GroupCoverPic || defaultUser} alt="profilecover" />
                            <span className="padlock"><img src={PadLock} /></span>
                            <ImgCrop aspect={6 / 2} grid={true} beforeCrop={this.handleBeforUpload} cropperProps={{ cropSize: { width: 1000, height: 400 }, cropShape: "round" }}>
                                <Upload {...this.uploadProps}>
                                    <Tooltip title="Change Coverphoto">
                                        <a className="editpost" onClick={() => this.setState({ isProfilePic: false })}>
                                            <span className="left-menu camera-icon" />
                                        </a>
                                    </Tooltip>
                                </Upload>
                            </ImgCrop>

                        </div>

                        <div className="user-statistic pb-0">
                            <div className="left-statistic group-leftext">
                                <Title className="mb-0" level={5}>{groupData.GroupName}</Title>
                                <div className="f-12">{groupData.Type} Group</div>
                            </div>
                            <Card className="group-banner w-btn" >
                                <List
                                    itemLayout="horizontal"
                                    dataSource={[{}]}
                                    renderItem={item => (
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={<div className="img-container"> <ImgCrop shape="round" beforeCrop={this.handleBeforUpload}>
                                                    <Upload {...this.uploadProps}>
                                                        <Avatar src={groupData?.GroupImage || defaultUser} />
                                                        <Tooltip placement="top" title="Change Photo">
                                                            <a className="img-camera" onClick={() => this.setState({ isProfilePic: true })}><span className="left-menu camera-icon" /> </a>
                                                        </Tooltip>
                                                    </Upload>
                                                </ImgCrop> </div>}
                                            // title={<a href="https://ant.design">{item.title}</a>}

                                            // description={<div className="f-12">{item.Type}</div>}
                                            />
                                            {/* {!groupData.IsMember && <div className="btn-position"><span className="text-center mt-8 mr-16"><span className="f-20 fw-400">{item.Members}</span> Members</span>
                                                <Button type="primary" onClick={() => this.joinGroup(item)}>Invite</Button>
                                            </div>} */}
                                        </List.Item>
                                    )}
                                />


                            </Card>
                            <CommonModal visible={visible} title="Invite Friends to This Group" cancel={this.handleCancel} saved={this.handleOk} className="invite-search">
                                {loading && <Loader className="loader-middle" />}
                                <Search className="header-searchbar mb-16" placeholder="Search" onChange={(e) => this.onSearch(e)} onSearch={(event) => this.onSearch(event)} />
                                <div className="">
                                    <div className="f-16 fw-400">Suggested</div>
                                    <List itemLayout="horizontal"
                                    >{friendsData}</List>

                                </div>
                            </CommonModal>
                            <div className="right-statistic group-right mt-12 mx-12">
                                {groupData.Members?.length > 0 && <span className="text-center mt-4 mr-16">
                                    <span className="f-20 mt-4 fw-400">{groupData.Members.length}</span> Members</span>}
                                <Button type="primary" onClick={this.showModal}><span className="icons add-white"></span> Invite</Button>
                            </div>
                        </div>
                        {/* <div className=""><Divider className="m-0" /></div> */}
                        <Tabs defaultActiveKey="1" className="profile-tabs" tabBarExtraContent={operations}>
                            <TabPane tab="About" key="3">
                                <Row gutter={16}>

                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <GroupAbout />
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tab="Posts" key="1">
                                <Row gutter={16}>
                                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                        <Invite />
                                    </Col>
                                    <Col xs={24} sm={16} md={16} lg={16} xl={16}>
                                        {groupData?.GroupId && <Postings sharebox={true} friendsSuggestions={false} postingsType="group" groupData={groupData} />}
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tab="Media" key="2">
                                <Row gutter={16}>

                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <Media />
                                    </Col>
                                </Row>
                            </TabPane>

                        </Tabs>
                    </Col>
                    <Col xs={24} sm={8} md={8} lg={6} xl={6}>
                        <Ads />
                    </Col>
                </Row>
            </div> : null
        )
    }
}

const mapStateToProps = ({ oidc }) => {
    return { user: oidc.user, profile: oidc.profile }
}
const mapDispatchToProps = dispatch => {
    return {
        upadateProfile: (info) => { dispatch(profileSuccess(info)) }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Group);