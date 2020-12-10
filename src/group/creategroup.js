import React, { Component } from 'react';
import { Row, Col, Tabs, Card, Avatar, Tooltip, Slider, List, Button, message, Upload, Image, Form, Input, Radio,Checkbox } from 'antd';
import './groupstyle.css';
import CommonModal from '../components/ProfileComponents/CommonModal';
import { profileDetail, joinGroup, saveProfileImage } from '../shared/api/apiServer';
import { connect } from 'react-redux';
import notify from '../shared/components/notification';
import ImgCrop from 'antd-img-crop';
import defaultUser from '../styles/images/defaultuser.jpg';
const { Meta } = Card;

const { TabPane } = Tabs;
const data = [
    { title: 'Programmers' }
];

const navigations =
    [
        {
            "Heading": "About Me",
            "Url": "/aboutme",
            "CssSprite": "left-menu profile-icon",
            "IsActive": false
        },
        {
            "Heading": "Interests",
            "Url": "/interests",
            "CssSprite": "left-menu interest",
            "IsActive": false
        },
        {
            "Heading": "Hobbies",
            "Url": "/hobbies",
            "CssSprite": "left-menu hobbies",
            "IsActive": false
        },
        {
            "Heading": "Internships",
            "Url": "/internships",
            "CssSprite": "left-menu intenship",
            "IsActive": false
        },
        {
            "Heading": "Video as Profile",
            "Url": "/videoprofile",
            "CssSprite": "left-menu play",
            "IsActive": false
        },
        {
            "Heading": "Education",
            "Url": "/education",
            "CssSprite": "left-menu education",
            "IsActive": false
        },
        {
            "Heading": "Courses",
            "Url": "/courses",
            "CssSprite": "left-menu courses",
            "IsActive": false
        },
        {
            "Heading": "Groups",
            "Url": "/profilegroups",
            "CssSprite": "left-menu group-icon",
            "IsActive": false
        }
    ]
const options = [
    { label: 'Allow members to invite their connections', value: 'Allow members to invite their connections' },
    { label: 'Require new posts to be reviewed by admins', value: 'Require new posts to be reviewed by admins' },
];
function onChange(checkedValues) {
    console.log('checked = ', checkedValues);
  }
const { TextArea } = Input;
class CreateGroup extends Component {


    imageObject = {};
    state = {
        groupData: {
            lstDetails: [
                {
                    title: "Programmers",
                    Type: "Private Group",
                    CreatedDate: '2020-10-11',
                    
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
        const { navigations, disabled, visible, groupData } = this.state;
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        const { value } = this.state;
        return (
            groupData ? <div className="main">
                <Row gutter={24}>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <div className="coverpage">
                            <img className="center-focus" src={groupData.CoverPic} alt="profilecover" />
                           
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
                        <div className="user-statistic">
                            <Card className="group-banner w-btn" >
                                <List
                                    itemLayout="horizontal"
                                    dataSource={groupData.lstDetails}
                                    renderItem={item => (
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={<div className="img-container">          <ImgCrop shape="round" beforeCrop={this.handleBeforUpload}>
                                                    <Upload {...this.uploadProps}>
                                                        <Avatar src={groupData?.ProfilePic || defaultUser} />
                                                        <Tooltip placement="top" title="Change Photo">
                                                            <a className="img-camera" onClick={() => this.setState({ isProfilePic: true })}><span className="left-menu camera-icon" /> </a>
                                                        </Tooltip>
                                                    </Upload>
                                                </ImgCrop></div>}
                                            />
                                        </List.Item>
                                    )}
                                />

                                <div className="my-16">
                                    <Form layout="vertical" >
                                        <Row gutter={24}>
                                            <Col xs={24}>
                                                <Form.Item label="Group Name" className="custom-fields">
                                                    <Input placeholder="Enter group name here" />
                                                </Form.Item>
                                            </Col>
                                            
                                            <Col xs={24}>
                                                <Form.Item label="Group Type" className="custom-fields">
                                                <Input placeholder="Ex: IT GRoup" />
                                                </Form.Item>
                                            </Col>
                                            
                                            <Col xs={12}>
                                                <Form.Item label="Choose Privacy" className="custom-fields">
                                                <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={12}>
                                                <Form.Item label="Invite Friends (optional)" className="custom-fields">
                                                <Input />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={12}>
                                                <Form.Item label="Hide Group" className="custom-fields">
                                                <Input /><div className="f-12">Private groups can't change to public to protect the privacy of group members. <span className="">Learn More</span></div>
                                                </Form.Item>
                                                
                                            </Col>
                                            <Col xs={24}>
                                                <Form.Item label="Location" className="custom-fields">
                                                    <Input placeholder="Add a Location to your group" />
                                                </Form.Item>
                                            </Col>
                                            </Row>
                                            <Row gutter={24}>
                                            <Col xs={24}>
                                                <Form.Item label="Description" className="custom-fields">
                                                    <TextArea
                                                        placeholder="Autosize height with minimum and maximum number of lines"

                                                    />
                                                </Form.Item>
                                            </Col>
                                            {/* <Col xs={12}>
                                                <Form.Item label="Group Rules" className="custom-fields">
                                                    <TextArea placeholder="Autosize height with minimum and maximum number of lines" />
                                                </Form.Item>
                                            </Col> */}
                                            

                                            {/* <Col xs={24}>
                                                <Form.Item label="Group discoverability" className="custom-fields">
                                                    <Radio.Group onChange={this.onChange} value={value}>
                                                        <Radio style={radioStyle} value={1}>Listed</Radio>
                                                        <Radio style={radioStyle} value={2}>Unlisted</Radio>
                                                    </Radio.Group>
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24}>
                                                <Form.Item label="Permissions" className="custom-fields">
                                                <Checkbox.Group options={options} onChange={onChange} />
                                                </Form.Item>
                                            </Col> */}
                                        </Row>
                                    </Form>
                                </div>
                            </Card>
                            <CommonModal visible={visible} title="Edit Photo" cancel={this.handleCancel} saved={this.handleOk}>
                                <div className="">
                                    <div className="upload-preview">
                                        <Image src={groupData.ProfilePic} />
                                        <a class="item-close">
                                            <Tooltip title="Remove">
                                                <span className="close-icon"></span>
                                            </Tooltip>
                                        </a>
                                    </div>
                                    <div>
                                        <Slider defaultValue={30} disabled={disabled} />
                                    </div>

                                </div>
                            </CommonModal>
                        </div>
                    </Col>
                </Row>
            </div> : null
        )
    }
}

const mapStateToProps = ({ oidc }) => {
    return { user: oidc.user, profile: oidc.profile }
}
export default connect(mapStateToProps)(CreateGroup);