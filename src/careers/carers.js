import React, { Component } from "react";
import { Button, Card, Avatar, List, Empty, Row, Col, Skeleton } from "antd";
import user from "../styles/images/user.jpg";
import Amazon from "../styles/images/amazon.svg";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
const { Meta } = Card;
const data = [
    {
        title: 'Amazon Web Service',
        jobs: '2 Jobs',
        logo: '../images/amazon.svg'
    },
    {
        title: 'IBM',
        jobs: '1 Job'
    },
    {
        title: 'Dr.Reddy\'s',
        jobs: '15 Jobs'
    },
    {
        title: 'TCS',
        jobs: '2 Jobs'
    },
    {
        title: 'Wipro',
        jobs: '2 Jobs'
    },
    
]
class Carers extends Component {
    render() {
        return (
            <div className="custom-card sub-text">
                <Card title="Careers" bordered={false} extra={<Link to="/commingsoon">View all</Link>} actions={[
                    <Button type="primary">View more Careers</Button>
                ]} >
                    <List
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={Amazon || user} />}
                                    title={<a>{item.title}</a>}
                                    description={item.jobs}
                                />
                                <Link
                        className="text-center f-12 list-link"
                        onClick={() => this.joinGroup(item)}
                      >
                        View
                      </Link>
                            </List.Item>
                        )}
                    />
                </Card>
            </div>
        )
    }
}
const mapStateToProps = ({ oidc }) => {
    return { profile: oidc.profile }
}
export default connect(mapStateToProps)(Carers);