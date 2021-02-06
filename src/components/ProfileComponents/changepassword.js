import React, { Component, useEffect, useState } from 'react';
import { Button, Input, Form, Divider, Row, Col } from 'antd';
import { withRouter } from "react-router-dom";
import { saveUserPassword } from '../../shared/api/apiServer';
import connectStateProps from '../../shared/stateConnect';
import notify from '../../shared/components/notification';

const CreateCourse = ({ profile }) => {
    const [initialValues, setInitialValues] = useState({
        "Id": profile?.Id,
        "Username": profile?.Email,
        "OldPassword": "",
        "NewPassword": "",
        "Repassword": ""
    })
    const [form] = Form.useForm();
    const onFinishFailed = (error) => {

    }
    const saveUserPass = async (values) => {
        if (values.NewPassword !== values.Repassword) {
            notify({ message: "Error", type: "error", description: "New password and re entered password must same" });

        }
        else {
            const result = await saveUserPassword(initialValues);
            if (result.ok) {
                notify({ message: "Change Password", description: "Password changed successfully" });
                form.resetFields();
            }
            else {
                notify({ message: "Error", type: "error", description: "Something went wrong :)" });
            }
        }
    }
    const clearValues = () => {
        form.resetFields();

    }
    const handleChange = (prop, val) => {
        let object = { ...initialValues };
        object[prop] = val.currentTarget.value;
        setInitialValues(object);
    }
    return (<>
        <div className="custom-card">
            <Form form={form}
                initialValues={{
                    "Id": profile?.Id,
                    "Username": profile?.Email,
                    "OldPassword": "",
                    "NewPassword": "",
                    "Repassword": ""
                }} onFinishFailed={onFinishFailed} onFinish={(values) => saveUserPass(values)} enableReinitialize>
                <Row className="p-16">
                    <Col xs={{ span: 24 }} lg={{ span: 14, offset: 5 }}>
                        <Row align="middle">
                            <Col xs={24} lg={8} className="change-text">
                                <span>Current password</span>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item name="OldPassword" rules={[{ required: true, message: "Current password  required" }]} className="mb-12" >
                                    <Input.Password value={initialValues.OldPassword} className="w-300 input-height" onChange={(e) => handleChange("OldPassword", e)} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={{ span: 24 }} lg={{ span: 14, offset: 5 }}>
                        <Row align="middle">
                            <Col xs={24} lg={8} className=" change-text">
                                <span >New password</span>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item name="NewPassword" rules={[{ required: true, message: "New password  required" }, { min: 8, message: "password  atleast 8 characters" }]} className="mb-12" >
                                    <Input.Password value={initialValues.NewPassword} className="w-300 input-height" maxLength="50" onChange={(e) => handleChange("NewPassword", e)} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={{ span: 24 }} lg={{ span: 14, offset: 5 }}>
                        <Row align="middle">
                            <Col xs={24} lg={8} className=" change-text">
                                <span>Re-enter new password </span>
                            </Col>
                            <Col xs={24} lg={12}>
                                <Form.Item name="Repassword" rules={[{ required: true, message: "Re-enter new password required" }, { min: 8, message: "password  atleast 8 characters" }
                                ]} className="mb-12">
                                    <Input.Password value={initialValues.Repassword} className="w-300 input-height" maxLength="50" onChange={(e) => handleChange("Repassword", e)} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Divider className="m-0" />
                <div className="text-right p-12">
                    <Button className="mx-8" type="primary" htmlType="submit">Save</Button>
                    <Button htmlType="button" onClick={() => clearValues()}>Cancel</Button>
                </div>
            </Form>
        </div>
    </>)
}


export default connectStateProps(withRouter(CreateCourse)); 