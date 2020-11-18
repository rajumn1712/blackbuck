import React from 'react';
import { Avatar, Button, Card } from 'antd';
import user from '../../../styles/images/user.jpg';


const joingroup = <div className="join-grp-title">John Doe <span className="join-grp-txt">has Created a group name is</span> Mech Mantra</div>

class GroupCard extends React.Component{

    state={
        post:joingroup,
        users:[
            {image:user,id:1,initial:'',colorbc:''},
            {image:user,id:2,initial:'',colorbc:''},
            {image:user,id:3,initial:'',colorbc:''},
            {image:'',id:4,initial:'NM',colorbc:'#f56a00'},
            {image:'',id:5,initial:'NM',colorbc:'#f56a00'},
            {image:'',id:6,initial:'NM',colorbc:'#f56a00'},
            {image:'',id:7,initial:'NM',colorbc:'#f56a00'}
        ]
    }

    handleJoinGroup = ()=>{
        alert('Group Joined')
    }

    render(){

        const grouppost = {...this.state};

        return(
            <div className="post-card mb-16">
                    <Card title={grouppost.post} style={{ width: '100%', borderRadius: 10 }} bordered={false}>
                        <div className="p-16 text-center">
                            <div className="mb-16">
                                <Avatar.Group
                                    maxCount={4}
                                    size="large"
                                    maxStyle={{ color: 'var(--primary)', backgroundColor: 'var(--secondary)' }}
                                >
                                    {grouppost.users.map(user=>{
                                        return <Avatar src={user.image} key={user.id} style={{ backgroundColor: user.colorbc }}>
                                            {user.image ? null : user.initial}
                                        </Avatar>
                                    })}
                                </Avatar.Group>
                            </div>
                            <Button type="primary" onClick={this.handleJoinGroup}>Join Group</Button>
                        </div>
                    </Card>
                </div>
        )
    }
}

export default GroupCard;