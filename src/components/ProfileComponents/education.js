import React, { Component, createRef } from "react";
import {
  Card,
  Avatar,
  List,
  Divider,
  Row,
  Col,
  Form,
  Input,
  Select,
  DatePicker,
  message,
} from "antd";
import { Link } from "react-router-dom";
// import { userManager } from '../../shared/authentication/auth';
import { store } from "../../store";
// import User1 from '../styles/images/avatar.png';
// import User2 from '../styles/images/user.jpg';
// import User3 from '../styles/images/user_image.jpg';
// import User4 from '../styles/images/user-image.jpg';
// import { userLogout } from '../../reducers/auth';
import "../../index.css";
import "../../App.css";
import { Meta } from "antd/lib/list/Item";
import Dragger from "antd/lib/upload/Dragger";
import CommonModal from "./CommonModal";
import notify from "../../shared/components/notification";
import { saveEducation } from "../../shared/api/apiServer";
import { ErrorMessage, Field, Formik } from "formik";
const { Option } = Select;
const { RangePicker } = DatePicker;

class Education extends Component {
  formRef = createRef();
  state = {
    education: this.props.education,
    visible: false,
    lstEducation: [],
    errors: {},
  };
  showModal = (e) => {
    e.preventDefault();
    this.setState({
      visible: true,
    });
  };
  saveEducation = (e) => {
    let { errors } = this.state;
    errors = this.handleValidate(this.formRef.current.values);
    this.setState({ errors: errors });
    saveEducation(this.props?.profile?.Id, this.state.lstEducation).then(
      (res) => {
        message.success("Education saved successfully");
      }
    );
    this.setState({
      visible: false,
    });
  };
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
  initialValues = {
    EducationType: "",
    College: "",
    AcademicYear: "",
    Place: "",
    MarksGrade: "",
  };
  errors = {};
  handleValidate = (values) => {
    for (var key in values) {
      if (!values[key]) {
        this.errors[key] = "is required";
      }
    }

    return this.errors;
  };
  addEducation = () => {
    let educatioObj = {
        EducationType: "",
        College: "",
        AcademicYear: "",
        Place: "",
        MarksGrade: "",
        EducationTypeLu: ["School", "College"],
        RecordStatus: "Added",
        uploadSources: [],
      },
      { lstEducation } = this.state;
    lstEducation.push(educatioObj);
    this.setState({ lstEducation: lstEducation });
  };
  deleteEducation = (education, idx) => {
    let { lstEducation } = this.state;
    if (education.RecordStatus == null)
      lstEducation.forEach(function (index, key) {
        if (education.Id == lstEducation[key]) {
          education.RecordStatus = "Deleted";
          lstEducation[key] = education;
        }
      });
    else {
      lstEducation.splice(idx, 1);
    }
    this.setState({ lstEducation: lstEducation });
  };
  handleChange = (event, index, fieldName) => {
    const { lstEducation } = this.state;
    lstEducation[index][
      event.currentTarget ? event.currentTarget.name : fieldName
    ] = event.currentTarget ? event.currentTarget.value : event;
    this.setState({ lstEducation: lstEducation });
  };
  handleDdlChange = (event, index) => {
    const { lstEducation } = this.state;
    lstEducation[index].EducationType = event;
    this.setState({ lstEducation: lstEducation });
  };
  onChange = (info, index) => {
    const { status } = info.file;
    const { lstEducation } = this.state;
    if (status === "done") {
      lstEducation[index].uploadSources.push(info.file);
      this.setState({ ...this.state, lstEducation: lstEducation });
      notify({
        description: `${info.file.name} file uploaded successfully.`,
        message: "Upload",
      });
    } else if (status === "error") {
      notify({
        description: `${info.file.name} file upload failed.`,
        type: "error",
        message: "Upload",
      });
    }
  };
  uploadProps = {
    name: "file",
    multiple: false,
    action: "http://138.91.35.185/tst.blackbuck.identity/Home/UploadFile",
    showUploadList: false,
  };
  deleteFile = (key, index, education) => {
    const { lstEducation } = this.state;
    lstEducation[index].uploadSources.splice(key, 1);
    this.setState({ ...this.state, lstEducation: lstEducation });
  };
  render() {
    const { user } = store.getState().oidc;

    const { education, visible, lstEducation, errors } = this.state;
    return (
      <div className="custom-card profile-card">
        <Card
          title="Education"
          bordered={false}
          extra={
            !this.props.IsHideAction ? (
              <Link onClick={this.showModal}>
                <span className="icons add" />
              </Link>
            ) : null
          }
        >
          <List
            itemLayout="horizontal"
            dataSource={education}
            renderItem={(item) => (
              <div className="edu-card">
                <Meta
                  className="edu-study"
                  avatar={
                    <div className="about-icons">
                      <span className="icons location" />
                    </div>
                  }
                  title={
                    <div className="d-flex align-items-center">
                      <span className="overflow-text">{item.Name}</span>
                    </div>
                  }
                  description={
                    <div>
                      <span style={{ color: "var(--textprimary)" }}></span>{" "}
                      {item.StartDate} - {item.EndDate} |{" "}
                      <span style={{ color: "var(--textprimary)" }}></span>
                      {item.Location}
                    </div>
                  }
                />
                <Meta
                  className="edu-certificate"
                  avatar={
                    <div className="about-icons">
                      <span className="icon education-icon mr-0" />
                    </div>
                  }
                  title={
                    <div className="d-flex align-items-center">
                      <span className="overflow-text">
                        {item.File ? item.File : "No Files"}
                      </span>
                    </div>
                  }
                />
                {!this.props.IsHideAction ? (
                  <Link className="f-12 list-link">
                    <span className="icons edit" />
                  </Link>
                ) : null}
              </div>
            )}
          />
        </Card>
        <CommonModal
          className="custom-popup"
          visible={this.state.visible}
          title="Education"
          cancel={this.handleCancel}
          saved={this.saveEducation}
        >
          {lstEducation.map((education, index) => {
            return (
              <div className="">
                {education.RecordStatus != "Deleted" && (
                  <div>
                    {/* <Divider className="text-left-line" orientation="left">{education.EducationType} <Link onClick={() => { this.deleteEducation(education, index) }}><span className=" icons white-close" /></Link></Divider> */}
                    <Formik
                      initialValues={this.initialValues}
                      innerRef={this.formRef}
                      validate={(values) => this.handleValidate(values)}
                    >
                      {({ touched }) => {
                        return (
                          <Form layout="vertical">
                            <Row gutter={16}>
                              <Col xs={24} sm={12}>
                                <Form.Item
                                  label="Education Type"
                                  className="custom-fields custom-select"
                                >
                                  <Select
                                    defaultValue=""
                                    name="EducationType"
                                    value={education.EducationType}
                                    onChange={(event) =>
                                      this.handleDdlChange(event, index)
                                    }
                                  >
                                    <Option value="">Select State</Option>
                                    {education.EducationTypeLu.map(
                                      (item, index) => {
                                        return (
                                          <Option key={index} value={item}>
                                            {item}
                                          </Option>
                                        );
                                      }
                                    )}
                                  </Select>
                                  <span className="validateerror">
                                    <ErrorMessage name="EducationType" />
                                  </span>
                                  {errors["EducationType"] &&
                                  !touched.EducationType ? (
                                    <span className="validateerror">
                                      {errors["EducationType"]}
                                    </span>
                                  ) : null}
                                </Form.Item>
                              </Col>
                              <Col xs={24} sm={12}>
                                <Form.Item
                                  label="College/University Name"
                                  className="custom-fields"
                                >
                                  <Field
                                    className="ant-input"
                                    value={education.College}
                                    name="College"
                                    onChange={(event) =>
                                      this.handleChange(event, index, education)
                                    }
                                  />
                                  <span className="validateerror">
                                    <ErrorMessage name="College" />
                                  </span>
                                  {errors["College"] && !touched.College ? (
                                    <span className="validateerror">
                                      {errors["College"]}
                                    </span>
                                  ) : null}
                                </Form.Item>
                              </Col>
                              <Col xs={24} sm={12}>
                                <Form.Item
                                  label="Academic Year"
                                  className="custom-fields"
                                >
                                  <Input.Group compact>
                                    <RangePicker
                                      name="AcademicYear"
                                      value={education.AcademicYear}
                                      onChange={(event) =>
                                        this.handleChange(
                                          event,
                                          index,
                                          "AcademicYear"
                                        )
                                      }
                                    />
                                    <span className="validateerror">
                                      <ErrorMessage name="AcademicYear" />
                                    </span>
                                    {errors["AcademicYear"] &&
                                    !touched.AcademicYear ? (
                                      <span className="validateerror">
                                        {errors["AcademicYear"]}
                                      </span>
                                    ) : null}
                                  </Input.Group>
                                </Form.Item>
                              </Col>
                              <Col xs={24} sm={12}>
                                <Form.Item
                                  label="Place of College/University"
                                  className="custom-fields"
                                >
                                  <Field
                                    className="ant-input"
                                    value={education.Place}
                                    name="Place"
                                    onChange={(event) =>
                                      this.handleChange(event, index, education)
                                    }
                                  />
                                  <span className="validateerror">
                                    <ErrorMessage name="Place" />
                                  </span>
                                  {errors["Place"] && !touched.Place ? (
                                    <span className="validateerror">
                                      {errors["Place"]}
                                    </span>
                                  ) : null}
                                </Form.Item>
                              </Col>
                              <Col xs={24} sm={12}>
                                <Form.Item
                                  label="Marks Grade"
                                  className="custom-fields"
                                >
                                  <Field
                                    className="ant-input"
                                    value={education.MarksGrade}
                                    name="MarksGrade"
                                    onChange={(event) =>
                                      this.handleChange(event, index, education)
                                    }
                                  />
                                  <span className="validateerror">
                                    <ErrorMessage name="MarksGrade" />
                                  </span>
                                  {errors["MarksGrade"] &&
                                  !touched.MarksGrade ? (
                                    <span className="validateerror">
                                      {errors["MarksGrade"]}
                                    </span>
                                  ) : null}
                                </Form.Item>
                              </Col>
                            </Row>
                          </Form>
                        );
                      }}
                    </Formik>
                    <Dragger
                      {...this.uploadProps}
                      onChange={(info) => this.onChange(info, index)}
                      className="upload mb-24"
                    >
                      <span className="sharebox-icons photo-upload"></span>
                      <p className="ant-upload-text mt-8 mb-0">
                        Upload Certificate
                      </p>
                    </Dragger>
                    <div className="docs about-icons mb-16 education">
                      <List
                        itemLayout="horizontal"
                        dataSource={education.uploadSources}
                        renderItem={(item, key) => (
                          <List.Item className="upload-preview">
                            <List.Item.Meta
                              title={item.name}
                              description={
                                <div className="file-size f-14">
                                  {item.size}
                                </div>
                              }
                            />
                            <span
                              className="close-icon"
                              onClick={() =>
                                this.deleteFile(key, index, education)
                              }
                            ></span>
                          </List.Item>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {lstEducation.length == 0 && (
            <Divider className="text-left-line" orientation="left">
              Add Education{" "}
              <Link onClick={() => this.addEducation()}>
                <span className=" icons white-add" />
              </Link>
            </Divider>
          )}
        </CommonModal>
      </div>
    );
  }
}
export default Education;
