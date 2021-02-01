import React, { useEffect, useState } from "react";
import { Button, Card, Col, DatePicker, Form, Input, Row, Select } from "antd";
import TextArea from "antd/lib/input/TextArea";
import moment from "moment";
import { uuidv4 } from "../../utils";
import { getJobById, saveJobPost } from "../../shared/api/apiServer";
import notify from "../../shared/components/notification";
import Loader from "../../common/loader";
import connectStateProps from "../../shared/stateConnect";
import { useParams, withRouter } from "react-router-dom/cjs/react-router-dom.min";
import { RegionDropdown } from "react-country-region-selector";
const {Option} = Select;

const PostingJob = ({profile,history}) => {
    const jobpostObj = {
            "JobId": uuidv4(),
            "Title": "",
            "EmployerName": "",
            "Type": "Internship",
            "Qualification": "",
            "Skills":"",
            "Years": "",
            "Months": "",
            "Status": "Active",
            "SalaryRange": "",
            "StartDate": "",
            "EndDate": "",
            "Place": "",
            "City": "",
            "State": "",
            "Role": "",
            "CreateDate": "",
            "UserDetails": {
              "UserId": profile?.Id,
              "Firstname": profile?.FirstName,
              "Lastname": profile?.LastName,
              "Image": profile?.ProfilePic
            }
          
    }
    const yearsmonths = ['1','2','3','4','5','6','7','8','9','10','11','12']
    let { id } = useParams();
    const [jobPostingObject,setJobPostingObject] = useState({...jobpostObj});
    const [form] = Form.useForm();
    const [loading,setLoading] = useState(false);

    useEffect(()=>{
        if(id !== 'new'){
            getjobbyid(id);
        }
    },[])

    const getjobbyid = async (id)=>{
        setLoading(true)
        const response = await getJobById(profile.Id,id);
        if(response.ok){
            bindEditableData(response.data[0]);
        }
    }

    const bindEditableData = (obj)=>{
        obj.StartDate = obj.StartDate ? moment(obj.StartDate).local() : "";
        obj.EndDate = obj.EndDate ? moment(obj.EndDate).local() : "";
        setJobPostingObject({...obj});
        form.setFieldsValue({...obj});
        setLoading(false);
    }

    const jobSave = async ()=>{
        setLoading(true);
        jobPostingObject.CreateDate = jobPostingObject.CreateDate ? jobPostingObject.CreateDate : new Date();
      jobPostingObject.StartDate = jobPostingObject.StartDate ? moment(jobPostingObject.StartDate).format("YYYY-MM-DDT00:00:00") : jobPostingObject.StartDate;
      jobPostingObject.EndDate = jobPostingObject.EndDate ? moment(jobPostingObject.EndDate).format("YYYY-MM-DDT00:00:00") : jobPostingObject.EndDate;
        const saveresponse = await saveJobPost(jobPostingObject);
        if(saveresponse.ok){
            notify({ message: "Job", description: "Job saved successfully" });
            // setJobPostingObject({...jobpostObj});
            setLoading(false);
            history.push('/admin/jobpostings')
        }
    }

    const handleChange = (prop,val)=>{
        jobPostingObject[prop] = val ? (val.currentTarget ? val.currentTarget.value : val) : "";
        setJobPostingObject({...jobPostingObject});
    }
  return (
    <>
    {loading && <Loader className="loader-middle" />}
      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
          <Form initialValues={{ ...jobpostObj }} onFinishFailed={() => { }} onFinish={() => jobSave()} scrollToFirstError={true} form={form}>
            <Row>
              <Col
                offset={4}
                xs={16}
                sm={16}
                md={16}
                lg={16}
                xl={16}
                xxl={16}
                className="course-steps"
              >
                <div className="">
                  <Card>
                  <Row gutter={16}>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                      <label className="text-secondary d-block mb-4 semibold required">
                        Title
                      </label>
                      <Form.Item
                        className="custom-fields"
                        name="Title"
                        rules={[{ required: true, message: "Title  required" }]}
                      >
                        <Input
                          placeholder="Title"
                          onChange={(value) => handleChange('Title', value)}
                          maxLength={150}
                          autoComplete="off"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                      <label className="text-secondary d-block mb-4 semibold required">
                        Employer Name
                      </label>
                      <Form.Item
                        className="custom-fields"
                        name="EmployerName"
                        rules={[
                          {
                            required: true,
                            message: "Employer Name  required",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Employer Name"
                          onChange={(value) => handleChange('EmployerName', value)}
                          maxLength={150}
                          autoComplete="off"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                      <label className="text-secondary d-block mb-4 semibold required">
                        Job Type
                      </label>
                      <Form.Item
                        className="custom-fields"
                        name="Type"
                        rules={[
                          { required: true, message: "Job Type  required" },
                        ]}
                      >
                        <Select
                          defaultValue="Internship"
                          className="text-left"
                          onChange={(value) => handleChange('Type', value)}
                        >
                          <Option value="Job">Job</Option>
                          <Option value="Internship">Internship</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                      <label className="text-secondary d-block mb-4 semibold required">
                        Qualification
                      </label>
                      <Form.Item
                        className="custom-fields"
                        name="Qualification"
                        rules={[
                          {
                            required: true,
                            message: "Qualification  required",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Qualification"
                          onChange={(value) => handleChange('Qualification', value)}
                          maxLength={150}
                          autoComplete="off"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                      <label className="text-secondary d-block mb-4 semibold required">
                        Skills
                      </label>
                      <Form.Item
                        className="custom-fields"
                        name="Skills"
                        rules={[
                          {
                            required: true,
                            message: "Skills  required",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Skills"
                          onChange={(value) => handleChange('Skills', value)}
                          maxLength={150}
                          autoComplete="off"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                      <label className="text-secondary d-block mb-4 semibold required">
                        Years
                      </label>
                      <Form.Item
                        className="custom-fields"
                        name="Years"
                        rules={[{ required: true, message: "Years  required" }]}
                      >
                          <Input
                          placeholder="Years"
                          onChange={(value) => handleChange('Years', value)}
                          maxLength={150}
                          autoComplete="off"
                        />
                        {/* <Select
                          defaultValue=""
                          className="text-left"
                          onChange={(value) => handleChange('Years', value)}
                        >
                          <Option value="">Select Year</Option>
                          {yearsmonths.map((yearfield,indx)=>{
                              return <Option key={indx} value={yearfield}>{yearfield}</Option>
                          })}
                        </Select> */}
                      </Form.Item>
                    </Col>
                    <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                      <label className="text-secondary d-block mb-4 semibold required">
                        Months
                      </label>
                      <Form.Item
                        className="custom-fields"
                        name="Months"
                        rules={[
                          { required: true, message: "Months  required" },
                        ]}
                      >
                        <Select
                          defaultValue=""
                          className="text-left"
                          onChange={(value) => handleChange('Months', value)}
                        >
                          <Option value="">Select Month</Option>
                          {yearsmonths.map((monthfield,indx)=>{
                              return <Option key={indx} value={monthfield}>{monthfield}</Option>
                          })}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                      <label className="text-secondary d-block mb-4 semibold required">
                        Salary Range
                      </label>
                      <Form.Item
                        className="custom-fields"
                        name="SalaryRange"
                        rules={[
                          { required: true, message: "Salary Range  required" },
                        ]}
                      >
                        <Input
                          placeholder="Salary Range"
                          onChange={(value) => handleChange('SalaryRange', value)}
                          maxLength={150}
                          autoComplete="off"
                        />
                      </Form.Item>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      xxl={12}
                      className="custom-fields"
                    >
                      <label className="text-secondary d-block mb-4 semibold required">
                        Start Date
                      </label>
                      <Form.Item
                        className="custom-fields"
                        name="StartDate"
                        rules={[
                          { required: true, message: "Start Date required" },
                        ]}
                      >
                        <DatePicker
                          placeholder="Start Date"
                          format="MM/DD/YYYY"
                          onChange={(value) => handleChange('StartDate', value)}
                          disabledDate={(current) => {
                            return (moment().add(-1, "days") >= current || moment(jobPostingObject.EndDate ? jobPostingObject.EndDate : '').add(+1, "days") <= current);
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      xxl={12}
                      className="custom-fields"
                    >
                      <label className="text-secondary d-block mb-4 semibold required">
                        End Date
                      </label>
                      <Form.Item
                        className="custom-fields"
                        name="EndDate"
                        rules={[
                          { required: true, message: "End Date required" },
                        ]}
                      >
                        <DatePicker
                          placeholder="End Date"
                          format="MM/DD/YYYY"
                          onChange={(value) => handleChange('EndDate', value)}
                          disabledDate={(current) => {
                            return (moment().add(-1, "days") >= current || moment(jobPostingObject.StartDate ? jobPostingObject.StartDate : '').add(-1, "days") >= current);
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                      <label className="text-secondary d-block mb-4 semibold required">
                        Place
                      </label>
                      <Form.Item
                        className="custom-fields"
                        name="Place"
                        rules={[{ required: true, message: "Place  required" }]}
                      >
                        <Input
                          placeholder="Place"
                          onChange={(value) => handleChange('Place', value)}
                          maxLength={150}
                          autoComplete="off"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                      <label className="text-secondary d-block mb-4 semibold required">
                        City
                      </label>
                      <Form.Item
                        className="custom-fields"
                        name="City"
                        rules={[{ required: true, message: "City  required" }]}
                      >
                        <Input
                          placeholder="City"
                          onChange={(value) => handleChange('City', value)}
                          maxLength={150}
                          autoComplete="off"
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
                      <label className="text-secondary d-block mb-4 semibold required">
                        State
                      </label>
                      <Form.Item
                        className="custom-fields"
                        name="State"
                        rules={[{ required: true, message: "State  required" }]}
                      >
                          <RegionDropdown
                          showDefaultOption={true}
                          defaultOptionLabel="Select State"
                          blankOptionLabel="Select State"
                          onChange={(value) => handleChange("State", value)}
                          country='India'
                        />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                      <label className="text-secondary d-block mb-4 semibold required">
                        Role
                      </label>
                      <Form.Item
                        className="mb-0"
                        name="Role"
                        rules={[{ required: true, message: "Role  required" }]}
                      >
                        <TextArea 
                          placeholder="Role"
                          onResize
                          autoSize={{ minRows: 3, maxRows: 30 }}
                          onChange={(value) => handleChange('Role', value)}
                          maxLength={1360}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  </Card>
                </div>
                <div className="card-background mt-16">
                    <span className="text-left">
                        <Button
                          type="default"
                          className="addContent px-16"
                          size="small"
                          onClick={()=>{
                              history.push('/admin/jobpostings')
                          }}
                        >
                          Cancel
                        </Button>
                      </span>
                      <span className="text-right float-right">
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="addContent px-16"
                          size="small"
                          style={{ marginRight: 8 }}
                        >
                          Save Job
                        </Button>
                      </span>
                    </div>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default connectStateProps(withRouter(PostingJob));
