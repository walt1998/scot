var Dispatcher = require('./dispatcher.jsx')
var EventEmitter = require('../../../node_modules/events').EventEmitter
var Actions = ('./tab_actions.jsx')
var assign = require('object-assign')
var storekey;
var Activemq = require('../activemq/handleupdate.jsx')
function updateStatus(payload) {
	var data = new Object()
	var type = 'PUT'
	$('.subtable'+payload.action.item).find('.z-selected').each(function(key, value){
	$(value).find('.z-cell').each(function(x,y){
	    if($(y).attr('name') == "id"){
		if(payload.action.data == "promoted"){
		data = JSON.stringify({promote: 'new'})
		}
		else if(payload.action.data == 'closed'){
		var curr = Math.round(new Date().getTime() /1000)
		data = JSON.stringify({status: payload.action.data, closed: curr})
		}
		else if (payload.action.data == 'open'){	
		data = JSON.stringify({status:payload.action.data})
		}
		else{
		type = 'DELETE'
		}
		$.ajax({
			type: type,
			url: '/scot/api/v2/alert/'+$(y).text(),
			data: data
		}).success(function(response){
            Store.emitChange(payload.action.item)
		})
	}
	})
	})
    if(type == 'PUT'){
 	$.ajax({
	type: type,
 	url: '/scot/api/v2/alertgroup/' + payload.action.item,
	data: JSON.stringify({status:payload.action.data})
	}).success(function(response){
	})
    }
}

function deleteEvent(payload) {
    window.location.replace('#/'+payload.action.type);
}

function headerUpdate(payload) {
    Store.emitChange(payload.action.item);
}

function activeMQ(payload){
   
    Activemq.handle_update(Store, payload)

}

var Store = assign({}, EventEmitter.prototype, {
	emitChange: function(key){
	    this.emit(key)
	},
	addChangeListener: function(callback){
	    this.on(storekey, callback)
	},
	storeKey: function(key){
	storekey = key
	}
    })

    Dispatcher.register(function(payload){
	if(payload.message == 'alertstatusmessage') {
		updateStatus(payload)
	}
    else if(payload.message == 'headerUpdate') {
        headerUpdate(payload)
    }
    else if(payload.message == 'deleteEvent') {
        deleteEvent(payload);
    }	 
    else if (payload.message == 'activemq'){
	    activeMQ(payload)
	}
   	return true
     })

module.exports = Store
