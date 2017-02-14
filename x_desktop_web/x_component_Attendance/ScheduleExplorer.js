MWF.xDesktop.requireApp("Attendance", "Explorer", null, false);
MWF.xDesktop.requireApp("Organization", "Selector.package", null, false);
MWF.xApplication.Attendance.ScheduleExplorer = new Class({
	Extends: MWF.xApplication.Attendance.Explorer,
	Implements: [Options, Events],

    initialize: function(node, app, actions, options){
        this.setOptions(options);
        this.app = app;
        this.path = "/x_component_Attendance/$ScheduleExplorer/";
        this.cssPath = "/x_component_Attendance/$ScheduleExplorer/"+this.options.style+"/css.wcss";
        this._loadCss();

        this.actions = actions;
        this.node = $(node);

        this.initData();
        if (!this.personActions) this.personActions = new MWF.xAction.org.express.RestActions();
    },
    loadView : function(){
        this.view = new MWF.xApplication.Attendance.ScheduleExplorer.View(this.elementContentNode, this.app,this, this.viewData, this.options.searchKey );
        this.view.load();
        this.setContentSize();
    },
    createDocument: function(){
        if(this.view)this.view._createDocument();
    }
});

MWF.xApplication.Attendance.ScheduleExplorer.View = new Class({
    Extends: MWF.xApplication.Attendance.Explorer.View,
    _createItem: function(data){
        return new MWF.xApplication.Attendance.ScheduleExplorer.Document(this.table, data, this.explorer, this);
    },

    _getCurrentPageData: function(callback, count){
        this.actions.listSchedule(function(json){
            if (callback) callback(json);
        });
    },
    _removeDocument: function(documentData, all){
        this.actions.deleteSchedule(documentData.id, function(json){
            this.explorer.view.reload();
            this.app.notice(this.app.lp.deleteDocumentOK, "success");
        }.bind(this));
    },
    _createDocument: function(){
        var schedule = new MWF.xApplication.Attendance.ScheduleExplorer.Schedule(this.explorer);
        schedule.create();
    },
    _openDocument: function( documentData ){
        var schedule = new MWF.xApplication.Attendance.ScheduleExplorer.Schedule(this.explorer, documentData );
        schedule.edit();
    }

})

MWF.xApplication.Attendance.ScheduleExplorer.Document = new Class({
    Extends: MWF.xApplication.Attendance.Explorer.Document

})


