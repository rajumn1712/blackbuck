import { Card, Col, Row,Tabs  } from "antd";
import React, { Component } from "react";
import Ads from "../components/ads";
import Courses from "../components/ProfileComponents/courses";
import GroupsPage from "../shared/components/GroupsPage";
import Invite from '../shared/components/Invite';
import Groups from '../shared/components/Groups';
const { TabPane } = Tabs;
class Aboutus extends Component {
  state={
    tabkey:"1",
  }
  componentDidMount() { }
  isDataRefreshed = (refresh) => {
    if (refresh) this.courses.getGroups();
  };

  render() {
    const {tabkey}=this.state;
    return (
      <div className="main">
        <Row gutter={16}>
          <Col xs={24} sm={24} md={16} lg={17} xl={17}>
            {/* <div className="custom-card">
              <Card title="Groups" bordered={false}>
                <GroupsPage onRef={(courses) => (this.courses = courses)} />
              </Card>
            </div> */}
            <div >

            <Tabs defaultActiveKey="1"
              className="group-tabs sub-tab profile-tabs"
              onChange={(e) => this.setState({ ...this.state, tabkey: e })}>
              <TabPane tab="Groups" key="1">
                <Row gutter={16}>
                  <Col xs={24}>
                  <GroupsPage onRef={(courses) => (this.courses = courses)}/>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Invite Groups" key="3">
                <Row gutter={16}>
                  <Col xs={24}>
                  <Invite displayas={"Card"}/>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Suggested Groups" key="2">
                <Row gutter={16}>
                  <Col xs={24}>
                  <Groups displayas={"Card"} />
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
            </div>
          </Col>
          <Col xs={24} sm={12} md={8} lg={7} xl={7}>
            <Courses
              isDataRefreshed={(refresh) => this.isDataRefreshed(refresh)}
            />
            <Ads />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Aboutus;
