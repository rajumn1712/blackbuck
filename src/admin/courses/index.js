import React, { useState, useEffect, useRef } from 'react';
import { Card, Input, Row, Col, Button, Select, Collapse, Space, message, Upload, Table, Statistic, DatePicker, Modal, InputNumber, Form, Tooltip, Image } from 'antd';
import { withRouter } from "react-router-dom";
import Title from 'antd/lib/typography/Title';
import '../../styles/theme.css';
import { ArrowUpOutlined, PlusOutlined, InboxOutlined } from '@ant-design/icons';
import connectStateProps from '../../shared/stateConnect';
import { getCollegeBranches, getAuthors, saveTopic, sectionDeletion, saveSection, saveCourse, getCourse } from '../../shared/api/apiServer';
import notify from '../../shared/components/notification';
import { values } from 'lodash';
import { uuidv4 } from '../../utils';
import Loader from "../../common/loader";
import { Link } from "react-router-dom";
import video from '../../styles/images/video.mp4';
import Courses from './Courses';
// import ytdl from 'youtube.get-video-info'
const { Meta } = Card;
const { Panel } = Collapse;
const { Option } = Select;
const { Dragger } = Upload;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const uploadButton = (
    <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
    </div>
);
const data = [
    {
        key: '1',
        name: 'Introduction.mp4',
        type: 'Video',
        size: '50KB',
    },
    {
        key: '2',
        name: 'Learn how to code from scratch.mp4',
        type: 'Video',
        size: '25KB',
    }
];

const topicTitle = (
    <span className="left-menu play mr-4"></span>
)

