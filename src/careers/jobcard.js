import React, { useEffect, useState } from "react";
import { Button, Typography, Statistic, Card, Row, Col, Tag } from "antd";
import Identity from "../components/identity";
import Ads from "../components/ads";
import Postings from "../shared/postings";
import BBScholars from "../shared/components/scholars";
import Tags from "../components/ProfileComponents/tags";
import { LikeOutlined } from "@ant-design/icons";
import { Link, withRouter } from "react-router-dom";
import {
  allJobPostings,
  profileDetail,
  saveUserJobPost,
  setSystemAdmin,
} from "../shared/api/apiServer";
import Loader from "../common/loader";
import Moment from "react-moment";
import { uuidv4 } from "../utils";
import notify from "../shared/components/notification";
import connectStateProps from "../shared/stateConnect";

const { Title, Paragraph } = Typography;
const JobCard = (props) => {
  let page = 1;
  const pageSize = 5;
  let [allJobPosts, setAllJobPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadMore, setLoadMore] = useState(true);

  // const log = (e)=> {
  //   console.log(e);
  // }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    getJobPostings(page, pageSize);
  }, []);

  const getJobPostings = async (pageNo, pagesize) => {
    setLoading(true);
    const response = await allJobPostings(
      pagesize,
      pagesize * pageNo - pagesize,
      props.postingsType,
      props.match?.params?.state,
      props.match?.params?.city
    );
    if (response.ok) {
      allJobPosts = allJobPosts.concat(response.data);
      setAllJobPosts([...allJobPosts]);
      setLoading(false);
      setLoadMore(response.data.length === pageSize);
      console.log(loadMore);
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
    const object = {
      Id: uuidv4(),
      JobId: job.JobId,
      UserId: props.profile.Id,
      CreateDate: new Date(),
    };
    const response = await saveUserJobPost(object);
    if (response.ok) {
      notify({
        message: "Job",
        type: "success",
        description: "Job saved for later",
      });
    } else {
      notify({
        message: "Job",
        type: "error",
        description: "Something went wrong",
      });
    }
  };

  const renderJobPost = (jobpost, indx) => {
    return (
      <div className="post-card">
      <Card
        key={indx}
        bordered={true}
        className="job-card"
        actions={[
          <a>
            <span className="post-icons save-job"></span>Save Job
          </a>,
          <a>
            <span className="post-icons view-job mr-8"></span>View Details
          </a>,
          <a>
            <span className="post-icons apply-job"></span>Apply Now
          </a>
        ]}
      >
        <div className="p-12">
          <Title className="f-16 semibold text-primary mb-0">
            {jobpost.Title}
          </Title>
          <Paragraph className="f-12 text-secondary">
            <Moment fromNow>{jobpost.CreateDate}</Moment>
          </Paragraph>
          <Paragraph className="f-12 mb-8" style={{color: 'var(--primary)'}}>
            {jobpost.EmployerName}
          </Paragraph>
          <Paragraph className="f-14 text-primary" ellipsis={{ rows: 2 }}>
            {jobpost.Role}
          </Paragraph>
          <ul className="d-flex m-0 pl-0 job-req">
            <li className="f-14 text-primary">
              <span className="post-icons job mr-16"></span>
              <Paragraph className="f-14 text-primary m-0">
                {jobpost.Type}
              </Paragraph>
            </li>
            <li className=" f-14 text-primary ">
              <span className="post-icons role mr-16"></span>
              <Paragraph className="f-14 text-primary m-0">
                {jobpost.Title}
              </Paragraph>
            </li>
            <li className="f-14 text-primary">
              <span className="post-icons location mr-16"></span>
              <Paragraph className="f-14 text-primary m-0">
                {jobpost.Place}, {jobpost.City}, {jobpost.State}
              </Paragraph>
            </li>
          </ul>
          <span className="job-ldate f-12 text-secondary px-8 py-4">
            Last date |{" "}
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
      {/* <Card className="mb-8">
          <div className="p-16">
            <Title className="f-16 semibold text-primary mb-0">
                UI/UX Designer
            </Title>
            <Paragraph className="f-12 text-secondary">Amazon <span >29-01-2021</span></Paragraph>
            <div className="d-flex justify-content-between">
              <div className="f-12">
                <div className="my-8"><span className="icons Careers"></span> 0 - 1 years</div>
                <div className="my-8"><span className="icons Careers"></span> Not Disclosed</div>
                <div className="my-8"><span className="icons location"></span> Delhi NCR, New Zealand, Bengaluru, Hyderabad, zirakpur</div>
              </div>
              <div className="text-right mt-auto">
                <Button>Login to apply</Button>
              </div>
            </div>           
          </div>
        </Card> */}
      {/* <Card className="mb-8">
          <div className="p-16">
            <Title className="f-16 semibold text-primary mb-0">
              Job description
            </Title>
            <Paragraph className="text-secondary">test</Paragraph>
            <div className="f-14 mb-8">
            <Title className="f-14 semibold mb-0">Share profile if interested and mention:</Title>
            <div className="f-12 text-primary">Experience in IOS development:</div>
            <div className="f-12 text-primary">Experience in Android development:</div>
            <div className="f-12 text-primary">Experience as Architect:</div>
            <div className="f-12 text-primary">CTC</div>
            <div className="f-12 text-primary">ECTC</div>
            <div className="f-12 text-primary">Preferred location - <span className="f-14">Bangalore/Chennai/Pune:</span></div>
            </div>

            <Title className="f-14 semibold mb-0"> Key Skills</Title>
            <div className="tag-name px-0">
              <Tag closable onClose={log}>Example</Tag>
              <Tag closable onClose={log}>Test</Tag>
            </div>
          </div>
        </Card> */}
      {allJobPosts?.map((jobpost, indx) => renderJobPost(jobpost, indx))}
      {loading && <Loader className="loader-top-middle" />}
    </div>
  );
};
export default connectStateProps(withRouter(JobCard));
