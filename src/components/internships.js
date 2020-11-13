import React, { Component } from 'react';
import { Button, Layout, Card, Avatar, List, Dropdown, Tooltip, Popover } from 'antd'
import { Link } from 'react-router-dom';
import { userManager } from '../shared/authentication/auth';
import { store } from '../store'
import User1 from '../styles/images/avatar.png';
import User2 from '../styles/images/user.jpg';
import User3 from '../styles/images/user_image.jpg';
import User4 from '../styles/images/user-image.jpg';
import wipro from '../styles/images/Wiprologo.svg'
import infosys from '../styles/images/infosys.svg'

import { userLogout } from '../reducers/auth';
import '../index.css';
import '../App.css';
const data = [

    {
        company: wipro,
        title: 'Wipro',
        place: 'Hyderabad',
        months: '6'
    },
    {
        company: infosys,
        title: 'infosys',
        place: 'Hyderabad',
        months: '6'
    },
    {
        company: wipro,
        title: 'Wipro',
        place: 'Hyderabad',
        months: '6'
    },
    {
        company: wipro,
        title: 'Wipro',
        place: 'Hyderabad',
        months: '6'
    },
];
class Intership extends Component {

    render() {
        const { user } = store.getState().oidc;
        return (
            <div className="custom-card">
                <Card title="Internships" bordered={false} extra={<Link to=""><span className="icons add" /></Link>}  >
                    <List
                        grid={{
                            gutter: 8,
                            xs: 1,
                            sm: 2,
                            md: 2,
                            lg: 2,
                            xl: 2,
                            xxl: 2,
                        }}
                        itemLayout="horizontal"
                        dataSource={data}
                        renderItem={item => (
                            <List.Item>
                                <div className="intern-cards">
                                    <span className="left-menu intenship card-options-left" />
                                    <span className="icons more card-options-right" />
                                    <div className="intern-cardbody">
                                        <img src={item.company} />
                                        <h4 className="title">{item.title}</h4>
                                        <p className="description"><span className="afterline mr-16">{item.place}</span><span className="">{item.months} Months</span></p>
                                    </div>
                                    <div className="intern-cardfooter">
                                        <p className="mb-0"><span className="icons pdf mr-8" />Internship Cetificate.pdf</p>
                                    </div>
                                </div>
                            </List.Item>
                        )}
                    />
                </Card>
            </div>

        )
    }
}
export default Intership;