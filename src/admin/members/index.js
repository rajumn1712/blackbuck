import React, { useEffect, useState } from 'react';
import { Card, Input, Row, Col, Button, Select, Table, Tooltip } from 'antd';
import Title from 'antd/lib/typography/Title';
import { getUsers, getUsersCount } from '../../shared/api/apiServer';
import connectStateProps from '../../shared/stateConnect';

const { Option } = Select;
const columns = [
    {
        title: 'User Name',
        dataIndex: 'Firstname',
        key: 'Firstname',
        render: text => <a>{text}</a>,
    },
    {
        title: 'Email',
        dataIndex: 'Email',
        key: 'Email',
    },
    {
        title: 'Branch',
        dataIndex: 'BranchName',
        key: 'BranchName',
    },
    {
        title: 'College',
        dataIndex: 'CollegeName',
        key: 'CollegeName',
    },

];
const Members = ({ profile }) => {
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [selection, setSelection] = useState([]);
    useEffect(() => {
        getMembersCount();
        getMembers(1, 20);
    }, []);
    const getMembers = async (page, pageSize) => {
        const response = await getUsers(profile?.Id, pageSize, ((pageSize * page) - pageSize));
        if (response.ok) {
            setData(response.data);
        }

    }
    const onPageChange = (page, pageSize) => {
        getMembers(page, pageSize);
    }
    const getMembersCount = async () => {
        const response = await getUsersCount();
        if (response.ok) {
            setCount(response.data?.[0]);
        }

    }
    const showModal = () => {

    }
    const onRecordSelect = (record) => {
        const idx = selection.indexOf(record);
        if (idx > -1) {
            selection.splice(idx, 1);
        } else {
            selection.push(record);
        }
        setSelection(selection);
    }
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
            <Card className="px-12 pt-12" extra={<div>
                {/* <Tooltip placement="top" title="Block">
                    <span className="left-menu block-icon mx-8"></span>
                </Tooltip> */}
                <Tooltip placement="top" title="Set Scroller" onClick={() => showModal()}>
                    <span className="left-menu setscroller-icon mx-8"></span>
                </Tooltip>
                <Tooltip placement="top" title="Set Admin" onClick={() => showModal()}>
                    <span className="left-menu setadmin-icon mx-8"></span>
                </Tooltip>

            </div>}>
                <Table
                    rowSelection={{
                        type: "checkbox",
                        hideSelectAll: true,
                        onSelect: (record) => onRecordSelect(record)
                    }}
                    columns={columns} dataSource={data} size="small" pagination={{ position: ["bottomCenter"], total: count, onChange: (page, pageSize) => onPageChange(page, pageSize) }} bordered={true} />
            </Card>
        </div>
    </>
}
export default connectStateProps(Members);