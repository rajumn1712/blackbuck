import React, {
  useEffect,
  useState,
} from "react";
import {
  Typography,
  Card,
  Empty,
  Modal,
  Skeleton
} from "antd";
import { Link, withRouter } from "react-router-dom";
import {
  allJobPostings,
  deleteJobSavedPost,
  saveUserJobPost
} from "../shared/api/apiServer";
import Loader from "../common/loader";
import Moment from "react-moment";
import { uuidv4 } from "../utils";
import notify from "../shared/components/notification";
import connectStateProps from "../shared/stateConnect";
import ApplyModal from "./applyModal";

const { Title, Paragraph } = Typography;
const JobCard = ((props) => {
  let page = 1;
  const pageSize = 5;
  let showSavedLink = window.location.href.indexOf("savedjobs") > -1;
  let [allJobPosts, setAllJobPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  let [loadMore, setLoadMore] = useState(true);
  let [jobpostObj, setJobPostObj] = useState({});

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = (jobpost) => {
    if (jobpost.IsApplied) {
      notify({
        message: "Job",
        type: "warning",
        description: "Already applied to this job",
      });
    } else {
      jobpostObj = jobpost;
      setJobPostObj({ ...jobpostObj });
      setIsModalVisible(true);
    }
  };

  const handleCancel = (isSubmit) => {
    if (isSubmit) updateJobApplications(jobpostObj, "Application");
    setIsModalVisible(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    if (props.refresh) {
      allJobPosts = [];
      setAllJobPosts([...allJobPosts]);
    }
    getJobPostings(page, pageSize);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [props.refresh]);

  const getJobPostings = async (pageNo, pagesize) => {
    setLoading(true);
    const response = await allJobPostings(
      props.profile?.Id,
      pagesize,
      pagesize * pageNo - pagesize,
      props.postingsType,
      props.searchobj?.stateValue,
      props.searchobj?.cityValue
    );
    if (response.ok) {
      allJobPosts = allJobPosts.concat(response.data);
      setAllJobPosts([...allJobPosts]);
      setLoading(false);
      loadMore = response.data.length === pageSize ? true : false;
      setLoadMore(loadMore);
    }
  };
  const handleScroll = () => {
    const windowHeight =
      "innerHeight" in window
        ? window.innerHeight
        : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowBottom = Math.ceil(windowHeight + window.pageYOffset);
    if (windowBottom >= docHeight) {
      loadMoreJobs();
    } else {
    }
  };
  const loadMoreJobs = (e) => {
    if (loadMore && !loading) {
      page += 1;
      setLoading(true);
      getJobPostings(page, 5);
    }
  };

  const saveJobPost = async (job) => {
    if (job.IsJobSaved) {
      notify({
        message: "Job",
        type: "warning",
        description: "Already saved this job",
      });
      return;
    }
    const object = {
      Id: uuidv4(),
      JobId: job.JobId,
      UserId: props.profile.Id,
      CreateDate: new Date(),
    };
    const response = await saveUserJobPost(object);
    if (response.ok) {
      updateJobApplications(job, "SavedJob");
      notify({
        message: "Job",
        type: "success",
        description: "Job application saved",
      });
    } else {
      notify({
        message: "Job",
        type: "error",
        description: "Something went wrong",
      });
    }
  };

  const updateJobApplications = (job, type) => {
    let typeObj = { SavedJob: "IsJobSaved", Application: "IsApplied" };
    allJobPosts.forEach((item) => {
      if (item.JobId === job.JobId) {
        item[typeObj[type]] = true;
      }
    });
    setAllJobPosts([...allJobPosts]);
  };
  const deleteJob = (jobpost) => {
    Modal.confirm({
      title: "Confirm",
      icon: "",
      content: "Are you sure want to delete saved job?",
      okText: "Ok",
      cancelText: "Cancel",
      onOk: () => confirmJObDelete(jobpost),
    });
  };
  const confirmJObDelete = async (jobpost)=>{
    const response = await deleteJobSavedPost(jobpost.JobId);
    if (response.ok) {
      allJobPosts = allJobPosts.filter((item) => jobpost.JobId !== item.JobId);
      setAllJobPosts([...allJobPosts]);
      notify({
        message: "Delete",
        type: "success",
        description: "Saved job deleted successfully",
      });
    } else {
      notify({
        message: "Delete",
        type: "error",
        description: "Something went wrong",
      });
    }
  }
  const renderJobPost = (jobpost, indx) => {
    return (
      <div className="post-card" key={indx}>
        <Card
          bordered={true}
          className="job-card"
          actions={[
            <Link to={`/jobdetail/${jobpost.JobId}`}>
              <span className="post-icons view-job mr-8"></span>View Details
            </Link>,
            jobpost.IsApplied ? <a className="apply-job-btn">
            <span className="post-icons apply-job"></span>Applied
          </a> :<a className="apply-job-btn" onClick={() => showModal(jobpost)}>
              <span className="post-icons apply-job"></span>Apply Now
            </a>,
            !showSavedLink ? (
              <a onClick={() => saveJobPost(jobpost)}>
                <span className="post-icons save-job"></span>Save Job
              </a>
            ):<a onClick={() => deleteJob(jobpost)}>
            <span className="post-icons delete-icon"></span>Delete
          </a>,
          ]}
        >
          <div className="p-12 cursor-pointer" onClick={()=>{
        props.history.push(`/jobdetail/${jobpost.JobId}`)
      }}>
            <div className="job-card-title">
              <div className="company-logo"> 
                {jobpost.CompanyLogo && <img src={jobpost.CompanyLogo} className="obj-fit" alt={jobpost.EmployerName} />}
                {!jobpost.CompanyLogo && <span className="company-text">{jobpost.EmployerName.substring(0,2)}</span>}
              </div>
              <div> 
              <Title className="f-16 semibold text-secondary mb-0 "><Link to={`/jobdetail/${jobpost.JobId}`}> <span className="post-title">{jobpost.Title}</span></Link></Title>
            {/* <Paragraph className="f-12 text-secondary">
              <Moment fromNow>{jobpost.CreateDate}</Moment>
            </Paragraph> */}
              <Paragraph className="f-12 mb-8" >{jobpost.EmployerName}</Paragraph>
            </div>
            </div>
            <Paragraph className="f-14 text-primary" ellipsis={{ rows: 2 }}>
              {jobpost.Role}
            </Paragraph>
            <ul className="d-flex m-0 pl-0 job-req justify-content-between">
              <li className="f-14 text-primary">
                <span className="post-icons job mr-16"></span>
                {jobpost.Type === "Job" && (
                  <Paragraph className="f-14 text-primary m-0">
                    {jobpost.Years} Yr's
                  </Paragraph>
                )}
                {jobpost.Type === "Internship" && jobpost.Years !== "0" ? (
                  <Paragraph className="f-14 text-primary m-0">
                    {jobpost.Years} Yr's {jobpost.Months} M
                  </Paragraph>
                ) : (
                  jobpost.Type === "Internship" && (
                    <Paragraph className="f-14 text-primary m-0">
                      {jobpost.Months}{" "}
                      {jobpost.Months === "1" ? "Month" : "Months"}
                    </Paragraph>
                  )
                )}
              </li>
              <li className=" f-14 text-primary ">
                <span className="post-icons role mr-16"></span>
                <Paragraph className="f-14 text-primary m-0">
                  {jobpost.SalaryRange ? jobpost.SalaryRange : "Not Disclosed"}
                </Paragraph>
              </li>
              <li className="f-14 text-primary">
                <span className="post-icons location mr-16"></span>
                <Paragraph className="f-14 text-primary m-0">
                  {jobpost.City}, {jobpost.State}
                </Paragraph>
              </li>
            </ul>
            <span className="job-ldate semibold f-12 text-secondary">
              Apply Before {" "}
              <span className="semibold text-primary">
                <Moment format="MM/DD/YYYY">{jobpost.EndDate}</Moment>
              </span>
            </span>
          </div>
        </Card>
      </div>
    );
  };
  return (
    <div onScroll={handleScroll}>
      {allJobPosts?.map((jobpost, indx) => renderJobPost(jobpost, indx))}
      {loading &&
      <div className="post-card-skelton jc-skelton" >
          <div className="post-card-header-skelton">
            <Skeleton.Avatar active shape='Square' size="large" />
            <Skeleton active paragraph={{ rows: 1 }} />
          </div>
          <div className="job-card-body-skelton">
            <Skeleton paragraph={{rows:2}} active />
            <div className="d-flex">
              <Skeleton.Button active shape='square' />
              <Skeleton.Button active shape='square' />
              <Skeleton.Button active shape='square' />
          </div>
          <Skeleton.Button className="s-date-btn" active shape='square' />
          </div>
          <div className="post-card-footer-skelton d-flex">
            <Skeleton.Button active shape='square' />
            <Skeleton.Button active shape='square' />
            <Skeleton.Button active shape='square' />
          </div>
        </div>}
      {allJobPosts.length == 0 && <Empty />}
      <ApplyModal
        className="custom-popup"
        visible={isModalVisible}
        object={jobpostObj}
        cancel={(isSubmit) => handleCancel(isSubmit)}
        formid="myJobCardFomid"
      />
    </div>
  );
});
export default connectStateProps(withRouter(JobCard));
