import React, { PureComponent } from "react";
import { Panel } from "react-bootstrap";
import $ from "jquery";

class Status extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      statusData: {},
      error: null
    };

    this.updateData = this.updateData.bind(this);
    this.fetchError = this.fetchError.bind(this);
  }

  componentDidMount() {
    /*
		 * Expected structure:
		 * [
		 *		{ name: "SERVICE", status: "STATUS" },
		 *		...
		 * ]
		 *
		 * Service: name of service
		 * Status: [ "ok", "error", "warn", "unknown" ]
		 */
    $.ajax({
      type: "get",
      url: "scot/api/v2/status",
      success: this.updateData,
      error: this.fetchError
    });
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  updateData(response) {
    if (this._isMounted) {
      this.setState({
        statusData: response
      });
    }
  }

  fetchError(error) {
    if (this._isMounted) {
      this.setState({
        error: error
      });
    }
  }

  render() {
    let { className = "" } = this.props;
    let services = [];
    if (Array.isArray(this.state.statusData)) {
      for (let service of this.state.statusData) {
        let { name, status } = service;
        if (!status) {
          status = "unknown";
        }

        services.push(<Service key={name} name={name} status={status} />);
      }
    }

    let classes = ["Status", className];
    if (services.length > 4) {
      classes.push("cols-2");
    }

    return (
      <div className={classes.join(" ")}>
        {this.state.error && (
          <Panel bsStyle="danger" header="Error">
            {this.state.error}
          </Panel>
        )}
        {services}
      </div>
    );
  }
}

const Service = ({ name, status }) => (
  <div className={`service status-${status}`} title={`Status: ${status}`}>
    {name}
  </div>
);

export default Status;
