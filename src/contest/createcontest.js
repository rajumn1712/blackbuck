import React, { Component, createRef } from 'react';
import { Row, Col, Card, Avatar, Tooltip, Slider, List, Upload, Image, Form, Select, DatePicker, message, Input } from 'antd';
import CommonModal from '../components/ProfileComponents/CommonModal';
import { saveContest, fetchUserFriends, editContest, saveNotification } from '../shared/api/apiServer';
import { connect } from 'react-redux';
import notify from '../shared/components/notification';
import ImgCrop from 'antd-img-crop';
import defaultUser from '../styles/images/defaultuser.jpg';
import { uuidv4 } from "../utils";
import Loader from "../common/loader";
import defaultCover from '../styles/images/defaultcover.png'
import moment from 'moment';
const { Option } = Select;
const { TextArea } = Input;

class CreateContest extends Component {
    formRef = createRef();
    contestObj = {
        ContestId: "",
        ContestName: "",
        StartDate: "",
        EndDate: "",
        CoverPic: "",
        PrivacyType: "",
        Description: "",
        AdminUsers: null,
        CreatedDate: "",
        Members: [],
        ContestLink: []
    }

    imageObject = {};
    getContestObject = (id) => {
        editContest(id, this.props?.profile.Id).then(res => {
            this.setInitialvalues(res.data[0].Group);
            let { contestObj } = this.state;
            contestObj = res.data[0].Group;
            this.setState({ ...this.state, contestObj });
        });
    }
    setInitialvalues = (initialValues) => {
        let { contestObj } = this.state;
        contestObj.ContestName = initialValues.ContestName;
        contestObj.PrivacyType = initialValues.PrivacyType;
        contestObj.Description = initialValues.Description;
        contestObj.ContestLink = initialValues.ContestLink;
        contestObj.StartDate = initialValues.StartDate;
        contestObj.EndDate = initialValues.EndDate;
        this.setState({ ...this.state, contestObj });
        this.formRef.current.setFieldsValue({ ...contestObj })
    }
    state = {
        disabled: false,
        visible: false,
        loading: false,
        contestObj: this.contestObj,
        TypeLu: [
            {
                Name: "Public",
                Icon: "icons public-icon",
                Description: "Anyone can see who's in the group and what they post.",
                SubType: "General"

            }
        ],
    };
    createObject = (values) => {
        let { contestObj } = this.state;
        return {
            ContestId: contestObj.ContestId ? contestObj.ContestId : uuidv4(),
            ContestName: values.ContestName,
            PrivacyType: values.PrivacyType ? values.PrivacyType : "",
            CoverPic: contestObj.CoverPic ? contestObj.CoverPic : "",
            StartDate: contestObj.StartDate ? contestObj.StartDate : "",
            EndDate: contestObj.EndDate ? contestObj.EndDate : "",
            Description: values.Description,
            AdminUsers: contestObj.AdminUsers ? contestObj.AdminUsers : [{
                "UserId": this.props?.profile?.Id,
                "Firstname": this.props?.profile?.FirstName,
                "Lastname": this.props?.profile?.LastName,
                "Image": this.props?.profile?.ProfilePic,
                "Email": this.props?.profile?.Email
            }],
            CreatedDate: contestObj.CreatedDate ? new Date(contestObj.CreatedDate) : new Date(),
            Members: contestObj.Members ? contestObj.Members : [],
            ContestLink: contestObj.ContestLink ? contestObj.ContestLink : [],
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
        let { contestObj } = this.state;
        contestObj.CoverPic = this.imageObject.ImageUrl;
        this.imageObject = {};
        this.setState({ ...this.state, contestObj: contestObj });

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
        this.imageObject = {};
        fetchUserFriends((this.props.userId ? this.props.userId : (this.props?.profile?.Id)))
            .then(res => {
                const friendsInfo = res.data;
                this.setState({ ...this.state, FriendsList: friendsInfo });
            })
        if (this.props.contestId) {
            this.getContestObject(this.props.GroupId)
        }
    }
    componentWillUnmount() {
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
        let { contestObj } = this.state;
        contestObj[prop] = val ? (val.currentTarget ? val.currentTarget.value : val) : "";
        this.setState({ ...this.state, contestObj });
    }

    handleSave = async (e) => {
        this.formRef.current.validateFields().then((values) => {
            //  this.formRef.current.resetFields();
            this.groupSave();
        });
    };
    groupSave = async () => {
        let { contestObj } = this.state;
        let notificationArray = [];
        this.setState({ ...this.state, loading: true });
        const saveObj = this.createObject(contestObj);
        const response = await saveContest(saveObj);
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
        const { disabled, visible, GroupTypeLu, TypeLu, contestObj, HiddenLu, FriendsList, loading } = this.state;
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
                        <img className="center-focus" src={contestObj.CoverPic || defaultCover} alt="profilecover" />
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
                        <Card className="group-banner w-btn mt-0" >
                            <div className="my-16">
                                <Form layout="vertical" initialValues={{ ...contestObj }} on scrollToFirstError={true} ref={this.formRef} >
                                    <Row gutter={24}>
                                        <Col xs={24}>
                                            <Form.Item label="Contest Name" name="ContestName" className="custom-fields" rules={[{ required: true, message: "Name  required" }]}>
                                                <Input placeholder="Name" onChange={(value) => this.handleChange('ContestName', value)} maxLength={150} autoComplete="off" />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                            <label className="text-secondary d-block mb-4  required">Start Date</label>
                                            <Form.Item className="custom-fields" name="StartDate" rules={[{
                                                required: true, message: "Start date required"
                                            }, {
                                                type: "date", validator: async (rule, value, callback) => {
                                                    if (value && contestObj.EndDate) {
                                                        if (new Date(value) > new Date(contestObj.EndDate)) {
                                                            throw new Error("Start Date should grater than end date")
                                                        } else {
                                                            callback();
                                                        }
                                                    }
                                                }
                                            }]}>
                                                <DatePicker placeholder="Start Date" onChange={(val) => { this.handleChange("Date", val) }} format="DD/MM/YYYY HH:mm:ss" disabledDate={(current) => {
                                                    return (
                                                        moment().add(-1, "days") >= current
                                                    );
                                                }} showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }} />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                            <label className="text-secondary d-block mb-4  required">End Date</label>
                                            <Form.Item className="custom-fields" name="EndDate" rules={[{
                                                required: true, message: "End date required"
                                            }, {
                                                type: "date", validator: async (rule, value, callback) => {
                                                    if (value && contestObj.StartDate) {
                                                        if (new Date(value) < new Date(contestObj.StartDate)) {
                                                            throw new Error("End Date should later than start date")
                                                        } else {
                                                            callback();
                                                        }
                                                    }
                                                }
                                            }]}>
                                                <DatePicker placeholder="End Date" onChange={(val) => { this.handleChange("EndDate", val) }} format="DD/MM/YYYY HH:mm:ss" disabledDate={(current) => {
                                                    return (
                                                        moment().add(-1, "days") >= current
                                                    );
                                                }} showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }} />
                                            </Form.Item>
                                        </Col>

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
                                                    {TypeLu.map((item, index) => {
                                                        return (
                                                            <Option key={index} value={item.Name} label={item.Name}>
                                                                {this.renderSelectItem(item)}
                                                            </Option>
                                                        );
                                                    })}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                            <label className="text-secondary d-block mb-4 required">Contest Links</label>
                                            <Form.Item className="custom-fields custom-multiselect" name="ContestLink" rules={[{
                                                required: true,
                                                type: 'array',
                                                defaultField: { type: 'url', message: 'This field must be a valid url.' }
                                            }]
                                            }>
                                                <Select

                                                    mode="tags"
                                                    style={{ width: "100%" }}
                                                    placeholder="Enter Links"
                                                    onChange={(value) => this.handleChange('ContestLink', value)}
                                                ></Select>
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
                                    <Image src={contestObj.GroupImage} />
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
export default connect(mapStateToProps)(CreateContest);