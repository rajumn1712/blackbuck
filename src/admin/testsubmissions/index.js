import React, { useEffect, useState } from 'react';
import { Typography, Card, Table, Dropdown, Menu } from 'antd';
import { getSubmissions, certipyRejectDocument } from '../../shared/api/apiServer';
import connectStateProps from '../../shared/stateConnect';
import Moment from "react-moment";
import notify from '../../shared/components/notification';

const { Title } = Typography;
// const assginMentActions = (
//   <Menu className="custom-dropdown">
//     <Menu.Item key="0">
//       <span onClick={(event, record) => certifyDoc(record)}>Certified</span>
//     </Menu.Item>
//     <Menu.Item key="1">
//       <span onClick={(event, record) => certifyDoc(record)}>Rejected</span>
//     </Menu.Item>
//   </Menu>
// );


const TestSubmissions = ({ profile }) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'Firstname',
    },
    {
      title: 'Document',
      dataIndex: 'document',
      render: (text, record) => record.Tests?.map((test, index) => {
        return <span><a onClick={(ev) => {
          ev.stopPropagation();
          window.open(test.Documents, "_blank");
        }}>{test.Title}</a>{index !== record.Tests?.length - 1 && ", "}</span>
      })
    },
    {
      title: 'Date and Time',
      dataIndex: 'CreatedDate',
      render: (text) => <span ><Moment fromNow>{text}</Moment></span>
    },
    {
      title: '',
      dataIndex: 'action',
      render: (text, record) => <><Dropdown overlay={<Menu className="custom-dropdown">
        <Menu.Item key="0">
          <span onClick={() => certifyDoc(record, "Certified")}>Certified</span>
        </Menu.Item>
        <Menu.Item key="1">
          <span onClick={() => certifyDoc(record, "Rejected")}>Rejected</span>
        </Menu.Item>
      </Menu>} trigger={['click']}>
        <div className="text-right"><a className="ant-dropdown-link" onClick={e => e.preventDefault()}><span className="post-icons more-icon mr-0"></span></a></div></Dropdown></>,
    },
  ];
  const [data, setData] = useState([])
  useEffect(() => {
    getTestSubmissions(1, 20);
  }, []);
  const getTestSubmissions = async (page, pageSize) => {
    const response = await getSubmissions(profile?.Id, pageSize, ((pageSize * page) - pageSize));
    if (response.ok) {
      let data = response.data;
      setData(data);
    }

  }
  const certifyDoc = async (record, type) => {
    const result = await certipyRejectDocument(record.Id, type);
    if (result.ok) {
      notify({ message: "Test", description: `Documents ${type} successfully` });
      getTestSubmissions(1, 20);
    }
    else {
      window.scrollTo(0, 0);
      notify({ message: "Error", type: "error", description: "Something went wrong :)" });
    }
  }
  return (
    <>
      <Title className="f-18 text-primary semibold">Test Submissions</Title>
      <div className="custom-card">
        <Card className="p-12 custom-fields">
          <Table columns={columns} dataSource={data} size="small" bordered={true} pagination={{ position: ["bottomCenter"], total: data?.length }} />
        </Card>
      </div>
    </>
  );
}
export default connectStateProps(TestSubmissions);
