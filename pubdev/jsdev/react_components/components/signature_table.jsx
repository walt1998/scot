import React from 'react';
import { render } from 'react-dom';
import brace from 'brace';
import AceEditor from 'react-ace';
import Button from 'react-bootstrap/lib/Button.js';
import DropdownButton from 'react-bootstrap/lib/DropdownButton.js';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger.js';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup.js';
import MenuItem from 'react-bootstrap/lib/MenuItem.js';
import Popover from 'react-bootstrap/lib/Popover.js';
import Store from '../activemq/store.jsx';

import 'brace/mode/javascript';
import 'brace/mode/java';
import 'brace/mode/python';
import 'brace/mode/xml';
import 'brace/mode/ruby';
import 'brace/mode/sass';
import 'brace/mode/markdown';
import 'brace/mode/mysql';
import 'brace/mode/json';
import 'brace/mode/html';
import 'brace/mode/c_cpp';
import 'brace/mode/csharp';
import 'brace/mode/perl';
import 'brace/mode/powershell';
import 'brace/mode/yaml';
import 'brace/theme/github';
import 'brace/keybinding/vim';
import 'brace/keybinding/emacs';

var SignatureTable = React.createClass({
    getInitialState: function() {
        var key = new Date();
        key = key.getTime();
        var value = '';
        if (!jQuery.isEmptyObject(this.props.headerData.body)) {
            if (this.props.headerData.body[this.props.headerData.prod_sigbody_id] != undefined) {
                value = this.props.headerData.body[this.props.headerData.prod_sigbody_id].body;
            }
        } 
        return {
            readOnly: true,
            value: value,
            signatureData: this.props.headerData,
            loaded: true,
            viewVersionid: this.props.headerData.prod_sigbody_id,
            lastViewVersionid: null,
            key: key,
            cursorEnabledDisabled: 'cursorDisabled',
            keyboardHandlers: ['none', 'vim', 'emacs'],
            currentKeyboardHandler: 'none',
            languageModes: ['csharp', 'c_cpp','html', 'javascript', 'java','json', 'markdown', 'mysql','perl', 'powershell', 'python', 'ruby', 'sass','xml','yaml'],
            currentLanguageMode: 'java',
            ajaxType: null,    
        }
    },
    onChange: function(value) {
        this.setState({value:value});
    },
    submitSigBody: function(e) {
        var url = 'scot/api/v2/sigbody/';
        if (this.state.ajaxType == 'put') {
            url = 'scot/api/v2/sigbody/' + this.state.viewVersionid;
        }
        $.ajax({
            type: this.state.ajaxType,
            url: url,
            data: JSON.stringify({signature_id:this.props.id, body:this.state.value}),
            contentType: 'application/json; charset=UTF-8',
            success: function(data) {
                console.log('successfully changed signature data');
                this.setState({readOnly:true, cursorEnabledDisabled: 'cursorDisabled', ajaxType:null, viewVersionid:data.id});
            }.bind(this),
            error: function() {
            }.bind(this)
        })
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState({signatureData: nextProps.headerData});
    },
    editSigBody: function() {
        this.setState({readOnly: false, lastViewVersionid: this.state.viewVersionid, cursorEnabledDisabled: 'cursorEnabled', ajaxType:'put'});    
    },
    createNewSigBody: function() {
        this.setState({readOnly: false, viewVersionid: null, lastViewVersionid:this.state.viewVersionid , value:'', cursorEnabledDisabled: 'cursorEnabled', ajaxType:'post'});
    },
    createNewSigBodyFromSig: function() {
        this.setState({readOnly:false, lastViewVersionid: this.state.viewVersionid, cursorEnabledDisabled:'cursorEnabled', ajaxType:'post', viewVersionid: null});
    },
    Cancel: function() {
        var value = '';
        if (!jQuery.isEmptyObject(this.state.signatureData.body)) {
            if (this.state.signatureData.body[this.state.signatureData.prod_sigbody_id] != undefined) {
                value = this.state.signatureData.body[this.state.lastViewVersionid].body;
            }
        }
        this.setState({readOnly:true, value:value , viewVersionid: this.state.lastViewVersionid, cursorEnabledDisabled: 'cursorDisabled', ajaxType:null});
    },
    viewSigBody: function(e) {
        if (this.state.readOnly == true) {  //only allow button click if you can't edit the signature
            this.setState({value:this.state.signatureData.body[e.target.id].body, viewVersionid:e.target.id});
        }
    },
    keyboardHandlerUpdate: function(e) {
        this.setState({currentKeyboardHandler: e.target.text});
    },
    languageModeUpdate: function(e) {
        this.setState({currentLanguageMode: e.target.text});
    },
    render: function() {
        var versionsArray = [];
        var keyboardHandlersArray = [];
        var languageModesArray = [];
        var not_saved_signature_entry_id = 'not_saved_signature_entry_' + this.state.key;
        var currentKeyboardHandlerApplied = this.state.currentKeyboardHandler;
        if (!jQuery.isEmptyObject(this.state.signatureData)) {
            for (var key in this.state.signatureData.body) {
                var versionid = this.state.signatureData.body[key].id
                var disabled;
                if (this.state.readOnly == true) { disabled = false;} else { disabled = true;};
                versionsArray.push(<MenuItem id={versionid} key={versionid} onClick={this.viewSigBody} eventKey={versionid} bsSize={'xsmall'} disabled={disabled}>{versionid}</MenuItem>)
            }
        }
        
        if (this.state.keyboardHandlers != undefined) {
            for (var i=0; i < this.state.keyboardHandlers.length; i++) {
                keyboardHandlersArray.push(<MenuItem id={i} key={i} onClick={this.keyboardHandlerUpdate} eventKey={i} bsSize={'xsmall'}>{this.state.keyboardHandlers[i]}</MenuItem>);
            }
        }
        
        if (this.state.currentKeyboardHandler == 'none' ) {
            currentKeyboardHandlerApplied = null;
        }
        
        if (this.state.languageModes != undefined) {
            for (var i=0; i < this.state.languageModes.length; i++) {
                languageModesArray.push(<MenuItem id={i} key={i} onClick={this.languageModeUpdate} eventKey={i} bsSize={'xsmall'}>{this.state.languageModes[i]}</MenuItem>);
            }
        }
        return (
            <div id={'signatureDetail'} className='signatureDetail'>
                {this.state.loaded ?
                    <div style={{display:'flex'}}>
                        <SignatureMetaData signatureData={this.state.signatureData} type={this.props.type} id={this.props.id}/>
                        <div id={not_saved_signature_entry_id} className={'not_saved_signature_entry'}>
                            <div className={'row-fluid signature-entry-outer'} style={{marginLeft: 'auto', marginRight: 'auto'}}>          
                                <div className={'row-fluid signature-entry-header'}>
                                    <div className="signature-entry-header-inner">[<a style={{color:'black'}}>Not_Saved_0</a>]by {whoami}>
                                        <span className='pull-right' style={{display:'inline-flex',paddingRight:'3px'}}>
                                            Language Handler:
                                            <DropdownButton bsSize={'xsmall'} title={this.state.currentLanguageMode} id='bg-nested-dropdown' style={{marginRight:'10px'}}>
                                                {languageModesArray}
                                            </DropdownButton>
                                            
                                            Keyboard Handler: 
                                            <DropdownButton bsSize={'xsmall'} title={this.state.currentKeyboardHandler} id='bg-nested-dropdown' style={{marginRight:'10px'}}>
                                                {keyboardHandlersArray}
                                            </DropdownButton>
                                            
                                            Signature Version:  
                                            <DropdownButton bsSize={'xsmall'} title={this.state.viewVersionid} id='bg-nested-dropdown' style={{marginRight:'10px'}}>
                                                {versionsArray}
                                            </DropdownButton> 
                                        {this.state.readOnly ? 
                                            <span>
                                                <Button bsSize={'xsmall'} onClick={this.createNewSigBody}>Create new version</Button>
                                                <Button bsSize={'xsmall'} onClick={this.createNewSigBodyFromSig}>Create new version using this base</Button>
                                                <Button bsSize={'xsmall'} onClick={this.editSigBody}>Update displayed version</Button>
                                            </span>
                                        :
                                            <span>
                                                <Button bsSize={'xsmall'} onClick={this.submitSigBody}>Submit</Button>
                                                <Button bsSize={'xsmall'} onClick={this.Cancel}>Cancel</Button>
                                            </span>
                                        }
                                        </span>
                                    </div>
                                </div> 
                                <AceEditor
                                    mode            = {this.state.currentLanguageMode}
                                    theme           = "github"
                                    onChange        = {this.onChange}
                                    name            = "signatureEditor"
                                    editorProps     = {{$blockScrolling: true}}
                                    keyboardHandler = {currentKeyboardHandlerApplied}
                                    value           = {this.state.value}
                                    height          = '400px'
                                    width           = '100%'
                                    readOnly        = {this.state.readOnly}
                                    className       = {this.state.cursorEnabledDisabled}
                                    showPrintMargin = {false}
                                />
                            </div>
                        </div>
                    </div> 
                    : 
                    <div>
                        Loading Signature Data...
                    </div>
                }
            </div>
        )
    }
});

