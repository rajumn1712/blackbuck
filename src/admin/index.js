import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import Groups from './groups';
import AdminCourses from './courses';
import Members from './members';

class Admin extends Component {

    render() {
        return <div>
            <div>
                <Link to="/admin/courses">Courses</Link>
                <Link to="/admin/members">Members</Link>
                <Link to="/admin/groups">Groups</Link>
            </div>
            <Switch>
                <Route path="/admin/courses" component={AdminCourses} />
                <Route path="/admin/members" component={Members} />
                <Route path="/admin/groups" component={Groups} />
            </Switch>
        </div>
    }
}
export default Admin;