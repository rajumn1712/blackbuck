import React, { useEffect, useState } from "react";
import { Card, Modal, Table, Tooltip } from "antd";
import Title from "antd/lib/typography/Title";
import { Link, withRouter } from "react-router-dom";
import connectStateProps from "../../shared/stateConnect";
import {
  deleteJobPost,
  getJobPostings,
  jobpostingsCount,
} from "../../shared/api/apiServer";
import notify from "../../shared/components/notification";
import GetColumnSearchProps from "../../shared/components/filterComponent";

const JobPostings = ({ profile, history }) => {
  const columns = [
    {
      title: "Title",
      dataIndex: "Title",
      key: "Title",
      render: (text, record) => (
        <Link to={`/admin/postingjob/${record.JobId}`}>{text}</Link>
      ),
      ...GetColumnSearchProps('Title')
    },
    {
      title: "Employer Name",
      dataIndex: "EmployerName",
      key: "EmployerName",
      ...GetColumnSearchProps('EmployerName')
    },
    {
      title: "Type",
      dataIndex: "Type",
      key: "Type",
      ...GetColumnSearchProps('Type')
    },
    {
      title: "Qualification",
      dataIndex: "Qualification",
      key: "Qualification",
      ...GetColumnSearchProps('Qualification')
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
    },
  ];
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [selection, setSelection] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    jobsCount();
    getAllJobPostings(1, 10);
  }, []);

  const getAllJobPostings = async (page, pageSize) => {
    setLoading(true);
    const response = await getJobPostings(
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

  const jobsCount = async () => {
    const response = await jobpostingsCount();
    if (response.ok) {
      setCount(response.data?.[0]);
    }
  };

  const onRecordSelect = (record) => {
    const idx = selection.indexOf(record);
    if (idx > -1) {
      selection.splice(idx, 1);
    } else {
      selection.push(record);
    }
    setSelection(selection);
  };

  const onSelectedRowKeysChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const onPageChange = (page, pageSize) => {
    setSelection([]);
    setSelectedRowKeys([]);
    getAllJobPostings(page, pageSize);
  };

  const handleJobById = () => {
    if (selection.length == 0 || selection.length > 1) {
      notify({
        message: "Warning",
        type: "warning",
        description: "Please select one record only",
      });
      return;
    } else {
      history.push(`/admin/postingjob/${selection[0].JobId}`);
    }
  };

  const deleteJob = async () => {
    if (selection.length == 0 || selection.length > 1) {
      notify({
        message: "Warning",
        type: "warning",
        description: "Please select one record only",
      });
      return;
    } else {
      Modal.confirm({
        title: "Confirm",
        icon: "",
        content: "Are you sure want to delete job?",
        okText: "Ok",
        cancelText: "Cancel",
        onOk: () => confirmJObDelete(),
      });
    }
  };

  const confirmJObDelete = async () => {
    const response = await deleteJobPost(selection[0].JobId);
    if (response.ok) {
      getAllJobPostings(1, 10);
      setSelectedRowKeys([]);
      setSelection([]);
      notify({
        message: "Delete",
        type: "success",
        description: "Job post deleted successfully",
      });
    } else {
      notify({
        message: "Error",
        type: "error",
        description: "Something went wrong",
      });
    }
  };

  return (
    <>
      <Title className="f-18 text-primary semibold">Jobs</Title>
      <div className="custom-card">
        <Card
          className="px-12 pt-12"
          extra={
            <ul className="admin-actions">
              <li>
                <Tooltip placement="top" title="Add job">
                  <Link
                    to="/admin/postingjob/new"
                    className="icon add-icon mr-0"
                  ></Link>
                </Tooltip>
              </li>
              <li>  
                <Tooltip placement="top" title="Edit job">
                  <Link
                    className="icon edit-admin mr-0"
                    onClick={handleJobById}
                  ></Link>
                </Tooltip>
              </li>
              <li>
                <Tooltip placement="top" title="Delete job">
                  <Link className="icon delete-admin mr-0" onClick={deleteJob}></Link>
                </Tooltip>
              </li>
            </ul>
          }
        >
          <div className="overflowX-auto">
            <Table
              rowSelection={{
                hideSelectAll: true,
                onSelect: onRecordSelect,
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectedRowKeysChange,
              }}
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
      </div>
    </>
  );
};

export default connectStateProps(withRouter(JobPostings));
