import React, { Component } from 'react';
import { Card, Button, Input,List } from 'antd';
import { Link } from "react-router-dom";
const data = [
    {
      title: 'Edit password here',
    },
];
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
                   
                >
                    <List
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={item => (
                            <List.Item  actions={[<a key="list-loadmore-edit"><span className="icons edit" /></a>]} >
                                <List.Item.Meta
                                    title='Edit password here'
                                    description="It's a good idea to use a strong password that you're not using elsewhere"
                                />
                            </List.Item>
                        )}
                    />
                    <div className=" py-16">
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