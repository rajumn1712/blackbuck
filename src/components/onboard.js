import React, { useEffect, useState } from 'react';
import { Steps, Button, message, Card, List, Avatar, Row, Col, Select, Input, Checkbox, Form, DatePicker } from 'antd';
import Logo from '../styles/images/blackbugs-logo.png';
import Onboard1 from '../styles/images/onboard1.svg';
import Onboard2 from '../styles/images/onboard2.svg';
import { ErrorMessage, Field, Formik } from 'formik';
import GroupsPage from '../shared/components/GroupsPage';
import Computer from '../styles/images/computer.svg';
import { fetchInerests, getBranchSubjects, getCollegeBranches, getColleges, saveOnboard } from '../shared/api/apiServer';
import notify from '../shared/components/notification';
import connectStateProps from '../shared/stateConnect';
import OwlCarousel from 'react-owl-carousel2';
const { Option } = Select;
function onChange(checkedValues) {
    console.log('checked = ', checkedValues);
}



const OnBoard = ({ profile }) => {
    const [current, setCurrent] = React.useState(0);
    const [colleges, setColleges] = useState([]);
    const [branches, setBranches] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [initialValues, setInitialValues] = useState({
        "UserDetails": {
            "UserId": profile?.Id,
            "Firstname": profile?.FirstName,
            "Lastname": profile?.LastName,
            "Image": profile?.ProfilePic,
            "Email": profile?.Email
        },
        "College": {
            "CollegeId": "",
            "CollegeName": "",
            "BranchId": "",
            "BranchName": "",
            "Subjects": []
        },
        "Interests": []
    })
    const [interests, setInterests] = useState([]);
    const next = async () => {
        if (current === 0) {
            await saveOnboard({ UserDetails: { ...initialValues.UserDetails }, College: { ...initialValues.College }, OnBoardStep: "1" });
            fetchInterests();
        } else if (current == 1) {
            await saveOnboard({ UserDetails: { ...initialValues.UserDetails }, Interests: [...initialValues.Interests], OnBoardStep: "2" });
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
        prop === "CollegeId" ? fetchBranches() : fetchSubjects();
    }
    const onSubjectsSelection = (subject) => {
        let object = { ...initialValues };
        const idx = object.College.Subjects.indexOf(subject[0]);
        if (idx > -1) {
            object.College.Subjects.splice(idx, 1);
        } else {
            object.College.Subjects.push(subject[0])
        }
        setInitialValues(object);
    }
    const onInterestSelection = (subject) => {
        let object = { ...initialValues };
        const idx = object.Interests.indexOf(subject[0]);
        if (idx > -1) {
            object.Interests.splice(idx, 1);
        } else {
            object.Interests.push(subject[0])
        }
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
    useEffect(() => {
        fetchColleges();
    }, []);

    const steps = [
        {
            content:
                <Row gutter={8}>
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
                            <Form layout="vertical" initialValues={initialValues} onFinishFailed={(err) => console.log(err)}>
                                <Row gutter={16}>

                                    <Col xs={24} className="custom-fields">
                                        <Form.Item label="College/University Name" name="CollegeId" rules={[{ required: true, message: "College / University name required" }]}>
                                            <Select defaultValue={initialValues.College.CollegeId} showSearch placeholder="Select a college" onChange={(val) => handleChange("CollegeId", val)}>
                                                {colleges?.map((college, indx) => <Option value={college?.CollegeId}><Avatar src={college.Image} />{college?.CollegeName}</Option>)}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={12} className="custom-fields">
                                        <Form.Item label="Branch name" name="course" rules={[{ required: true, message: "Course name required" }]}>
                                            <Select defaultValue={initialValues.College.BranchId} placeholder="Select a branch" onChange={(val) => handleChange("BranchId", val)}>
                                                {branches?.map((branch, indx) => <Option value={branch?.BranchId}>{branch?.BranchName}</Option>)}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={12} className="custom-fields">
                                        <Form.Item label="Date of joining" name="JoiningDate" rules={[{ required: true, message: "Date of joining required" }]}>
                                            <DatePicker defaultValue={initialValues.College.JoiningDate} onChange={(val) => { handleChange("DateOfJoining", val) }} format="DD/MM/YYYY" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={12} className="custom-fields">
                                        <Form.Item label="Passing out year" name="PassOutYear" rules={[{ required: true, message: "Passing out year required" }]}>
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
                                </Row>
                            </Form>
                        </div >
                        {subjects.length > 0 && <><div className="intro-subtitle">
                            <h2>
                                Choose you're subjects
                            </h2>
                        </div>
                            <div className="intro4">
                                <Checkbox.Group style={{ width: '100%' }} onChange={onSubjectsSelection}>
                                    <Row gutter={8}>
                                        {subjects.map((subject, indx) => <Col span={12}>
                                            <Checkbox key={indx} className="intro-check" value={subject}><span>{subject?.SubjectName}</span></Checkbox>
                                        </Col>)}

                                    </Row>
                                </Checkbox.Group>
                            </div></>}
                    </Col>
                </Row>,
        },
        {
            content:
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

            ,
        },
        {
            content:
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
                            <OwlCarousel items={3} autoWidth={true}>
                                <Card className="carousel-card"
                                    cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                                >
                                   <div>
                                        <h5 className="carousel-card-title text-overflow">Civil Engineering</h5>
                                        <p className="carousel-card-descp text-overflow">Civil engineering is a professional engineering discipline that deals with the design, construction, and maintenance of the physical and naturally built environment,</p>
                                        <div className="text-center">
                                            <Button type="default" className="addfrnd semibold">Join Group</Button>
                                        </div>
                                    </div>
                                </Card>
                            </OwlCarousel>
                        </div>

                    </Col>
                </Row>
            ,
        },

    ];
    return (
        <>

            <Card className="mb-16 custom-card onboard-process" bordered={true} >
                <div className="steps-content">
                    {steps[current].content}

                    <div className="steps-action">
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
                            <Button type="primary" onClick={() => next()}>
                                Next
                            </Button>
                        )}
                    </div>

                </div>
                {/* <Row gutter={8}>
                    <Col xs={24} md={8}>
                        <div style={{ height: '100%', backgroundColor: 'var(--grey)' }}></div>
                    </Col>
                    <Col xs={24} md={16}>
                       

                    </Col>
                </Row> */}


            </Card>
        </>
    );
};

export default connectStateProps(OnBoard); 