MWF.xApplication.Attendance.ScheduleExplorer.Schedule = new Class({
    Extends: MWF.widget.Common,
    options: {
        "width": "600",
        "height": "450"
    },
    initialize: function( explorer, data ){
        this.explorer = explorer;
        this.app = explorer.app;
        this.data = data || {};
        this.css = this.explorer.css;

        this.load();
    },
    load: function(){
        this.data.workTime = this.data.onDutyTime;
        this.data.offTime = this.data.offDutyTime;
        this.data.department = this.data.organizationName;
        this.data.lateTime = this.data.lateStartTime;
        this.data.leaveEarlyTime =this.data.leaveEarlyStartTime;
        this.data.absenteeismTime =this.data.absenceStartTime;
    },

    open: function(e){
        this.isNew = false;
        this.isEdited = false;
    },
    create: function(){
        this.isNew = true;
        this._open();
    },
    edit: function(){
        this.isEdited = true;
        this._open();
    },
    _open : function(){
        this.createMarkNode = new Element("div", {
            "styles": this.css.createMarkNode,
            "events": {
                "mouseover": function(e){e.stopPropagation();},
                "mouseout": function(e){e.stopPropagation();}
            }
        }).inject(this.app.content, "after");

        this.createAreaNode = new Element("div", {
            "styles": this.css.createAreaNode
        });

        this.createNode();

        this.createAreaNode.inject(this.createMarkNode, "after");
        this.createAreaNode.fade("in");

        this.department.focus();

        this.setCreateNodeSize();
        this.setCreateNodeSizeFun = this.setCreateNodeSize.bind(this);
        this.addEvent("resize", this.setCreateNodeSizeFun);
    },
    createNode: function(){
        var _self = this;
        this.createNode = new Element("div", {
            "styles": this.css.createNode
        }).inject(this.createAreaNode);


        this.createIconNode = new Element("div", {
            "styles": this.isNew ? this.css.createNewNode : this.css.createIconNode
        }).inject(this.createNode);


        this.createFormNode = new Element("div", {
            "styles": this.css.createFormNode
        }).inject(this.createNode);

        var lp = this.app.lp.schedule;

        var inputStyle = "width: 99%; border:1px solid #999; background-color:#FFF; border-radius: 3px; box-shadow: 0px 0px 6px #CCC;height: 26px;";
        var inputTimeStyle = "width: 99%; border:1px solid #999; background-color:#FFF; border-radius: 3px; box-shadow: 0px 0px 6px #CCC;height: 26px;"+
            "background : url(/x_component_Attendance/$ScheduleExplorer/default/icon/calendar.png) 98% center no-repeat";
        var inputPersonStyle = "width: 99%; border:1px solid #999; background-color:#FFF; border-radius: 3px; box-shadow: 0px 0px 6px #CCC;height: 26px;"+
            "background : url(/x_component_Attendance/$PermissionExplorer/default/icon/selectperson.png) 98% center no-repeat";

        var html = "<table width='100%' height='270' border='0' cellPadding='0' cellSpacing='0'>" +
            "<tr>"+
            "<td colspan='2' style='height: 50px; line-height: 50px; text-align: center; min-width: 80px; font-size:18px;font-weight: bold;'>" + lp.setSchedule + "</td>" +
            "</tr>" +
            "<tr>"+
            "<td style='height: 60px; line-height: 60px; text-align: left; min-width: 80px; width:25%' rowspan='2'>" + lp.department + ":</td>" +
            "<td style='; text-align: right;'>"+
            (!this.isNew && !this.isEdited  ? "" :
                ("<input type='text' id='department' " + "style='" + inputPersonStyle +"'" + " value='" + ( this.data && this.data.department ? this.data.department : "") + "'/>")) +
            "</td>"+
            "</tr>" +
            "<tr>"+
            "<td style='; text-align: left;font-size:14px;padding-bottom: 5px'>"+
            (!this.isNew && !this.isEdited  ? "" :("<input type='button' id='selCompany' " +"style='margin-right:5px'"+ " value='选择公司'/>")) +
            (!this.isNew && !this.isEdited  ? "" :("<input type='button' id='selDepartment' " + " value='选择部门'/>")) +
            //"注：不选择" + lp.department + "则为默认排班"+
            "</td>"+
            "</tr>" +
            "<tr>" +
            "<td style='height: 30px; line-height: 30px;  text-align: left'>"+lp.workTime+":</td>" +
            "<td style='; text-align: right;'>" +
            (!this.isNew && !this.isEdited  ? "" :
                ("<input type='text' id='workTime' " + "style='" + inputTimeStyle +"'" + " value='" + ( this.data && this.data.workTime ? this.data.workTime : "") + "'/>")) +
            "</td>" +
            "</tr>" +
            "<tr>" +
            "<td style='height: 30px; line-height: 30px;  text-align: left'>"+lp.offTime+":</td>" +
            "<td style='; text-align: right;'>" +
            (!this.isNew && !this.isEdited  ? "" :
                ("<input type='text' id='offTime' " + "style='" + inputTimeStyle +"'" + " value='" + ( this.data && this.data.offTime ? this.data.offTime : "") + "'/>")) +
            "</td>" +
            "</tr>" +
            "<tr>" +
            "<td style='height: 30px; line-height: 30px;  text-align: left'>"+lp.lateTime+":</td>" +
            "<td style='; text-align: right;'>" +
            (!this.isNew && !this.isEdited  ? "" :
                ("<input type='text' id='lateTime' " + "style='" + inputTimeStyle +"'" + " value='" + ( this.data && this.data.lateTime ? this.data.lateTime : "") + "'/>")) +
            "</td>" +
            "</tr>" +
            "<tr>" +
            "<td style='height: 30px; line-height: 30px;  text-align: left'>"+lp.leaveEarlyTime+":</td>" +
            "<td style='; text-align: right;'>" +
            (!this.isNew && !this.isEdited  ? "" :
                ("<input type='text' id='leaveEarlyTime' " + "style='" + inputTimeStyle +"'" + " value='" + ( this.data && this.data.leaveEarlyTime ? this.data.leaveEarlyTime : "") + "'/>")) +
            "</td>" +
            "</tr>" +
            "<tr>" +
            "<td style='height: 30px; line-height: 30px;  text-align: left'>"+lp.absenteeismTime+":</td>" +
            "<td style='; text-align: right;'>" +
            (!this.isNew && !this.isEdited  ? "" :
                ("<input type='text' id='absenteeismTime' " + "style='" + inputTimeStyle +"'" + " value='" + ( this.data && this.data.absenteeismTime ? this.data.absenteeismTime : "") + "'/>")) +
            "</td>" +
            "</tr>" +
            "</table>";
        this.createFormNode.set("html", html);

        this.department = this.createFormNode.getElement("#department");
        this.workTime = this.createFormNode.getElement("#workTime");
        this.offTime = this.createFormNode.getElement("#offTime");
        this.lateTime = this.createFormNode.getElement("#lateTime");
        this.leaveEarlyTime = this.createFormNode.getElement("#leaveEarlyTime");
        this.absenteeismTime = this.createFormNode.getElement("#absenteeismTime");

        this.createFormNode.getElement("#selDepartment").addEvent("click",function(){
            _self.selectDepartment(this,"d");
        })
        this.createFormNode.getElement("#selCompany").addEvent("click",function(){
            _self.selectDepartment(this,"c");
        })

        this.workTime.addEvent("click",function(){
            _self.selectCalendar(this);
        })
        this.offTime.addEvent("click",function(){
            _self.selectCalendar(this);
        })
        this.lateTime.addEvent("click",function(){
            _self.selectCalendar(this);
        })
        this.leaveEarlyTime.addEvent("click",function(){
            _self.selectCalendar(this);
        })
        this.absenteeismTime.addEvent("click",function(){
            _self.selectCalendar(this);
        })

        this.cancelActionNode = new Element("div", {
            "styles": this.css.createCancelActionNode,
            "text": this.app.lp.cancel
        }).inject(this.createFormNode);
        this.createOkActionNode = new Element("div", {
            "styles": this.css.createOkActionNode,
            "text": this.app.lp.ok
        }).inject(this.createFormNode);

        this.cancelActionNode.addEvent("click", function(e){
            this.cancelCreate(e);
        }.bind(this));
        this.createOkActionNode.addEvent("click", function(e){
            this.okCreate(e);
        }.bind(this));
    },

    setCreateNodeSize: function (width, height, top, left) {
        if (!width)width = this.options && this.options.width ? this.options.width : "50%"
        if (!height)height = this.options && this.options.height ? this.options.height : "50%"
        if (!top) top = this.options && this.options.top ? this.options.top : 0;
        if (!left) left = this.options && this.options.left ? this.options.left : 0;

        var allSize = this.app.content.getSize();
        var limitWidth = allSize.x; //window.screen.width
        var limitHeight = allSize.y; //window.screen.height

        "string" == typeof width && (1 < width.length && "%" == width.substr(width.length - 1, 1)) && (width = parseInt(limitWidth * parseInt(width, 10) / 100, 10));
        "string" == typeof height && (1 < height.length && "%" == height.substr(height.length - 1, 1)) && (height = parseInt(limitHeight * parseInt(height, 10) / 100, 10));
        300 > width && (width = 300);
        220 > height && (height = 220);
        top = top || parseInt((limitHeight - height) / 2, 10);
        left = left || parseInt((limitWidth - width) / 2, 10);

        this.createAreaNode.setStyles({
            "width": "" + width + "px",
            "height": "" + height + "px",
            "top": "" + top + "px",
            "left": "" + left + "px"
        });

        this.createNode.setStyles({
            "width": "" + width + "px",
            "height": "" + height + "px"
        });

        var iconSize = this.createIconNode ? this.createIconNode.getSize() : {x: 0, y: 0};
        var topSize = this.formTopNode ? this.formTopNode.getSize() : {x: 0, y: 0};
        var bottomSize = this.formBottomNode ? this.formBottomNode.getSize() : {x: 0, y: 0};

        var contentHeight = height - iconSize.y - topSize.y - bottomSize.y;
        //var formMargin = formHeight -iconSize.y;
        this.createFormNode.setStyles({
            "height": "" + contentHeight + "px"
        });
    },
    //setCreateNodeSize: function(){
    //    var size = this.app.node.getSize();
    //    var allSize = this.app.content.getSize();
    //
    //    this.createAreaNode.setStyles({
    //        "width": ""+size.x+"px",
    //        "height": ""+size.y+"px"
    //    });
    //    var hY = size.y*0.8;
    //    var mY = size.y*0.2/2;
    //    this.createNode.setStyles({
    //        "height": ""+hY+"px",
    //        "margin-top": ""+mY+"px"
    //    });
    //
    //    var iconSize = this.createIconNode.getSize();
    //    var formHeight = hY*0.9;
    //    if (formHeight>250) formHeight = 250;
    //    var formMargin = hY*0.3/2-iconSize.y;
    //    this.createFormNode.setStyles({
    //        "height": ""+formHeight+"px",
    //        "margin-top": ""+formMargin+"px"
    //    });
    //},
    cancelCreate: function(e){
        var _self = this;
        var department = this.department.get("value");
        if ( this.isNew &&  department!="" && department!="default" ){
            this.app.confirm("warn", e,
                this.app.lp.create_cancel_title,
                this.app.lp.create_cancel, "320px", "100px",
                function(){
                    _self.createMarkNode.destroy();
                    _self.createAreaNode.destroy();
                    this.close();
                },function(){
                    this.close();
                }
            );
        }else{
            this.createMarkNode.destroy();
            this.createAreaNode.destroy();
            delete _self;
        }
    },
    okCreate: function(e){
        var data = {
            "id" : (this.data && this.data.id) ? this.data.id : null,
            "organizationName": this.department.get("value"),
            "onDutyTime": this.workTime.get("value"),
            "offDutyTime": this.offTime.get("value"),
            "lateStartTime": this.lateTime.get("value"),
            "leaveEarlyStartTime": this.leaveEarlyTime.get("value"),
            "absenceStartTime": this.absenteeismTime.get("value")
        };

        if (data.onDutyTime && data.offDutyTime && data.lateStartTime ){
            this.app.restActions.saveSchedule(data, function(json){
                if( json.type == "ERROR" ){
                    this.app.notice( json.userMessage  , "error");
                }else{
                    this.createMarkNode.destroy();
                    this.createAreaNode.destroy();
                    if(this.explorer.view)this.explorer.view.reload();
                    this.app.notice( this.isNew ? this.app.lp.createSuccess : this.app.lp.updateSuccess  , "success");
                }
                //    this.app.processConfig();
            }.bind(this));
        }else{
            this.app.notice( "请选择上班打卡时间、下班打卡时间和迟到起算时间", "error");
        }
    },
    selectCalendar : function( calendarNode ){
        MWF.require("MWF.widget.Calendar", function(){
            var calendar = new MWF.widget.Calendar( calendarNode, {
                "style": "xform",
                "timeOnly": true,
                "isTime": true,
                "target": this.app.content
            });
            calendar.show();
        }.bind(this));
    },
    selectDepartment: function(el, type ){
        var options = {
            "type": type == "d" ? "department" : "company",
            "title": type == "d" ? "选择部门" : "选择公司",
            "names": this.data.department || [],
            "count" : "1",
            "onComplete": function(items){
                this.data.department = [];
                items.each(function(item){
                    this.data.department.push(item.data.name);
                }.bind(this));
                this.department.set("value",this.data.department);
            }.bind(this)
        };
        var selector = new MWF.OrgSelector(this.app.content, options);
    }
});

