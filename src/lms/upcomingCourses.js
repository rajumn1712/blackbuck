import React, { useEffect, useState } from 'react';
import { getUpcomingCourses } from '../shared/api/apiServer';
import defaultguser from "../styles/images/default-cover.png";
import { Avatar, Card, List } from 'antd';
import { Link } from 'react-router-dom';

const UpcomingCourses = ()=>{

    let [courses,setCourses] = useState([])
    const [loading,setLoading] = useState(false)

    useEffect(()=>{
        upcomingcourses()
    },[])

    const upcomingcourses = async ()=>{
        setLoading(true)
        const response = await getUpcomingCourses();
        if(response.ok){
            courses = response.data;
            setCourses([...courses]);
            setLoading(false)
        }
    }

    return (
        <div className="custom-card sub-text card-scroll">
        {/* {this.state.loading && <Loader className="loader-top-middle" />} */}
        <Card
          title="Upcoming Courses"
          bordered={false}
          extra={
              <Link to="/lms">View all</Link>
          }
        >
          <List
          loading={loading}
            itemLayout="horizontal"
            dataSource={courses}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={(Array.isArray(item.image) ? item.image[0] : item.image) || defaultguser} />}
                  title={
                    <div className="d-flex align-items-center mr-16">
                      <span className="overflow-text">{item.name}</span>
                    </div>
                  }
                  description={
                    <div className="f-12 text-secondary">
                      {item.members && (
                        <span>
                          {item.members}
                        </span>
                      )}{" "}
                      Members 
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      </div>
    )
}

export default UpcomingCourses;