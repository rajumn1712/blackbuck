import React, { Component } from 'react';
import { Card, Select, List } from 'antd'
import '../index.css';
import '../App.css';
import moment from "moment";
import { connect } from 'react-redux';
const { Option } = Select;
const data = {
    "Public": {
        title: 'Public',
        description: "Anyone can see who's in the group and what they post.",
        img: 'left-menu public-icon',
    }
};
class GroupAbout extends Component {
    state = {
        aboutData: this.props.aboutData,

    }
    location = (location, type) => {
        return {
            title: location,
            img: type ? "left-menu history-icon" : "left-menu location-icon",
        }
    }
    render() {
        const { aboutData } = this.state;
        return (
            <div className="custom-card group-member ">
                <Card title="About This Contest" bordered={false}>
                    <div>
                        {aboutData.Description && <p>{aboutData.Description}</p>}
                        <div>
                            {(aboutData.Type == 'Private' || aboutData.Type == 'Public') && <List
                                itemLayout="horizontal"
                                dataSource={[data[aboutData.Type]]}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<span className={item.img} />}
                                            title={item.title}
                                            description={item.description}
                                        />
                                    </List.Item>
                                )}
                            />}
                            {aboutData.CreatedDate && <List
                                itemLayout="horizontal"
                                dataSource={[this.location(aboutData.CreatedDate, 'History')]}
                                renderItem={item => (
                                    <List.Item>
                                        <List.Item.Meta
                                            avatar={<span className={item.img} />}
                                            title={'History'}
                                            description={(`Contest created on ${moment(aboutData.CreatedDate).format('ll')}`)}
                                        />
                                    </List.Item>
                                )}
                            />
                            }
                        </div>

                    </div>
                </Card>

            </div>
        )
    }
}
const mapStateToProps = ({ oidc }) => {
    return { profile: oidc.profile }
}
export default connect(mapStateToProps)(GroupAbout);