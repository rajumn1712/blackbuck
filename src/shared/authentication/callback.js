import React from "react";
import { CallbackComponent } from "redux-oidc";
import { userManager } from "./auth";
class CallbackPage extends React.Component {
    render() {
        return (
            <CallbackComponent
                userManager={userManager}
                successCallback={() => { this.props.history.push("/") }}
                errorCallback={error => {
                    console.error(error);
                }}
            >
                <div>Redirecting...</div>
            </CallbackComponent>
        );
    }
}

export default CallbackPage;