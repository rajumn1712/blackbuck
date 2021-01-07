import React, { Component, useEffect, useState } from 'react';
import { Card, Button, Input, List, Form, Row, Col, Divider } from 'antd';
import { Link, withRouter } from "react-router-dom";
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
                <div className=" py-16">
                    <Form form={form} 
           initialValues={{
                        "Id": profile?.Id,
                        "Username": profile?.Email,
                        "OldPassword": "",
                        "NewPassword": "",
                        "Repassword": ""
                    }} onFinishFailed={onFinishFailed} onFinish={(values) => saveUserPass(values)} enableReinitialize>
                        <div className="d-flex my-8"><span className="change-text">Current password</span>
                            <Form.Item name="OldPassword" rules={[{ required: true, message: "Current password  required" }]} className="mb-12" >
                                <Input.Password value={initialValues.OldPassword} className="w-300 input-height"  onChange={(e) => handleChange("OldPassword", e)} />
                            </Form.Item>
                        </div>
                        <div className="d-flex my-8"><span className="change-text">New password</span>
                            <Form.Item name="NewPassword" rules={[{ required: true, message: "New password  required" }, { min: 8, message: "password  atleast 8 characters" }]} className="mb-12" >
                                <Input.Password value={initialValues.NewPassword} className="w-300 input-height" maxLength="50" onChange={(e) => handleChange("NewPassword", e)} />
                            </Form.Item>
                        </div>
                        <div className="d-flex my-8"><span className="change-text">Re-enter new password </span>
                            <Form.Item name="Repassword" rules={[{ required: true, message: "Re-enter new password required" }, { min: 8, message: "password  atleast 8 characters"}
                            ]} className="mb-12">
                                <Input.Password value={initialValues.Repassword} className="w-300 input-height" maxLength="50" onChange={(e) => handleChange("Repassword", e)} />
                            </Form.Item>
                        </div>
                        <Divider className="m-0 mb-16" />
                        <div className="text-right pr-12">
                                <Button className="mx-8" type="primary" htmlType="submit">Save</Button>
                                <Button htmlType="button" onClick={() => clearValues()}>Cancel</Button>
                        </div>
                    </Form>
                </div>

            
        </div>
    </>)
}


export default connectStateProps(withRouter(CreateCourse)); 