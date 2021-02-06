import React, { Component, createRef } from 'react';
import { Row, Col, Card, Avatar, Tooltip, Slider, List, Button, message, Upload, Image, Form, Select } from 'antd';
import './groupstyle.css';
import CommonModal from '../components/ProfileComponents/CommonModal';
import { saveGroup, fetchUserFriends, editGroup } from '../shared/api/apiServer';
import { connect } from 'react-redux';
import notify from '../shared/components/notification';
import ImgCrop from 'antd-img-crop';
import defaultUser from '../styles/images/defaultuser.jpg';
import { ErrorMessage, Field, Formik } from "formik";
import { hasChanged, uuidv4 } from "../utils";
import Loader from "../common/loader";
import defaultCover from '../styles/images/defaultcover.png'
import defaultguser from '../styles/images/default-cover.png';
const { Option } = Select;

class CreateGroup extends Component {
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
        Categories:[]
    }
    formRef = createRef();

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
        this.formRef.current.values.GroupName = initialValues.GroupName;
        this.formRef.current.values.GroupType = initialValues.GroupType;
        this.formRef.current.values.Type = initialValues.Type;
        this.formRef.current.values.Location = initialValues.Location;
        this.formRef.current.values.Description = initialValues.Description;
        initialValues.Invitations.forEach(val => {
            this.formRef.current.values.Invitations.push(val.FriendId)
        })
    }
    state = {
        GroupTypeLu: ["IT Group", "Science Group ", "Learning Group"],
        TypeLu: [
            {
                Name: "Public",
                Icon: "icons public-icon",
                Description: "Anyone can see who's in the group and what they post."

            },
            {

                Name: "Private",
                Icon: "icons private-icon",
                Description: "Only members can see who's in the group and what they post."
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
        initialValues: {
            GroupName: this.groupObject.GroupName,
            GroupType: this.groupObject.GroupType,
            Type: this.groupObject.Type,
            Location: this.groupObject.Location,
            Description: this.groupObject.Description,
            Invitations: this.groupObject.Invitations,
            Hide: this.groupObject.Hide,
        },
    };
    createObject = (values) => {
        let { groupObject } = this.state;
        let InvitesArray = [];
        values.Invitations.forEach(item => {
            InvitesArray.push({ UserName: this.props?.profile.FirstName, FriendId: item, Image: this.props?.profile.ProfilePic, CreatedDate:new Date()})
        });
        return {
            GroupName: values.GroupName,
            GroupType: values.GroupType,
            GroupImage: groupObject.GroupImage,
            GroupCoverPic: groupObject.GroupCoverPic,
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
            Categories:[],
            CourseSections:[]
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
        action: process.env.REACT_APP_AUTHORITY +'/Home/UploadFile',
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

    handleSave = async (e) => {
        this.formRef.current.handleSubmit();
        if (!hasChanged(this.formRef.current.values)) {
            this.setState({ ...this.state, loading: true });
            const saveObj = this.createObject(this.formRef.current.values);
            const response = await saveGroup(saveObj);
            if (response.ok) {
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
                <List.Item.Meta className="privacy-dropdown sample-check"
                    avatar={item.Icon ? <span className={item.Icon}></span> : <Avatar className="select-image" src={item.Image || defaultUser} />}
                    title={<span>{item.Firstname ? item.Firstname : item.Name}</span>}
                    description={item.Description ? <div className="f-12" style={{wordBreak: 'break-word',whiteSpace: 'pre-wrap'}}>{item.Description}</div> : ''}
                />
            </List.Item>
        </div>
    }
    render() {
        const { disabled, visible, initialValues, GroupTypeLu, TypeLu, groupObject, HiddenLu, InvitesLu, FriendsList, loading } = this.state;
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        const { value } = this.state;
        return <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            innerRef={this.formRef}
            validate={(values) => this.handleValidate(values)}
        >
            {({ values, setFieldValue }) => {
                return (
                    <div className="main">
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
                                            <Form layout="vertical" >
                                                <Row gutter={24}>
                                                    <Col xs={24}>
                                                        <Form.Item label="Group Name" className="custom-fields" name="Group Name" rules={[{ required: true }]}>
                                                            <Field
                                                                className="ant-input"
                                                                name="GroupName"
                                                                value={values.GroupName}
                                                                placeholder="Enter group name here"
                                                                maxlength={150} 
                                                                autocomplete="off"
                                                            />
                                                            <span className="validateerror">
                                                                <ErrorMessage name="GroupName" />
                                                            </span>
                                                        </Form.Item>
                                                    </Col>

                                                    <Col xs={24} id="groupType">
                                                        <Form.Item
                                                            label="Group Type"
                                                            className="custom-fields custom-select" name="Group Type" rules={[{ required: true }]}
                                                        >
                                                            <Select
                                                                defaultValue=""
                                                                name="GroupType"
                                                                value={values.GroupType}
                                                                onChange={(value) =>
                                                                    setFieldValue("GroupType", value)
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
                                                            <span className="validateerror">
                                                                <ErrorMessage name="GroupType" />
                                                            </span>
                                                        </Form.Item>

                                                    </Col>

                                                    <Col xs={12} id="type">
                                                        <Form.Item
                                                            label="Choose Privacy"
                                                            className="custom-fields custom-select" name="Choose Privacy" rules={[{ required: true }]}
                                                        >
                                                            <Select
                                                                defaultValue=""
                                                                name="Type"
                                                                value={values.Type}
                                                                onChange={(value) =>
                                                                    setFieldValue("Type", value)
                                                                }
                                                                optionLabelProp="label"
                                                                getPopupContainer={() => document.querySelector('#type')}
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
                                                    <Col xs={12} id="inviteFrnd1">
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
                                                            <span className="validateerror">
                                                                <ErrorMessage name="Invitations" />
                                                            </span>
                                                        </Form.Item>
                                                    </Col>
                                                    {values.Type == 'Private' && <Col xs={12}>
                                                        <Form.Item
                                                            label="Hide Group"
                                                            className="custom-fields custom-select" name="Hide Group" rules={[{ required: true }]}
                                                        >
                                                            <Select
                                                                defaultValue="Visible"
                                                                name="Hide"
                                                                value={values.Hide}
                                                                onChange={(value) =>
                                                                    setFieldValue("Hide", value)
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
                                                            <span className="validateerror">
                                                                <ErrorMessage name="Hide" />
                                                            </span>
                                                        </Form.Item>
                                                    </Col>
                                                    }
                                                    <Col xs={24}>
                                                        <Form.Item label="Location" className="custom-fields" name="Location" rules={[{ required: true }]}>
                                                            <Field
                                                                className="ant-input"
                                                                name="Location"
                                                                value={values.Location}
                                                                placeholder="Add a Location to your group"
                                                                autocomplete="off"
                                                                maxlength={100}
                                                            />
                                                            <span className="validateerror">
                                                                <ErrorMessage name="Location" />
                                                            </span>
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Row gutter={24}>
                                                    <Col xs={24}>
                                                        <Form.Item label="Description" className="custom-fields" name="Description" rules={[{ required: true }]}>
                                                            <Field
                                                                className="ant-input"
                                                                name="Description"
                                                                type="textarea"
                                                                as="textarea"
                                                                autoSize={{ minRows: 3, maxRows: 20 }}
                                                                maxlength={1360}
                                                                autocomplete="off"
                                                                value={values.Description}
                                                                placeholder="Autosize height with minimum and maximum number of lines"
                                                            />
                                                            <span className="validateerror">
                                                                <ErrorMessage name="Description" />
                                                            </span>
                                                        </Form.Item>
                                                    </Col>
                                                    {/* <div className="">
                                                        <Button
                                                            key="submit"
                                                            type="primary"
                                                            htmlType="submit"
                                                            onClick={() => this.handleSave()}
                                                        >
                                                            Save
                                                        </Button>
                                                    </div> */}
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