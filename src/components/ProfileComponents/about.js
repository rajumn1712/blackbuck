import React, { Component, createRef } from "react";
import {
  Card,
  Divider,
  Row,
  Col,
  Form,
  Input,
  Tooltip,
  Button,
  Avatar,
  Select,
} from "antd";
import { Link } from "react-router-dom";
import { store } from "../../store";
import "../../index.css";
import "../../App.css";
import CommonModal from "./CommonModal";
import { ErrorMessage, Field, Formik } from "formik";
import { getColleges, saveAboutMe } from "../../shared/api/apiServer";
import { hasChanged, uuidv4 } from "../../utils";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import notify from "../../shared/components/notification";
import Loader from "../../common/loader";
import { apiClient } from "../../shared/api/clients";
import moment from "moment";
import { connect } from "react-redux";
import { profileSuccess } from "../../reducers/auth";
import TextArea from "antd/lib/input/TextArea";

const { Option } = Select;

class About extends Component {
  formRef = createRef();

  state = {
    Firstname: this.props.about.Firstname,
    Lastname: this.props.about.Lastname,
    CollegeId: [],
    PhoneNumber: this.props.about.PhoneNumber
      ? this.props.about.PhoneNumber
      : "",
    Email: this.props.about.Email,
    AboutMe: this.props.about.Aboutme ? this.props.about.Aboutme : "",
    finalAddress: this.props.about.Address,
    address: {},
    visible: false,
    loading: false,
    colleges: [],
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
  handleOnChange = (event) => {
    const input = event.target;
    const user = { ...this.state };
    user[input.name] = input.value;
    this.setState(user);
  };
  showModal = (e) => {
    e.preventDefault();
    this.fetchColleges();
    let editObject = { ...this.state };
    editObject.address =
      this.props.about.Address.length > 0
        ? { ...this.props.about.Address[0] }
        : {
            // PlatNo: "",
            Street: "",
            // Address: "",
            City: "",
            State: "",
            Country: "",
            PinCode: "",
          };
    editObject.address = Object.assign(editObject.address, {
      PhoneNumber: editObject.PhoneNumber,
      AboutMe: editObject.AboutMe,
      Firstname: editObject.Firstname,
      Lastname: editObject.Lastname,
      CollegeId: [],
      CollegeName: null,
    });
    editObject.address.CollegeId.push((this.props.about?.College?.CollegeId) ? (this.props.about?.College?.CollegeId) : (this.props.about?.College?.CollegeName));
    let { address } = this.state;
    address = { ...editObject.address }
    address.CollegeId = editObject.address.CollegeId;
    this.setState({
      ...this.state, address: address
    }, () => {
      this.setState({ visible: true });
    });
  };

  fetchColleges = async () => {
    this.setState({ ...this.state, loading: true });
    const collegeResponse = await getColleges();
    if (collegeResponse.ok) {
      let { colleges } = this.state;
      colleges = collegeResponse.data;
      this.setState({ ...this.state, colleges, loading: false });
    } else {
      this.setState({ ...this.state, loading: false });
      notify({
        message: "Error",
        type: "error",
        description: "Something went wrong :)",
      });
    }
  };

  handleOk = async (values) => {
    this.setState({ ...this.state, loading: true }, () => {
      this.props.profile.FirstName = values.Firstname;
      this.props.profile.LastName = values.Lastname;
      this.props.updateProfile(this.props.profile);
    });
    const saveObj = this.createSaveObj(values);
    const response = await saveAboutMe(saveObj);
    if (response.ok) {
      this.setState(
        {
          loading: false,
          visible: false,
        },
        () => {
          notify({
            description: "Profile edited successfully",
            message: "Abou Me",
          });
          this.props.callback(true);
        }
      );
    } else {
      this.setState({ loading: false }, () => {
        notify({
          description: "Something went wrong",
          message: "Error",
          type: "error",
        });
      });
    }
  };
  createSaveObj = (values) => {
    if(!this.state.address.CollegeName){
      let { address } = this.state;
      address.dupCollegeName = this.state.colleges?.filter(
        (item) => item.CollegeId === this.props.about?.College?.CollegeId
      )[0]?.CollegeName;
      address.CollegeName = address.dupCollegeName ? address.dupCollegeName : address.CollegeName;
    this.setState({...this.state,address});
    }
    const saveObj = {
      UserId: this.props.about.UserId,
      Aboutme: values.AboutMe,
      PhoneNumber: values.PhoneNumber,
      Firstname: values.Firstname,
      Lastname: values.Lastname,
      CollegeId: Array.isArray(values.CollegeId) ? values.CollegeId[0]:values.CollegeId,
      CollegeName: this.state.address.CollegeName,
      IsNameModified:
        this.props.about.Firstname === values.Firstname &&
        this.props.about.Lastname === values.Lastname
          ? false
          : true,
      Address: [
        {
          AddressId: this.state.address.AddressId
            ? this.state.address.AddressId
            : uuidv4(),
          // PlatNo: values["PlatNo"],
          Street: values["Street"],
          // Address: values["Address"],
          City: values["City"],
          State: values["State"],
          Country: values["Country"],
          PinCode: values["PinCode"],
        },
      ],
    };
    return saveObj;
  };
  handleCancel = (e) => {
    this.formRef.current.resetFields();
    this.setState({
      visible: false,
      address: {},
    });
  };
  ExportPdf = () => {
    this.setState({ ...this.state, loading: true });
    // const doc = new jsPDF();
    const profileData = this.props.about;
    const html = `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">     
    <link href="http://fonts.cdnfonts.com/css/neue-haas-grotesk-text-pro" rel="stylesheet">       
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Download Profile</title>
    <style>
         @import url('http://fonts.cdnfonts.com/css/neue-haas-grotesk-text-pro');
        * {
            font-family: 'Neue Haas Grotesk Text Pro', sans-serif;
        }
       
    </style>
</head>

<body style="margin: 0;width: 794px;">
    <table style="width: 794px;background-color: #07A3B2;margin: auto;border-collapse: collapse;">
        <tr>
            <td style="width: 30%;padding: 60px 24px 24px;vertical-align: top;">
                <table style="border-collapse: collapse;width: 100%;">
                    <tr style="margin-bottom: 24px;">
                        <td>
                            <h3 style="font-size: 22px;font-weight: 400; line-height: 26px; color:#ffffff;margin-top: 0;margin-bottom: 0.5em;">Contact</h3>
                            <p style="margin-bottom: 6px;color:#ffffff;margin-top: 0;line-height: 1.5715;font-size: 14px;">${
                              profileData.PhoneNumber || ""
                            }</p>
                            <p style="margin-bottom: 6px;color:#ffffff;margin-top: 0;line-height: 1.5715;font-size: 14px;">${
                              profileData.Email
                            }</p>
                            ${profileData.Address?.map(
                              (displayaddress, index) => {
                                delete displayaddress.AddressId;
                                return `<p key={index} style="margin-bottom: 6px;color:#ffffff;margin-top: 0;line-height: 1.5715;font-size: 14px;">
                                  ${Object.keys(displayaddress)
                                    ?.map((k) => {
                                      return displayaddress[k];
                                    })
                                    .join(",")}
                                </p>`;
                              }
                            )}
                            
                            <p style="margin-bottom: 6px;color:#ffffff;margin-top: 0;line-height: 1.5715;font-size: 14px;word-break: break-all;">${
                              process.env.REACT_APP_HOSTURL +
                              "profileview/" +
                              profileData.UserId
                            }</p> 
                        </td>
                    </tr>
                    <tr>
                        <td >
                            <h3 style="font-size: 22px;font-weight: 400; line-height: 26px; color:#ffffff;margin-bottom: 0.5em;">Internships</h3>
                            ${profileData.Internships?.map(
                              (internship, index) => {
                                return `<p key={index} style="margin-bottom: 6px;color:#ffffff;margin-top: 0;line-height: 1.5715;font-size: 14px;">
                                  ${internship.CompanyName}-${internship.Duration}
                                </p>`;
                              }
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td >
                            <h3 style="font-size: 22px;font-weight: 400; line-height: 26px; color:#ffffff;margin-bottom: 0.5em;">Certified Courses</h3>
                            ${this.props.certifiedcourses?.map((course) => {
                              return `<p key={index} style="margin-bottom: 6px;color:#ffffff;margin-top: 0;line-height: 1.5715;font-size: 14px;">
                                  ${course.CourseName}
                                </p>`;
                            })}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h3  style="font-size: 22px;font-weight: 400; line-height: 26px; color:#ffffff;margin-bottom: 0.5em;">Hobbies</h3>
                            <ul style="list-style-type: none;padding-left: 0;">
                            ${profileData.Hobbies?.map((hobbie, index) => {
                              return `<li key={index} style="color:#ffffff;margin-top: 0;line-height: 1.5715;font-size: 14px;padding:0">${hobbie}</li>`;
                            })}
                            </ul>
                        </td>
                    </tr>
                </table>
            </td>
            <td style="background-color: #ffffff;width: 70%;padding: 60px 24px 24px;vertical-align: top;">
                <table style="border-collapse: collapse; width:100%;">
                    <tr>
                        <td >
                            <h1 style="margin-top:0;font-weight: 400;font-size: 36px;color:#000000b3;margin-bottom: 5px;line-height: 40px;text-transform: capitalize;">${
                              profileData.Firstname
                            } ${profileData.Lastname}</h1>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h3 style="font-size: 22px;font-weight: 400; line-height: 26px; color:#000000b3;margin-bottom: 0.5em;">About me</h3>
                            <p style="margin-bottom: 6px;margin-top: 0;line-height: 1.5715;font-size: 14px;margin-bottom: 6px !important;color: #00000080;text-align: justify;">${
                              profileData.Aboutme || ""
                            }</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h3 style="font-size: 22px;font-weight: 400; line-height: 26px; color:#000000b3;margin-bottom: 0.5em;">Education</h3>
                            <table>
                            ${profileData.Education?.map((education, index) => {
                              return `<tr key={index}>
                                    <td>
                                        <h4 style="font-size: 18px;font-weight: 400;line-height: 22px;margin-top: 0; margin-bottom: 0.5em; color: rgba(0, 0, 0, 0.85);">${
                                          education.Name
                                        }</h4>
                                        <p style="margin-bottom: 6px;margin-top: 0;line-height: 1.5715;font-size: 14px;margin-bottom: 6px !important;color: #00000080;">${
                                          education.Degree
                                        }</p>
                                        <p style="margin-bottom: 6px;margin-top: 0;line-height: 1.5715;font-size: 14px;margin-bottom: 6px !important;color: #00000080;">${moment(
                                          education.StartDate
                                        ).format("YYYY")}
                                        -
                                        ${moment(education.EndDate).format(
                                          "YYYY"
                                        )}</p>
                                    </td>
                                </tr>`;
                            })}
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
        `;
    // doc.html(html).then(() => {
    //   doc.save("test.pdf")
    // });
    apiClient
      .post(process.env.REACT_APP_AUTHORITY + "/Account/DownLoadProfile", {
        FileName: this.props?.about?.Firstname,
        TemplateContent: html,
      })
      .then((res) => {
        if (res.ok) {
          window.open(res.data);
          this.setState({ ...this.state, loading: false }, () => {
            notify({
              message: "Download",
              description: "Profile downloaded successfully",
            });
          });
        } else {
          notify({
            message: "Error",
            description: "Something went wrong",
            type: "error",
          });
        }
      });
  };
  getFilter = (input, option) => {
    return option.name
      ? option.name.toLowerCase().indexOf(input.toLowerCase()) >= 0
      : [];
  };
  handleChange = (prop, val, option) => {
    let initialValues = { ...this.state.address };
    if (prop === "CollegeId") {
      initialValues[prop] = option[0]?.value ? option[0]?.value : null;
      initialValues.CollegeName = option[0]?.value ? option[0]?.name : val[0];
      initialValues.CollegeName = initialValues.CollegeName ? initialValues.CollegeName : initialValues.CollegeId;
    } else {
      initialValues[prop] = val
        ? val.currentTarget
          ? val.currentTarget.value
          : val
        : "";
    }

    this.setState({ ...this.state, address: initialValues });
  };

  render() {
    const { user } = store.getState().oidc;

    const {
      PhoneNumber,
      Email,
      AboutMe,
      finalAddress,
      visible,
      address,
      loading,
      colleges,
    } = this.state;

    return (
      <div className="custom-card profile-card">
        <Card
          actions={
            !this.props.IsHideAction && [
              <Button type="primary" onClick={this.ExportPdf}>
                <span className="post-icons download-icon"></span>Download
                Profile
              </Button>,
            ]
          }
          title="About Me"
          bordered={false}
          extra={
            !this.props.IsHideAction ? (
              <Tooltip title="Edit">
                <Link onClick={this.showModal}>
                  <span className="icons edit" />
                </Link>
              </Tooltip>
            ) : null
          }
        >
          {loading && <Loader className="loader-top-middle" />}
          <div>
            {AboutMe && <p>{AboutMe}</p>}
            <Divider className="text-left-line" orientation="left">
              Contact
            </Divider>
            <Row gutter={16}>
              {finalAddress?.length > 0 && (
                <Col xs={24} sm={12}>
                  <div className="about-details">
                    <div className="about-icons">
                      <span className="icons location c-default" />
                    </div>
                    {finalAddress?.map((displayaddress, index) => {
                      delete displayaddress.AddressId;
                      return (
                        <p key={index}>
                          {Object.keys(displayaddress)
                            .map((k) => {
                              return displayaddress[k];
                            })
                            .join(", ")}
                        </p>
                      );
                    })}
                  </div>
                </Col>
              )}
              {PhoneNumber && (
                <Col xs={24} sm={12}>
                  <div className="about-details">
                    <div className="about-icons">
                      <span className="icons phone c-default" />
                    </div>
                    <p>{PhoneNumber}</p>
                  </div>
                </Col>
              )}
              {Email && (
                <Col xs={24} sm={12}>
                  <div className="about-details">
                    <div className="about-icons">
                      <span className="icons email c-default" />
                    </div>
                    <p>{Email}</p>
                  </div>
                </Col>
              )}
            </Row>
          </div>
        </Card>
        <CommonModal
          className="custom-popup"
          visible={visible}
          title="About Me"
          cancel={this.handleCancel}
          saved={() => {
            this.formRef.current.validateFields().then((values) => {
              this.formRef.current.resetFields();
              this.handleOk(values);
            });
          }}
        >
          {loading && <Loader className="loader-top-middle" />}
        {visible &&  <Form layout="vertical" initialValues={address} ref={this.formRef}>
            <Row gutter={16}>
              <Col xs={24} className="mb-16">
                <Form.Item
                  label="About Me"
                  name="AboutMe"
                  rules={[{ required: true, message: "About Me required" }]}
                  className="custom-fields"
                >
                  <TextArea
                    component="textarea"
                    className="ant-input"
                    autoSize={{ minRows: 2, maxRows: 3 }}
                    placeholder="About Me"
                    onChange={(value) => this.handleChange("AboutMe", value)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="First Name"
                  name="Firstname"
                  rules={[{ required: true, message: "First Name required" }]}
                  className="custom-fields"
                >
                  <Input
                    className="ant-input"
                    placeholder="First Name"
                    onChange={(value) => this.handleChange("Firstname", value)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Last Name"
                  name="Lastname"
                  rules={[{ required: true, message: "Last Name required" }]}
                  className="custom-fields"
                >
                  <Input
                    className="ant-input"
                    placeholder="Last Name"
                    onChange={(value) => this.handleChange("Lastname", value)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} className="custom-fields custom-multiselect about-clg-input">
                <Form.Item
                  label="College/University Name"
                  name="CollegeId"
                  rules={[
                    {
                      required: true,
                      message: "College / University name required",
                    },
                    {
                      validator: (rule, value, callback) => {
                        if (value) {
                          if (value.length > 1) {
                            callback(
                              "Please select only one College/University"
                            );
                          } else if (value.length <= 1) {
                            callback();
                          }
                        }
                        return;
                      },
                    },
                  ]}
                >
                  <Select
                    mode={"tags"}
                    showSearch
                    filterOption={(input, option) =>
                      this.getFilter(input, option)
                    }
                    //  defaultValue={address.CollegeId}
                    placeholder="Select a college"
                    onChange={(val, option) =>
                      this.handleChange("CollegeId", val, option)
                    }
                  >
                    {colleges?.map((college, indx) => (
                      <Option
                        name={college?.CollegeName}
                        value={college?.CollegeId}
                      >
                        <Avatar src={college.Image} />
                        {college?.CollegeName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Street Name"
                  name="Street"
                  rules={[{ required: true, message: "Street Name required" }]}
                  className="custom-fields"
                >
                  <Input
                    className="ant-input"
                    placeholder="Street Name"
                    onChange={(value) => this.handleChange("Street", value)}
                  />
                </Form.Item>
              </Col>
              {/* <Col xs={24}>
                      <Form.Item
                        label="Address"
                        name="Address"
                        rules={[{ required: true }]}
                        className="custom-fields"
                      >
                        <Field
                          className="ant-input"
                          value={values?.Address}
                          name="Address"
                        />
                        <span className="validateerror">
                          <ErrorMessage name="Address" />
                        </span>
                      </Form.Item>
                    </Col> */}
              <Col xs={24} sm={12}>
                <Form.Item
                  label="City"
                  name="City"
                  rules={[{ required: true, message: "City required" }]}
                  className="custom-fields"
                >
                  <Input
                    className="ant-input"
                    placeholder="City"
                    onChange={(value) => this.handleChange("City", value)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Country"
                  name="Country"
                  rules={[{ required: true, message: "Country required" }]}
                  className="custom-fields custom-select"
                >
                  <CountryDropdown
                    value={address?.Country}
                    onChange={(value) => {
                      let initialValues = { ...this.state.address };
                      initialValues.Country = value;
                      initialValues.State = "";
                      this.setState({ ...this.state, address: initialValues });
                    }}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="State"
                  name="State"
                  rules={[{ required: true, message: "State required" }]}
                  className="custom-fields custom-select"
                >
                  <RegionDropdown
                    showDefaultOption={true}
                    defaultOptionLabel="Select State"
                    blankOptionLabel="Select State"
                    country={address?.Country}
                    value={address?.State}
                    onChange={(value) => this.handleChange("State", value)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Pin Code"
                  name="PinCode"
                  rules={[
                    { required: true, message: "Pin Code required" },
                    () => ({
                      validator(_, value) {
                        if (Number(value)) {
                          return Promise.resolve();
                        } else if (!Number(value)) {
                          return Promise.reject("Only Numbers allowed");
                        }
                      },
                    }),
                  ]}
                  className="custom-fields"
                >
                  <Input
                    className="ant-input"
                    placeholder="Pin Code"
                    name="PinCode"
                    maxlength="6"
                    onChange={(value) => this.handleChange("PinCode", value)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="Phone Number"
                  name="PhoneNumber"
                  rules={[
                    { required: true, message: "Phone Number required" },
                    () => ({
                      validator(_, value) {
                        if (Number(value)) {
                          return Promise.resolve();
                        } else if (!Number(value)) {
                          return Promise.reject("Only Numbers allowed");
                        }
                      },
                    }),
                  ]}
                  className="custom-fields"
                >
                  <Input
                    className="ant-input"
                    placeholder="Phone Number"
                    maxlength="15"
                    onChange={(value) =>
                      this.handleChange("PhoneNumber", value)
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={24}>
                <Form.Item label="Email" className="custom-fields">
                  <Input value={Email} name="Email" disabled />
                </Form.Item>
              </Col>
            </Row>
          </Form>
  }
        </CommonModal>
      </div>
    );
  }
}
const mapStateToProps = ({ oidc }) => {
  return { profile: oidc.profile };
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateProfile: (info) => {
      dispatch(profileSuccess(info));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(About);
