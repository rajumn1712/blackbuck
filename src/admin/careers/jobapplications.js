import { Card, Table } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useEffect, useState } from 'react';
import Moment from 'react-moment';
import { getJobApplications, jobApplicationCount } from '../../shared/api/apiServer';

const columns = [
    {
        title: 'Title',
        dataIndex: 'Title',
        key: 'Title',
    },
    {
        title: 'Applicant Name',
        dataIndex: 'ApplicantName',
        render:(text,record)=><span>{record.ApplicantDetails.Firstname} {record.ApplicantDetails.Lastname}</span>
    },
    {
        title: 'File Name',
        dataIndex: 'FileName',
        render:(text,record)=><a href={record.Documents.Url}>{record.Documents.File}</a>
    },
    {
        title: 'Skills',
        dataIndex: 'Skills',
        key: 'Skills',
    },
    {
        title:'Date of Application',
        dataIndex: 'CreateDate',
      render: (text) => <span ><Moment fromNow>{text}</Moment></span>
    }

];

const JobApplications = ()=>{

    const [data,setData] = useState([]);
    const [count,setCount] = useState(0);
    const [loading,setLoading] = useState(false);

    useEffect(()=>{
        applicationsCOunt()
        allJObApplication(1,10);
    },[])

    const allJObApplication = async (page,pageSize)=>{
        setLoading(true);
        const response = await getJobApplications(pageSize, ((pageSize * page) - pageSize));
        if(response.ok){
            response.data.forEach((item, index) => {
                item["key"] = index;
            })
            setData(response.data);
            setLoading(false)
        }

    }

    const applicationsCOunt = async ()=>{
        const response = await jobApplicationCount();
        if(response.ok){
            setCount(response.data?.[0]);
        }
    }

    const onPageChange = (page, pageSize) => {
        allJObApplication(page,pageSize)
    }

    return(
        <>
        <Title className="f-18 text-primary semibold">Jobs</Title>
        <Card className="custom-card">
        <div className="custom-card">
           <Table loading={loading}
                    columns={columns} dataSource={data} size="small" pagination={{ position: ["bottomCenter"], total: count, onChange: (page, pageSize) => onPageChange(page, pageSize) }} bordered={true} />
        </div>
        </Card>
        </>
    )
}

export default JobApplications;