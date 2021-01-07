import React, { Component } from 'react';
import { Card, Input, Row, Col, Button, Select, Collapse, Space, Steps, message, Upload, Table, Tag, Form, Tabs } from 'antd';
import Title from 'antd/lib/typography/Title';

const { Option } = Select;
const columns = [
    {
        title: 'User Name',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Group',
        dataIndex: 'group',
        key: 'group',
    },
    {
        title: 'College',
        dataIndex: 'college',
        key: 'college',
    },

];
const data = [
    {
        key: '1',
        name: 'John doe',
        email: 'johndoe@blackbuck.com',
        college: 'BVRIT Hyderabad College of Engineering',
        group: 'CSE',
    },
    {
        key: '2',
        name: 'Sherlyn',
        email: 'sherlyn@blackbuck.com',
        college: 'Gokaraju Rangaraju Institute of Engineering & Technology',
        group: 'Mech',
    },
    {
        key: '3',
        name: 'Ram Mohan',
        email: 'rammohan@blackbuck.com',
        college: 'Gokaraju Rangaraju Institute of Engineering & Technology',
        group: 'IT',
    },
    {
        key: '4',
        name: 'Ramesh',
        email: 'rameshb@blackbuck.com',
        college: 'Gokaraju Rangaraju Institute of Engineering & Technology',
        group: 'AI',
    },
    {
        key: '5',
        name: 'Srujan',
        email: 'srujan@blackbuck.com',
        college: 'Mahatma Gandhi Institute of Technology (MGIT)',
        group: 'Civil',
    },
];
class Members extends Component {
    render() {
        return <>
            <Title className="f-18 text-primary semibold">Members</Title>
            <div className="custom-card">
                <Card className="p-12 custom-fields">
                    <Row gutter={16} align="middle">
                        <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                            <Input placeholder="User Name" />
                        </Col>
                        <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                            <Select allowClear placeholder="Choose Group">
                                <Option value="Mechanical Engineering">Mechanical Engineering</Option>
                                <Option value="Chemical Engineering">Chemical Engineering</Option>
                                <Option value="Information Technology">Information Technology</Option>
                                <Option value="Civil Engineering">Civil Engineering</Option>
                                <Option value="Aeronautical Engineering">Aeronautical Engineering</Option>
                                <Option value="Artificial Intelligence">Artificial Intelligence</Option>
                            </Select>
                        </Col>
                        <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                            <Select allowClear placeholder="Choose College">
                                <Option value="BVRIT Hyderabad College of Engineering">BVRIT Hyderabad College of Engineering</Option>
                                <Option value="CGokaraju Rangaraju Institute of Engineering & Technology">Gokaraju Rangaraju Institute of Engineering & Technology</Option>
                                <Option value="Mahatma Gandhi Institute of Technology (MGIT)">Mahatma Gandhi Institute of Technology (MGIT)</Option>
                            </Select>
                        </Col>
                        <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                            <Button type="primary">Search</Button>
                        </Col>
                    </Row>
                </Card>
            </div>
            <div className="custom-card">
                <Card className="px-12 pt-12">
                    <Table columns={columns} dataSource={data} size="small" pagination={{ position: ["bottomCenter"] }} bordered={true} />
                </Card>
            </div>
        </>
    }
}
export default Members;