import React, { Component, createRef } from "react";
import { Card, Divider, Row, Col, Form, Input, Tooltip, Button, Avatar, Select } from "antd";
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
import moment from 'moment';
import { connect } from "react-redux";
import { profileSuccess } from "../../reducers/auth";

const { Option } = Select;

class About extends Component {
  state = {
    Firstname:this.props.about.Firstname,
      Lastname:this.props.about.Lastname,
      CollegeId:this.props.about.College.CollegeId,
    PhoneNumber: this.props.about.PhoneNumber
      ? this.props.about.PhoneNumber
      : "",
    Email: this.props.about.Email,
    AboutMe: this.props.about.Aboutme ? this.props.about.Aboutme : "",
    finalAddress: this.props.about.Address,
    address: {},
    visible: false,
    loading: false,
    colleges:[]
  };

  handleValidate = (values) => {
    let errors = {};
    // if (!value.Email) {
    //     errors.Email = "Required!";
    // } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value.Email)) {
    //     errors.Email = "Invalid email address!";
    // }
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
      Firstname:editObject.Firstname,
      Lastname:editObject.Lastname,
      CollegeId:editObject.CollegeId
    });

    this.setState({
      visible: true,
      address: editObject.address,
    });
  };

  fetchColleges = async ()=>{
    this.setState({...this.state,loading:true})
        const collegeResponse = await getColleges();
        if (collegeResponse.ok) {
            let {colleges} = this.state;
            colleges = collegeResponse.data;
            this.setState({...this.state,colleges,loading:false})
        } else {
          this.setState({...this.state,loading:false})
            notify({ message: "Error", type: "error", description: "Something went wrong :)" })
        }
  }

  handleOk = () => {
    this.formRef.current.handleSubmit();
    if (!hasChanged(this.formRef.current.values)) {
      this.setState({ ...this.state, loading: true },()=>{
        this.props.profile.FirstName = this.formRef.current.values.Firstname;
        this.props.profile.LastName = this.formRef.current.values.Lastname;
        this.props.updateProfile(this.props.profile);
      });
      const saveObj = this.createSaveObj(this.formRef.current.values);
      saveAboutMe(saveObj).then((res) => {
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
      });
    }
  };
  createSaveObj = (values) => {
    const saveObj = {
      UserId: this.props.about.UserId,
      Aboutme: values.AboutMe,
      PhoneNumber: values.PhoneNumber,
      Firstname:values.Firstname,
      Lastname:values.Lastname,
      CollegeId:values.CollegeId,
      CollegeName:this.state.colleges.filter(item => item.CollegeId === values.CollegeId)[0].CollegeName,
      IsNameModified : (this.props.about.Firstname === values.Firstname && this.props.about.Lastname === values.Lastname) ? false : true,
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
    this.formRef.current.setErrors({});
    this.setState({
      visible: false,
      address: {},
    });
  };
  ExportPdf = () => {
    this.setState({...this.state,loading:true})
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
                            <p style="margin-bottom: 6px;color:#ffffff;margin-top: 0;line-height: 1.5715;font-size: 14px;">${profileData.PhoneNumber || ''}</p>
                            <p style="margin-bottom: 6px;color:#ffffff;margin-top: 0;line-height: 1.5715;font-size: 14px;">${profileData.Email}</p>
                            ${profileData.Address?.map((displayaddress, index) => {
                              delete displayaddress.AddressId;
                              return (
                                `<p key={index} style="margin-bottom: 6px;color:#ffffff;margin-top: 0;line-height: 1.5715;font-size: 14px;">
                                  ${Object.keys(displayaddress)
                                    ?.map((k) => {
                                      return displayaddress[k];
                                    })
                                    .join(",")}
                                </p>`
                              );
                            })}
                            
                            <p style="margin-bottom: 6px;color:#ffffff;margin-top: 0;line-height: 1.5715;font-size: 14px;word-break: break-all;">${process.env.REACT_APP_HOSTURL + 'profileview/' + profileData.UserId}</p> 
                        </td>
                    </tr>
                    <tr>
                        <td >
                            <h3 style="font-size: 22px;font-weight: 400; line-height: 26px; color:#ffffff;margin-bottom: 0.5em;">Internships</h3>
                            ${profileData.Internships?.map((internship, index) => {
                              return (
                                `<p key={index} style="margin-bottom: 6px;color:#ffffff;margin-top: 0;line-height: 1.5715;font-size: 14px;">
                                  ${internship.CompanyName}-${internship.Duration}
                                </p>`
                              )})}
                        </td>
                    </tr>
                    <tr>
                        <td >
                            <h3 style="font-size: 22px;font-weight: 400; line-height: 26px; color:#ffffff;margin-bottom: 0.5em;">Certified Courses</h3>
                            ${this.props.certifiedcourses?.map((course) => {
                              return (
                                `<p key={index} style="margin-bottom: 6px;color:#ffffff;margin-top: 0;line-height: 1.5715;font-size: 14px;">
                                  ${course.CourseName}
                                </p>`
                              )})}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h3  style="font-size: 22px;font-weight: 400; line-height: 26px; color:#ffffff;margin-bottom: 0.5em;">Hobbies</h3>
                            <ul style="list-style-type: none;padding-left: 0;">
                            ${profileData.Hobbies?.map((hobbie, index) => {
                              return `<li key={index} style="color:#ffffff;margin-top: 0;line-height: 1.5715;font-size: 14px;padding:0">${hobbie}</li>`
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
                            <h1 style="margin-top:0;font-weight: 400;font-size: 36px;color:#000000b3;margin-bottom: 5px;line-height: 40px;text-transform: capitalize;">${profileData.Firstname} ${profileData.Lastname}</h1>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h3 style="font-size: 22px;font-weight: 400; line-height: 26px; color:#000000b3;margin-bottom: 0.5em;">About me</h3>
                            <p style="margin-bottom: 6px;margin-top: 0;line-height: 1.5715;font-size: 14px;margin-bottom: 6px !important;color: #00000080;text-align: justify;">${profileData.Aboutme || ''}</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <h3 style="font-size: 22px;font-weight: 400; line-height: 26px; color:#000000b3;margin-bottom: 0.5em;">Education</h3>
                            <table>
                            ${profileData.Education?.map((education, index) => {
                              return (
                                `<tr key={index}>
                                    <td>
                                        <h4 style="font-size: 18px;font-weight: 400;line-height: 22px;margin-top: 0; margin-bottom: 0.5em; color: rgba(0, 0, 0, 0.85);">${education.Name}</h4>
                                        <p style="margin-bottom: 6px;margin-top: 0;line-height: 1.5715;font-size: 14px;margin-bottom: 6px !important;color: #00000080;">${education.Degree}</p>
                                        <p style="margin-bottom: 6px;margin-top: 0;line-height: 1.5715;font-size: 14px;margin-bottom: 6px !important;color: #00000080;">${moment(education.StartDate).format('YYYY')}
                                        -
                                        ${moment(education.EndDate).format('YYYY')}</p>
                                    </td>
                                </tr>`
                              );
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
    apiClient.post(process.env.REACT_APP_AUTHORITY + '/Account/DownLoadProfile',{
      FileName:this.props?.about?.Firstname,
      TemplateContent:html
    }).then(res=>{
      if(res.ok){
        window.open(res.data);
        this.setState({...this.state,loading:false},()=>{
          notify({
            message:"Download",
            description:'Profile downloaded successfully'
            
          })
        })
      }else{
        notify({
          message:"Error",
          description:'Something went wrong',
          type:'error'
        })
      }
    })

    // this.setState({ ...this.state, loading: true });
    // const input = document.getElementById("downloadpdf");
    // html2canvas(input, {
    //   onclone: function (clonedDoc) {
    //     clonedDoc.getElementById("downloadpdf").style.visibility = "visible";
    //   },
    // }).then((canvas) => {
    //   this.setState({ ...this.state, loading: false });
    //   const imgData = canvas.toDataURL("image/png", "1.0");
    //   const pdf = new jsPDF("p", "in", "a4");
    //   pdf.addImage(imgData, "JPEG", 0, 0, 0, 0);
    //   pdf.save("download.pdf");
    // });
  };
  formRef = createRef();
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
      colleges
    } = this.state;

    return (
      <div className="custom-card profile-card">
        <Card actions={!this.props.IsHideAction && [
          <Button type="primary"  onClick={this.ExportPdf}>
            <span className="post-icons download-icon"></span>Download Profile
          </Button>
        ]}
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
          saved={this.handleOk.bind(this)}
        >
          {loading && <Loader className="loader-top-middle" />}
          <Formik
            enableReinitialize
            innerRef={this.formRef}
            initialValues={address}
            validate={(values) => this.handleValidate(values)}
          >
            {({ values, setFieldValue }) => {
              return (
                <Form layout="vertical">
                  <Row gutter={16}>
                    {/* <Col xs={24}>
                                    <h3>Contact</h3>
                                </Col> */}
                    <Col xs={24} className="mb-16">
                      <Form.Item
                        label="About Me"
                        name="About Me"
                        rules={[{ required: true }]}
                        className="custom-fields"
                      >
                        <Field
                          component="textarea"
                          className="ant-input"
                          autoSize={{ minRows: 2, maxRows: 6 }}
                          value={values?.AboutMe}
                          name="AboutMe"
                        />
                        <span className="validateerror">
                          <ErrorMessage name="AboutMe" />
                        </span>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="First Name"
                        name="First Name"
                        rules={[{ required: true }]}
                        className="custom-fields"
                      >
                        <Field
                          className="ant-input"
                          value={values?.Firstname}
                          name="Firstname"
                        />
                        <span className="validateerror">
                          <ErrorMessage name="Firstname" />
                        </span>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Last Name"
                        name="Last Name"
                        rules={[{ required: true }]}
                        className="custom-fields"
                      >
                        <Field
                          className="ant-input"
                          value={values?.Lastname}
                          name="Lastname"
                        />
                        <span className="validateerror">
                          <ErrorMessage name="Lastname" />
                        </span>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24}>
                    <Form.Item className="custom-fields" label="College/University Name" name="CollegeId" rules={[{ required: true, message: "College / University name required" }]}>
                                            <Select defaultValue={values.CollegeId} placeholder="Select a college" onChange={(val) => setFieldValue("Country", val)}>
                                                {colleges?.map((college, indx) => <Option value={college?.CollegeId}><Avatar src={college.Image} />{college?.CollegeName}</Option>)}
                                            </Select>
                                        </Form.Item>
                    </Col>
                    {/* <Col xs={24} sm={12}>
                      <Form.Item
                        label="House No"
                        name="House No"
                        rules={[{ required: true }]}
                        className="custom-fields"
                      >
                        <Field
                          className="ant-input"
                          value={values?.PlatNo}
                          name="PlatNo"
                        />
                        <span className="validateerror">
                          <ErrorMessage name="PlatNo" />
                        </span>
                      </Form.Item>
                    </Col> */}
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Street Name"
                        name="Street Name"
                        rules={[{ required: true }]}
                        className="custom-fields"
                      >
                        <Field
                          className="ant-input"
                          value={values?.Street}
                          name="Street"
                        />
                        <span className="validateerror">
                          <ErrorMessage name="Street" />
                        </span>
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
                        rules={[{ required: true }]}
                        className="custom-fields"
                      >
                        <Field
                          className="ant-input"
                          value={values?.City}
                          name="City"
                        />
                        <span className="validateerror">
                          <ErrorMessage name="City" />
                        </span>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Country"
                        name="Country"
                        rules={[{ required: true }]}
                        className="custom-fields custom-select"
                      >
                        <CountryDropdown
                          onChange={(value) => {
                            setFieldValue("Country", value);
                            setFieldValue("State", "")
                          }}
                          value={values?.Country}
                          name="Country"
                        />
                        {/* <Select
                          id="select"
                          value={values.Country}
                          name="Country"
                          onChange={this.handleOnChange.bind(this)}
                        >
                          <Option value="Select Option">Select Option</Option>
                        </Select> */}
                        <span className="validateerror">
                          <ErrorMessage name="Country" />
                        </span>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="State"
                        name="State"
                        rules={[{ required: true }]}
                        className="custom-fields custom-select"
                      >
                        <RegionDropdown
                          showDefaultOption={true}
                          defaultOptionLabel="Select State"
                          blankOptionLabel="Select State"
                          onChange={(value) => setFieldValue("State", value)}
                          country={values?.Country}
                          value={values?.State}
                        />
                        {/* <Select
                          defaultValue="Select Option"
                          value={values.State}
                          name="State"
                        >
                          <Option value="Select Option">Select State</Option>
                        </Select> */}
                        <span className="validateerror">
                          <ErrorMessage name="State" />
                        </span>
                      </Form.Item>
                    </Col>

                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Pin Code"
                        name="Pin Code"
                        rules={[{ required: true }]}
                        className="custom-fields"
                      >
                        <Field
                          className="ant-input"
                          value={values?.PinCode}
                          name="PinCode"
                          maxlength="6"
                          onChange={(e) => {
                            if (/^[0-9\b]+$/.test(e.target.value)) {
                              setFieldValue("PinCode", e.target.value)
                            } else {
                              e.preventDefault()
                            }
                          }}
                        />
                        <span className="validateerror">
                          <ErrorMessage name="PinCode" />
                        </span>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        label="Phone Number"
                        name="Phone Number"
                        rules={[{ required: true }]}
                        className="custom-fields"
                      >
                        <Field
                          className="ant-input"
                          value={values?.PhoneNumber}
                          name="PhoneNumber"
                          maxlength="15"
                          onChange={(e) => {
                            if (/^[0-9\b]+$/.test(e.target.value)) {
                              setFieldValue("PhoneNumber", e.target.value)
                            } else {
                              e.preventDefault()
                            }
                          }}
                        />
                        <span className="validateerror">
                          <ErrorMessage name="PhoneNumber" />
                        </span>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24}>
                      <Form.Item label="Email" className="custom-fields">
                        <Input value={Email} name="Email" disabled />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              );
            }}
          </Formik>
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
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(About);
