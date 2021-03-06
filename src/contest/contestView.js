import React, { Component } from "react";
import { profileSuccess } from "../reducers/auth";
import { connect } from 'react-redux'
class ContestView extends Component {
    render() {
        return <>Hello</>
    }
}

const mapStateToProps = ({ oidc }) => {
    return { user: oidc.user, profile: oidc.profile };
};
const mapDispatchToProps = (dispatch) => {
    return {
        upadateProfile: (info) => {
            dispatch(profileSuccess(info));
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(ContestView);
