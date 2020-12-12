import React, { Component ,createRef} from 'react';
import { Row, Col, Tabs, Card, Avatar, Tooltip, Slider, List, Button, message, Upload, Image, Form, Input, Radio, Checkbox } from 'antd';
import './groupstyle.css';
import CommonModal from '../components/ProfileComponents/CommonModal';
import { profileDetail, joinGroup, saveProfileImage, saveGroup } from '../shared/api/apiServer';
import { connect } from 'react-redux';
import notify from '../shared/components/notification';
import ImgCrop from 'antd-img-crop';
import defaultUser from '../styles/images/defaultuser.jpg';
import { ErrorMessage, Field, Formik } from "formik";
import { hasChanged, uuidv4 } from "../utils";
const { Meta } = Card;

const { TabPane } = Tabs;
const data = [
    { title: 'Programmers' }
];
const options = [
    { label: 'Allow members to invite their connections', value: 'Allow members to invite their connections' },
    { label: 'Require new posts to be reviewed by admins', value: 'Require new posts to be reviewed by admins' },
];
function onChange(checkedValues) {
    console.log('checked = ', checkedValues);
}
const { TextArea } = Input;
const groupObject = {
    GroupName: "",
    GroupType: "",
    ProfilePic: "",
    CoverPic: "",
    Privacy: "",
    Location: "",
    Description: "",
    Hide: "",
    InvitationsList: ["Ramu", "Somu"],
    GroupId: "",
    UserId: "",
    Admins: []
}
class CreateGroup extends Component {
    formRef = createRef();

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
        visible: false,
        groupObject: groupObject,
        initialValues: {
            GroupName: groupObject.GroupName,
            GroupType: groupObject.GroupType,
            Privacy: groupObject.Privacy,
            Location: groupObject.Location,
            Description: groupObject.Description,
            Hide: groupObject.Hide,
            InvitationsList: groupObject.InvitationsList,
        },
    };
    createObject = (values) => {
        return {
            GroupName: values.GroupName,
            GroupType: values.GroupType,
            ProfilePic: values.ProfilePic,
            CoverPic: values.CoverPic,
            Privacy: values.Privacy,
            Location: values.Location,
            Description: values.Description,
            Hide: values.Hide,
            InvitationsList: values.InvitationsList,
            GroupId: values.GroupId,
            UserId: groupObject.UserId,
            Admins: values.Admins,
        };
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

    handleSave = (e) => {
        debugger;
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
    render() {
        const { disabled, visible, groupData, initialValues } = this.state;
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
                                                        <Form.Item label="Group Type" className="custom-fields">
                                                            <Field
                                                                className="ant-input"
                                                                name="GroupType"
                                                                value={values.GroupType}
                                                                placeholder="Ex: IT GRoup"
                                                            />
                                                            <span className="validateerror">
                                                                <ErrorMessage name="GroupType" />
                                                            </span>
                                                        </Form.Item>
                                                    </Col>

                                                    <Col xs={12}>
                                                        <Form.Item label="Choose Privacy" className="custom-fields">
                                                            <Field
                                                                className="ant-input"
                                                                name="Privacy"
                                                                value={values.Privacy}
                                                            />
                                                            <span className="validateerror">
                                                                <ErrorMessage name="Privacy" />
                                                            </span>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={12}>
                                                        <Form.Item label="Invite Friends (optional)" className="custom-fields">
                                                            <Field
                                                                className="ant-input"
                                                                name="InvitationsList"
                                                                value={values.InvitationsList}
                                                            />
                                                            <span className="validateerror">
                                                                <ErrorMessage name="InvitationsList" />
                                                            </span>
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xs={12}>
                                                        <Form.Item label="Hide Group" className="custom-fields">
                                                            <Field
                                                                className="ant-input"
                                                                name="Hide"
                                                                value={values.Hide}
                                                            />
                                                            <span className="validateerror">
                                                                <ErrorMessage name="Hide" />
                                                            </span>
                                                        </Form.Item>

                                                    </Col>
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
            }}
        </Formik>
    }
}

const mapStateToProps = ({ oidc }) => {
    return { user: oidc.user, profile: oidc.profile }
}
export default connect(mapStateToProps)(CreateGroup);