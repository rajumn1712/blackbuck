import React, { Component } from 'react';
import { Row, Col, Tabs, Card, Avatar, Tooltip, Slider, List, Button, message, Upload, Image, Input, Typography, Checkbox,Descriptions,Divider } from 'antd';
import Invite from '../shared/components/Invite';
import Ads from '../components/ads';
import Postings from '../shared/postings/index';
import './groupstyle.css'
import PadLock from '../styles/images/padlock.svg'
import GroupAbout from '../shared/components/groupabout';
import Media from '../shared/components/media';
import CommonModal from '../components/ProfileComponents/CommonModal';
import { profileDetail, joinGroup, saveProfileImage } from '../shared/api/apiServer';
import { connect } from 'react-redux';
import { profileSuccess } from '../reducers/auth';
import notify from '../shared/components/notification';
import ImgCrop from 'antd-img-crop';
import defaultUser from '../styles/images/defaultuser.jpg';
const { Search } = Input;
const onSearch = value => console.log(value);
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
        visible: false
    };

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
        profileDetail(this.props?.profile?.Id)
            .then(res => {

                const groupData = res.data[0].User;
                groupData.lstDetails = [
                    {}
                ];
                groupData.lstDetails[0].title = "Programmers";
                groupData.lstDetails[0].Type = "Private Group";
                groupData.lstDetails[0].CreatedDate = '2020-10-11';
                groupData.lstDetails[0].Members = '2.5K';
                this.setState({ groupData: groupData });
            })
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    handleOk = e => {
        console.log(e);
        this.setState({
            visible: false,
        });
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
        function onChange(e) {
            console.log(`checked = ${e.target.checked}`);
        }
        const operations = <div className="mb-8 mr-12">
            <span className="post-icons groupshare-icon mt-8"></span>
            <span className="post-icons h-more-icon mx-8"></span>
            
        </div>;
        const { groupData, disabled, visible } = this.state;
        return (
            groupData ? <div className="main">
                <Row gutter={16}>
                    <Col xs={24} sm={16} md={16} lg={18} xl={18}>
                        <div className="coverpage">
                            <img className="center-focus" src={groupData.CoverPic} alt="profilecover" />
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
                                <Title className="mb-0" level={5}>IT Group</Title>
                                <div className="f-12">Private Group</div>
                            </div>
                            <Card className="group-banner w-btn" >
                                <List
                                    itemLayout="horizontal"
                                    dataSource={groupData.lstDetails}
                                    renderItem={item => (
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={<div className="img-container"> <ImgCrop shape="round" beforeCrop={this.handleBeforUpload}>
                                                    <Upload {...this.uploadProps}>
                                                        <Avatar src={groupData?.ProfilePic || defaultUser} />
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
                                <Search className="header-searchbar mb-16" placeholder="Search" onSearch={onSearch} />
                                <div className="">
                                    <div className="f-16 fw-400">Suggested</div>
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={data}
                                        renderItem={item => (
                                            <List.Item>
                                                <List.Item.Meta
                                                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                                    title={<a href="https://ant.design">{item.title}</a>}

                                                /><Checkbox onChange={onChange}></Checkbox>
                                            </List.Item>
                                        )}
                                    />

                                </div>
                            </CommonModal>
                            <div className="right-statistic mt-8">
                                <span className="text-center mt-8 mr-16">
                                    <span className="f-20 fw-400">2.5K</span> Members</span>
                                <Button type="primary" onClick={this.showModal}>Invite</Button>
                            </div>
                        </div>
                        {/* <div className=""><Divider className="m-0" /></div> */}
                        <Tabs defaultActiveKey="1" className="profile-tabs" tabBarExtraContent={operations}>
                            <TabPane tab="About" key="3">
                                <Row gutter={16}>
                                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                        <Invite />
                                    </Col>
                                    <Col xs={24} sm={16} md={16} lg={16} xl={16}>
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
                                        <Postings sharebox={false} friendsSuggestions={false} postingsType="all" />
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tab="Media" key="2">
                                <Row gutter={16}>
                                    <Col xs={24} sm={8} md={8} lg={8} xl={8}>
                                        <Invite />
                                    </Col>
                                    <Col xs={24} sm={16} md={16} lg={16} xl={16}>
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