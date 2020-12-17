import React, { Component } from "react";
import { Card, Avatar, Button, Empty } from "antd";
import { connect } from "react-redux";
import {
  acceptDeclinePrivateInvites,
  getAdminInvites,
} from "../shared/api/apiServer";
import notify from "../shared/components/notification";

class PrivateInvite extends Component {
  state = {
    invitations: [],
  };
  componentDidMount() {
    this.getadminInvitations();
  }
  getadminInvitations = () => {
    getAdminInvites(this.props.profile?.Id, 1, 0).then((res) => {
      this.setState({ invitations: res.data?.length > 0 ? res.data : [] });
    });
  };
  acceptInvite = (type, obj) => {
    acceptDeclinePrivateInvites(obj.GroupId, obj.MemberId, type).then((res) => {
      this.getadminInvitations();
      notify({
        placement: "bottomLeft",
        message: "Invite",
        description: `Request ${type} successfully.`,
      });
    });
  };
  render() {
    let { invitations } = this.state;
    return (
      <div className="invite-card">
        <Card title="Invite" bordered={true}>
          {invitations.length > 0 && (
            <div>
              <Avatar.Group>
                <Avatar src={this.props?.profile?.ProfilePic}></Avatar>
                <Avatar src={invitations[0]?.Image} />
              </Avatar.Group>
              <p>
                <span>{invitations[0]?.MemberName}</span> requested to accept to
                join in your{" "}
                <span className="text-color invite-grp-name">
                  {invitations[0]?.GroupName}
                </span>{" "}
                group
              </p>
              <div className="invite-btn">
                <Button
                  className="mr-16"
                  type="primary"
                  onClick={() => this.acceptInvite("accept", invitations[0])}
                >
                  Accept
                </Button>
                <Button
                  type="danger"
                  onClick={() => this.acceptInvite("decline", invitations[0])}
                >
                  Decline
                </Button>
              </div>
            </div>
          )}
          {invitations.length == 0 && (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </Card>
      </div>
    );
  }
}

const mapStateToProps = ({ oidc }) => {
  return { user: oidc.user, profile: oidc.profile };
};
export default connect(mapStateToProps)(PrivateInvite);
