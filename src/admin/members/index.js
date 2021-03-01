import React, { useEffect, useState } from 'react';
import { Card, Input, Row, Col, Button, Select, Table, Tooltip, Form } from 'antd';
import Title from 'antd/lib/typography/Title';
import { getUsers, getUsersCount, setScholor, getSystemGroups, setSystemAdmin, saveAdminUsers } from '../../shared/api/apiServer';
import connectStateProps from '../../shared/stateConnect';
import notify from '../../shared/components/notification';
import Modal from 'antd/lib/modal/Modal';
import GetColumnSearchProps from "../../shared/components/filterComponent";

const { Option } = Select;
const Members = ({ profile }) => {
    const obj = { Type: "Group", GroupName: "", GroupId: "", SystemType: "Root", Isroot: false }
    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [selection, setSelection] = useState([]);
    const [isModal, setIsModal] = useState(false);
    const [adminObj, setAdminObj] = useState({ ...obj });
    const [groups, setGroups] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const columns = [
        {
            title: 'User Name',
            dataIndex: 'Firstname',
            key: 'Firstname',
            render: text => <a>{text}</a>,
            ...GetColumnSearchProps('Firstname')
        },
        {
            title: 'Email',
            dataIndex: 'Email',
            key: 'Email',
            ...GetColumnSearchProps('Email')
        },
        {
            title: 'Branch',
            dataIndex: 'BranchName',
            key: 'BranchName',
            ...GetColumnSearchProps('BranchName')
        },
        {
            title: 'College',
            dataIndex: 'CollegeName',
            key: 'CollegeName',
            ...GetColumnSearchProps('CollegeName')
        },

    ];
    useEffect(() => {
        getMembersCount();
        getMembers(1, 20);
    }, []);
    const getMembers = async (page, pageSize) => {
        setLoading(true);
        const response = await getUsers(profile?.Id, pageSize, ((pageSize * page) - pageSize));
        if (response.ok) {
            setLoading(false);
            response.data.forEach((item, index) => {
                item["key"] = index;
            })
            setData(response.data);
        }
        else { setLoading(false); }

    }
    const onPageChange = (page, pageSize) => {
        setSelection([])
        setSelectedRowKeys([]);
        getMembers(page, pageSize);
    }
    const getMembersCount = async () => {
        const response = await getUsersCount();
        if (response.ok) {
            setCount(response.data?.[0]);
        }

    }
    const showModal = (type) => {
        if (selection.length == 0 || selection.length > 1) {
            notify({
                description: "Please select one record",
                message: "Selection",
            });
        }
        else {
            if (type == "scholor")
                changeScholor();
            else {
                setAdminObj({ ...obj })
                fetchGroupSuggestions();
                setIsModal(true)
            }
        }
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
    const changeScholor = () => {
        setScholor(selection[0].UserId).then((res) => {
            if (res.ok) {
                setSelectedRowKeys([]);
                setSelection([]);
                notify({
                    description: "Scholor updated successfully",
                    message: "Scholor",
                });
            }
        });
    }
    const handleCancel = () => {
        setIsModal(false)
    }
    const setAdmin = async () => {
        if (adminObj.Type == "Group") {
            let saveAdminObj = {
                GroupId: adminObj.GroupId,
                AdminUsers: [{
                    "UserId": selection[0]?.UserId,
                    "Firstname": selection[0]?.Firstname,
                    "Lastname": selection[0]?.Lastname,
                    "Image": selection[0]?.ProfilePic,
                    "Email": selection[0]?.Email
                }]
            };
            const groupAdminData = await saveAdminUsers(saveAdminObj);
            if (groupAdminData.ok) {
                setIsModal(false)
                setSelection([])
                setSelectedRowKeys([]);
                notify({ message: "Group Admin", description: "Set as admin successfully" });
            } else {
                notify({ message: "Error", type: "error", description: "Something went wrong :)" });
            }
        }
        else {
            const setAdminsData = await setSystemAdmin(selection[0]?.UserId, adminObj.SystemType);
            if (setAdminsData.ok) {
                setIsModal(false)
                setSelection([])
                setSelectedRowKeys([]);
                notify({ message: "System", description: "Set as Admin successfully" });
            } else {
                notify({ message: "Error", type: "error", description: "Something went wrong :)" });
            }
        }

    }
    const fetchGroupSuggestions = async () => {
        const groupsData = await getSystemGroups(selection[0]?.UserId);
        if (groupsData.ok) {
            setGroups(groupsData.data);
        } else {
            notify({ message: "Error", type: "error", description: "Something went wrong :)" });
        }
    }
    const onSelectedRowKeysChange = selectedRowKeys => {
        setSelectedRowKeys(selectedRowKeys);
    };
    const handleChange = (prop, value) => {
        adminObj[prop] = value.currentTarget ? value.currentTarget.value : value;
        setAdminObj({ ...adminObj })
    }
    return <>
        <Title className="f-18 text-primary semibold">Members</Title>
        {/* <div className="custom-card">
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
        </div> */}
        <div className="custom-card">
            <Card className="px-12 pt-12" extra={<div>
                {/* <Tooltip placement="top" title="Block">
                    <span className="left-menu block-icon mx-8"></span>
                </Tooltip> */}
                <Tooltip placement="top" title="Set Scholor" onClick={() => showModal("scholor")}>
                    <span className="left-menu setscroller-icon mx-8"></span>
                </Tooltip>
                <Tooltip placement="top" title="Set Admin" onClick={() => showModal()}>
                    <span className="left-menu setadmin-icon mx-8"></span>
                </Tooltip>

            </div>}>
                <div className="overflowX-auto">
                    <Table
                        rowSelection={{
                            hideSelectAll: true,
                            onSelect: onRecordSelect,
                            selectedRowKeys: selectedRowKeys,
                            onChange: onSelectedRowKeysChange
                        }}
                        loading={loading}
                        columns={columns} dataSource={data} size="small" pagination={{ position: ["bottomCenter"], total: count, onChange: (page, pageSize) => onPageChange(page, pageSize) }} bordered={true} />
                </div>
            </Card>
        </div>
        <Modal title="Add Admin" visible={isModal} onCancel={handleCancel} centered
            footer={<>
                <Button type="primary" form="myForm" key="submit" htmlType="submit">Save</Button>
            </>}
            destroyOnClose={true}

        >
            <Form id="myForm" onFinishFailed={() => { }} onFinish={() => setAdmin()} initialValues={{ Type: "Group", GroupName: "", GroupId: "", SystemType: "Root", Isroot: false }}>
                <div>
                    <div className="custom-fields">
                        <label className="text-secondary d-block mb-4">Choose Type</label>
                        <Form.Item name="Type" rules={[{ required: true, message: "Type  required" }]} >
                            <Select defaultValue="Group" placeholder="Choose Type" onChange={(value) => handleChange('Type', value, true)} >
                                <Option value="Group">Group</Option>
                                <Option value="System">System</Option>
                            </Select>
                        </Form.Item>
                    </div>
                    {adminObj.Type === "System" && <div className="custom-fields">
                        <label className="text-secondary d-block mb-4">System Type</label>
                        <Form.Item name="SystemType">
                            <Select defaultValue="Root" placeholder="Choose System Type" onChange={(value) => handleChange('SystemType', value, true)}>
                                <Option value="Root">Root</Option>
                                <Option value="LMS">LMS</Option>
                                <Option value="Careers">Careers</Option>
                            </Select>
                        </Form.Item>
                    </div>
                    }
                    {adminObj.Type === "Group" && <div className="custom-fields">
                        <label className="text-secondary d-block mb-4 ant-form-item-required">* Group</label>
                        <Form.Item name="GroupId" rules={[{ required: true, message: "Group  required" }]}>
                            <Select defaultValue="Choose Group" placeholder="Choose Group" onChange={(val) => handleChange("GroupId", val)}>
                                <Option value="">Choose Group</Option>
                                {groups?.map((group) => <Option value={group?.id}>{group?.name}</Option>)}
                            </Select>
                        </Form.Item>
                    </div>
                    }
                </div>
            </Form>
        </Modal>
    </>
}
export default connectStateProps(Members);