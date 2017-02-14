queryView_parameter = {};

function queryView_init() {
    $('#content').html('');
    $('#result').html('');
    var str = '<table border="1" width="100%">';
    str += '<tr><td colspan="2"><a href="#" id="list">list</a>&nbsp;<a href="#" id="get">get</a>&nbsp;<a href="#" id="execute">execute</a></td></tr>';
    str += '<tr><td>applicationFlag:</td><td><input type="text" id="applicationFlag" style="width:95%"/></td></tr>';
    str += '<tr><td>flag:</td><td><input type="text" id="flag" style="width:95%"/></td></tr>';
    str += '<tr><td colspan="2">date</td></tr>';
    str += '<tr><td colspan="2"><textarea id="date" style="width:95%;height:300px"></textarea></td></tr>';
    str += '<tr><td colspan="2">sample</td></tr>';
    str += '<tr><td colspan="2">{<br>';
    str += '"dateRangeType": "none",<br>';
    str += '"dateEffectType": "completed",<br>';
    str += '"start": "",<br>';
    str += '"completed": "",<br>';
    str += '"year": "",<br>';
    str += '"month": "",<br>';
    str += '"date": "",<br>';
    str += '"season": 0,<br>';
    str += '"week": 0,<br>';
    str += '"adjust": 0<br>';
    str += '}';
    str += '</td></tr>';
    str += '<tr><td colspan="2">filter</td></tr>';
    str += '<tr><td colspan="2"><textarea id="filter" style="width:95%;height:300px"></textarea></td></tr>';
    str += '<tr><td colspan="2">sample</td></tr>';
    str += '<tr><td colspan="2">{<br>';
    str += '"path": "",<br>';
    str += '"value": "",<br>';
    str += '"formatType": "",<br>';
    str += '"completed": "",<br>';
    str += '"logic": "",<br>';
    str += '"comparison": ""<br>';
    str += '}';
    str += '</td></tr>';
    str += '<tr><td colspan="2">where application</td></tr>';
    str += '<tr><td colspan="2"><textarea id="application" style="width:95%;height:100px"></textarea></td></tr>';
    str += '<tr><td colspan="2">where process</td></tr>';
    str += '<tr><td colspan="2"><textarea id="process" style="width:95%;height:100px"></textarea></td></tr>';
    str += '<tr><td colspan="2">where company</td></tr>';
    str += '<tr><td colspan="2"><textarea id="company" style="width:95%;height:100px"></textarea></td></tr>';
    str += '<tr><td colspan="2">where department</td></tr>';
    str += '<tr><td colspan="2"><textarea id="department" style="width:95%;height:100px"></textarea></td></tr>';
    str += '<tr><td colspan="2">where person</td></tr>';
    str += '<tr><td colspan="2"><textarea id="person" style="width:95%;height:100px"></textarea></td></tr>';
    str += '<tr><td colspan="2">where identity</td></tr>';
    str += '<tr><td colspan="2"><textarea id="identity" style="width:95%;height:100px"></textarea></td></tr>';
    str += '<tr><td colspan="2">column</td></tr>';
    str += '<tr><td colspan="2"><textarea id="column" style="width:95%;height:100px"></textarea></td></tr>';
    str += '</table>';
    $('#content').html(str);
    $('#list').click(function() {
	queryView_list($('#applicationFlag').val());
    });
    $('#get').click(function() {
	queryView_get($('#flag').val(), $('#applicationFlag').val());
    });
    $('#execute').click(function() {
	queryView_execute($('#flag').val(), $('#applicationFlag').val());
    });
}

function queryView_list(applicationFlag) {
    $('#result').html('');
    star
    $.ajax({
	type : 'get',
	dataType : 'json',
	url : '../jaxrs/queryview/list/application/flag/' + applicationFlag,
	xhrFields : {
	    'withCredentials' : true
	},
	crossDomain : true
    }).always(function(json) {
	$('#result').html(JSON.stringify(json, null, 4));
    });
}

function queryView_get(flag, applicationFlag) {
    $('#result').html('');
    $.ajax({
	type : 'get',
	dataType : 'json',
	url : '../jaxrs/queryview/flag/' + flag + '/application/flag/' + applicationFlag,
	xhrFields : {
	    'withCredentials' : true
	},
	crossDomain : true
    }).always(function(json) {
	$('#result').html(JSON.stringify(json, null, 4));
    });
}

function queryView_execute(flag, applicationFlag) {
    $('#result').html('');
    var data = {};
    if ($('#date').val().length > 0) {
	data.date = JSON.parse($('#date').val());
    }
    if ($('#filter').val().length > 0) {
	data.filter = JSON.parse($('#filter').val());
    }
    if ($('#application').val().length > 0) {
	data.application = JSON.parse($('#application').val());
    }
    if ($('#process').val().length > 0) {
	data.process = JSON.parse($('#process').val());
    }
    if ($('#company').val().length > 0) {
	data.company = JSON.parse($('#company').val());
    }
    if ($('#department').val().length > 0) {
	data.department = JSON.parse($('#department').val());
    }
    if ($('#person').val().length > 0) {
	data.person = JSON.parse($('#person').val());
    }
    if ($('#identity').val().length > 0) {
	data.identity = JSON.parse($('#identity').val());
    }
    if ($('#column').val().length > 0) {
	data.column = JSON.parse($('#column').val());
    }
    $.ajax({
	type : 'put',
	dataType : 'json',
	url : '../jaxrs/queryview/flag/' + flag + '/application/flag/' + applicationFlag + '/execute',
	contentType : 'application/json; charset=utf-8',
	data : JSON.stringify(request),
	xhrFields : {
	    'withCredentials' : true
	},
	crossDomain : true
    }).always(function(json) {
	$('#result').html(JSON.stringify(json, null, 4));
    });
}