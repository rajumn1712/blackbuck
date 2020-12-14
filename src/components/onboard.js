import React, { useEffect, useState } from 'react';
import { Steps, Button, message, Card, List, Avatar, Row, Col, Select, Input, Checkbox, Form } from 'antd';
import Logo from '../styles/images/blackbugs-logo.png';
import Onboard1 from '../styles/images/onboard1.svg';
import Onboard2 from '../styles/images/onboard2.svg';
import { ErrorMessage, Field, Formik } from 'formik';
import GroupsPage from '../shared/components/GroupsPage';
import Computer from '../styles/images/computer.svg';
import { getBranchSubjects, getCollegeBranches, getColleges } from '../shared/api/apiServer';
import notify from '../shared/components/notification';
import connectStateProps from '../shared/stateConnect';
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
        }
    })

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
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
    const onSubjectsSelection = () => {

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
                        <div className="intro2">
                            <Form layout="vertical" initialValues={initialValues} onFinishFailed={(err) => console.log(err)}>
                                <Row gutter={16}>

                                    <Col xs={24} className="custom-fields">
                                        <Form.Item label="College/University Name" name="CollegeId" rules={[{ required: true, message: "College / University name required" }]}>
                                            <Select showSearch placeholder="Select a college" onChange={(val) => handleChange("CollegeId", val)}>
                                                {colleges?.map((college, indx) => <Option value={college?.CollegeId}><Avatar src={college.Image} />{college?.CollegeName}</Option>)}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={12} className="custom-fields">
                                        <Form.Item label="Branch name" name="course" rules={[{ required: true, message: "Course name required" }]}>
                                            <Select placeholder="Select a branch" onChange={(val) => handleChange("BranchId", val)}>
                                                {branches?.map((branch, indx) => <Option value={branch?.BranchId}>{branch?.BranchName}</Option>)}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    {/* <Col xs={12} className="custom-fields">
                                        <Form.Item label="Branch name" name="branch" rules={[{ required: true, message: "Branch name required" }]}>
                                            <Input />
                                        </Form.Item>
                                    </Col> */}
                                </Row>
                            </Form>
                        </div >
                        {subjects.length > 0 && <><div className="intro-subtitle">
                            <h2>
                                Choose you're subjects
                            </h2>
                        </div>
                            <div className="intro4">
                                <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
                                    <Row gutter={8}>
                                        {subjects.map((subject, indx) => <Col span={12}>
                                            <Checkbox onChange={(val) => onSubjectsSelection(val, subject)} key={indx} className="intro-check" value="Computers"><span>{subject?.SubjectName}</span></Checkbox>
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
                            <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
                                <Row gutter={8}>
                                    <Col span={12}>
                                        <Checkbox className="intro-check" value="Computers"><span><img src={Computer} className="mr-8" /><span>Computers</span></span></Checkbox>
                                    </Col>
                                    <Col span={12}>
                                        <Checkbox className="intro-check" value="Entertainment"><span><img src={Computer} className="mr-8" /><span>Entertainment</span></span></Checkbox>
                                    </Col>
                                    <Col span={12}>
                                        <Checkbox className="intro-check" value="Travel"><span><img src={Computer} className="mr-8" /><span>Travel</span></span></Checkbox>
                                    </Col>
                                    <Col span={12}>
                                        <Checkbox className="intro-check" value="Business"><span><img src={Computer} className="mr-8" /><span>Business</span></span></Checkbox>
                                    </Col>
                                    <Col span={12}>
                                        <Checkbox className="intro-check" value="Education"><span><img src={Computer} className="mr-8" /><span>Education</span></span></Checkbox>
                                    </Col>
                                    <Col span={12}>
                                        <Checkbox className="intro-check" value="Health"><span><img src={Computer} className="mr-8" /><span>Health</span></span></Checkbox>
                                    </Col>
                                    <Col span={12}>
                                        <Checkbox className="intro-check" value="Shopping"><span><img src={Computer} className="mr-8" /><span>Shopping</span></span></Checkbox>
                                    </Col>
                                    <Col span={12}>
                                        <Checkbox className="intro-check" value="Sports"><span><img src={Computer} className="mr-8" /><span>Sports</span></span></Checkbox>
                                    </Col>
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
                            <GroupsPage />
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