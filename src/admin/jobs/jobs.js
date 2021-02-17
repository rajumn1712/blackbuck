import React, { Component } from "react";
import { Typography, Card, Table, Dropdown, Menu } from "antd";

const { Title } = Typography;
const assginMentActions = (
    <Menu className="custom-dropdown">
      <Menu.Item key="0">
        <a href="#">Certified</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a href="#">Rejected</a>
      </Menu.Item>
    </Menu>
  );
const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Document',
      dataIndex: 'document',
      render: text => <a>{text}</a>
    },
    {
        title: 'Date and Time',
        dataIndex: 'datetime',
    },
    {
      title: '',
      dataIndex: 'action',
      render:  () => <><Dropdown overlay={assginMentActions} trigger={['click']}>
      <div className="text-right"><a className="ant-dropdown-link" onClick={e => e.preventDefault()}><span className="post-icons more-icon mr-0"></span></a></div></Dropdown></>,
    },
  ];
  const data = [
    {
      key: '1',
      name: 'John Brown',
      document: 'Assignment - 1.docx',
      datetime: '19/01/2021 1:10 pm',      
    },
    {
      key: '2',
      name: 'Jim Green',
      document: 'Assignment - 2.ppt',
      datetime: '19/01/2021 1:10 pm',
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      document: 'Assignment - 3.docx',
      datetime: '19/01/2021 1:10 pm',
      address: 'Sidney No. 1 Lake Park',
    },
  ];

class Jobs extends Component {
  render() {
    return (
      <>
        <Title className="f-18 text-primary semibold">Test Submissions</Title>
        <div className="custom-card">
          <Card className="p-12 custom-fields">
            <div className="overflowX-auto">
            <Table columns={columns} dataSource={data} size="small" bordered={true} pagination={{ position: ["bottomCenter"]}} />
              
            </div>
          </Card>
        </div>
      </>
    );
  }
}
export default Jobs;
