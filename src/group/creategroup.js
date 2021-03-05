import React, { Component, createRef } from 'react';
import { Row, Col, Card, Avatar, Tooltip, Slider, List, Upload, Image, Form, Select, AutoComplete, message, Input } from 'antd';
import './groupstyle.css';
import CommonModal from '../components/ProfileComponents/CommonModal';
import { saveGroup, fetchUserFriends, editGroup, saveNotification } from '../shared/api/apiServer';
import { connect } from 'react-redux';
import notify from '../shared/components/notification';
import ImgCrop from 'antd-img-crop';
import defaultUser from '../styles/images/defaultuser.jpg';
import { uuidv4 } from "../utils";
import Loader from "../common/loader";
import defaultCover from '../styles/images/defaultcover.png'
import defaultguser from '../styles/images/default-cover.png';
import indianCitiesDatabase from 'indian-cities-database';
var cities = indianCitiesDatabase.cities;
let cityValues = cities.map(item => item.city);
const { Option } = Select;
const { TextArea } = Input;

class CreateGroup extends Component {
    formRef = createRef();
    groupObject = {
        GroupName: "",
        GroupType: "",
        GroupImage: "",
        GroupCoverPic: "",
        Type: "",
        Location: "",
        Description: "",
        Hide: "Visible",
        Invitations: [],
        GroupId: null,
        AdminUsers: null,
        CreatedDate: "",
        Members: [],
        Categories: [],
        MainType: "General",
        IsSystem: false
    }

