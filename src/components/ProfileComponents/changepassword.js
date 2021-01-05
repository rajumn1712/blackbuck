import React, { Component } from 'react';
import { Card, Button,Input } from 'antd';
import { Link } from "react-router-dom";

class CreateCourse extends Component {
    render() {
        return <>
            <div className="custom-card">
                <Card title="change Password" actions={!this.props.IsHideAction && [
                    <div className="text-right pr-12">
                        <Button className="mx-8" type="primary" htmlType="submit">Save</Button>
                        <Button htmlType="close" >Cancel</Button>
                    </div>
                ]}
                    extra={<span className="icons edit" />}
                >

                    <div className=" pb-12">
                        <div className="d-flex my-8"><span className="change-text">Current</span>
                            <Input className="w-300" />
                        </div>
                        <div className="d-flex my-8"><span className="change-text">New </span>
                            <Input className="w-300" />
                        </div>
                        <div className="d-flex my-8"><span className="change-text">Re-enter new </span>
                            <Input className="w-300" />
                        </div>
                    </div>

                </Card>
            </div>
        </>
    }
}
export default CreateCourse;