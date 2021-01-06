import React, { Component, useEffect, useState } from 'react';
import { Card, Button, Input, List, Form, Row, Col } from 'antd';
import { Link, withRouter } from "react-router-dom";
import { saveUserPassword } from '../../shared/api/apiServer';
import connectStateProps from '../../shared/stateConnect';
import notify from '../../shared/components/notification';

const data = [
    {
        title: 'Edit password here',
    },
];
const CreateCourse = ({ profile }) => {
    const [initialValues, setInitialValues] = useState({
        "Id": profile?.Id,
        "Username": profile?.Email,
        "OldPassword": "",
        "NewPassword": "",
        "Repassword": ""
    })
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
                let object = { ...initialValues }
                object.Id = profile?.Id;
                object.Username = profile?.Email;
                object.OldPassword = "";
                object.NewPassword = "";
                object.Repassword = "";

                setInitialValues(object);
            }
            else {
                notify({ message: "Error", type: "error", description: "Something went wrong :)" });
            }
        }
    }
    const clearValues = () => {
        let object = { ...initialValues }
        object.Id = profile?.Id;
        object.Username = profile?.Email;
        object.OldPassword = "";
        object.NewPassword = "";
        object.Repassword = "";
        setInitialValues(object);

    }
    const handleChange = (prop, val) => {
        let object = { ...initialValues };
        object[prop] = val.currentTarget.value;
        setInitialValues(object);
    }
    return (<>
        <div className="custom-card">
            <Card title="change Password"

            >
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={item => (
                        <List.Item >
                            <List.Item.Meta
                                title='Edit password here'
                                description="It's a good idea to use a strong password that you're not using elsewhere"
                            />
                        </List.Item>
                    )}
                />
                <div className=" py-16">
                    <Form initialValues={initialValues} onFinishFailed={onFinishFailed} onFinish={(values) => saveUserPass(values)} enableReinitialize>
                        <div className="d-flex my-8"><span className="change-text">Current</span>
                            <Form.Item name="OldPassword" rules={[{ required: true, message: "Current password  required" }]} >
                                <Input.Password value={initialValues.OldPassword} className="w-300" maxLength="50" onChange={(e) => handleChange("OldPassword", e)} />
                            </Form.Item>
                        </div>
                        <div className="d-flex my-8"><span className="change-text">New </span>
                            <Form.Item name="NewPassword" rules={[{ required: true, message: "New password  required" }, { min: 8, message: "password  atleast 8 characters" }]} >
                                <Input.Password value={initialValues.NewPassword} className="w-300" maxLength="50" onChange={(e) => handleChange("NewPassword", e)} />
                            </Form.Item>
                        </div>
                        <div className="d-flex my-8"><span className="change-text">Re-enter new </span>
                            <Form.Item name="Repassword" rules={[{ required: true, message: "Re-enter new password required" }, { min: 8, message: "password  atleast 8 characters" }
                            ]}>
                                <Input.Password value={initialValues.Repassword} className="w-300" maxLength="50" onChange={(e) => handleChange("Repassword", e)} />
                            </Form.Item>
                        </div>
                        <div className="text-right pr-12">
                            <Button className="mx-8" type="primary" htmlType="submit">Save</Button>
                            <Button onClick={() => clearValues()}>Cancel</Button>
                        </div>
                    </Form>
                </div>

            </Card>
        </div>
    </>)
}


export default connectStateProps(withRouter(CreateCourse)); 