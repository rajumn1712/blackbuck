import React, { useEffect, useState } from 'react';
import { Card, Select, Table, Tooltip } from 'antd';
import Title from 'antd/lib/typography/Title';
import { getAllSystemGroups, groupBlock } from '../../shared/api/apiServer';
import connectStateProps from '../../shared/stateConnect';
import notify from '../../shared/components/notification';
import moment from 'moment';
import Loader from "../../common/loader";
import GetColumnSearchProps from "../../shared/components/filterComponent";
import CommonModal from "../../components/ProfileComponents/CommonModal";
import CreateGroup from '../../group/creategroup';

const { Option } = Select;
const Groups = ({ profile }) => {
    const columnsGroups = [
        {
            title: 'Group Name',
            dataIndex: 'name',
            ...GetColumnSearchProps('name')
        },
        {
            title: 'Posts',
            dataIndex: 'postsCount',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            ...GetColumnSearchProps('type')
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
            }),
            ...GetColumnSearchProps('type', (value, record) => {
                record.adminUsers.forEach((admin, index) => {
                    record.renderdText = (record.renderdText ? record.renderdText : "") + "" + (admin.Firstname ? admin.Firstname : "");
                });
                return record['renderdText'].toLowerCase().includes(value.toLowerCase())
            })
        },
        {
            title: 'Status',
            dataIndex: 'Status',
            render: (text, record) => { return record.IsGroupBlocked ? 'Blocked' : 'Active' }
        },
    ];
    const [data, setData] = useState([]);
    const [selection, setSelection] = useState([]);
    const [isModal, setIsModal] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cgroup, setCgroup] = useState("");
    useEffect(() => {
        getGroups(1, 20);
    }, []);
    const handleCancel = () => {
        setIsModal(false)
    };
    const saveGroup = () => {
        cgroup.handleSave();
    };
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
    const createGroup = () => {
        setIsModal(true)
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
        <div className="custom-card">
            <Card className="px-12 pt-12"
                extra={<ul className="admin-actions">
                    <li>
                        <Tooltip placement="top" title="Create Group" onClick={() => createGroup()}>
                            <span className="left-menu group-icon  cursor-pointer"></span>
                        </Tooltip>
                    </li>
                    <li>
                        <Tooltip placement="top" title="Block / Un Block" onClick={() => blockGroup()}>
                            <span className="left-menu block-icon cursor-pointer"></span>
                        </Tooltip>
                    </li>
                </ul>}>
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
            <CommonModal
                className="creategroup-popup"
                visible={isModal}
                title="Create group"
                cancel={handleCancel}
                saved={saveGroup}
            >
                {isModal && (
                    <CreateGroup
                        Type={"Add"}
                        CreatorType={'Admin'}
                        handleCancel={handleCancel}
                        onRef={(cgroup) => (setCgroup({ ...cgroup }))}
                    />
                )}
            </CommonModal>
        </div>
    </>
}
export default connectStateProps(Groups);