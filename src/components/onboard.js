import React, { useEffect, useState } from 'react';
import { Steps, Button, message, Card, Avatar, Row, Col, Select, Checkbox, Form, DatePicker } from 'antd';
import Logo from '../styles/images/blackbugs-logo.png';
import Onboard1 from '../styles/images/onboard1.svg';
import Onboard2 from '../styles/images/onboard2.svg';
import { fetchCourseSuggestions, fetchInerests, getBranchSubjects, getCollegeBranches, getColleges, joinGroup as JoinGroup, saveOnboard } from '../shared/api/apiServer';
import notify from '../shared/components/notification';
import connectStateProps from '../shared/stateConnect';
import OwlCarousel from 'react-owl-carousel2';
import { Link, withRouter } from 'react-router-dom/cjs/react-router-dom.min';
const { Option } = Select;
const OnBoard = ({ profile, history, updateProfile }) => {
    const [current, setCurrent] = React.useState(0);
    const [colleges, setColleges] = useState([]);
    const [branches, setBranches] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [groupSuggestions, setGroupSuggetions] = useState([])
    const [initialValues, setInitialValues] = useState({
        "UserDetails": {
            "UserId": profile?.Id,
            "Firstname": profile?.FirstName,
            "Lastname": profile?.LastName,
            "Image": profile?.ProfilePic,
            "Email": profile?.Email
        },
        "College": {
            "CollegeId": null,
            "CollegeName": "",
            "BranchId": null,
            "BranchName": "",
            "Subjects": []
        },
        "Interests": []
    })
    const [interests, setInterests] = useState([]);
    useEffect(() => {
        if (profile?.IsOnBoardProcess) {
            history.push("/")
        }
        else { fetchColleges(); }
    }, []);
    const next = async (values) => {
        if (current === 0) {
            console.log(values)
            await saveOnboard({ UserDetails: { ...initialValues.UserDetails }, College: { ...initialValues.College }, OnBoardStep: "1" });
            fetchInterests();
        } else if (current == 1) {
            if (interests.length > 0) {
                await saveOnboard({ UserDetails: { ...initialValues.UserDetails }, Interests: [...initialValues.Interests], OnBoardStep: "2" });
            }
            fetchGroupSuggestions();
        }
        setCurrent(current + 1);
    };

    const prev = () => {
        if (current === 2) {
            fetchInterests();
        }
        setCurrent(current - 1);

    };
    const fetchColleges = async () => {
        const collegeResponse = await getColleges();
        if (collegeResponse.ok) {
            setColleges(collegeResponse.data);
        } else {
            notify({ message: "Error", type: "error", description: "Something went wrong :)" })
        }
    }
    const fetchBranches = async () => {
        const branchesResponse = await getCollegeBranches(initialValues.College.CollegeId);
        if (branchesResponse.ok) {
            setBranches(branchesResponse.data);
        } else {
            notify({ message: "Error", type: "error", description: "Something went wrong :)" })
        }
    }
    const fetchSubjects = async () => {
        const subjectsResponse = await getBranchSubjects(initialValues.College.CollegeId, initialValues.College.BranchId);
        if (subjectsResponse.ok) {
            setSubjects(subjectsResponse.data);
        } else {
            notify({ message: "Error", type: "error", description: "Something went wrong :)" })
        }
    }
    const handleChange = (prop, val) => {
        let object = { ...initialValues };
        object.College[prop] = val;
        setInitialValues(object);
        const result = prop === "CollegeId" ? fetchBranches() : (prop === "BranchId" ? fetchSubjects() : "");
    }
    const onSubjectsSelection = (subject) => {
        let object = { ...initialValues };
        object.College.Subjects = subjects.filter(item => subject.indexOf(item.SubjectId) > -1);
        setInitialValues(object);
    }
    const onInterestSelection = (subject) => {
        let object = { ...initialValues };
        object.Interests = subject
        setInitialValues(object);
    }
    const fetchInterests = async () => {
        const intResponse = await fetchInerests();
        if (intResponse.ok) {
            setInterests(intResponse.data);
        } else {
            notify({ message: "Error", type: "error", description: "Something went wrong :)" })
        }
    }
    const fetchGroupSuggestions = async () => {
        const grpSuggetions = await fetchCourseSuggestions(profile?.Id, 5, 0);
        if (grpSuggetions.ok) {
            setGroupSuggetions(grpSuggetions.data);
        } else {
            notify({ message: "Error", type: "error", description: "Something went wrong :)" });
        }
    }
    const joinGroup = async (item) => {
        const obj = {
            "UserId": profile?.Id,
            "Firstname": profile?.FirstName,
            "Lastname": profile?.LastName,
            "Image": profile?.ProfilePic,
            "Email": profile?.Email
        }
        if (item.type == "Private") { obj.Type = "request" }
        const joinResponse = await JoinGroup(item.id, obj);
        if (joinResponse.ok) {
            notify({ message: "Group join", description: item.type === "Private" ? "Request sent" : "Joined to group" });
            let groups = [...groupSuggestions];
            groups = groups.filter(it => it.id !== item.id);
            setGroupSuggetions(groups);
        } else {
            notify({ message: "Error", description: "Something went wrong :)", type: "error" });
        }

    }

    const onFinishFailed = (error) => {

    }
    const finishSetup = () => {
        let prop = { ...profile };
        prop.IsOnBoardProcess = true;
        updateProfile(prop);
        history.push("/")
    }
    const fetchSelectedSubjects = () => {
        return initialValues.College.Subjects.map(item => item.SubjectId);
    }
    const steps = [
        {
            content:
                <Row>
                    <Col xs={24} md={8}>
                        <div className="intro1">
                            <img src={Logo} alt="blackbuck" width="250px" />
                            <h1> Welcome to Blackbuck</h1>
                            <p>To bring premier and practical formal education closer to students and professionals.</p>
                            <div className="intro-image text-center">
                                <img src={Onboard1} alt="blackbuck" width="200px" />
                            </div>
                        </div>

                    </Col>
                    <Col xs={24} md={16} className="right">
                        <div className="intro-title">
                            <h2>
                                A bit about you
                            </h2>
                        </div>
                        <div className="intro2 pb-0">
                            <Form layout="vertical" initialValues={initialValues.College} onFinishFailed={onFinishFailed} onFinish={(values) => next(values)}>
                                <Row gutter={16}>

                                    <Col xs={24} className="custom-fields">
                                        <Form.Item label="College/University Name" name="CollegeId" rules={[{ required: true, message: "College / University name required" }]}>
                                            <Select defaultValue={initialValues.College.CollegeId} showSearch placeholder="Select a college" onChange={(val) => handleChange("CollegeId", val)}>
                                                {colleges?.map((college, indx) => <Option value={college?.CollegeId}><Avatar src={college.Image} />{college?.CollegeName}</Option>)}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={12} className="custom-fields">
                                        <Form.Item label="Branch name" name="BranchId" rules={[{ required: true, message: "Branch is required" }]}>
                                            <Select defaultValue={initialValues.College.BranchId} placeholder="Select a branch" onChange={(val) => handleChange("BranchId", val)}>
                                                {branches?.map((branch, indx) => <Option value={branch?.BranchId}>{branch?.BranchName}</Option>)}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={12} className="custom-fields">
                                        <Form.Item label="Date of joining" name="DateOfJoining" rules={[{ required: true, message: "Date of joining required" }]}>
                                            <DatePicker defaultValue={initialValues.College.DateOfJoining} onChange={(val) => { handleChange("DateOfJoining", val) }} format="DD/MM/YYYY" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={12} className="custom-fields">
                                        <Form.Item label="Passing out year" name="PassingOutYear" rules={[{ required: true, message: "Passing out year required" }]}>
                                            <DatePicker defaultValue={initialValues.College.PassOutYear} onChange={(val) => { handleChange("PassingOutYear", val) }} picker="year" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={12} className="custom-fields">
                                        <Form.Item label="Current year" name="CurrentYear" rules={[{ required: true, message: "Current year required" }]}>
                                            <Select defaultValue={initialValues.College.CurrentYear} placeholder="Select an option" onChange={(val) => { handleChange("CurrentYear", val) }}>
                                                <Option value="1">1</Option>
                                                <Option value="2">2</Option>
                                                <Option value="3">3</Option>
                                                <Option value="4">4</Option>
                                                <Option value="5">5</Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} className="custom-fields">
                                        <Form.Item label="Choose you're courses" name="Subjects" rules={[{ required: true, message: "Please select at least one subject" }]}>
                                            <Select mode="multiple" defaultValue={fetchSelectedSubjects()} showSearch placeholder="Select a course" onChange={onSubjectsSelection} filterOption={(input, option) =>
                                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }>
                                                {subjects?.map((subject, indx) => <Option key={indx} value={subject.SubjectId}>{subject?.SubjectName}</Option>)}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <div className="steps-action">
                                    <Button type="primary" htmlType="submit">
                                        Next
                                        </Button>
                                </div>
                            </Form>
                        </div >
                    </Col>
                </Row>,
        },
        {
            content:
                <>
                    <Row gutter={8}>
                        <Col xs={24} md={8}>
                            <div className="intro1">
                                <img src={Logo} alt="blackbuck" width="250px" />
                                <h1> Welcome to Blackbuck</h1>
                                <p>To bring premier and practical formal education closer to students and professionals.</p>
                                <div className="intro-image text-center">
                                    <img src={Onboard2} alt="blackbuck" width="200px" />
                                </div>
                            </div>

                        </Col>
                        <Col xs={24} md={16} className="right">
                            <div className="intro-title">
                                <h2>Tell us what you are Interested in?</h2>
                                <p>You can select few</p>
                            </div>

                            <div className="intro4">
                                <Checkbox.Group style={{ width: '100%' }} onChange={onInterestSelection}>
                                    <Row gutter={8}>
                                        {interests.map((subject, indx) => <Col span={12}>
                                            <Checkbox key={indx} className="intro-check" value={subject}><span>{subject?.Name}</span></Checkbox>
                                        </Col>)}
                                    </Row>
                                </Checkbox.Group>
                            </div>
                        </Col>
                    </Row>
                    <div className="steps-action">
                        <Button className="backbtn" onClick={() => prev()}>
                            Back
                        </Button>
                        {/* <Button type="primary" onClick={() => { finishSetup() }}>
                            Finish
                        </Button> */}
                        <Button type="primary" onClick={() => next()}>
                            Next
                        </Button>
                    </div>
                </>
            ,
        },
        {
            content:
                <>
                    <Row gutter={8}>
                        <Col xs={24} md={8}>
                            <div className="intro1">
                                <img src={Logo} alt="blackbuck" width="250px" />
                                <h1>Welcome to Blackbuck</h1>
                                <p>To bring premier and practical formal education closer to students and professionals.</p>
                                <div className="intro-image text-center">
                                    <img src={Onboard2} alt="blackbuck" width="200px" />
                                </div>
                            </div>

                        </Col>
                        <Col xs={24} md={16} className="right">
                            <div className="intro-title">
                                <h2>Want to join in Groups?</h2>
                            </div>
                            <div className="intro3">
                                <Link className="more-frnd-btn left"><span className="icon left-arrow mr-0"></span></Link><Link className="more-frnd-btn" ><span className="icon right-arrow mr-0"></span></Link>
                                <OwlCarousel autoWidth={true} dots={false} animateOut={true} animateIn={true}>
                                    {groupSuggestions.map((grpItem, idx) => <Card key={idx} className="carousel-card"
                                        cover={<img alt="example" src={grpItem.image} />}
                                    >
                                        <div>
                                            <h5 className="carousel-card-title text-overflow">{grpItem.name}</h5>
                                            <p className="carousel-card-descp text-overflow">{grpItem.deescription}</p>
                                            <div className="text-center">
                                                <Button type="default" className="addfrnd semibold" onClick={() => { joinGroup(grpItem) }}>Join Group</Button>
                                            </div>
                                        </div>
                                    </Card>)}
                                </OwlCarousel>
                            </div>

                        </Col>
                    </Row>
                    <div className="steps-action">
                        <Button className="backbtn" onClick={() => prev()}>
                            Back
                        </Button>
                        <Button type="primary" onClick={() => { finishSetup() }}>
                            Finish
                        </Button>
                    </div>
                </>,
        },

    ];
    return (
        <div className="main">
            <Row align="middle" justify="center">
                <Col xs={24} lg={20}>
                    <Card className="mb-16 custom-card onboard-process" bordered={true} >
                        <div className="steps-content">
                            {steps[current].content}

                            {/* <div className="steps-action">
                        {current > 0 && (
                            <Button className="backbtn" onClick={() => prev()}>
                                Back
                            </Button>
                        )}
                        {current === steps.length - 1 && (
                            <Button type="primary" onClick={() => message.success('Processing complete!')}>
                                Finish
                            </Button>
                        )}
                        {current < steps.length - 1 && (
                            <Button type="primary" htmlType="submit" onClick={() => next()}>
                                Next
                            </Button>
                        )}
                    </div> */}

                        </div>
                        {/* <Row gutter={8}>
                    <Col xs={24} md={8}>
                        <div style={{ height: '100%', backgroundColor: 'var(--grey)' }}></div>
                    </Col>
                    <Col xs={24} md={16}>
                       

                    </Col>
                </Row> */}


                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default connectStateProps(withRouter(OnBoard)); 