    imageObject = {};
    getGroupObject = (id) => {
        editGroup(id, this.props?.profile.Id).then(res => {
            this.setInitialvalues(res.data[0].Group);
            let { groupObject } = this.state;
            groupObject = res.data[0].Group;
            this.setState({ ...this.state, groupObject });
        });
    }
    setInitialvalues = (initialValues) => {
        let { groupObject } = this.state;
        groupObject.GroupName = initialValues.GroupName;
        groupObject.GroupType = initialValues.GroupType;
        groupObject.Type = initialValues.Type;
        groupObject.Location = initialValues.Location;
        groupObject.Hide = initialValues.Hide ? initialValues.Hide : "Visible";
        groupObject.Description = initialValues.Description;
        groupObject.MainType = initialValues.MainType ? initialValues.MainType : "General";
        groupObject.IsSystem = initialValues.IsSystem;
        initialValues.Invitations.forEach(val => {
            groupObject.Invitations.push(val.FriendId)
        })
        this.setState({ ...this.state, groupObject });
        this.formRef.current.setFieldsValue({ ...groupObject })
    }
    state = {
        GroupTypeLu: ["IT Group", "Science Group ", "Learning Group"],
        TypeLu: [
            {
                Name: "Public",
                Icon: "icons public-icon",
                Description: "Anyone can see who's in the group and what they post.",
                SubType: "General"

            },
            {

                Name: "Private",
                Icon: "icons private-icon",
                Description: "Only members can see who's in the group and what they post.",
                SubType: "General"
            },
            {

                Name: "Company",
                Icon: "icons private-icon",
                Description: "Only members can see who's in the group and what they post.",
                SubType: "Company"
            },
            {

                Name: "Subject",
                Icon: "icons private-icon",
                Description: "Only members can see who's in the group and what they post.",
                SubType: "College"
            },
            {

                Name: "Branch",
                Icon: "icons private-icon",
                Description: "Only members can see who's in the group and what they post.",
                SubType: "College"
            },
            {

                Name: "College",
                Icon: "icons private-icon",
                Description: "Only members can see who's in the group and what they post.",
                SubType: "College"
            }
        ],
        HiddenLu: [
            {
                Name: "Visible",
                Icon: "icons visible-icon",
                Description: "Anyone can find this group."

            },
            {

                Name: "Hidden",
                Icon: "icons hidden-icon",
                Description: "Only members can find this group."
            }
        ],
        FriendsList: [],
        disabled: false,
        visible: false,
        loading: false,
        isProfilePic: false,
        groupObject: this.groupObject,
    };
    createObject = (values) => {
        let { groupObject } = this.state;
        let InvitesArray = [];
        values.Invitations.forEach(item => {
            InvitesArray.push({ UserName: this.props?.profile.FirstName, FriendId: item, Image: this.props?.profile.ProfilePic, CreatedDate: new Date() })
        });
        return {
            GroupName: values.GroupName,
            GroupType: values.GroupType ? values.GroupType : "Official",
            GroupImage: groupObject.GroupImage ? groupObject.GroupImage : "",
            GroupCoverPic: groupObject.GroupCoverPic ? groupObject.GroupCoverPic : "",
            Type: values.Type,
            Location: values.Location,
            Description: values.Description,
            Hide: values.Type == "Private" ? values.Hide : "",
            Invitations: InvitesArray,
            GroupId: groupObject.GroupId ? groupObject.GroupId : uuidv4(),
            UserId: groupObject.UserId,
            AdminUsers: groupObject.AdminUsers ? groupObject.AdminUsers : [{
                "UserId": this.props?.profile?.Id,
                "Firstname": this.props?.profile?.FirstName,
                "Lastname": this.props?.profile?.LastName,
                "Image": this.props?.profile?.ProfilePic,
                "Email": this.props?.profile?.Email
            }],
            CreatedDate: groupObject.CreatedDate ? new Date(groupObject.CreatedDate) : new Date(),
            Members: [],
            Categories: [],
            CourseSections: [],
            MainType: groupObject.MainType ? groupObject.MainType : "General",
            IsSystem: groupObject.IsSystem ? groupObject.IsSystem : (this.props.profile.Role == "Super Admin" ? true : false)
        };
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
        let { groupObject } = this.state;
        if (this.state.isProfilePic) {
            groupObject.GroupImage = this.imageObject.ImageUrl;
        } else {
            groupObject.GroupCoverPic = this.imageObject.ImageUrl;
        }
        this.imageObject = {};
        this.setState({ ...this.state, groupObject: groupObject });

    }
    uploadProps = {
        name: 'file',
        multiple: false,
        fileList: [],
        action: process.env.REACT_APP_AUTHORITY + '/Home/UploadFile',
        onChange: ({ file }) => {
            const { status } = file;
            if (status !== 'uploading') {

            }
            if (status === 'done') {
                this.imageObject.ImageUrl = file.response[0];
                this.handleImageOk();
                message.success(`${this.state.isProfilePic ? 'Profile picture' : 'Cover picture'} uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`File upload failed.`);
            }
        },

    };

    componentDidMount() {
        this.props.onRef(this)
        this.imageObject = {};
        fetchUserFriends((this.props.userId ? this.props.userId : (this.props?.profile?.Id)))
            .then(res => {
                const friendsInfo = res.data;
                this.setState({ ...this.state, FriendsList: friendsInfo });
            })
        if (this.props.GroupId) {
            this.getGroupObject(this.props.GroupId)
        }
    }
    componentWillUnmount() {
        this.props.onRef(null)
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
    handleChange = (prop, val) => {
        let { groupObject } = this.state;
        groupObject[prop] = val ? (val.currentTarget ? val.currentTarget.value : val) : "";
        this.setState({ ...this.state, groupObject });
    }

    handleSave = async (e) => {
        this.formRef.current.validateFields().then((values) => {
            //  this.formRef.current.resetFields();
            this.groupSave();
        });
    };

    getTypeLu = (typeLu) => {
        let { groupObject } = this.state;
        return typeLu.filter(item => item.SubType == groupObject.MainType);
    }
    groupSave = async () => {
        let { groupObject } = this.state;
        let notificationArray = [];
        this.setState({ ...this.state, loading: true });
        const saveObj = this.createObject(groupObject);
        const response = await saveGroup(saveObj);
        if (response.ok) {
            saveObj.Invitations.forEach(invite => {
                let notificationObj = {
                    "NotificationId": uuidv4(),
                    "ReferenceId": saveObj.GroupId,//GroupId
                    "Name": saveObj.GroupName,//GroupName
                    "MainUserId": invite.FriendId,
                    "UserId": this.props?.profile?.Id,
                    "Firstname": this.props?.profile?.FirstName,
                    "Lastname": this.props?.profile?.LastName,
                    "Image": this.props?.profile?.ProfilePic,
                    "Email": this.props?.profile?.Email,
                    "NotificationType": "Invitations",
                    "CreatedDate": new Date(),
                    "Type": "request"
                }
                notificationArray.push(notificationObj);
            })
            saveNotification({ "Notifications": notificationArray }).then(res => {

            });
            this.setState({ ...this.state, loading: false });
            this.props.handleCancel();
            if (this.props.refreshSave)
                this.props.refreshSave();
            notify({
                description: this.props.Type == "Edit" ? "Group edited successfully" : "Group saved successfully",
                message: "Group",
            });
        } else {
            notify({ description: "Something went wrong :)", message: "Error", type: 'error' })
            this.setState({ ...this.state, loading: false });
        }
    }
    renderSelectItem = (item) => {
        return <div>
            <List.Item>
                <List.Item.Meta className="privacy-dropdown sample-check"
                    avatar={item.Icon ? <span className={item.Icon}></span> : <Avatar className="invite-dropdown" src={item.Image || defaultUser} />}
                    title={<span>{item.Firstname ? item.Firstname : item.Name}</span>}
                    description={item.Description ? <div className="f-12" style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>{item.Description}</div> : ''}
                />
            </List.Item>
        </div>
    }
    render() {
        const { disabled, visible, GroupTypeLu, TypeLu, groupObject, HiddenLu, FriendsList, loading } = this.state;
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        return <div className="main">
            {loading && <Loader className="loader-middle" />}
            <Row gutter={24}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <div className="coverpage">
                        <img className="center-focus" src={groupObject.GroupCoverPic || defaultCover} alt="profilecover" />

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
                                dataSource={[{}]}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<div className="img-container">          <ImgCrop shape="round" beforeCrop={this.handleBeforUpload}>
                                                <Upload {...this.uploadProps}>
                                                    <Avatar src={groupObject?.GroupImage || defaultguser} onClick={() => this.setState({ isProfilePic: true })} />
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
                                <Form layout="vertical" initialValues={{ ...groupObject }} on scrollToFirstError={true} ref={this.formRef} >
                                    <Row gutter={24}>
                                        {this.props.profile.Role == "Super Admin" && <Col xs={24} id="groupMainType">
                                            <Form.Item
                                                label="Type"
                                                className="custom-fields custom-select" name="MainType" rules={[{ required: true, message: "Type  required" }]}
                                            >
                                                <Select
                                                    name="MainType"
                                                    onChange={(value) =>
                                                        this.handleChange("MainType", value)
                                                    }
                                                    getPopupContainer={() => document.querySelector('#groupMainType')}
                                                    disabled={this.props.Type == "Edit"}
                                                >
                                                    {["General", "College", "Company"].map((item, index) => {
                                                        return (
                                                            <Option key={index} value={item}>
                                                                {item}
                                                            </Option>
                                                        );
                                                    })}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        }
                                        <Col xs={24}>
                                            <Form.Item label="Group Name" name="GroupName" className="custom-fields" rules={[{ required: true, message: "Group Name  required" }]}>
                                                <Input placeholder="Title" onChange={(value) => this.handleChange('GroupName', value)} maxLength={150} autoComplete="off" />
                                            </Form.Item>
                                        </Col>

                                        {groupObject.MainType == 'General' && <Col xs={24} id="groupType">
                                            <Form.Item
                                                label="Group Type"
                                                className="custom-fields custom-select" name="GroupType" rules={[{ required: true, message: "Group Type  required" }]}
                                            >
                                                <Select
                                                    defaultValue=""
                                                    name="GroupType"
                                                    onChange={(value) =>
                                                        this.handleChange("GroupType", value)
                                                    }
                                                    getPopupContainer={() => document.querySelector('#groupType')}
                                                >
                                                    <Option value="">Select Type</Option>
                                                    {GroupTypeLu.map((item, index) => {
                                                        return (
                                                            <Option key={index} value={item}>
                                                                {item}
                                                            </Option>
                                                        );
                                                    })}
                                                </Select>
                                            </Form.Item>

                                        </Col>
                                        }

                                        <Col xs={24} lg={12} id="type">
                                            <Form.Item
                                                label="Choose Privacy"
                                                className="custom-fields custom-select" name="Type" rules={[{ required: true, message: "Privacy required" }]}
                                            >
                                                <Select
                                                    defaultValue=""
                                                    name="Type"
                                                    onChange={(value) =>
                                                        this.handleChange("Type", value)
                                                    }
                                                    optionLabelProp="label"
                                                    getPopupContainer={() => document.querySelector('#type')}
                                                >
                                                    <Option value="" label="Select Type">Select Type</Option>
                                                    {this.getTypeLu(TypeLu).map((item, index) => {
                                                        return (
                                                            <Option key={index} value={item.Name} label={item.Name}>
                                                                {this.renderSelectItem(item)}
                                                            </Option>
                                                        );
                                                    })}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} lg={12} id="inviteFrnd1">
                                            <Form.Item
                                                label="Invite Friends (optional)"
                                                className="custom-fields multi-select custom-select"
                                                placeholder="Select Invitee"
                                                name="Invitations"
                                            >
                                                <Select
                                                    name="Invitations"
                                                    onChange={(value) =>
                                                        this.handleChange("Invitations", value)
                                                    }
                                                    optionLabelProp="label"
                                                    mode="multiple"
                                                    getPopupContainer={() => document.querySelector('#inviteFrnd1')}
                                                    filterOption={(input, option) =>
                                                        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                >
                                                    {FriendsList.map((item, index) => {
                                                        return (
                                                            <Option key={index} value={item.UserId} label={item.Firstname}>
                                                                {this.renderSelectItem(item)}
                                                            </Option>
                                                        );
                                                    })}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        {groupObject.Type == 'Private' && <Col xs={24} lg={12}>
                                            <Form.Item
                                                label="Hide Group"
                                                name="Hide"
                                                className="custom-fields custom-select" rules={[{ required: true, message: "Hide Group required" }]}
                                            >
                                                <Select
                                                    defaultValue="Visible"
                                                    name="Hide"
                                                    onChange={(value) =>
                                                        this.handleChange("Hide", value)
                                                    }
                                                    optionLabelProp="label"
                                                >
                                                    {HiddenLu.map((item, index) => {
                                                        return (
                                                            <Option key={index} value={item.Name} label={item.Name}>
                                                                {this.renderSelectItem(item)}
                                                            </Option>
                                                        );
                                                    })}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        }
                                        <Col xs={24} id="Loc">
                                            <Form.Item label="Location" className="custom-fields" name="Location" rules={[{ required: true, message: "Location required" }]}>
                                                <AutoComplete
                                                    name="Location"
                                                    placeholder={"Add a Location to your group"}
                                                    onChange={(value) =>
                                                        this.handleChange("Location", value)
                                                    }
                                                    getPopupContainer={() => document.querySelector('#Loc')}
                                                    filterOption={(input, option) =>
                                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                >
                                                    {cityValues.map((item, index) => {
                                                        return (
                                                            <Option key={index} value={item}>
                                                                {item}
                                                            </Option>
                                                        );
                                                    })}
                                                </AutoComplete>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={24}>
                                        <Col xs={24}>
                                            <Form.Item label="Description" className="mb-12" name="Description" rules={[{ required: true }]}>
                                                <TextArea placeholder="Description" onResize onChange={(value) => this.handleChange('Description', value)}
                                                    autoSize={{ minRows: 3, maxRows: 20 }} maxLength={1360} autocomplete="off"
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                        </Card>
                        <CommonModal visible={visible} title="Edit Photo" cancel={this.handleCancel} saved={this.handleOk}>
                            <div className="">
                                <div className="upload-preview">
                                    <Image src={groupObject.GroupImage} />
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
        </div>
    }
}

const mapStateToProps = ({ oidc }) => {
    return { user: oidc.user, profile: oidc.profile }
}
export default connect(mapStateToProps)(CreateGroup);