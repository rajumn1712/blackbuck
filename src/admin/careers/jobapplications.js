import { Card, Table } from "antd";
import Title from "antd/lib/typography/Title";
import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import ShowMoreText from "react-show-more-text";
import {
  getJobApplications,
  jobApplicationCount,
} from "../../shared/api/apiServer";
import GetColumnSearchProps from "../../shared/components/filterComponent";
import connectStateProps from "../../shared/stateConnect";

const JobApplications = ({profile}) => {
  const columns = [
    {
      title: "Title",
      dataIndex: "Title",
      key: "Title",
      ...GetColumnSearchProps('Title')
    },
    {
      title: "Applicant Name",
      dataIndex: "ApplicantName",
      render: (text, record) => (
        <span>
          {record.ApplicantDetails.Firstname} {record.ApplicantDetails.Lastname}
        </span>
      ),
      ...GetColumnSearchProps('ApplicationName')
    },
    {
      title: "File Name",
      dataIndex: "FileName",
      render: (text, record) => (
        <a href={record.Documents.Url}>{record.Documents.File}</a>
      ),
    },
    {
      title: "Skills",
      dataIndex: "Skills",
      key: "Skills",
      ...GetColumnSearchProps('Skills')
    },
    {
      title: "Comment",
      dataIndex: "Comment",
      render: (text) => (
        <ShowMoreText lines={2} more="see more" less="see less">
          {text}
        </ShowMoreText>
      ),
      ...GetColumnSearchProps('Comment')
    },
    {
      title: "Date of Application",
      dataIndex: "CreateDate",
      render: (text) => (
        <span>
          <Moment fromNow>{text}</Moment>
        </span>
      ),
    },
  ];
  const [data, setData] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    applicationsCOunt();
    allJObApplication(1, 10);
  }, []);

  const allJObApplication = async (page, pageSize) => {
    setLoading(true);
    const response = await getJobApplications(
      profile.Id,
      pageSize,
      pageSize * page - pageSize
    );
    if (response.ok) {
      response.data.forEach((item, index) => {
        item["key"] = index;
      });
      setData(response.data);
      setLoading(false);
    }
  };

  const applicationsCOunt = async () => {
    const response = await jobApplicationCount();
    if (response.ok) {
      setCount(response.data?.[0]);
    }
  };

  const onPageChange = (page, pageSize) => {
    allJObApplication(page, pageSize);
  };

  return (
    <>
      <Title className="f-18 text-primary semibold">Job Applications</Title>
      <Card className="custom-card">
        <div className="custom-card overflowX-auto">
          
          <Table
            loading={loading}
            columns={columns}
            dataSource={data}
            size="small"
            pagination={{
              position: ["bottomCenter"],
              total: count,
              onChange: (page, pageSize) => onPageChange(page, pageSize),
            }}
            bordered={true}
          />
        </div>
      </Card>
    </>
  );
};

export default connectStateProps(JobApplications);
