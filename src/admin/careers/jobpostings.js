import React, { useEffect, useState } from 'react';
import { Card, Table, Tooltip } from 'antd';
import Title from 'antd/lib/typography/Title';
import { Link, withRouter } from 'react-router-dom';
import connectStateProps from '../../shared/stateConnect';
import { getJobPostings, jobpostingsCount } from '../../shared/api/apiServer';
import notify from '../../shared/components/notification';

const columns = [
    {
        title: 'Title',
        dataIndex: 'Title',
        key: 'Title',
        render: text => <a>{text}</a>,
    },
    {
        title: 'Employer Name',
        dataIndex: 'EmployerName',
        key: 'EmployerName',
    },
    {
        title: 'Type',
        dataIndex: 'Type',
        key: 'Type',
    },
    {
        title: 'Qualification',
        dataIndex: 'Qualification',
        key: 'Qualification',
    },
    {
        title:'Status',
        dataIndex:'Status',
        key:'Status'
    }

];

const JobPostings = ({profile,history})=>{

    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);
    const [selection, setSelection] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    useEffect(()=>{
        jobsCount();
        getAllJobPostings(1,10);
    },[])

    const getAllJobPostings = async (page,pageSize)=>{
        const response = await getJobPostings(profile.Id,pageSize, ((pageSize * page) - pageSize));
        if (response.ok) {
            response.data.forEach((item, index) => {
                item["key"] = index;
            })
            setData(response.data);
            setCount(response.data.length);
        }
    }

    const jobsCount = async ()=>{
        const response = await jobpostingsCount();
        if(response.ok){
            setCount(response.data?.[0]);
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

    const onSelectedRowKeysChange = selectedRowKeys => {
        setSelectedRowKeys(selectedRowKeys);
    };

    const onPageChange = (page, pageSize) => {
        setSelection([])
        setSelectedRowKeys([]);
        getAllJobPostings(page,pageSize)
    }

    const handleJobById = ()=>{
        if(selection.length == 0 || selection.length > 1){
            notify({ message: "Warning", type: "error", description: "Please select one record only" });
            return;
        }else{
            history.push(`/admin/postingjob/${selection[0].JobId}`)
        }
    }

    return <>
    <Title className="f-18 text-primary semibold">Jobs</Title>
    <div className="custom-card">
            <Card className="px-12 pt-12" extra={<div>
                <Tooltip placement="top" title="Add job">
                    <Link to="/admin/postingjob/new" className="icons add"></Link>
                </Tooltip>
                <Tooltip placement="top" title="Edit job">
                    <Link className="icons edit" onClick={handleJobById}></Link>
                </Tooltip>

            </div>}>
                <Table
                    rowSelection={{
                        hideSelectAll: true,
                        onSelect: onRecordSelect,
                        selectedRowKeys: selectedRowKeys,
                        onChange: onSelectedRowKeysChange
                    }}
                    columns={columns} dataSource={data} size="small" pagination={{ position: ["bottomCenter"], total: count, onChange: (page, pageSize) => onPageChange(page, pageSize) }} bordered={true} />
            </Card>
        </div>
    </>
}

export default connectStateProps(withRouter(JobPostings));