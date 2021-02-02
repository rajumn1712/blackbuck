import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Card
} from "antd";
import ApplyModal from "./applyModal";
import { Link, withRouter } from "react-router-dom";
import { getJobById } from "../shared/api/apiServer";
import Moment from "react-moment";
import Loader from "../common/loader";
import notify from "../shared/components/notification";
import connectStateProps from "../shared/stateConnect";


const { Title, Paragraph } = Typography;
const JobDetails = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading,setLoading] = useState(false);
  let [jobDetailObj,setJobDetailObj] = useState({})

  useEffect(()=>{
    getJobdetail();
  },[]);

  const getJobdetail = async ()=>{
    setLoading(true);
    const response = await getJobById(props.profile?.Id,props.match.params?.jobid);
    if(response.ok){
jobDetailObj = response.data[0];
setJobDetailObj({...jobDetailObj});
setLoading(false);
    }
  }
  const showModal = () => {
    if(jobDetailObj.IsApplied){
      notify({
        message:'Job',
        type:'warning',
        description:'Already applied to this job'
      })
    }else{setIsModalVisible(true);}
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <>
      <Link className="f-16 semibold mx-4 text-primary" to="/cms">
        <span class="icon left-arrow mr-0"></span>Back to Careers
      </Link>
      <div className="custom-card mt-12">
      {loading && <Loader className="loader-top-middle" />}
        <Card>
          <div className="p-12">
            <Title className="f-16 semibold text-primary mb-0">
              {jobDetailObj.Title}
            </Title>
            <Paragraph className="f-12 text-secondary">
              <Moment fromNow>{jobDetailObj.CreateDate}</Moment>
            </Paragraph>
            <Paragraph className="f-14">
              {jobDetailObj.EmployerName}
            </Paragraph>
            <p className="f-14 text-primary mb-12 job-req">
              <span className="post-icons job mr-16"></span>{jobDetailObj.Years} Yr's
            </p>
            <p className="f-14 text-primary mb-12 job-req">
              <span className="post-icons role mr-16"></span>{jobDetailObj.SalaryRange}
            </p>
            <p className="f-14 text-primary job-req d-flex">
              <span className="post-icons location mr-16"></span>
             <p> {jobDetailObj.Place}, {jobDetailObj.City}, {jobDetailObj.State}</p>
            </p>
            <span className="job-ldate f-14 semibold text-secondary px-8 py-4">
              Apply before |{" "}
              <span className="semibold text-primary f-16">
                <Moment format="MM/DD/YYYY">{jobDetailObj.EndDate}</Moment>
              </span>
            </span>
          </div>
          <div
            className="p-12 text-right"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            {/* <Button type="dashed">Save Job</Button> */}
            <Button type="primary" className="ml-16" onClick={showModal}>
              Apply Now
            </Button>
          </div>
        </Card>
        <Card title="Job Description" bordered>
          <div className="p-12">
            <Paragraph className="f-12 text-secondary mb-0">Type</Paragraph>
            <Paragraph className="f-14 text-primary semibold">{jobDetailObj.Type}</Paragraph>
            <Paragraph className="text-secondary">
             {jobDetailObj.Role}
            </Paragraph>
            <Title className="f-16 semibold text-primary mb-8">Education</Title>
            <Paragraph className="text-primary f-14 mb-4">
              <span className="text-secondary">{jobDetailObj.Qualification}</span>
            </Paragraph>
            {/* <Paragraph className="text-primary f-14 mb-4">
              <span className="text-secondary">PG -</span> Masters of Computers
              Applications
            </Paragraph> */}
          </div>
        </Card>
        <Card title="Skills" bordered>
          <div className="p-12">
          {jobDetailObj.Skills}
            {/* <span className="job-tag text-primary">#UI/UX Designer,</span>
            <span className="job-tag text-primary">#UI Developer,</span>
            <span className="job-tag text-primary">#FrontEnd Development,</span>
            <span className="job-tag text-primary">#Developer,</span> */}
          </div>
        </Card>
      
        <ApplyModal className="custom-popup"
          visible={isModalVisible}
          object={jobDetailObj}
          cancel={handleCancel}
          formid="myJobFormID"
        />
        </div>
    </>
  );
};
export default connectStateProps(withRouter(JobDetails));
