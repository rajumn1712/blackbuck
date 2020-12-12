import React, { Component, createRef } from 'react';
import { Row, Col, Card, Avatar, Tooltip, Slider, List, Button, message, Upload, Image, Form, Select } from 'antd';
import './groupstyle.css';
import CommonModal from '../components/ProfileComponents/CommonModal';
import { saveGroup, fetchUserFriends } from '../shared/api/apiServer';
import { connect } from 'react-redux';
import notify from '../shared/components/notification';
import ImgCrop from 'antd-img-crop';
import defaultUser from '../styles/images/defaultuser.jpg';
import { ErrorMessage, Field, Formik } from "formik";
import { hasChanged, uuidv4 } from "../utils";
const { Option } = Select;

const groupObject = {
    GroupName: "",
    GroupType: "",
    GroupImage: "",
    GroupCoverPic: "",
    Type: "",
    Location: "",
    Description: "",
    Hide: "",
    Invitations: [],
    GroupId: "",
    AdminUsers: null,
    CreatedDate: ""
}
class CreateGroup extends Component {
    formRef = createRef();

    imageObject = {};
    state = {
        GroupTypeLu: ["IT Group", "science group ", "Learning Group"],
        TypeLu: [
            {
                Name: "Public",
                Image: "../styles/images/defaultuser.jpg",
                Description: "Anyone can see who's in the group and what they post."

            },
            {

                Name: "Private",
                Image: "../styles/images/defaultuser.jpg",
                Description: "Only members can see who's in the group and what they post."
            }
        ],
        HiddenLu: [
            {
                Name: "Visible",
                Image: "../styles/images/defaultuser.jpg",
                Description: "Anyone can find this group."

            },
            {

                Name: "Hidden",
                Image: "../styles/images/defaultuser.jpg",
                Description: "Only members can find this group."
            }
        ],
        FriendsList: [],
        disabled: false,
        visible: false,
        groupObject: this.props.Type == 'Add' ? groupObject : this.props.groupObject,
        initialValues: {
            GroupName: groupObject.GroupName,
            GroupType: groupObject.GroupType,
            Type: groupObject.Type,
            Location: groupObject.Location,
            Description: groupObject.Description,
            Invitations: groupObject.Invitations,
        },
    };
    createObject = (values) => {
        let { groupObject } = this.state;
        let InvitesArray = [];
        values.Invitations.forEach(item => {
            InvitesArray.push({ UserName: this.props?.profile.FirstName, FriendId: item })
        });
        return {
            GroupName: values.GroupName,
            GroupType: values.GroupType,
            GroupImage: groupObject.GroupImage,
            GroupCoverPic: groupObject.GroupCoverPic,
            Type: values.Type,
            Location: values.Location,
            Description: values.Description,
            Hide: values.Hide,
            Invitations: InvitesArray,
            GroupId: groupObject.GroupId ? groupObject.GroupId : uuidv4,
            UserId: groupObject.UserId,
            AdminUsers: groupObject.AdminUsers ? groupObject.AdminUsers : [{
                "UserId": this.props?.profile?.Id,
                "Firstname": this.props?.profile?.FirstName,
                "Lastname": this.props?.profile?.LastName,
                "Image": this.props?.profile?.ProfilePic,
                "Email": this.props?.profile?.Email
            }],
            CreatedDate: groupObject.CreatedDate ? new Date(groupObject.CreatedDate) : new Date()
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

    componentDidMount() {
        fetchUserFriends((this.props.userId ? this.props.userId : (this.props?.profile?.Id)))
            .then(res => {
                const friendsInfo = res.data;
                this.setState({ ...this.state, FriendsList: friendsInfo });
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

    handleSave = (e) => {
        this.formRef.current.handleSubmit();
        if (!hasChanged(this.formRef.current.values)) {
            const saveObj = this.createObject(this.formRef.current.values);
            saveGroup(saveObj).then((res) => {
                this.setState(
                    {
                        visible: false,
                    },
                    () => {
                        notify({
                            description: "Group saved successfully",
                            message: "Group",
                        });
                    }
                );
            });
        }
    };
    handleValidate = (values) => {
        let errors = {};
        for (var key in values) {
            if (!values[key]) {
                errors[key] = "is required";
            }
        }

        return errors;
    };
    handleDomNavigate = (navigate) => {
        navigate.current.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    }
    renderSelectItem = (item) => {
        return <div>
            <List.Item>
                <List.Item.Meta
                    avatar={<Avatar className="select-image" src={item.Image || defaultUser} />}
                    title={<span>{item.Firstname ? item.Firstname : item.Name}</span>}
                    description={item.Description ? <div className="f-12">{item.Description}</div> : ''}
                />
            </List.Item>
        </div>
    }
    render() {
        const { disabled, visible, initialValues, GroupTypeLu, TypeLu, groupObject, HiddenLu, InvitesLu, FriendsList } = this.state;
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        const { value } = this.state;
        return <Formik
            enableReinitialize
            initialValues={initialValues}
            innerRef={this.formRef}
            validate={(values) => this.handleValidate(values)}
        >
            {({ values, setFieldValue }) => {
                return (
                    <div className="main">
                        <Row gutter={24}>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <div className="coverpage">
                                    <img className="center-focus" src={groupObject.GroupCoverPic || defaultUser} alt="profilecover" />

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
                                                                <Avatar src={groupObject?.GroupImage || defaultUser}  onClick={() => this.setState({ isProfilePic: true })}/>
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
                                                            <Field
                                                                className="ant-input"
                                                                name="GroupName"
                                                                value={values.GroupName}
                                                                placeholder="Enter group name here"
                                                            />
                                                            <span className="validateerror">
                                                                <ErrorMessage name="GroupName" />
                                                            </span>
                                                        </Form.Item>
                                                    </Col>

                                                    <Col xs={24}>
                                                        <Form.Item
                                                            label="Group Type"
                                                            className="custom-fields custom-select"
                                                        >
                                                            <Select
                                                                defaultValue=""
                                                                name="GroupType"
                                                                value={values.GroupType}
                                                                onChange={(value) =>
                                                                    setFieldValue("GroupType", value)
                                                                }
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
                                                            <span className="validateerror">
                                                                <ErrorMessage name="GroupType" />
                                                            </span>
                                                        </Form.Item>

                                                    </Col>

                                                    <Col xs={12}>
                                                        <Form.Item
                                                            label="Choose Privacy"
                                                            className="custom-fields custom-select"
                                                        >
                                                            <Select
                                                                defaultValue=""
                                                                name="Type"
                                                                value={values.Type}
                                                                onChange={(value) =>
                                                                    setFieldValue("Type", value)
                                                                }
                                                                optionLabelProp="label"
                                                            >
                                                                <Option value="" label="Select Type">Select Type</Option>
                                                                {TypeLu.map((item, index) => {
                                                                    return (
                                                                        <Option key={index} value={item.Name} label={item.Name}>
                                                                            {this.renderSelectItem(item)}
                                                                        </Option>
                                                                    );
                                                                })}
                                                            </Select>
                                                            <span className="validateerror">
                                                                <ErrorMessage name="Type" />
                                                            </span>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={12}>
                                                        <Form.Item
                                                            label="Invite Friends (optional)"
                                                            className="custom-fields multi-select custom-select "
                                                            placeholder="Select Invitee"
                                                        >
                                                            <Select
                                                                defaultValue=""
                                                                name="Invitations"
                                                                value={values.Invitations}
                                                                onChange={(value) =>
                                                                    setFieldValue("Invitations", value)
                                                                }
                                                                optionLabelProp="label"
                                                                mode="multiple"
                                                            >
                                                                {FriendsList.map((item, index) => {
                                                                    return (
                                                                        <Option key={index} value={item.UserId} label={item.Firstname}>
                                                                            {this.renderSelectItem(item)}
                                                                        </Option>
                                                                    );
                                                                })}
                                                            </Select>
                                                            <span className="validateerror">
                                                                <ErrorMessage name="Invitations" />
                                                            </span>
                                                        </Form.Item>
                                                    </Col>
                                                    {values.Type == 'Private' && <Col xs={12}>
                                                        <Form.Item
                                                            label="Hide Group"
                                                            className="custom-fields custom-select"
                                                        >
                                                            <Select
                                                                defaultValue=""
                                                                name="Hide"
                                                                value={values.Hide}
                                                                onChange={(value) =>
                                                                    setFieldValue("Hide", value)
                                                                }
                                                                optionLabelProp="label"
                                                            >
                                                                <Option value="" label="Select Type">Select Type</Option>
                                                                {HiddenLu.map((item, index) => {
                                                                    return (
                                                                        <Option key={index} value={item.Name} label={item.Name}>
                                                                            {this.renderSelectItem(item)}
                                                                        </Option>
                                                                    );
                                                                })}
                                                            </Select>
                                                            <span className="validateerror">
                                                                <ErrorMessage name="Hide" />
                                                            </span>
                                                        </Form.Item>
                                                    </Col>
                                                    }
                                                    <Col xs={24}>
                                                        <Form.Item label="Location" className="custom-fields">
                                                            <Field
                                                                className="ant-input"
                                                                name="Location"
                                                                value={values.Location}
                                                                placeholder="Add a Location to your group"
                                                            />
                                                            <span className="validateerror">
                                                                <ErrorMessage name="Location" />
                                                            </span>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Row gutter={24}>
                                                    <Col xs={24}>
                                                        <Form.Item label="Description" className="custom-fields">
                                                            <Field
                                                                className="ant-input"
                                                                name="Description"
                                                                type="textarea"
                                                                value={values.Description}
                                                                placeholder="Autosize height with minimum and maximum number of lines"
                                                            />
                                                            <span className="validateerror">
                                                                <ErrorMessage name="Description" />
                                                            </span>
                                                        </Form.Item>
                                                    </Col>
                                                    <div className="">
                                                        <Button
                                                            key="submit"
                                                            type="primary"
                                                            htmlType="submit"
                                                            onClick={() => this.handleSave()}
                                                        >
                                                            Save
            </Button>
                                                    </div>,
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
                )
            }}
        </Formik>
    }
}

const mapStateToProps = ({ oidc }) => {
    return { user: oidc.user, profile: oidc.profile }
}
export default connect(mapStateToProps)(CreateGroup);