const AdminCourses = ({ profile }) => {
    const obj = {
        "TopicId": "",
        "Title": "",
        "Description": "",
        "ThumbNails": [],
        "VideoSource": "Upload",
        "VideoName": "",
        "VideoUrl": [],
        "Duration": "03:05:00",
        "Size": ""
    }
    const sectionObj = {
        "SectionId": uuidv4(),
        "SectionName": "",
        "IsSaved": false,
        "Topics": [
        ]
    }

    const courseObj = {
        "GroupId": uuidv4(),
        "GroupName": "",
        "GroupImage": [],
        "Description": "",
        "Type": "Course",
        "Author": [],
        "CreatedDate": "",
        "CategoryType": "LMS",
        "CourseVideo": [],
        "AdminUsers": [{
            "UserId": profile?.Id,
            "Firstname": profile?.FirstName,
            "Lastname": profile?.LastName,
            "Image": profile?.ProfilePic,
            "Email": profile?.Email
        }
        ],
        "Categories": [
        ],
        "Members": [],
        "Invitations": [],
        "IsPublish": false,
        "CourseSections": [
        ]
    }
    let formRef = useRef();
    const TimeObj = { "Hours": "0", "Min": "0", "Sec": "0" };
    const [CategoriesLu, setCategoriesLu] = useState([]);
    const [AuthorsLu, setAuthorsLu] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [current, setCurrent] = React.useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [topicObj, setTopicObj] = useState({ ...obj });
    const [videoTimeObj, setVideoTimeObj] = useState({ ...TimeObj });
    const [topicEdit, setTopicEdit] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [secObj, setSecObj] = useState({ ...sectionObj });
    const [courseObject, setCourseObject] = useState({ ...courseObj });
    const [fileUploading, setFileUploading] = useState(false);
    const [secId, setSecId] = useState("");
    const [form] = Form.useForm();
    const [showGrid, setShowGrid] = useState(true);
    const [fileImgUploading, setFileImgUploading] = useState(false);
    const [fileVideoUploading, setFileVideoUploading] = useState(false);
    const [CoursesObj, setCoursesObj] = useState("");
    useEffect(() => {
        fetchBranches();
        fetchAuthors()
    }, []);
    const fetchBranches = async () => {
        const branchResponse = await getCollegeBranches();
        if (branchResponse.ok) {
            setCategoriesLu(branchResponse.data);
        } else {
            notify({ message: "Error", type: "error", description: "Something went wrong :)" })
        }
    }
    const fetchAuthors = async () => {
        const branchResponse = await getAuthors();
        if (branchResponse.ok) {
            setAuthorsLu(branchResponse.data);
        } else {
            notify({ message: "Error", type: "error", description: "Something went wrong :)" })
        }
    }

    const props = {
        name: 'file',
        multiple: false,
        accept: ".mp4,.mpeg4,.mov,.flv,.avi,.mkv,.webm",
        action: process.env.REACT_APP_AUTHORITY + "/Home/UploadFile",
        onChange(info) {
            setFileUploading(true);
            const { status } = info.file;
            if (status === 'done') {
                setFileUploading(false);
                topicObj.VideoUrl = info.file.response;
                topicObj.VideoName = info.file.name;
                topicObj.Size = info.file.size;
                setTopicObj({ ...topicObj });
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    const onCourseEditObj = (id) => {
        setShowForm(true);
        courseObject.GroupId = id;
        setCourseObject({ ...courseObject })
        refreshCourseDetails(true);
    }
    const deleteSection = async (item) => {
        if (!item.IsSaved) {
            courseObject.CourseSections = courseObject.CourseSections.filter(sec => sec.SectionId
                !== item.SectionId);
            setCourseObject({ ...courseObject });
        }
        else {
            const result = await sectionDeletion(topicObj, courseObject.GroupId, item.SectionId);
            if (result.ok) {
                notify({ message: "Section", description: "Section deleted successfully" });
            }
            else {
                notify({ message: "Error", type: "error", description: "Something went wrong :)" });
            }
        }
    }
    const handleVidoTimeChange = (prop, val) => {
        videoTimeObj[prop] = val.currentTarget ? val.currentTarget.value : val;
        setVideoTimeObj({ ...videoTimeObj }, () => {

        })
        topicObj.Duration = videoTimeObj["Hours"] + ":" + videoTimeObj["Min"] + ":" + videoTimeObj["Sec"];
        setTopicObj({ ...topicObj });
    }
    const refreshCourseDetails = async () => {
        const branchResponse = await getCourse(courseObject.GroupId);
        if (branchResponse.ok) {
            bindCourseData(branchResponse.data[0])
        } else {
            notify({ message: "Error", type: "error", description: "Something went wrong :)" })
        }
    }
    const bindCourseData = (obj) => {
        let ObjCourse = { ...obj }
        ObjCourse.Author = [];
        ObjCourse.Categories = [];
        obj.Author.forEach(item => {
            ObjCourse.Author.push(item.UserId)
        });
        obj.Categories.forEach(item => {
            ObjCourse.Categories.push(item.BranchId)
        });
        setCourseObject({ ...obj });
        form.setFieldsValue({ ...ObjCourse })
        setShowForm(true);
    }
    const topicSave = async () => {
        if (topicObj.ThumbNails?.length == 0) {
            setIsError(true);
            setErrorMessage("Feature image required");
            formRef.current.scrollTop = 0;
            return;
        }
        if (topicObj.VideoUrl?.length == 0) {
            setIsError(true);
            setErrorMessage("Video source/video required");
            formRef.current.scrollTop = 0;
            return;
        }
        // if (topicObj.VideoSource == "YouTube") {
        //     var video_id = topicObj.VideoUrl.split('v=')[1];
        //     var ampersandPosition = video_id.indexOf('&');
        //     if (ampersandPosition != -1) {
        //         video_id = video_id.substring(0, ampersandPosition);
        //     }
        //     ytdl.retrieve(video_id, function (err, res) {
        //         topicObj.VideoName = res.name;
        //         topicObj.Size = res.size;
        //         setTopicObj({ ...topicObj });
        //         saveTopicUpdate();
        //     });
        //     return;
        // }
        // else {
        saveTopicUpdate();
        // }
    }
    const saveTopicUpdate = async () => {
        const result = await saveTopic(topicObj, courseObject.GroupId, secId);
        if (result.ok) {
            setIsModalVisible(false);
            refreshCourseDetails();
            notify({ message: "Topic", description: "Topic saved successfully" });
        }
        else {
            notify({ message: "Error", type: "error", description: "Something went wrong :)" });
        }
    }
    const coursSave = async () => {
        courseObject.CreatedDate = courseObject.CreatedDate ? courseObject.CreatedDate : new Date();
        const result = await saveCourse(courseObject);
        if (result.ok) {
            notify({ message: "Course", description: "Course saved successfully" });
            setCourseObject({ ...courseObj });
            setShowForm({ ...false })
            CoursesObj.refresh();
            form.resetFields();
        }
        else {
            window.scrollTo(0, 0);
            notify({ message: "Error", type: "error", description: "Something went wrong :)" });
        }

    }
    const getTopicsTime = (items) => {
        let time = "00:00:00";
        items.forEach(item => {
            time = sumTime(time, item.Duration);
        })
        time = time.split(":");
        return time[0] + "h" + time[1] + "m" + time[2] + "s";
    }
    function sumTime(t1, t2, array = []) {
        var times = [3600, 60, 1],
            sum = [t1, t2, ...array]
                .map(s => s.split(':').reduce((s, v, i) => s + times[i] * v, 0))
                .reduce((a, b) => a + b, 0);

        return times
            .map(t => [Math.floor(sum / t), sum %= t][0])
            .map(v => v.toString().padStart(2, 0))
            .join(':');
    }
    const cancelCourse = () => {
        form.resetFields();
        setCourseObject({ ...courseObj });
        setShowGrid(true);
        setShowForm(false)
    }
    const handleChange = (prop, val, popup) => {
        if (!popup) {
            if (prop != "Categories" && prop != "Author") {
                courseObject[prop] = val.currentTarget ? val.currentTarget.value : val;
            }
            else {
                courseObject[prop] = [];
                (prop == "Categories" ? val : [val]).forEach(item => {
                    (prop == "Categories" ? CategoriesLu : AuthorsLu).forEach(obj => {
                        if (item == (prop == "Categories" ? obj.BranchId : obj.UserId)) {
                            let Object = prop == "Categories" ? {
                                "BranchId": obj.BranchId,
                                "Name": obj.BranchName,
                            } : {
                                    "UserId": obj.UserId,
                                    "Firstname": obj.Firstname,
                                    "Lastname": obj.Lastname,
                                    "Image": obj.Image,
                                    "Email": obj.Email,
                                }

                            courseObject[prop].push({ ...Object });
                        }
                    });
                });
            }
            setCourseObject({ ...courseObject })
        }
        else {
            topicObj[prop] = val.currentTarget ? val.currentTarget.value : val;
            setTopicObj({ ...topicObj })
        }
    }
    const secItemsChange = (prop, val, index) => {
        secObj[prop] = val.currentTarget ? val.currentTarget.value : val;
        setSecObj({ ...secObj })
        courseObject.CourseSections[index][prop] = val.currentTarget ? val.currentTarget.value : val;
        setCourseObject({ ...courseObject });
    }
    const sectionSave = async () => {
        // if (secObj.Topics?.length == 0) {
        //     notify({ message: "Warn", type: "error", description: "Atleast one topic required" });
        //     return;
        // }
        const result = await saveSection(secObj, courseObject.GroupId);
        if (result.ok) {
            secObj.IsSaved = true;
            courseObject.CourseSections.forEach(item => {
                if (item.SectionId == secObj.SectionId) {
                    item = secObj;
                }
            });
            setCourseObject({ ...courseObject });
            notify({ message: "Section", description: "Section saved successfully" });
        }
        else {
            notify({ message: "Error", type: "error", description: "Something went wrong :)" });
        }
    }
    const addSection = () => {
        if (courseObject.CreatedDate) {
            courseObject.CourseSections.push(secObj);
            setCourseObject({ ...courseObject });
        }
        else {
            notify({ message: "Error", type: "error", description: "Please save course" });
        }
    }
    const deleteImage = () => {
        topicObj.ThumbNails = [];
        setTopicObj({ ...topicObj })
    }

    const onChange = (info) => {
        const { status } = info.file;
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
            topicObj.ThumbNails = info.fileList[0].response;
            setTopicObj({ ...topicObj });
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    }
    const showModal = (type, topic, sectionId) => {
        setSecId(sectionId);
        if (type == 'Edit') {
            setTopicObj({ ...topic })
            setTopicEdit(true);
        }
        else {
            obj.TopicId = uuidv4();
            setTopicObj({ ...obj })
            setTopicEdit(false);
        }
        setIsModalVisible(true);
    };
    const handleCancel = () => {
        setTopicObj({ ...obj })
        setIsModalVisible(false);
    };

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };
    const { Dragger } = Upload;
    return (<>
        <Row gutter={12} className="mb-12">
            <Col span={4}>
                <Card className="admin-kpi-card">
                    <Statistic
                        title="Members"
                        value={600}
                        valueStyle={{ color: 'var(--textprimary)' }}
                        prefix={<ArrowUpOutlined />}
                    />
                </Card>
            </Col>
            {/* <Col span={4}>
                <Card className="admin-kpi-card">
                    <Statistic
                        title="Posts"
                        value={254}
                        valueStyle={{ color: 'var(--textprimary)' }}
                        prefix={<ArrowUpOutlined />}
                    />
                </Card>
            </Col> */}
            <Col span={4}>
                <Card className="admin-kpi-card">
                    <Statistic
                        title="Courses"
                        value={21}
                        valueStyle={{ color: 'var(--textprimary)' }}
                        prefix={<ArrowUpOutlined />}
                    />
                </Card>
            </Col>
            {/* <Col span={4}>
                <Card className="admin-kpi-card">
                    <Statistic
                        title="Groups"
                        value={50}
                        valueStyle={{ color: 'var(--textprimary)' }}
                        prefix={<ArrowUpOutlined />}
                    />
                </Card>
            </Col> */}
            <Col span={4}>
                <Card className="admin-kpi-card">
                    <Statistic
                        title="Shares"
                        value={45}
                        valueStyle={{ color: 'var(--textprimary)' }}
                        prefix={<ArrowUpOutlined />}
                    />
                </Card>
            </Col>
            <Col span={4}>
                <Card className="admin-kpi-card">
                    <Statistic
                        title="Interships"
                        value={14}
                        valueStyle={{ color: 'var(--textprimary)' }}
                        prefix={<ArrowUpOutlined />}
                    />
                </Card>
            </Col>
        </Row>
        <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                <div className="custom-card mb-16">
                    <Card className="start-course">
                        <Row align="middle" className="p-16">
                            <Col xs={18} sm={18} md={18} lg={18} xl={18} xxl={18} className="pr-16">
                                <Title level={3} className="normalbold text-white">Get Started with the course</Title>
                                <p className="f-14 text-white mb-0">Whether you've been teaching for years or are teaching for the first time, you can make an engaging course. We've compiled resources and best practices to help you get to the next level, no matter where you're starting.</p>
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6} className="text-right">
                                <Button type="dashed" onClick={() => { setShowForm(true) }}>Create Course</Button>
                            </Col>
                        </Row>
                    </Card>
                </div>
                {showForm && <Form initialValues={{ ...courseObj }} onFinishFailed={() => { }} onFinish={() => coursSave()} scrollToFirstError={true} form={form} >

                    <Row>
                        <Col offset={4} xs={16} sm={16} md={16} lg={16} xl={16} xxl={16} className="course-steps">
                            <div className="text-center my-16 pb-16">
                                <Title level={1} className="normalbold text-primary">Get Started with the course</Title>
                                <p className="f-14 text-secondary">Whether you've been teaching for years or are teaching for the first time, you can make an engaging course. We've compiled resources and best practices to help you get to the next level, no matter where you're starting.</p>
                            </div>
                            <Row>
                                <Col offset={1} xs={20} sm={22} md={22} lg={22} xl={22} xxl={22}>
                                    <div className="create-course">
                                        <div className="custom-fields">
                                            <label className="text-secondary d-block mb-4">Course Title</label>
                                            <Form.Item name="GroupName" rules={[{ required: true, message: "Course Title  required" }]}>
                                                <Input placeholder="e.g. Learn how to code from scratch" onChange={(value) => handleChange('GroupName', value)} />
                                            </Form.Item>
                                        </div>
                                        <div className="custom-fields">
                                            <label className="text-secondary d-block mb-4">Course Description</label>
                                            <Form.Item name="Description" rules={[{ required: true, message: "Description  required" }]}>
                                                <TextArea onResize onChange={(value) => handleChange('Description', value)}
                                                    autoSize={{ minRows: 3, maxRows: 30 }}
                                                />
                                            </Form.Item>
                                        </div>
                                        <Row gutter={16}>
                                            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className="multi-select custom-fields">
                                                <label className="text-secondary d-block mb-4">Choose Category</label>
                                                <Form.Item name="Categories" rules={[{ required: true, message: "Categories  required" }]}>
                                                    <Select
                                                        placeholder="Choose a Category" className="text-left"
                                                        onChange={(value) => handleChange('Categories', value)}
                                                        mode="multiple"
                                                    >
                                                        {CategoriesLu?.map((item, index) => {
                                                            return <Option value={item.BranchId} key={index}>{item.BranchName}</Option>
                                                        })}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12} className="custom-fields">
                                                <label className="text-secondary d-block mb-4">Author Name</label>
                                                <Form.Item name="Author" rules={[{ required: true, message: "Author  required" }]} onChange={(value) => handleChange('Author', value)}>
                                                    <Select
                                                        defaultValue="Choose Author" placeholder="Choose Author" className="text-left"
                                                        onChange={(value) => handleChange('Author', value)}
                                                    >
                                                        <Option value="">Choose Author</Option>
                                                        {AuthorsLu?.map((item, index) => {
                                                            return <Option value={item.UserId} key={index}>{item.Firstname}</Option>
                                                        })}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                                <div className="text-secondary">Course Image</div>
                                                <div className="mb-12">
                                                    <Dragger
                                                        className="upload"
                                                        {...props}
                                                        onChange={(info) => {
                                                            setFileImgUploading(true);
                                                            const { status } = info.file;
                                                            if (status === 'done') {
                                                                setFileImgUploading(false);
                                                                courseObject.GroupImage = info.file.response;
                                                                setCourseObject({ ...courseObject })
                                                                message.success(`${info.file.name} file uploaded successfully.`);
                                                            } else if (status === 'error') {
                                                                message.error(`${info.file.name} file upload failed.`);
                                                            }
                                                        }}
                                                        accept=".jpg,.jpeg,.png"
                                                        onRemove={() => {
                                                            courseObject.GroupImage = [];
                                                            setCourseObject({ ...courseObject })
                                                        }}
                                                        showUploadList={false}
                                                        disabled={fileImgUploading || courseObject.GroupImage.length > 0}
                                                    >
                                                        <span className="sharebox-icons photo-upload"></span>
                                                        <p className="ant-upload-text mt-8 mb-0">Upload Image</p>
                                                    </Dragger>
                                                    {fileImgUploading && <Loader className="loader-top-middle" />}
                                                    {courseObject.GroupImage?.map((image, indx) => (
                                                        <div key={indx} className="mb-16 upload-preview">
                                                            <Image src={image} />
                                                            <a
                                                                class="item-close"
                                                                onClick={() => {
                                                                    courseObject.GroupImage = [];
                                                                    setCourseObject({
                                                                        ...courseObject
                                                                    })
                                                                }}
                                                            >
                                                                <Tooltip title="Remove">
                                                                    <span className="close-icon"></span>
                                                                </Tooltip>
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            </Col>
                                            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                                <div className="text-secondary">Introduction video</div>
                                                <div className="mb-12">
                                                    <Dragger
                                                        className="upload"
                                                        {...props}
                                                        onRemove={() => {
                                                            courseObject.CourseVideo = [];
                                                            setCourseObject({ ...courseObject })
                                                        }}
                                                        onChange={(info) => {
                                                            setFileVideoUploading(true);
                                                            const { status } = info.file;
                                                            if (status === 'done') {
                                                                setFileVideoUploading(false);
                                                                courseObject.CourseVideo = info.file.response;
                                                                setCourseObject({ ...courseObject })
                                                                message.success(`${info.file.name} file uploaded successfully.`);
                                                            } else if (status === 'error') {
                                                                message.error(`${info.file.name} file upload failed.`);
                                                            }
                                                        }}
                                                        accept=".mp4,.mpeg4,.mov,.flv,.avi,.mkv,.webm"
                                                        showUploadList={false}
                                                        disabled={fileVideoUploading || courseObject.CourseVideo.length > 0}
                                                    >
                                                        <span className="sharebox-icons video-upload"></span>
                                                        <p className="ant-upload-text mt-8 mb-0">Upload Video</p>
                                                    </Dragger>
                                                    {fileVideoUploading && <Loader className="loader-top-middle" />}
                                                    {courseObject.CourseVideo?.map((image, indx) => (
                                                        <div key={indx} className="mb-16 upload-preview">
                                                            <video width="100%" controls>
                                                                <source src={image} />
                                                            </video>
                                                            <a
                                                                class="item-close"
                                                                onClick={() => {
                                                                    courseObject.CourseVideo = [];
                                                                    setCourseObject({
                                                                        ...courseObject
                                                                    })
                                                                }
                                                                }
                                                            >
                                                                <Tooltip title="Remove">
                                                                    <span className="close-icon"></span>
                                                                </Tooltip>
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            </Col>

                                        </Row>
                                    </div>
                                    <div className="create-course mt-16">
                                        <div className="f-18 add-course-section mb-16 p-12 text-center semibold cursor-pointer text-white" onClick={() => addSection()}>Add Course Section</div>
                                        {courseObject.CourseSections?.map((item, index) => {
                                            return <div> <div className="lecture-collapse mb-16" key={index}>
                                                <Collapse
                                                    className="mb-16"
                                                    expandIconPosition="right"
                                                >
                                                    <Panel header={item.SectionName} className="f-16 semibold text-primary" extra={<div className="f-16 text-secondary video-dur">{getTopicsTime(item.Topics)}</div>}>
                                                        {item.Topics?.map((topic) => {
                                                            return <Collapse
                                                                className="mb-8"
                                                                expandIconPosition="right"
                                                            >
                                                                <Panel header={<>{topicTitle} {item.Title}</>} className="f-16 semibold text-primary" extra={<div className="f-16 text-secondary subvideo-dur">{topic.Duration}</div>}>
                                                                    <div className="d-flex">
                                                                        <video width="280"><source src={topic.VideoUrl} /></video>
                                                                        <div className="ml-16">
                                                                            <p className="f-16 text-primary mb-4">{topic.VideoName}</p>
                                                                            <p className="f-14 text-secondary mb-8">{topic.Description}</p>
                                                                            <p className="f-12 text-primary">{topic.Duration} | {topic.Size}</p>
                                                                            <Button size="small" className="px-16" onClick={() => showModal('Edit', topic, item.SectionId)}>Edit Content</Button>
                                                                        </div>
                                                                    </div>
                                                                </Panel>
                                                            </Collapse>
                                                        })
                                                        }

                                                        <div onClick={() => showModal('Add', null, item.SectionId)} className="f-18 add-course-section mt-12 p-12 text-center semibold cursor-pointer text-white">Add Another Topic</div>
                                                    </Panel>
                                                </Collapse>
                                                <div className="add-lecture p-4" onClick={() => addSection()}><span className="icons add"></span></div>
                                            </div>
                                                <div className="lecture-collapse mb-16">
                                                    <div className="custom-fields entr-course-title p-12 mb-12">
                                                        <Form id="secForm" initialValues={item} onFinishFailed={() => { }} onFinish={() => sectionSave()} >
                                                            <Form.Item name="SectionName" rules={[{ required: true, message: "Section title required" }]}>
                                                                {item.SectionId && <Input placeholder="Add section title here" className="f-16 mb-16" onChange={(value) => secItemsChange("SectionName", value, index)} />}
                                                            </Form.Item>
                                                            <div className="text-right">
                                                                <Button type="primary" htmlType="submit" className="addContent px-16" size="small" style={{ marginRight: 8 }}>Add Section</Button>
                                                                <Button type="default" className="addContent px-16" size="small">Cancel</Button>
                                                            </div>
                                                        </Form>
                                                    </div>
                                                    <div className="add-lecture p-4"><span className="icons close" onClick={() => deleteSection(item)}></span></div>
                                                </div>
                                            </div>
                                        })}
                                        <div className="text-right">
                                            <Button type="primary" htmlType="submit" className="addContent px-16" size="small" style={{ marginRight: 8 }}>Save Course</Button>
                                            {(courseObject.CreatedDate && !courseObject.IsPublish) && <Button type="primary" className="addContent px-16" size="small" style={{ marginRight: 8 }}>Publish</Button>}
                                            <Button type="default" className="addContent px-16" size="small" onClick={() => cancelCourse()}>Cancel</Button>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>}
                <Modal title="Add Topic" visible={isModalVisible} onCancel={handleCancel} centered
                    footer={<>
                        <Button type="primary" form="myForm" key="submit" htmlType="submit">Save</Button>
                    </>}
                    className="addTopicPop"

                >
                    <Form id="myForm" onFinishFailed={() => { }} onFinish={() => topicSave()} initialValues={{ ...topicObj }}>
                        <div ref={formRef}>
                            {isError && <div class="ant-form-item-explain ant-form-item-explain-error"><div role="alert">{errorMessage}</div></div>}
                            <div className="custom-fields">
                                <label className="text-secondary d-block mb-4">Topic Title</label>
                                <Form.Item name="Title" rules={[{ required: true, message: "Title  required" }]} >
                                    <Input onChange={(value) => handleChange('Title', value, true)} />
                                </Form.Item>
                            </div>
                            <div className="custom-fields">
                                <label className="text-secondary d-block mb-4">Topic Description</label>
                                <Form.Item name="Description" rules={[{ required: true, message: "Description  required" }]} >
                                    <TextArea onResize
                                        autoSize={{ minRows: 3, maxRows: 20 }}
                                        onChange={(value) => handleChange('Description', value, true)}
                                    />
                                </Form.Item>
                            </div>
                            <div className="mb-8">
                                <label className="text-secondary d-block mb-4">Feature Image</label>
                                <Upload
                                    action={process.env.REACT_APP_AUTHORITY + "/Home/UploadFile"}
                                    listType="picture-card"
                                    accept=".jpg,.jpeg,.png"
                                    onChange={(info) => onChange(info)}
                                    onRemove={() => deleteImage()}
                                    onPreview={() => { }}
                                >
                                    {topicObj.ThumbNails.length >= 1 ? null : uploadButton}
                                </Upload>
                            </div>
                            <div className="custom-fields">
                                <label className="text-secondary d-block mb-4">Video Source</label>
                                <Form.Item name="VideoSource">
                                    <Select defaultValue="Choose Video Source" allowClear placeholder="Choose Video Source" onChange={(value) => handleChange('VideoSource', value, true)}>
                                        <Option value="Upload">Upload</Option>
                                        <Option value="YouTube">YouTube</Option>
                                        <Option value="Vimeo">Vimeo</Option>
                                    </Select>
                                </Form.Item>
                            </div>
                            {topicObj.VideoSource == "Upload" && <Dragger showUploadList={false} {...props} className="mb-16" disabled={topicObj.VideoUrl.length >= 1}>
                                <p className="ant-upload-drag-icon">
                                    <span className="sharebox-icons video-upload"></span>
                                </p>
                                <p className="ant-upload-text f-18, semibold">Click or drag file to this area to upload</p>
                            </Dragger>

                            }
                            {fileUploading && <Loader className="loader-top-middle" />}
                            {topicObj.VideoSource == "Upload" && topicObj.VideoUrl?.map((image, indx) => (
                                <div key={indx} className="mb-16 upload-preview">
                                    <video width="100%" controls>
                                        <source src={image} />
                                    </video>
                                    <a
                                        class="item-close"
                                        onClick={() => {
                                            topicObj.VideoUrl = []
                                            setTopicObj({ ...topicObj });
                                        }
                                        }
                                    >
                                        <Tooltip title="Remove">
                                            <span className="close-icon"></span>
                                        </Tooltip>
                                    </a>
                                </div>
                            ))}
                            {topicObj.VideoSource == "YouTube" && <div className="custom-fields">
                                <Form.Item name="VideoUrl" rules={[{ required: true, type: "url", message: "This field must be a valid url." }]} >
                                    <Input placeholder="YouTube URL" onChange={(value) => handleChange('VideoUrl', value, true)} />
                                </Form.Item>
                            </div>
                            }
                            {topicObj.VideoSource == "Vimeo" && <div className="custom-fields">
                                <Form.Item name="VideoUrl" rules={[{ required: true, type: "url", message: "This field must be a valid url." }]} >
                                    <Input placeholder="Vimeo URL" onChange={(value) => handleChange('VideoUrl', value, true)} />
                                </Form.Item>
                            </div>
                            }
                            <div className="custom-fields">
                                <label className="text-secondary d-block mb-4">Video Playback Time</label>
                                <Input.Group compact>
                                    <div className="videoplybacktime">
                                        <Form.Item  >
                                            <InputNumber min={0} max={10} defaultValue={0} onChange={(value) => handleVidoTimeChange('Hours', value)} />
                                            <em className="text-secondary d-block f-12 mt-4">HH</em>
                                        </Form.Item>
                                    </div>
                                    <div className="videoplybacktime">
                                        <Form.Item >
                                            <InputNumber min={0} max={59} defaultValue={0} onChange={(value) => handleVidoTimeChange('Min', value)} />
                                            <em className="text-secondary d-block f-12 mt-4">MM</em>
                                        </Form.Item>
                                    </div>
                                    <div className="videoplybacktime">
                                        <Form.Item>
                                            <InputNumber min={0} max={59} defaultValue={0} onChange={(value) => handleVidoTimeChange('Sec', value)} />
                                            <em className="text-secondary d-block f-12 mt-4">SS</em>
                                        </Form.Item>
                                    </div>
                                </Input.Group>
                            </div>
                        </div>
                    </Form>
                </Modal>

                <Courses onCourseEdit={(id) => onCourseEditObj(id)} onRef={courses => setCoursesObj(courses)} />


            </Col>

        </Row>
    </>)

}

export default connectStateProps(withRouter(AdminCourses));