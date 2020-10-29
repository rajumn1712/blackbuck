import React, { Component } from 'react';
import { connect } from 'react-redux';
class Home extends Component {
    componentDidMount() {
    }
    render() {
        return (
            <div>
                <h2>Welcome to blackbucks</h2>
            </div>
        )
    }
}
const mapStateToProps = ({ oidc }) => {
    return { oidc }
}
export default connect(mapStateToProps)(Home)