var SignatureMetaData = React.createClass({
    getInitialState: function() {
        var inputArrayType = ['description','type', 'status', 'prod_sigbody_id','qual_sigbody_id', 'signature_group']
        var inputArrayTypeDisplay = ['Description','Type', 'Status', 'Production Signature Body Version','Quality Signature Body Version', 'Signature Group'] 
        return {
            descriptionValue: this.props.signatureData.description,
            inputArrayType: inputArrayType,
            inputArrayTypeDisplay: inputArrayTypeDisplay,
            description: this.props.signatureData.description,
            type: this.props.signatureData.type,
            status: this.props.signatureData.status,
            prod_sigbody_id: this.props.signatureData.prod_sigbody_id,
            qual_sigbody_id: this.props.signatureData.qual_sigbody_id,
            signature_group: this.props.signatureData.signature_group,
            statusOptions:['enabled','disabled'] 
        }
    },
    InputChange: function(event) {
        var key = event.target.id;
        var newValue = {}
        newValue[key] = event.target.value;
        this.setState(newValue);
    },
    submitMetaData: function(event) {
        var k  = event.target.id;
        var v = event.target.value;
        var json = {};
        json[k] = v;
        $.ajax({
            type: 'put',
            url: 'scot/api/v2/signature/' + this.props.id,
            data: JSON.stringify(json),
            contentType: 'application/json; charset=UTF-8',
            success: function(data) {
                console.log('successfully changed incident data');
            }.bind(this),
            error: function() {
                this.props.errorToggle('Failed to updated signature metadata')
            }.bind(this)
        }) 
    },
    render: function() {
        var inputArray = [];
        
        for (var i=0; i < this.state.inputArrayType.length; i++) {
            var value = this.state[this.state.inputArrayType[i]];
            if (this.state.inputArrayType[i] == 'status') {
                inputArray.push(
                    <div>
                        <span className='signatureTableWidth'>
                            {this.state.inputArrayTypeDisplay[i]}:
                        </span>
                        <span className='signatureTableWidth'>
                            <OverlayTrigger trigger='focus' placement='bottom' overlay={<Popover id='statuspicker'><ButtonGroup vertical><Button id={this.state.inputArrayType[i]} value={'enabled'} onClick={this.InputChange}>enabled</Button><Button id={this.state.inputArrayType[i]} value={'disabled'} onClick={this.InputChange}>disabled</Button></ButtonGroup></Popover>}>
                                <input id={this.state.inputArrayType[i]} onChange={this.InputChange} value={value}/>
                            </OverlayTrigger>
                            <Button type='submit' bsSize='xsmall' bsStyle='success' onClick={this.submitMetaData} id={this.state.inputArrayType[i]} value={value}>Apply</Button>
                        </span>
                    </div>
                )
            } else if (this.state.inputArrayType[i] == 'prod_sigbody_id' || this.state.inputArrayType[i] == 'qual_sigbody_id') {
              var sigBodyVersionArray = [];
              if (!jQuery.isEmptyObject(this.props.signatureData)) {
                    for (var key in this.props.signatureData.body) {
                        var versionid = this.props.signatureData.body[key].id
                        sigBodyVersionArray.push(<Button id={this.state.inputArrayType[i]} key={versionid} onClick={this.InputChange} eventKey={versionid} bsSize={'xsmall'} value={versionid}>{versionid}</Button>)        
                    }
                } 
                inputArray.push(
                    <div> 
                        <span className='signatureTableWidth'>
                            {this.state.inputArrayTypeDisplay[i]}:
                        </span>
                        <span className='signatureTableWidth'>
                            <OverlayTrigger trigger='focus' placement='bottom' overlay={<Popover id='sigversionpicker'><ButtonGroup vertical>{sigBodyVersionArray}</ButtonGroup></Popover>}>
                                <input id={this.state.inputArrayType[i]} onChange={this.InputChange} value={value}/>
                            </OverlayTrigger>  
                            <Button type='submit' bsSize='xsmall' bsStyle='success' onClick={this.submitMetaData} id={this.state.inputArrayType[i]} value={value}>Apply</Button>
                        </span>
                    </div> 
                )
            } else {
                inputArray.push(
                    <div> 
                        <span className='signatureTableWidth'>
                            {this.state.inputArrayTypeDisplay[i]}:
                        </span>
                        <span className='signatureTableWidth'>
                            <input id={this.state.inputArrayType[i]} onChange={this.InputChange} value={value}/>
                            <Button type='submit' bsSize='xsmall' bsStyle='success' onClick={this.submitMetaData} id={this.state.inputArrayType[i]} value={value}>Apply</Button>
                        </span>
                    </div> 
                )
            }
        }
        return (
            <div id='signatureTable' className='signatureTable'>
                <div>
                   {inputArray} 
                </div>
            </div>
        )
    },
});



module.exports = SignatureTable;
