import React, { useState, useEffect, useRef } from 'react';
import { withRouter, useParams } from "react-router-dom";
import connectStateProps from '../../shared/stateConnect';
import { Card, Input, Row, Col, Button, Select, Collapse, Space, message, Upload, Table, Statistic, DatePicker, Modal, InputNumber, Form, Tooltip, Image, List } from 'antd';
import { uuidv4 } from '../../utils';
import moment from 'moment';
import notify from '../../shared/components/notification';
import { getCollegeBranches, getAuthors, saveTopic, sectionDeletion, saveSection, saveCourse, getCourse, publishCourse, getCoursesRelCount, submitDocs, topicDelete, getPublishedObject, getCategories } from '../../shared/api/apiServer';
import Loader from "../../common/loader";
import Title from 'antd/lib/typography/Title';
const { Dragger } = Upload;
const { Panel } = Collapse;
const { Option } = Select;
const { TextArea } = Input;
const topicTitle = (
    <span className="left-menu play mr-4"></span>
)
const docTitle = (
    <span className="left-menu docment"></span>
)
const CourseComponent = ({ profile, history }) => {
    const obj = {
        "TopicId": "",
        "Title": "",
        "Description": "",
        "ThumbNails": [],
        "DupThumbNails": [],
        "VideoSource": "Upload",
        "VideoName": "",
        "VideoUrl": [],
        "Duration": "00:00:00",
        "TopicType": "Video",
        "lstDocuments": [],
        "Size": "",
        "Hours": "00",
        "Min": "00",
        "Sec": "00",
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
        "CourseType": "Content",
        "Date": "",
        "RefLinks": [],
        "EndDate": "",
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
        "PublishDate": new Date(),
        "CourseSections": [
        ],
        "Tests": [],
        "Documents": [],
        "UrlType": [],
        "LiveDetails": [
            {
                "Id": uuidv4(),
                "Date": "",
                "Link": "",
            }
        ],
        "DupCategoeries": [],
        "SpecialCategory": [],
        "FeeType": "Free"
    }
    let postObject = {
        "GroupId": "",
        "IsPublish": true,
        "Posts": [
        ]
    };
    const LiveDatail = {
        "Date": "",
        "Link": "",
    }
    const acceptTypesForTopic = {
        "Video": ".mp4,.mpeg4,.mov,.flv,.avi,.mkv,.webm",
        "Document": ".doc,.docx,.ott,.rtf,.docm,.dot,.odt,.dotm,.md,.xls,.xlsx.,.csv",
    }
    let { id } = useParams();
    const [CategoriesLu, setCategoriesLu] = useState([]);
    const [AuthorsLu, setAuthorsLu] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [topicObj, setTopicObj] = useState({ ...obj });
    const [secObj, setSecObj] = useState({ ...sectionObj });
    const [courseObject, setCourseObject] = useState({ ...courseObj });
    const [fileUploading, setFileUploading] = useState(false);
    const [secId, setSecId] = useState("");
    const [form] = Form.useForm();
    const [topicForm] = Form.useForm();
    const [fileImgUploading, setFileImgUploading] = useState(false);
    const [fileVideoUploading, setFileVideoUploading] = useState(false);
    const [isCourseChanged, setIsCourseChanged] = useState(false);
    const [isVideoLoded, setIsVideoLoded] = useState(false);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState((id !== 'new'))
    useEffect(() => {
        fetchBranches();
        fetchAuthors();
        if (id !== 'new') {
            refreshCourseDetails(id)
        }
    }, []);
    const fetchBranches = async () => {
        const branchResponse = await getCategories();
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
        accept: acceptTypesForTopic[topicObj.TopicType],
        action: process.env.REACT_APP_AUTHORITY + "/Home/UploadFile",
        beforeUpload: (file) => {
            let accepted = false;
            const acceptTypes = acceptTypesForTopic[topicObj.TopicType]
            if (!(acceptTypes.indexOf(file.name.substr(file.name.lastIndexOf(".") + 1)) > -1)) {
                setFileUploading(false);
                notify({
                    message: "Upload",
                    description: `File format not supported`,
                    type: "warning",
                });
                accepted = true;
            }
            return !accepted;
        },
        onChange(info) {
            const { status } = info.file;
            if (status == "uploading") {
                setFileUploading(true);
            }
            if (status === 'done') {
                setFileUploading(false);
                if (topicObj.TopicType == "Document") {
                    const avatar = info.file?.name
                        ? info.file.name.substr(info.file.name.lastIndexOf(".") + 1)
                        : "word";
                    let response = {
                        title: info.file.name,
                        avatar,
                        url: info.file.response[0],
                        fileSize: info.file.size,
                    };
                    topicObj.lstDocuments = topicObj.lstDocuments
                        ? topicObj.lstDocuments.concat(response)
                        : [response];
                } else {
                    topicObj.VideoUrl = info.file.response;
                    topicObj.VideoName = info.file.name;
                    topicObj.Size = info.file.size;
                }
                setTopicObj({ ...topicObj });
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };
    const deleteSection = async (item) => {
        if (!item.IsSaved) {
            courseObject.CourseSections = courseObject.CourseSections.filter(sec => sec.SectionId
                !== item.SectionId);
            setCourseObject({ ...courseObject });
        }
        else {
            const result = await sectionDeletion(courseObject.GroupId, item.SectionId);
            if (result.ok) {
                notify({ message: "Section", description: "Section deleted successfully" });
                courseObject.CourseSections = courseObject.CourseSections.filter(sec => sec.SectionId
                    !== item.SectionId);
                setCourseObject({ ...courseObject });
            }
            else {
                notify({ message: "Error", type: "error", description: "Something went wrong :)" });
            }
        }
    }
    const refreshCourseDetails = async (id, isFromFunctions) => {
        const branchResponse = await getCourse(id ? id : courseObject.GroupId, profile?.Id);
        if (branchResponse.ok) {
            bindCourseData(branchResponse.data[0])
            if (branchResponse.data[0].IsPublish && !isFromFunctions) {
                const publishResponse = await getPublishedObject(branchResponse.data[0].GroupId);
                if (publishResponse.ok) {
                    setLoading(false)
                    setPosts(publishResponse.data)
                } else {
                    setLoading(false)
                    notify({ message: "Error", type: "error", description: "Something went wrong :)" })
                }
            }
            else {
                setLoading(false);
            }
        } else {
            notify({ message: "Error", type: "error", description: "Something went wrong :)" })
            setLoading(false)
        }
    }
    const addLiveDetails = () => {
        LiveDatail.Id = uuidv4();
        courseObject.LiveDetails.push({ ...LiveDatail })
        setCourseObject({ ...courseObject })
    }
    const deleteLiveDetails = (idx) => {
        courseObject.LiveDetails.splice(idx, 1)
        setCourseObject({ ...courseObject })
    }
    const handleLiveChange = (prop, val, index) => {
        courseObject.LiveDetails[index][prop] = val ? (val.currentTarget ? val.currentTarget.value : val) : "";
        setCourseObject({ ...courseObject })
        setIsCourseChanged(true)
    }

    const bindCourseData = (obj) => {
        let ObjCourse = { ...obj }
        ObjCourse.Author = [];
        ObjCourse.Categories = [];
        obj.Author.forEach(item => {
            ObjCourse.Author.push(item.UserId)
        });
        obj.Categories.forEach(item => {
            ObjCourse.Categories.push(item.GroupId)
        });
        obj.Date = obj.Date ? moment(obj.Date).local() : "";
        ObjCourse.Date = ObjCourse.Date ? moment(ObjCourse.Date).local() : "";
        obj.EndDate = obj.EndDate ? moment(obj.EndDate).local() : "";
        ObjCourse.EndDate = ObjCourse.EndDate ? moment(ObjCourse.EndDate).local() : "";
        ObjCourse.LiveDetails.forEach(item => {
            item.Date = item.Date ? moment(item.Date).local() : "";
        });
        ObjCourse.Categories = ObjCourse.Categories?.length == 4 ? ["All"] : ObjCourse.Categories;
        setCourseObject({ ...obj });
        form.setFieldsValue({ ...ObjCourse });
    }
    const topicSave = async () => {
        if (topicObj.TopicType == "Video") {
            topicObj.lstDocuments = [];
            topicObj.VideoName = topicObj.Title;
        }
        else {
            topicObj.VideoUrl = [];
            topicObj.VideoName = "";
            topicObj.Size = "";
            topicObj.Duration = "";
        }
        saveTopicUpdate();
    }
    const saveTopicUpdate = async () => {
        if (topicObj.VideoSource == "Upload")
            topicObj.Duration = new Date((topicObj.Sec ? topicObj.Sec : 0) * 1000).toISOString().substr(11, 8);
        else
            topicObj.Duration = "";
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
    const deleteTopic = async (topic, section) => {
        const result = await topicDelete(courseObject.GroupId, section.SectionId, topic.TopicId);
        if (result.ok) {
            refreshCourseDetails();
            notify({ message: "Topic", description: "Topic deleted successfully" });
        }
        else {
            notify({ message: "Error", type: "error", description: "Something went wrong :)" });
        }
    }
    const coursSave = async () => {
        setLoading(true)
        if (courseObject.CourseType == "Content" && courseObject.CourseVideo?.length == 0) {
            notify({
                message: "Course",
                description: `Introduction video Required`,
                type: "warning",
            });
            return;
        }
        courseObject.Tests = [];
        courseObject.CreatedDate = courseObject.CreatedDate ? courseObject.CreatedDate : new Date();
        courseObject.Date = courseObject.Date ? moment(courseObject.Date).format() : courseObject.Date;
        courseObject.EndDate = courseObject.EndDate ? moment(courseObject.EndDate).format() : courseObject.EndDate;
        courseObject.CourseSections = courseObject.CourseSections.filter(item => {
            if (item.SectionName) {
                item.IsSaved = true;
                return item;
            }
        });
        courseObject.Documents.forEach(item => {
            let Obj = {
                "TestId": uuidv4(),
                "Title": item.title,
                "Documents": item.url,
                "Avatar": item.avatar,
                "Size": item.fileSize
            }
            courseObject.Tests.push({ ...Obj });
        })
        // courseObject.CourseSections = courseObject.CourseType == "Live Session" ? [] : courseObject.CourseSections;
        if (courseObject.CourseType == "Content") {
            courseObject.Date = "";
            courseObject.Link = "";
            courseObject.UrlType = "";
            courseObject.LiveDetails = [];
            courseObject.EndDate = "";
        }
        if (courseObject.DupCategoeries?.length > 0) {
            courseObject.Categories = courseObject.DupCategoeries;
        }
        courseObject.SpecialCategory = courseObject.DupCategoeries.length > 0 ? "All" : courseObject.Categories.map(item => item.GroupName)
        courseObject.LiveDetails.forEach(item => {
            item.Date = item.Date ? moment(item.Date).format() : item.Date;
        })
        const result = await saveCourse(courseObject);
        if (result.ok) {
            setLoading(false)
            notify({ message: "Course", description: "Course saved successfully" });
            setCourseObject({ ...courseObj });
            history.push("/admin/courses")
        }
        else {
            setLoading(false)
            window.scrollTo(0, 0);
            notify({ message: "Error", type: "error", description: "Something went wrong :)" });
        }

    }
    const coursePublish = async () => {
        setLoading(true)
        postObject.GroupId = courseObject.GroupId;
        postObject.IsPublish = true;
        postObject.PublishDate = new Date();
        postObject.Posts = [];
        if (!courseObject.IsPublish) {
            courseObject.Categories.forEach(item => {
                let Obj = {
                    "PostId": uuidv4(),
                    "CourseId": courseObject.GroupId,
                    "Type": courseObject.CourseType == "Live Session" ? "Text" : "Video",
                    "Message": courseObject.Description,
                    "Title": courseObject.GroupName,
                    "IsAnonymous": false,
                    "CategoryType": "LMS",
                    "PostType": "Course",
                    "ImageUrl": courseObject.CourseVideo,
                    "CreatedDate": new Date(),
                    "UserDetails": {
                        "UserId": profile?.Id,
                        "Firstname": profile?.FirstName,
                        "Lastname": profile?.LastName,
                        "Image": profile?.ProfilePic,
                        "Email": profile?.Email
                    },
                    "Tags": [],
                    "Likes": [],
                    "Comments": [],
                    "Group": {
                        "GroupId": null,
                        "GroupName": null,
                        "GroupImage": null
                    },
                    "Shares": [],
                    "dupType": "Video",
                    "Author": courseObject.Author,
                    "PublishDate": new Date(),
                    "CourseType": courseObject.CourseType,
                    "Link": courseObject.CourseType == "Live Session" ? courseObject.Link : "",
                    "UrlType": courseObject.CourseType == "Live Session" ? courseObject.UrlType : "",
                    "LiveDate": courseObject.CourseType == "Live Session" ? courseObject.Date : "",
                };

                postObject.Posts.push({ ...Obj })
            })
        }
        else {
            posts.forEach(item => {
                let Obj = {
                    "PostId": item.PostId,
                    "Type": courseObject.CourseType == "Live Session" ? "Text" : "Video",
                    "Message": courseObject.Description,
                    "Title": courseObject.GroupName,
                    "ImageUrl": courseObject.CourseVideo,
                    "UserDetails": {
                        "UserId": profile?.Id,
                        "Firstname": profile?.FirstName,
                        "Lastname": profile?.LastName,
                        "Image": profile?.ProfilePic,
                        "Email": profile?.Email
                    },
                    "Author": courseObject.Author,
                    "CourseType": courseObject.CourseType,
                    "Link": courseObject.CourseType == "Live Session" ? courseObject.Link : "",
                    "UrlType": courseObject.CourseType == "Live Session" ? courseObject.UrlType : "",
                    "LiveDate": courseObject.CourseType == "Live Session" ? courseObject.Date : "",
                    "CreatedDate": new Date(),
                };
                postObject.Posts.push({ ...Obj })
            })
        }
        const result = await publishCourse(postObject, courseObject.IsPublish);
        if (result.ok) {
            setLoading(false)
            notify({ message: "Publish", description: "Course published successfully" });
            history.push("/admin/courses")
        }
        else {
            setLoading(false)
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
        time[0] = time[0]?.length < 2 ? ("0" + time[0]) : time[0];
        time[1] = time[1]?.length < 2 ? ("0" + time[1]) : time[1];
        time[2] = time[2]?.length < 2 ? ("0" + time[2]) : time[2];
        return time[0] + ":" + time[1] + ":" + time[2];
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
        history.push("/admin/courses");
    }
    const handleChange = (prop, val, popup) => {
        if (!popup) {
            if (prop != "Categories" && prop != "Author") {
                courseObject[prop] = val ? (val.currentTarget ? val.currentTarget.value : val) : "";
                if (courseObject[prop] == "Content" && prop == "CourseType") {
                    courseObject.UrlType = "";
                    courseObject.Date = "";
                    courseObject.Link = "";
                    courseObject.EndDate = "";
                    courseObject.LiveDetails = [];
                }
                else if (courseObject[prop] == "Live Session") {
                    courseObject.LiveDetails = [{
                        "Id": uuidv4(),
                        "Date": "",
                        "Link": "",
                    }];
                }
            }
            else {
                courseObject[prop] = [];
                (prop == "Categories" ? val : [val]).forEach(item => {
                    (prop == "Categories" ? CategoriesLu : AuthorsLu).forEach(obj => {
                        if (item == (prop == "Categories" ? obj.GroupId : obj.UserId)) {
                            let Object = prop == "Categories" ? {
                                "GroupId": obj.GroupId,
                                "GroupName": obj.GroupName,
                                "GroupImage": obj.GroupImage
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
                if (prop == "Categories") {
                    if (val.indexOf("All") > -1) {
                        courseObject.DupCategoeries = CategoriesLu;
                        form.setFieldsValue({ Categories: ["All"] })
                    }
                    else {
                        courseObject.DupCategoeries = [];
                    }
                }
            }
            setCourseObject({ ...courseObject })
            form.setFieldsValue({ UrlType: courseObject.UrlType, Date: courseObject.Date, Link: courseObject.Link })
            setIsCourseChanged(true)
        }
        else {
            topicObj[prop] = val ? (val.currentTarget ? val.currentTarget.value : val) : "";
            if (prop == "TopicType" && topicObj[prop] == "Document") {
                topicObj.VideoUrl = [];
                topicObj.Duration = "00:00:00";
            }
            if (prop == "TopicType" && topicObj[prop] == "Video") {
                topicObj.lstDocuments = [];
            }
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
        secObj.IsSaved = true;
        const result = await saveSection(secObj, courseObject.GroupId);
        if (result.ok) {
            refreshCourseDetails();
            setSecObj({ ...secObj })
            notify({ message: "Section", description: "Section saved successfully" });
        }
        else {
            notify({ message: "Error", type: "error", description: "Something went wrong :)" });
        }
    }
    const addSection = () => {
        let secAddObj = { ...sectionObj }
        secAddObj.SectionId = uuidv4();
        secAddObj.SectionName = "";
        setSecObj(secAddObj)
        if (courseObject.CreatedDate) {
            courseObject.CourseSections.push({ ...secAddObj });
            setCourseObject({ ...courseObject });
        }
        else {
            notify({ message: "Error", type: "error", description: "Please save course" });
        }
    }
    const bytesToSize = (bytes) => {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }
    const showModal = (type, topic, sectionId) => {
        let topicObjForsave = type == "Edit" ? JSON.parse(JSON.stringify(topic)) : { ...obj }
        setSecId(sectionId);
        if (type == 'Edit') {
            topicObjForsave.Sec = topic.Duration.split(":")?.[2]
            setTopicObj({ ...topicObjForsave })
        }
        else {
            topicObjForsave.TopicId = uuidv4();
            setTopicObj(topicObjForsave)
        }
        topicForm.setFieldsValue({ ...topicObjForsave })
        setIsModalVisible(true)
        setFileUploading(false);
        setIsVideoLoded(false)
    };
    const handleCancel = () => {
        topicForm.resetFields();
        setTopicObj({ ...obj })
        setIsModalVisible(false);
    };
    const uploadProps = {
        name: 'file',
        multiple: false,
        accept: ".doc,.docx,.ott,.rtf,.docm,.dot,.odt,.dotm,.md,.xls,.xlsx.,.csv",
        action: process.env.REACT_APP_AUTHORITY + "/Home/UploadFile",
        beforeUpload: (file) => {
            let accepted = false;
            const acceptTypes = ".doc,.docx,.ott,.rtf,.docm,.dot,.odt,.dotm,.md,.xls,.xlsx.,.csv";
            if (!(acceptTypes.indexOf(file.name.substr(file.name.lastIndexOf(".") + 1)) > -1)) {
                setFileUploading(false);
                notify({
                    message: "Upload",
                    description: `File format not supported`,
                    type: "warning",
                });
                accepted = true;
            }
            return !accepted;
        },
        onChange(info) {
            const { status } = info.file;
            if (status == "uploading") {
                setFileUploading(true);
            }
            if (status === 'done') {
                setFileUploading(false);
                const avatar = info.file?.name
                    ? info.file.name.substr(info.file.name.lastIndexOf(".") + 1)
                    : "word";
                let response = {
                    title: info.file.name,
                    avatar,
                    url: info.file.response[0],
                    fileSize: info.file.size,
                };
                courseObject.Documents = courseObject.Documents
                    ? courseObject.Documents.concat(response)
                    : [response];
                setCourseObject({ ...courseObject });
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    return (<>
        {loading && <Loader className="loader-middle" />}
        <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                <Form initialValues={{ ...courseObj }} onFinishFailed={() => { }} onFinish={() => coursSave()} scrollToFirstError={true} form={form} >
                    <Row>
                        <Col xs={{ span: 24 }}
                            sm={{ span: 20, offset: 2 }}
                            xl={{ span: 16, offset: 4 }} className="course-steps">
                            <div className="create-course">
                                <div className="custom-fields">
                                    <label className="text-secondary d-block mb-4 semibold required">Title</label>
                                    <Form.Item className="custom-fields" name="GroupName" rules={[{ required: true, message: "Title  required" }]}>
                                        <Input placeholder="Title" onChange={(value) => handleChange('GroupName', value)} maxLength={150} autoComplete="off" />
                                    </Form.Item>
                                </div>
                                <div className="">
                                    <label className="text-secondary d-block mb-4 semibold required">Description</label>
                                    <Form.Item className="mb-12" name="Description" rules={[{ required: true, message: "Description  required" }]}>
                                        <TextArea className="" placeholder="Description" onResize onChange={(value) => handleChange('Description', value)}
                                            autoSize={{ minRows: 3, maxRows: 30 }} maxLength={1360}
                                        />
                                    </Form.Item>
                                </div>
                                <Row gutter={16}>
                                    <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12} className="multi-select">
                                        <label className="text-secondary d-block mb-4 semibold required">Category</label>
                                        <Form.Item className="lh-24 custom-fields" name="Categories" rules={[{ required: true, message: "Categories  required" }]}>
                                            <Select
                                                placeholder="Choose a Category" className="text-left"
                                                onChange={(value) => handleChange('Categories', value)}
                                                mode="multiple"
                                                disabled={courseObject.CreatedDate}
                                                filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                <Option value="All">All</Option>
                                                {CategoriesLu?.map((item, index) => {
                                                    return <Option value={item.GroupId} key={index} disabled={courseObject.DupCategoeries?.length > 0}>{item.GroupName}</Option>
                                                })}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12} className="">
                                        <label className="text-secondary d-block mb-4 semibold  required">Author Name</label>
                                        <Form.Item className="custom-fields" name="Author" rules={[{ required: true, message: "Author  required" }]} onChange={(value) => handleChange('Author', value)}>
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
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} className="">
                                        <label className="text-secondary d-block mb-4 semibold  required">Fee Type</label>
                                        <Form.Item className="custom-fields" name="FeeType" rules={[{ required: true, message: "Fee type  required" }]}>
                                            <Select
                                                className="text-left"
                                                onChange={(value) => handleChange('FeeType', value)}
                                            >
                                                {["Free", "Paid"]?.map((item, index) => {
                                                    return <Option value={item} key={index}>{item}</Option>
                                                })}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={courseObject.CourseType == "Live Session" ? 12 : 24} sm={courseObject.CourseType == "Live Session" ? 12 : 24} md={courseObject.CourseType == "Live Session" ? 12 : 24} lg={courseObject.CourseType == "Live Session" ? 12 : 24} xl={courseObject.CourseType == "Live Session" ? 12 : 24} xxl={courseObject.CourseType == "Live Session" ? 12 : 24} className="">
                                        <label className="text-secondary d-block mb-4 semibold  required">Type</label>
                                        <Form.Item className="custom-fields" name="CourseType" rules={[{ required: true, message: "Type required" }]}>
                                            <Select
                                                defaultValue="Content" className="text-left"
                                                onChange={(value) => handleChange('CourseType', value)}
                                            >
                                                <Option value="Live Session">Live Session</Option>
                                                <Option value="Content">Content</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    {courseObject.CourseType == "Live Session" && <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                        <label className="text-secondary d-block mb-4  required">Start Date</label>
                                        <Form.Item className="custom-fields" name="Date" rules={[{
                                            required: true, message: "Start date required"
                                        }, {
                                            type: "date", validator: async (rule, value, callback) => {
                                                if (value && courseObject.EndDate) {
                                                    if (new Date(value) > new Date(courseObject.EndDate)) {
                                                        throw new Error("Start Date should grater than end date")
                                                    } else {
                                                        callback();
                                                    }
                                                }
                                            }
                                        }]}>
                                            <DatePicker placeholder="Course Start Date" onChange={(val) => { handleChange("Date", val) }} format="DD/MM/YYYY HH:mm:ss" disabledDate={(current) => {
                                                return (
                                                    moment().add(-1, "days") >= current
                                                );
                                            }} showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }} />
                                        </Form.Item>
                                    </Col>
                                    }
                                    {courseObject.CourseType == "Live Session" && <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                        <label className="text-secondary d-block mb-4  required">End Date</label>
                                        <Form.Item className="custom-fields" name="EndDate" rules={[{
                                            required: true, message: "End date required"
                                        }, {
                                            type: "date", validator: async (rule, value, callback) => {
                                                if (value && courseObject.Date) {
                                                    if (new Date(value) < new Date(courseObject.Date)) {
                                                        throw new Error("End Date should later than start date")
                                                    } else {
                                                        callback();
                                                    }
                                                }
                                            }
                                        }]}>
                                            <DatePicker placeholder="Course End Date" onChange={(val) => { handleChange("EndDate", val) }} format="DD/MM/YYYY HH:mm:ss" disabledDate={(current) => {
                                                return (
                                                    moment().add(-1, "days") >= current
                                                );
                                            }} showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }} />
                                        </Form.Item>
                                    </Col>
                                    }
                                    {courseObject.CourseType == "Live Session" && <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                        <label className="text-secondary d-block mb-4 semibold  required">Link Type</label>
                                        <Form.Item className="custom-fields" name="UrlType" rules={[{ required: true, message: "Link Type required" }]}>
                                            <Select
                                                defaultValue="Choose Link Type" placeholder="Choose Link Type" className="text-left"
                                                onChange={(value) => handleChange('UrlType', value)}
                                            >
                                                <Option value="">Choose Link Type</Option>
                                                <Option value="Zoom">Zoom</Option>
                                                <Option value="GotoMeeting">GotoMeeting</Option>
                                                <Option value="Others">Others</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>}
                                    {/* {courseObject.CourseType == "Live Session" && <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} className="custom-fields">
                                                <label className="text-secondary d-block mb-4 semibold required ">Link</label>
                                                <Form.Item className="custom-fields" name="Link" rules={[{ required: true, message: "This field must be a valid url.", type: "url" }]}>
                                                    <Input placeholder="Meeting Link" onChange={(value) => handleChange("Link", value)} />
                                                </Form.Item>
                                            </Col>
                                            } */}
                                    {/* {courseObject.CourseType == "Live Session" && <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} className="custom-fields">
                                                <label className="text-secondary d-block mb-4 semibold required ">Link</label>
                                                <Form.Item className="custom-fields" name="Link" rules={[{ required: true, message: "This field must be a valid url.", type: "url" }]}>
                                                    <Input placeholder="Meeting Link" onChange={(value) => handleChange("Link", value)} />
                                                </Form.Item>
                                            </Col>
                                            } */}
                                    {courseObject.CourseType == "Live Session" && courseObject.LiveDetails?.map((live, index) => {
                                        return <Col span={24} className="custom-fields" key={index}>
                                            <div className="add-livelinks">
                                                <div>
                                                    <a onClick={() => addLiveDetails()} ><span className="icons add p-4" /></a>
                                                    <Row gutter={8}>
                                                        <Col xs={24} sm={24} md={8} className="custom-fields">
                                                            <label className="text-secondary d-block mb-4 semibold required ">Date</label>
                                                            <Form.Item initialValue={live.Date ? live.Date : ""} className="custom-fields" name={[live.Id, "Date"]} rules={[{ required: true, message: "Date required" }]}>
                                                                <DatePicker placeholder="Course Date" onChange={(val) => { handleLiveChange("Date", val, index) }} format="DD/MM/YYYY HH:mm:ss" disabledDate={current => { return moment().add(-1, 'days') >= current }} showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }} />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col xs={24} sm={24} md={16} className="">
                                                            <label className="text-secondary d-block mb-4 semibold required ">Link</label>
                                                            <Form.Item initialValue={live.Link ? live.Link : ""} className="custom-fields" name={[live.Id, "Link"]} rules={[{ required: true, message: "This field must be a valid url.", type: "url" }]}>
                                                                <Input placeholder="Meeting Link" onChange={(value) => handleLiveChange("Link", value, index)} />
                                                            </Form.Item>
                                                        </Col>

                                                    </Row>
                                                    {courseObject.LiveDetails?.length > 1 && <a onClick={() => deleteLiveDetails(index)} ><span className="close-icon" /></a>}
                                                </div>
                                            </div>
                                        </Col>
                                    })}
                                </Row>
                                <Row gutter={16}>
                                    <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                        <label className="text-secondary d-block mb-4 semibold">Course Image</label>
                                        <div className="mb-12">
                                            <Dragger
                                                className="upload"
                                                onChange={(info) => {
                                                    const { status } = info.file;
                                                    if (status == "uploading") {
                                                        setFileImgUploading(true);
                                                    }
                                                    if (status === 'done') {
                                                        setFileImgUploading(false);
                                                        courseObject.GroupImage = info.file.response;
                                                        setCourseObject({ ...courseObject })
                                                        message.success(`${info.file.name} file uploaded successfully.`);
                                                    } else if (status === 'error') {
                                                        message.error(`${info.file.name} file upload failed.`);
                                                    }
                                                }}
                                                beforeUpload={(file) => {
                                                    let accepted = false;
                                                    const acceptTypes = ".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
                                                    if (!(acceptTypes.indexOf(file.name.substr(file.name.lastIndexOf(".") + 1)) > -1)) {
                                                        setFileImgUploading(false);
                                                        notify({
                                                            message: "Upload",
                                                            description: `File format not supported`,
                                                            type: "warning",
                                                        });
                                                        accepted = true;
                                                    }
                                                    return !accepted;
                                                }}
                                                accept=".jpg,.jpeg,.png"
                                                action={process.env.REACT_APP_AUTHORITY + "/Home/UploadFile"}
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
                                                <div key={indx} className="mb-16 mt-8 upload-preview">
                                                    <Image className="objectfit-cover" src={image} />
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
                                    <Col xs={24} sm={12} md={12} lg={12} xl={12} xxl={12}>
                                        <label className="text-secondary d-block mb-4 semibold">Introduction video</label>
                                        <div className="mb-12">
                                            <Dragger
                                                className="upload"
                                                onRemove={() => {
                                                    courseObject.CourseVideo = [];
                                                    setCourseObject({ ...courseObject })
                                                    setIsCourseChanged(true);
                                                }}
                                                onChange={(info) => {
                                                    const { status } = info.file;
                                                    if (status == "uploading") {
                                                        setFileVideoUploading(true);
                                                    }
                                                    if (status === 'done') {
                                                        setIsCourseChanged(true);
                                                        setFileVideoUploading(false);
                                                        courseObject.CourseVideo = info.file.response;
                                                        setCourseObject({ ...courseObject })
                                                        message.success(`${info.file.name} file uploaded successfully.`);
                                                    } else if (status === 'error') {
                                                        message.error(`${info.file.name} file upload failed.`);
                                                    }
                                                }}
                                                beforeUpload={(file) => {
                                                    let accepted = false;
                                                    const acceptTypes = ".mp4,.mpeg4,.mov,.flv,.avi,.mkv,.webm";
                                                    if (!(acceptTypes.indexOf(file.name.substr(file.name.lastIndexOf(".") + 1)) > -1)) {
                                                        setFileVideoUploading(false);
                                                        notify({
                                                            message: "Upload",
                                                            description: `File format not supported`,
                                                            type: "warning",
                                                        });
                                                        accepted = true;
                                                    }
                                                    return !accepted;
                                                }
                                                }
                                                action={process.env.REACT_APP_AUTHORITY + "/Home/UploadFile"}
                                                accept=".mp4,.mpeg4,.mov,.flv,.avi,.mkv,.webm"
                                                showUploadList={false}
                                                disabled={fileVideoUploading || courseObject.CourseVideo.length > 0}
                                            >
                                                <span className="sharebox-icons video-upload"></span>
                                                <p className="ant-upload-text mt-8 mb-0">Upload Video</p>
                                            </Dragger>
                                            {fileVideoUploading && <Loader className="loader-top-middle" />}
                                            {courseObject.CourseVideo?.map((image, indx) => (
                                                <div key={indx} className="mb-16 mt-8 upload-preview">
                                                    <video width="100%" controls controlsList="nodownload">
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
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                        <label className="text-secondary d-block mb-4 required">Reference Links</label>
                                        <Form.Item className="custom-fields custom-multiselect" name="RefLinks" rules={[{
                                            required: true,
                                            type: 'array',
                                            defaultField: { type: 'url', message: 'This field must be a valid url.' }
                                        }]
                                        }>
                                            <Select

                                                mode="tags"
                                                style={{ width: "100%" }}
                                                placeholder="Enter Links"
                                                onChange={(value) => handleChange('RefLinks', value)}
                                            ></Select>
                                        </Form.Item>
                                    </Col>

                                </Row>
                                <Row gutter={16}>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} className="ad-upload multi-select custom-fields">
                                        {fileUploading && <Loader className="loader-top-middle" />}
                                        <Dragger showUploadList={false} className="upload mb-16" {...uploadProps}>
                                            <span className="sharebox-icons docs-upload mb-16"></span>
                                            <p className="ant-upload-text">
                                                Upload your assignment files here</p>
                                            <p className="ant-upload-hint">
                                                Support for a single or bulk upload. Strictly prohibit
                                                from uploading company data or other band files (doc, PPT,
                                    PDF, xls).</p>
                                        </Dragger>
                                    </Col>
                                </Row>
                                <Row gutter={16}>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24} className="ad-upload multi-select custom-fields">

                                        <div className="docs mb-16 mt-16 pl-0">
                                            <List
                                                itemLayout="horizontal"
                                                dataSource={courseObject.Documents}
                                                renderItem={(item, indx) => (
                                                    <List.Item className="upload-preview">
                                                        <List.Item.Meta
                                                            avatar={[
                                                                <span className={`doc-icons ${item.avatar}`}></span>,
                                                            ]}
                                                            title={item.title}
                                                            description={
                                                                <div className="file-size f-12">{bytesToSize(item.fileSize)}</div>
                                                            }
                                                        />
                                                        <a
                                                            class="item-close"
                                                            onClick={() => {
                                                                courseObject.Documents.splice(indx, 1);
                                                                setTopicObj({ ...courseObject })
                                                            }}
                                                        >
                                                            <Tooltip title="Remove">
                                                                <span className="close-icon"></span>
                                                            </Tooltip>
                                                        </a>
                                                    </List.Item>
                                                )}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            <div className="create-course mt-16">
                                <div>
                                    {courseObject.CourseSections?.length == 0 && <div className="f-18 add-course-section mb-16 p-12 text-center semibold cursor-pointer text-white" onClick={() => addSection()}>Add Course Section</div>}
                                    {courseObject.CourseSections?.map((item, index) => {
                                        return <div> <div className="lecture-collapse mb-16" key={index}>
                                            {item.IsSaved && <Collapse
                                                className="mb-16"
                                                expandIconPosition="right"
                                            >
                                                <Panel header={item.SectionName} className="f-16 semibold text-primary" extra={<div className="f-16 text-secondary video-dur">{getTopicsTime(item.Topics)}</div>}>
                                                    {item.Topics?.map((topic, index) => {
                                                        return <Collapse
                                                            className="mb-8"
                                                            expandIconPosition="right"
                                                            key={index}
                                                        >
                                                            <Panel header={<>{topic.TopicType == "Video" && topicTitle}{topic.TopicType == "Document" && docTitle}{topic.VideoName ? topic.VideoName : topic.Title}</>} className="f-16 semibold text-primary" extra={<div className="f-16 text-secondary subvideo-dur">{topic.TopicType == "Video" && topic.Duration}</div>}>
                                                                {topic.TopicType == "Video" && <div className="d-flex">
                                                                    {topic.VideoSource == "Upload" && <video width="280" controls controlsList="nodownload"><source src={topic.VideoUrl} /></video>}
                                                                    {topic.VideoSource == "YouTube" && topic.VideoUrl && <iframe width="280" height="200" src={topic.VideoUrl.split("watch?v=").join("embed/")} frameborder="0" allowfullscreen X-Frame-Options={true}></iframe>}
                                                                    {topic.VideoSource == "Vimeo" && topic.VideoUrl && <iframe width="280" height="200" src={`https://player.vimeo.com/video/${topic.VideoUrl.split('/')[topic.VideoUrl.split('/').length - 1]}`} frameborder="0" allowfullscreen X-Frame-Options={true}></iframe>}
                                                                    <div className="ml-16">
                                                                        <p className="f-16 text-primary mb-4">{topic.VideoName}</p>
                                                                        <p className="f-14 text-secondary mb-8">{topic.Description}</p>
                                                                        <p className="f-12 text-primary">{topic.Duration ? topic.Duration : "NA"} | {topic.Size ? bytesToSize(topic.Size) : "NA"}</p>
                                                                        <Button size="small" className="px-16 mr-8" onClick={() => showModal('Edit', { ...topic }, item.SectionId)}>Edit</Button>
                                                                        <Button type="default" className=" remove-course-section px-16" size="small" onClick={() => deleteTopic(topic, item)}>Delete</Button>
                                                                    </div>
                                                                </div>}
                                                                {topic.TopicType == "Document" && <div className="docs">
                                                                    <List
                                                                        itemLayout="horizontal"
                                                                        dataSource={topic.lstDocuments}
                                                                        renderItem={(item) => (
                                                                            <List.Item
                                                                                onClick={(ev) => {
                                                                                    ev.stopPropagation();
                                                                                    window.open(item.url, "_blank");
                                                                                }}
                                                                                className="cursor-pointer"
                                                                            >
                                                                                <List.Item.Meta
                                                                                    avatar={[
                                                                                        <span className={`doc-icons ${item.avatar}`}></span>,
                                                                                    ]}
                                                                                    title={item.title}
                                                                                    description={
                                                                                        <div className="file-size f-12">{bytesToSize(item.fileSize)}</div>
                                                                                    }
                                                                                />
                                                                            </List.Item>
                                                                        )}
                                                                    />
                                                                    <Button size="small" className="px-16 mr-8" onClick={() => showModal('Edit', { ...topic }, item.SectionId)}>Edit</Button>
                                                                    <Button type="default" className=" remove-course-section px-16" size="small" onClick={() => deleteTopic(topic, item)}>Delete</Button>
                                                                </div>
                                                                }
                                                            </Panel>
                                                        </Collapse>
                                                    })
                                                    }
                                                    <div className="text-right">
                                                        <Button type="primary" size="small" className="px-16 mr-8" onClick={() => showModal('Add', null, item.SectionId)}>{item.Topics?.length > 0 ? "Add Another Topic" : "Add Topic"}</Button>
                                                        <Button type="default" className=" remove-course-section px-16" size="small" onClick={() => deleteSection(item)}>Delete Section</Button>
                                                    </div>
                                                </Panel>

                                            </Collapse>
                                            }
                                            {courseObject.CourseSections?.length - 1 !== index && <div className="add-lecture p-4"><Tooltip title="Remove Section"><span className="icons close" onClick={() => deleteSection(item)}></span></Tooltip></div>}
                                            {courseObject.CourseSections?.length - 1 == index && <div className="add-lecture p-4" onClick={() => addSection()}> <Tooltip title="Add Section"><span className="icons add"></span></Tooltip></div>}
                                        </div>
                                            {!item.IsSaved && <div className="lecture-collapse mb-16">
                                                <div className="custom-fields entr-course-title p-12 mb-12">
                                                    < Form id={"secForm" + index} initialValues={{ ...secObj }} onFinishFailed={() => { }} onFinish={() => sectionSave()}>
                                                        <Form.Item className="custom-fields" name="SectionName" rules={[{ required: true, message: "Section title required" }]}>
                                                            <div className="d-flex"><div style={{ width: '100%' }}>{item.SectionId && <Input className="py-0 f-16 right-shape" placeholder="Add section title here"
                                                                suffix={<Tooltip title="Save Section"><Button small htmlType="submit" type="primary">Save</Button></Tooltip>}
                                                                onChange={(value) => secItemsChange("SectionName", value, index)} />



                                                            }</div>
                                                                <div><Tooltip title="Delete Section"><span className="playicons close-section" onClick={() => deleteSection(item)}></span></Tooltip></div>
                                                            </div>


                                                        </Form.Item>
                                                    </Form>
                                                </div>
                                                {courseObject.CourseSections?.length - 1 !== index && <div className="add-lecture p-4"><Tooltip title="Remove Section"><span className="icons close" onClick={() => deleteSection(item)}></span></Tooltip></div>}
                                                {courseObject.CourseSections?.length - 1 == index && <div className="add-lecture p-4" onClick={() => addSection()}><Tooltip title="Add Section"><span className="icons add"></span></Tooltip></div>}
                                            </div>
                                            }
                                        </div>
                                    })}
                                </div>

                            </div>

                            <div className="card-background mt-16">
                                <span className="text-left">
                                    <Button type="default" className="addContent px-16" size="small" onClick={() => cancelCourse()}>Cancel</Button>
                                </span>
                                <span className="text-right float-right">
                                    <Button disabled={fileVideoUploading} type="primary" htmlType="submit" className="addContent px-16" size="small" style={{ marginRight: 8 }}>Save Course</Button>
                                    {(courseObject.CreatedDate) && <Button disabled={fileVideoUploading || isCourseChanged} type="primary" className="addContent px-16" size="small" style={{ marginRight: 8 }} onClick={() => coursePublish()}>Publish</Button>}
                                </span>
                            </div>
                        </Col>
                    </Row>
                </Form>
                <Modal title="Add Topic" visible={isModalVisible} onCancel={handleCancel} centered
                    footer={<>
                        <Button disabled={fileUploading || ((topicObj.VideoSource == "Upload" && topicObj.TopicType == "Video") ? !isVideoLoded : (topicObj.TopicType == "Document" ? topicObj.lstDocuments?.length === 0 : false))} type="primary" form="myForm" key="submit" htmlType="submit">Save</Button>
                    </>}
                    className="addTopicPop"
                    destroyOnClose

                >
                    <Form id="myForm" onFinishFailed={() => { }} onFinish={() => topicSave()} initialValues={topicObj} form={topicForm}>
                        <div>
                            <div className="custom-fields">
                                <label className="text-secondary d-block mb-4  required">Title</label>
                                <Form.Item name="Title" rules={[{ required: true, message: "Title  required" }]} >
                                    <Input onChange={(value) => handleChange('Title', value, true)} maxLength={150} />
                                </Form.Item>
                            </div>
                            <div className="description-space">
                                <label className="text-secondary d-block mb-4  required">Description</label>
                                <Form.Item name="Description" rules={[{ required: true, message: "Description  required" }]} >
                                    <TextArea onResize
                                        autoSize={{ minRows: 3, maxRows: 20 }}
                                        onChange={(value) => handleChange('Description', value, true)}
                                        maxLength={1024}
                                    />
                                </Form.Item>
                            </div>
                            <div className="custom-fields" id="type">
                                <label className="text-secondary d-block mb-4  required">Content Type</label>
                                <Form.Item name="TopicType" rules={[{ required: true, message: "Content Type  required" }]} >
                                    <Select allowClear placeholder="Choose Topic Type" onChange={(value) => handleChange('TopicType', value, true)}
                                        getPopupContainer={() => document.querySelector('#type')}>
                                        <Option value="Video">Video</Option>
                                        <Option value="Document">Document</Option>
                                    </Select>
                                </Form.Item>
                            </div>
                            {topicObj.TopicType == "Video" && <div className="custom-fields" id="sourceType">
                                <label className="text-secondary d-block mb-4  required">Video Source</label>
                                <Form.Item name="VideoSource">
                                    <Select defaultValue="Choose Video Source" allowClear placeholder="Choose Video Source" onChange={(value) => handleChange('VideoSource', value, true)} getPopupContainer={() => document.querySelector('#sourceType')}>
                                        <Option value="Upload">Upload</Option>
                                        <Option value="YouTube">YouTube</Option>
                                        <Option value="Vimeo">Vimeo</Option>
                                    </Select>
                                </Form.Item>
                            </div>
                            }
                            {topicObj.VideoSource == "Upload" && topicObj.TopicType == "Video" && <Dragger showUploadList={false} {...props} className="mb-16" disabled={topicObj.VideoUrl.length >= 1}>
                                <p className="ant-upload-drag-icon">
                                    <span className="sharebox-icons video-upload"></span>
                                </p>
                                <p className="ant-upload-text f-18, semibold">Click or drag file to this area to upload</p>
                            </Dragger>

                            }
                            {fileUploading && topicObj.TopicType == "Video" && <Loader className="loader-top-middle" />}
                            {topicObj.VideoSource == "Upload" && topicObj.TopicType == "Video" && topicObj.VideoUrl?.map((image, indx) => (
                                <div key={indx} className="mb-16 mt-8 upload-preview">
                                    <video width="100%" controls controlsList="nodownload" onLoadedMetadata={e => {
                                        setIsVideoLoded(true)
                                        topicObj.Sec = e.target.duration ? e.target.duration : 0;
                                        setTopicObj({ ...topicObj })
                                    }}>
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
                            {topicObj.VideoSource == "YouTube" && topicObj.TopicType == "Video" && <div className="custom-fields">
                                <label className="text-secondary d-block mb-4  required">YouTube URL</label>
                                <Form.Item name="VideoUrl" rules={[{ required: true, type: "url", message: "This field must be a valid url." }]} >
                                    <Input placeholder="YouTube URL" onChange={(value) => handleChange('VideoUrl', value, true)} />
                                </Form.Item>
                            </div>
                            }
                            {topicObj.VideoSource == "Vimeo" && topicObj.TopicType == "Video" && <div className="custom-fields">
                                <label className="text-secondary d-block mb-4  required">Vimeo URL</label>
                                <Form.Item name="VideoUrl" rules={[{ required: true, type: "url", message: "This field must be a valid url." }]} >
                                    <Input placeholder="Vimeo URL" onChange={(value) => handleChange('VideoUrl', value, true)} />
                                </Form.Item>
                            </div>
                            }
                            {topicObj.TopicType == "Document" && <Dragger
                                className="upload"
                                {...props}
                                showUploadList={false}
                            >
                                <span className="sharebox-icons docs-upload"></span>
                                <p className="ant-upload-text mt-8 mb-0">Upload Documents</p>
                            </Dragger>
                            }
                            {fileUploading && topicObj.TopicType == "Document" && <Loader className="loader-top-middle" />}
                            {topicObj.TopicType == "Document" &&
                                <div className="docs mb-16 pl-0 mt-8">
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={topicObj.lstDocuments}
                                        renderItem={(item, indx) => (
                                            <List.Item className="upload-preview">
                                                <List.Item.Meta
                                                    avatar={[
                                                        <span className={`doc-icons ${item.avatar}`}></span>,
                                                    ]}
                                                    title={item.title}
                                                    description={
                                                        <div className="file-size f-12">{bytesToSize(item.fileSize)}</div>
                                                    }
                                                />
                                                <a
                                                    class="item-close"
                                                    onClick={() => {
                                                        topicObj.lstDocuments.splice(indx, 1);
                                                        setTopicObj({ ...topicObj })
                                                    }}
                                                >
                                                    <Tooltip title="Remove">
                                                        <span className="close-icon"></span>
                                                    </Tooltip>
                                                </a>
                                            </List.Item>
                                        )}
                                    />
                                </div>}
                        </div>
                    </Form>
                </Modal>
            </Col>

        </Row></>)

}
export default connectStateProps(withRouter(CourseComponent));