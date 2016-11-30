var React = require('react');
var Panel = require('react-bootstrap/lib/Panel.js');
var Badge = require('react-bootstrap/lib/Badge.js');

var Status = React.createClass({
    getInitialState: function() {
        return {
            StatusData: null
        }
    },
    componentDidMount: function() {
        $.ajax({
            type: 'get',
            url: '/scot/api/v2/status',
        }).success(function(response) {
            this.setState({StatusData:response});
        }.bind(this))
    },
    render: function() {
        var StatusRows = [];
        if (this.state.StatusData != null) {
            for (var key in this.state.StatusData) {
                StatusRows.push(
                    <Panel header={key} >
                        <div style={{display:'flex', flexFlow:'column'}}>
                            <div style={{fontWeight:'bold'}}>{this.state.StatusData[key]}</div>
                        </div>
                    </Panel>
                )
            }
        } else {
            StatusRows.push(
                <Panel header={'SCOT 3.5 Status'}>
                    <br/>
                    <div style={{fontWeight:'bold'}}>Coming Soon</div>
                    <br/>
                </Panel>
            )
        }
        return (
            <div id='stats' className="stats">
                <div style={{textAlign:'center'}}>
                    <h2>Status</h2>
                </div>
                <div style={{display:'flex'}}>
                    {StatusRows}
                </div>
            </div>
        );
    }
});

module.exports = Status;
