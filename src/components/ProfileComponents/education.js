import React, { Component, createRef } from "react";
import {
  Card,
  List,
  Divider,
  Row,
  Col,
  Form,
  Input,
  Select,
  DatePicker,
  Tooltip,
} from "antd";
import { Link } from "react-router-dom";
import { store } from "../../store";
import "../../index.css";
import "../../App.css";
import { Meta } from "antd/lib/list/Item";
import Dragger from "antd/lib/upload/Dragger";
import CommonModal from "./CommonModal";
import notify from "../../shared/components/notification";
import { saveEducation } from "../../shared/api/apiServer";
import { ErrorMessage, Field, Formik } from "formik";
import { hasChanged, uuidv4 } from "../../utils";
import Moment from "react-moment";
import moment from "moment";
import Loader from "../../common/loader";
const { Option } = Select;
const { RangePicker } = DatePicker;

const educationObj = {
  EducationId: "",
  uploadsources: [],
};

class Education extends Component {
  formRef = createRef();
  state = {
    education: [...this.props.education],
    EducationTypeLu: ["School", "College"],
    educationObj: educationObj,
    initialValues: {
      EducationType: "",
      Name: "",
      AcademicYear: "",
      Location: "",
      MarksGrade: "",
    },
    certificates: {
      Avatar: "",
      File: "",
      Size: "",
    },
    isEdit: false,
    visible: false,
    loading: false,
    fileUploading: false,
  };
  disabledDate = (current) => {
    // Can not select days after today and today
    return current && current > moment().endOf("day");
  };
  showModal = (e, isedit, education) => {
    e.preventDefault();
    let { initialValues, educationObj } = { ...this.state };
    if (isedit) {
      let {
        Name,
        Location,
        EducationType,
        AcademicYear,
        MarksGrade,
      } = education;
      educationObj.EducationId = education.EducationId;
      educationObj.uploadsources = [...education.File];
      AcademicYear = AcademicYear.map((date) => {
        return moment(moment(new Date(date)));
      });
      Object.assign(initialValues, {
        Name,
        Location,
        EducationType,
        AcademicYear,
        MarksGrade,
      });
    } else {
      initialValues = {
        EducationType: "",
        Name: "",
        AcademicYear: "",
        Location: "",
        MarksGrade: "",
      };
    }
    this.setState({
      ...this.state,
      visible: true,
      isEdit: isedit ? true : false,
      initialValues: initialValues,
      educationObj: educationObj,
    });
  };
  createObject = (values) => {
    return {
      UserId: this.props.userid,
      Education: {
        EducationId: this.state.isEdit
          ? this.state.educationObj.EducationId
          : uuidv4(),
        Name: values.Name,
        AcademicYear: values.AcademicYear,
        StartDate: values.AcademicYear[0]._d,
        EndDate: values.AcademicYear[1]._d,
        Location: values.Location,
        MarksGrade: values.MarksGrade,
        File: this.state.educationObj.uploadsources,
        EducationType: values.EducationType,
      },
    };
  };
  saveEducation = (e) => {
    this.formRef.current.handleSubmit();
    if (!hasChanged(this.formRef.current.values)) {
      this.setState({ ...this.state, loading: true });
      const saveObj = this.createObject(this.formRef.current.values);
      saveEducation(saveObj).then((res) => {
        this.setState(
          {
            loading: false,
            visible: false,
          },
          () => {
            notify({
              description: "Education saved successfully",
              message: "Education",
            });
            this.props.callback(true);
          }
        );
      });
    }
  };
  handleCancel = (e) => {
    this.formRef.current.setErrors({});
    this.setState({
      ...this.state,
      educationObj: educationObj,
      visible: false,
      initialValues: {
        EducationType: "",
        Name: "",
        AcademicYear: "",
        Location: "",
        MarksGrade: "",
      },
    });
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
  uploadProps = {
    name: "file",
    accept: ".doc,.docx",
    multiple: false,
    action: "http://138.91.35.185/tst.blackbuck.identity/Home/UploadFile",
    showUploadList: false,
  };
  onChange = (info) => {
    this.setState({ ...this.state, fileUploading: true });
    const { status } = info.file;
    let { educationObj, certificates } = {
      ...this.state,
    };
    if (status === "done") {
      certificates.Avatar = info.file.name.split(".")[1];
      certificates.File = info.file.response[0];
      certificates.Size = parseFloat(info.file.size * 0.0009765625).toFixed(3);
      this.setState({ certificates: certificates });
      educationObj.uploadsources.push(this.state.certificates);
      this.setState({
        educationObj: educationObj,
        fileUploading: false,
      });
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
  deleteFile = (key) => {
    const educationObj = { ...this.state.educationObj };
    educationObj.uploadsources.splice(key, 1);
    this.setState({ educationObj: educationObj });
  };
  render() {
    const { user } = store.getState().oidc;

    const {
      education,
      visible,
      educationObj,
      initialValues,
      EducationTypeLu,
    } = this.state;
    return (
      <div className="custom-card profile-card">
        <Card
          title="Education"
          bordered={false}
          extra={
            !this.props.IsHideAction ? (
              <Tooltip title="Add">
                <Link onClick={this.showModal}>
                  <span className="icons add" />
                </Link>
              </Tooltip>
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
                      <Moment format="YYYY/MM/DD">{item.StartDate}</Moment> -{" "}
                      <Moment format="YYYY/MM/DD">{item.EndDate}</Moment> |{" "}
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
                      {item?.File?.length > 0 ? (
                        item.File.map((file, index) => {
                          return (
                            <span className="overflow-text" key={index}>
                              {file.File}
                            </span>
                          );
                        })
                      ) : (
                        <span className="overflow-text">{"No Files"}</span>
                      )}
                    </div>
                  }
                />
                {!this.props.IsHideAction ? (
                  <Link
                    className="f-12 list-link"
                    onClick={(e) => this.showModal(e, true, item)}
                  >
                    <span className="icons edit" />
                  </Link>
                ) : null}
              </div>
            )}
          />
        </Card>
        <CommonModal
          className="custom-popup"
          visible={visible}
          title="Education"
          cancel={this.handleCancel}
          saved={this.saveEducation}
        >
          <div className="">
            {this.state.loading && <Loader className="loader-top-middle" />}
            <Formik
              enableReinitialize={true}
              initialValues={initialValues}
              innerRef={this.formRef}
              validate={(values) => this.handleValidate(values)}
            >
              {({ values, setFieldValue }) => {
                return (
                  <Form layout="vertical">
                    <Row gutter={16}>
                      <Col xs={24} sm={24}>
                        <Form.Item
                          label="Education Type"
                          name="Education Type"
                          rules={[{ required: true }]}
                          className="custom-fields custom-select"
                        >
                          <Select
                            defaultValue=""
                            name="EducationType"
                            value={values.EducationType}
                            onChange={(value) =>
                              setFieldValue("EducationType", value)
                            }
                          >
                            <Option value="">Select Type</Option>
                            {EducationTypeLu.map((item, index) => {
                              return (
                                <Option key={index} value={item}>
                                  {item}
                                </Option>
                              );
                            })}
                          </Select>
                          <span className="validateerror">
                            <ErrorMessage name="EducationType" />
                          </span>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24}>
                        <Form.Item
                          label="College/University Name"
                          name="College/University Name"
                          rules={[{ required: true }]}
                          className="custom-fields"
                        >
                          <Field
                            className="ant-input"
                            value={values.Name}
                            name="Name"
                          />
                          <span className="validateerror">
                            <ErrorMessage name="Name" />
                          </span>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={24}>
                        <Form.Item
                          label="Academic Year"
                          name="Academic Year"
                          rules={[{ required: true }]}
                          className="custom-fields education-date"
                        >
                          <Input.Group compact>
                            <RangePicker
                              disabledDate={this.disabledDate}
                              name="AcademicYear"
                              value={values.AcademicYear}
                              onChange={(value) =>
                                setFieldValue("AcademicYear", value)
                              }
                            />
                            <span className="validateerror">
                              <ErrorMessage name="AcademicYear" />
                            </span>
                          </Input.Group>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="Place of College/University"
                          name="Place of COllege/University"
                          rules={[{ required: true }]}
                          className="custom-fields"
                        >
                          <Field
                            className="ant-input"
                            value={values.Location}
                            name="Location"
                          />
                          <span className="validateerror">
                            <ErrorMessage name="Location" />
                          </span>
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="Marks Grade"
                          name="Marks Grade"
                          rules={[{ required: true }]}
                          className="custom-fields"
                        >
                          <Field
                            className="ant-input"
                            value={values.MarksGrade}
                            name="MarksGrade"
                          />
                          <span className="validateerror">
                            <ErrorMessage name="MarksGrade" />
                          </span>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                );
              }}
            </Formik>
            <Dragger
              {...this.uploadProps}
              onChange={(info) => this.onChange(info)}
              className="upload mb-24"
            >
              {this.state.fileUploading && (
                <Loader className="loader-top-middle" />
              )}
              <span className="sharebox-icons photo-upload"></span>
              <p className="ant-upload-text mt-8 mb-0">Upload Certificate</p>
            </Dragger>
            <div className="docs about-icons mb-16 education">
              <List
                itemLayout="horizontal"
                dataSource={educationObj.uploadsources}
                renderItem={(item, key) => (
                  <List.Item className="upload-preview">
                    <List.Item.Meta
                      avatar={[
                        <span className={`doc-icons ${item.Avatar}`}></span>,
                      ]}
                      title={item.File}
                      description={
                        <div className="file-size f-14">{item.Size}</div>
                      }
                    />
                    <span
                      className="close-icon"
                      onClick={() => this.deleteFile(key, educationObj)}
                    ></span>
                  </List.Item>
                )}
              />
            </div>
          </div>
        </CommonModal>
      </div>
    );
  }
}
export default Education;
