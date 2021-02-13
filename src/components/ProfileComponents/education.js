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
      Degree: "",
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
        Degree,
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
        Degree,
        Location,
        EducationType,
        AcademicYear,
        MarksGrade,
      });
    } else {
      initialValues = {
        EducationType: "",
        Name: "",
        Degree: "",
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
        Degree: values.Degree,
        AcademicYear: values.AcademicYear,
        StartDate: moment(values.AcademicYear[0]._d).format("YYYY"),
        EndDate: moment(values.AcademicYear[1]._d).format("YYYY"),
        Location: values.Location,
        MarksGrade: values.MarksGrade,
        File: this.state.educationObj.uploadsources,
        EducationType: values.EducationType,
      },
    };
  };
  saveEducation = (values) => {
    this.setState({ ...this.state, loading: true });
    const saveObj = this.createObject(values);
    saveEducation(saveObj).then((res) => {
      this.setState(
        {
          loading: false,
          visible: false,
        },
        () => {
          notify({
            description: `Education ${
              this.state.isEdit ? "Edited" : "saved"
            } successfully`,
            message: "Education",
          });
          this.props.callback(true);
        }
      );
    });
  };
  handleCancel = (e) => {
    this.formRef.current.resetFields();
    this.setState({
      ...this.state,
      educationObj: educationObj,
      visible: false,
      initialValues: {
        EducationType: "",
        Name: "",
        Degree: "",
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
    accept: ".png,.jpeg,.pdf",
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
  handleChange = (prop, val) => {
    let initialValues = { ...this.state.initialValues };
    initialValues[prop] = val
      ? val.currentTarget
        ? val.currentTarget.value
        : val
      : "";
    this.setState({ ...this.state, initialValues: initialValues });
  };
  render() {
    const { user } = store.getState().oidc;

    const { education, visible, initialValues, EducationTypeLu } = this.state;
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
                      <span className="icons education-icon" />
                    </div>
                  }
                  title={
                    <div className="d-flex align-items-center">
                      <span className="overflow-text">{item.Name}</span>
                    </div>
                  }
                  description={
                    <div>
                      <span style={{ color: "var(--textprimary)" }}>
                        {item.Degree}
                      </span>{" "}
                      {item.StartDate} - {item.EndDate}
                      {/* <Moment format="YYYY/MM/DD">{item.StartDate}</Moment> -{" "}
                      <Moment format="YYYY/MM/DD">{item.EndDate}</Moment>{" "} */}
                      <div
                        style={{
                          color: "var(--textprimary)",
                          textTransform: "capitalize",
                        }}
                      >
                        {item.Location}
                      </div>
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
          saved={() => {
            this.formRef.current.validateFields().then((values) => {
              this.formRef.current.resetFields();
              this.saveEducation(values);
            });
          }}
        >
          <div className="">
            {this.state.loading && <Loader className="loader-top-middle" />}
            {visible && (
              <Form
                layout="vertical"
                initialValues={initialValues}
                ref={this.formRef}
              >
                <Row gutter={16}>
                  <Col xs={24} sm={24}>
                    <Form.Item
                      label="Education Type"
                      name="EducationType"
                      rules={[
                        { required: true, message: "Education Type required" },
                      ]}
                      className="custom-fields custom-select"
                    >
                      <Select
                        defaultValue=""
                        onChange={(value) =>
                          this.handleChange("EducationType", value)
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
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24}>
                    <Form.Item
                      label={
                        initialValues.EducationType === "School"
                          ? "School Name"
                          : "College/University Name"
                      }
                      name="Name"
                      rules={[
                        {
                          required: true,
                          message: `School/College Name required`,
                        },
                      ]}
                      className="custom-fields"
                    >
                      <Input
                        className="ant-input"
                        placeholder="Name"
                        name="Name"
                        onChange={(value) => this.handleChange("Name", value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24}>
                    <Form.Item
                      label="Degree"
                      name="Degree"
                      rules={[{ required: true, message: "Degree required" }]}
                      className="custom-fields"
                    >
                      <Input
                        className="ant-input"
                        placeholder="Degree"
                        name="Degree"
                        onChange={(value) => this.handleChange("Degree", value)}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24}>
                    <Form.Item
                      label="Academic Year"
                      name="AcademicYear"
                      rules={[
                        { required: true, message: "Academic Year required" },
                      ]}
                      className="custom-fields education-date"
                    >
                      {/* <Input.Group> */}
                      <RangePicker
                        // disabledDate={this.disabledDate}
                        picker="year"
                        value={initialValues.AcademicYear}
                        onChange={(value) =>
                          this.handleChange("AcademicYear", value)
                        }
                      />
                      {/* </Input.Group> */}
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label={`Place of ${
                        initialValues.EducationType === "School"
                          ? "School"
                          : "College/University"
                      }`}
                      name="Location"
                      rules={[
                        {
                          required: true,
                          message: `Place of ${
                            initialValues.EducationType === "School"
                              ? "School"
                              : "College/University"
                          } required`,
                        },
                      ]}
                      className="custom-fields"
                    >
                      <Input
                        className="ant-input"
                        placeholder={`Place of ${
                          initialValues.EducationType === "School"
                            ? "School"
                            : "College/University"
                        }`}
                        name="Location"
                        onChange={(value) =>
                          this.handleChange("Location", value)
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Marks Grade"
                      name="MarksGrade"
                      rules={[
                        { required: true, message: "Marks Grade required" },
                        { validator:(rule,value,callback)=>{
                          if(value){
                            if(!Number(value)){
                              callback('Only Numbers allowed')
                            }
                          }else{
                            callback()
                          }
                          return;
                        }}
                      ]}
                      className="custom-fields"
                    >
                      <Input
                        className="ant-input"
                        placeholder="Marks Grade"
                        onChange={(value) =>
                          this.handleChange("MarksGrade", value)
                        }
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            )}
          </div>
        </CommonModal>
      </div>
    );
  }
}
export default Education;
