import { message } from "antd";
import React from "react";
import { connect } from "react-redux";
import { CallbackComponent } from "redux-oidc";
import { profileSuccess } from "../../reducers/auth";
import { fetchProfile } from "../api/apiServer";
import { userManager } from "./auth";
class CallbackPage extends React.Component {
    handleSuccess = async () => {
        const profileResponse = await fetchProfile("Prasanna@gmail.com");
        if (profileResponse.ok) {
            this.props.updateProfile(profileResponse.data[0])
            this.props.history.push("/")
        } else {
            message.error("Something went wrong:)")
        }
    }
    render() {
        return (
            <CallbackComponent
                userManager={userManager}
                successCallback={() => this.handleSuccess()}
                errorCallback={error => {
                    console.error(error);
                }}
            >
                <div>Redirecting...</div>
            </CallbackComponent>
        );
    }
}
const mapStateToProps = ({ oidc }) => {
    return { oidc }
}
const mapDispatchToProps = dispatch => {
    return { updateProfile: (info) => { dispatch(profileSuccess(info)) } }
}
export default connect(mapStateToProps, mapDispatchToProps)(CallbackPage);