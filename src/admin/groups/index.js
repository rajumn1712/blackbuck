import React, { Component } from 'react';
import { Card, Input, Row, Col, Button, Select, Collapse, Space, Steps, message, Upload, Table, Tag, Form, Tabs,Tooltip } from 'antd';
import Title from 'antd/lib/typography/Title';

const { Option } = Select;
const columns = [
    {
        title: 'Group Name',
        dataIndex: 'groupname',
        key: 'groupname',
        render: text => <a>{text}</a>
    },
    {
        title: 'Posts',
        dataIndex: 'posts',
        key: 'posts',
    },
    {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: 'Members',
        dataIndex: 'members',
        key: 'members',
    },
    {
        title: 'Admin',
        dataIndex: 'admin',
        key: 'admin',
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
            <Space size="middle">
                <a className="semibold" style={{ color: 'var(--red)' }}>Delete</a>
            </Space>
        ),
    },
];

const data = [
    {
        key: '1',
        groupname: 'IPL',
        posts: '10',
        type: 'Public',
        date: '23-12-2020 06:00 pm',
        members: 45,
        admin: 'Blackbuck',

    },
    {
        key: '2',
        groupname: 'CSC Champs',
        posts: '35',
        type: 'Public',
        date: '11-12-2020 05:05 pm',
        members: 20,
        admin: 'Blackbuck',
    },
    {
        key: '3',
        groupname: 'Mech Mantra!',
        posts: '5',
        type: 'Private',
        date: '05-11-2020 01:00 pm',
        members: 68,
        admin: 'Blackbuck',
    },
    {
        key: '4',
        groupname: 'Pan India Movies',
        posts: '20',
        type: 'Public',
        date: '11-10-2020 01:00 pm',
        members: 101,
        admin: 'Blackbuck',
    },
];
class Groups extends Component {

    render() {
        return <>
            <Title className="f-18 text-primary semibold">Groups</Title>
            <div className="custom-card">
                <Card className="p-12 custom-fields">
                    <Row gutter={16} align="middle">
                        <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                            <Input placeholder="User Name" />
                        </Col>
                        <Col xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
                            <Select allowClear placeholder="Choose Group Type">
                                <Option value="Mechanical Engineering">Private</Option>
                                <Option value="Chemical Engineering">Public</Option>
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
                <Card className="px-12 pt-12" extra={<div>
                    <Tooltip placement="top" title="Block">
                       <span className="left-menu block-icon mx-8"></span>
                    </Tooltip>
                    <Tooltip placement="top" title="Set Admin">
                       <span className="left-menu setadmin-icon mx-8"></span>
                    </Tooltip>

                </div>}
                >
                    <Table columns={columns} dataSource={data} size="small" pagination={{ position: ["bottomCenter"] }} bordered={true} />
                </Card>
            </div>
        </>
    }
}
export default Groups;