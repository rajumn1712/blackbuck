import React, { useEffect, useState } from 'react';
import { Card, Input, Row, Col, Button, Select, Collapse, Space, Steps, message, Upload, Table, Tag, Form, Tabs, Tooltip } from 'antd';
import Title from 'antd/lib/typography/Title';
import { getAllSystemGroups, groupBlock } from '../../shared/api/apiServer';
import connectStateProps from '../../shared/stateConnect';
import notify from '../../shared/components/notification';
import Modal from 'antd/lib/modal/Modal';
import moment from 'moment';
import Loader from "../../common/loader";

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
const columnsGroups = [
    {
        title: 'Group Name',
        dataIndex: 'name',
        // render: text => {{text}}
    },
    {
        title: 'Posts',
        dataIndex: 'postsCount',
    },
    {
        title: 'Type',
        dataIndex: 'type',
    },
    {
        title: 'Date',
        dataIndex: 'date',
        render: (text, record) => (
            moment(record.date).format('ll')
        ),
    },
    {
        title: 'Members',
        dataIndex: 'members',
    },
    {
        title: 'Admin',
        dataIndex: 'admin',
        key: 'admin',
        render: (text, record) => record.adminUsers?.map((admin, index) => {
            return <span>{admin.Firstname}{index !== record.adminUsers?.length - 1 && ", "}</span>
        })
    },
    {
        title: 'Status',
        dataIndex: 'Status',
        render: (text, record) => { return record.IsGroupBlocked ? 'Blocked' : 'Active' }
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
];
const Groups = ({ profile }) => {
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [selection, setSelection] = useState([]);
    const [isModal, setIsModal] = useState(false);
    const [groups, setGroups] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        getGroups(1, 20);
    }, []);
    // const fetchGroupSuggestions = async () => {
    //     const groupsData = await getSystemGroups(selection[0]?.UserId);
    //     if (groupsData.ok) {
    //         setGroups(groupsData.data);
    //     } else {
    //         notify({ message: "Error", type: "error", description: "Something went wrong :)" });
    //     }
    // }
    const onSelectedRowKeysChange = selectedRowKeys => {
        setSelectedRowKeys(selectedRowKeys);
    };
    const onRecordSelect = (record) => {
        const idx = selection.indexOf(record);
        if (idx > -1) {
            selection.splice(idx, 1);
        } else {
            selection.push(record);
        }
        setSelection(selection);
    }
    const blockGroup = () => {
        if (selection.length == 0 || selection.length > 1) {
            notify({
                description: "Please select one record only",
                message: "Selection",
            });
            return;
        } {
            groupBlock({ GroupId: selection[0].id, IsGroupBlocked: (selection[0].IsGroupBlocked ? false : true) }).then((res) => {
                if (res.ok) {
                    updateData(selection[0])
                    setSelection([])
                    setSelectedRowKeys([]);
                    notify({
                        description: `Group  ${selection[0].IsGroupBlocked ? 'blocked' : 'un blocked'} successfully`,
                        message: "Groups",
                    });
                }
                else {
                    notify({ message: "Error", type: "error", description: "Something went wrong :)" });
                }
            });
        }
    }
    const updateData = (item) => {
        data.forEach(val => {
            if (val.id == item.id) {
                val.IsGroupBlocked = !item.IsGroupBlocked;
            }
        })
        setData(data)
    }
    const onPageChange = (page, pageSize) => {
        setSelection([])
        setSelectedRowKeys([]);
        getGroups(page, pageSize);
    }
    const getGroups = async (page, pageSize) => {
        setLoading(true);
        const response = await getAllSystemGroups(pageSize, ((pageSize * page) - pageSize));
        if (response.ok) {
            setLoading(false);
            response.data.forEach((item, index) => {
                item["key"] = index;
            })
            setData(response.data);
        }
        else {
            setLoading(false);
            window.scrollTo(0, 0);
            notify({ message: "Error", type: "error", description: "Something went wrong :)" });
        }

    }
    return <>
        <Title className="f-18 text-primary semibold">Groups</Title>
        {/* <div className="custom-card">
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
        </div> */}
        <div className="custom-card">
            <Card className="px-12 pt-12"

                extra={<div onClick={() => blockGroup()}>
                    <Tooltip placement="top" title="Block / Un Block">
                        <span className="left-menu block-icon mx-8"></span>
                    </Tooltip>
                </div>}>
                {loading && <Loader className="loader-middle" />}
                <div className="overflowX-auto">
                    <Table
                        rowSelection={{
                            hideSelectAll: true,
                            onSelect: onRecordSelect,
                            selectedRowKeys: selectedRowKeys,
                            onChange: onSelectedRowKeysChange
                        }}
                        columns={columnsGroups} dataSource={data} size="small" pagination={{ position: ["bottomCenter"], total: 200, onChange: (page, pageSize) => onPageChange(page, pageSize) }} bordered={true} />
                </div>
            </Card>
        </div>
    </>
}
export default connectStateProps(Groups);