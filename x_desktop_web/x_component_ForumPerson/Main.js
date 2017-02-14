MWF.xApplication.Forum = MWF.xApplication.Forum || {};
MWF.xApplication.ForumPerson = MWF.xApplication.ForumPerson || {};
MWF.require("MWF.widget.Identity", null,false);
MWF.xDesktop.requireApp("Forum", "Actions.RestActions", null, false);
MWF.xDesktop.requireApp("Forum", "lp."+MWF.language, null, false);
MWF.xDesktop.requireApp("Template", "Explorer", null, false);
MWF.xDesktop.requireApp("Forum", "Access", null, false);
MWF.xApplication.ForumPerson.options = {
	multitask: true,
	executable: true
}
MWF.xApplication.ForumPerson.Main = new Class({
	Extends: MWF.xApplication.Common.Main,
	Implements: [Options, Events],

	options: {
		"style": "default",
		"name": "ForumPerson",
		"icon": "icon.png",
		"width": "1210",
		"height": "700",
		"isResize": false,
		"isMax": true,
		"title": MWF.xApplication.ForumPerson.LP.title,
		"personName" : ""
	},
	onQueryLoad: function(){
		this.lp = MWF.xApplication.Forum.LP;
	},
	loadApplication: function(callback){
		this.userName = layout.desktop.session.user.name;
		this.restActions = new MWF.xApplication.Forum.Actions.RestActions();

		this.path = "/x_component_ForumPerson/$Main/"+this.options.style+"/";
		this.createNode();
		this.loadApplicationContent();
	},
	loadController: function(callback){
		this.access = new MWF.xApplication.Forum.Access( this.restActions, this.lp );
		if(callback)callback();
	},
	createNode: function(){
		this.content.setStyle("overflow", "hidden");
		this.node = new Element("div", {
			"styles": this.css.node
		}).inject(this.content);
	},
	loadApplicationContent: function(){
		if( !this.options.personName && this.status && this.status.personName ){
			this.options.personName = this.status.personName;
		}
		this.isCurrentUser = this.userName == this.options.personName;
		this.setTitle( this.options.personName );
		this.loadController(function(){
			this.access.login( function () {
				this.getUserData( this.options.personName, function( json ){
					this.personData = json.data;
					this.loadApplicationLayout();
				}.bind(this) )
			}.bind(this))
		}.bind(this))
	},
	getUserData : function( name, callback ){
		if( this.access.isAnonymous() ){
			this.restActions.getPersonIcon(name, function(url){
				if( callback )callback( { data : {
					icon : url,
					genderType : "m",
					signature : ""
				} } );
			})
		}else{
			this.restActions.getPerson( function( json ){
				if( json.data ){
					if( json.data.icon ){
						json.data.icon = 'data:image/png;base64,'+json.data.icon;
					}else{
						json.data.icon = "/x_component_ForumDocument/$Main/"+this.options.style+"/icon/noavatar_big.gif"
					}
				}
				if( !json.data.signature )json.data.signature="";
				if( callback )callback( json );
			}.bind(this), null, name, true )
		}
	},
	loadApplicationLayout : function(){
		this.contentContainerNode = new Element("div.contentContainerNode", {
			"styles": this.css.contentContainerNode
		}).inject(this.node);

		this.createTopNode();
		this.createMiddleNode();
	},
	reloadAllParents : function( sectionId ){
		this.restActions.getSection( sectionId, function( json ){
			var aid = "Forum";
			if (this.desktop.apps[aid]){
				this.desktop.apps[aid].reload();
			}

			aid = "ForumCategory"+json.data.forumId;
			if (this.desktop.apps[aid]){
				this.desktop.apps[aid].reload();
			}

			aid = "ForumSection"+sectionId;
			if (this.desktop.apps[aid]){
				this.desktop.apps[aid].reload();
			}
		}.bind(this) )
	},
	createTopNode: function(){
		var forumColor = this.lp.defaultForumColor;

		var topNode = this.topNode = new Element("div.topNode", {
			"styles": this.css.topNode
		}).inject(this.contentContainerNode);
		topNode.setStyle("border-bottom","1px solid "+forumColor);

		var topTitleLeftNode = new Element("div.topTitleLeftNode", {
			"styles": this.css.topTitleLeftNode
		}).inject(topNode);
		topTitleLeftNode.setStyle( "background-color" , forumColor )

		var topTitleMiddleNode = new Element("div.topTitleMiddleNode", {
			"styles": this.css.topTitleMiddleNode
		}).inject(topNode);
		topTitleMiddleNode.setStyle( "background-color" , forumColor )

		var topTitleRightNode = new Element("div.topTitleRightNode", {
			"styles": this.css.topTitleRightNode
		}).inject(topNode);
		topTitleRightNode.setStyle( "background-color" , forumColor )

		var topItemTitleNode = new Element("div.topItemTitleNode", {
			"styles": this.css.topItemTitleNode,
			"text": this.lp.title
		}).inject(topTitleMiddleNode);
		topItemTitleNode.addEvent("click", function(){
			var appId = "Forum";
			if (this.desktop.apps[appId]){
				this.desktop.apps[appId].setCurrent();
			}else {
				this.desktop.openApplication(null, "Forum", { "appId": appId });
			}

			if( !this.inBrowser ){
				this.close();
			}
			//this.close();
		}.bind(this))

		var topItemSepNode = new Element("div.topItemSepNode", {
			"styles": this.css.topItemSepNode
		}).inject(topTitleMiddleNode);


		var topItemTitleNode = new Element("div.topItemTitleNode", {
			"styles": this.css.topItemTitleNode,
			"text": this.lp.personCenter + "："+ this.options.personName
		}).inject(topTitleMiddleNode);

	},
	createMiddleNode: function(){
		this.middleNode = new Element("div.middleNode", {
			"styles": this.css.middleNode
		}).inject(this.contentContainerNode);

		this.createPersonNode();
		this._createMiddleNode();

		this.addEvent("resize", function () {
			this.setContentSize();
		}.bind(this));
		this.setContentSize();

		//MWF.require("MWF.widget.ScrollBar", function () {
		//	new MWF.widget.ScrollBar(this.contentContainerNode, {
		//		"indent": false,
		//		"style": "xApp_TaskList",
		//		"where": "before",
		//		"distance": 30,
		//		"friction": 4,
		//		"axis": {"x": false, "y": true},
		//		"onScroll": function (y) {
		//		}
		//	});
		//}.bind(this));
	},
	createPersonNode: function(){
		var personNode = new Element("div.personNode", {
			"styles": this.css.personNode
		}).inject(this.middleNode);


		this.restActions.getUserInfor( {"userName":this.options.personName}, function( json ){
			var userInfor = this.userInfor = json.data;
			var personLeftNode = new Element("div.personLeftNode", {
				"styles": this.css.personLeftNode
			}).inject(personNode);
			var personLeftIconNode = new Element("div.personLeftIconNode", {
				"styles": this.css.personLeftIconNode
			}).inject(personLeftNode);
			var personLeftIcon = new Element("img", {
				"styles": this.css.personLeftIcon,
				"src" : this.personData.icon
			}).inject(personLeftIconNode);

			var personLeftContent = new Element("div.personLeftContent", {
				"styles": this.css.personLeftContent
			}).inject(personLeftNode)
			var personTopDiv = new Element("div.personTopDiv", {
				"styles": this.css.personTopDiv
			}).inject(personLeftContent)
			var personTopInfor= new Element("div.personTopInfor", {
				"styles": this.css.personTopInfor,
				"text" : this.options.personName
			}).inject(personTopDiv)

			if( !this.access.isAnonymous() && !this.inBrowser ){
				if( this.isCurrentUser ){
					var actionNode = new Element("input", {
						"type" : "button",
						"styles": this.css.personSettingAction,
						"value" : this.lp.changePersonSetting
					}).inject(personTopDiv)
					actionNode.addEvent("click", function(){
						var appId = "Profile";
						if (this.desktop.apps[appId]){
							this.desktop.apps[appId].setCurrent();
						}else {
							this.desktop.openApplication(null, "Profile", {
							});
						}
					}.bind(this))
				}else{
					var actionNode = new Element("input", {
						"type" : "button",
						"styles": this.css.personSettingAction,
						"value" : this.lp.sendMessage
					}).inject(personTopDiv)
					actionNode.addEvent("click", function(e){
						if (layout.desktop.widgets["IMIMWidget"]) {
							var IM = layout.desktop.widgets["IMIMWidget"];
							var name = this.options.personName;
							IM.getOwner(function(){
								this.openChat(e, {
									from : name
								});
							}.bind(IM));
						}
					}.bind(this))
				}
			}


			var personLeftDiv = new Element("div.personLeftDiv", {
				"styles": this.css.personLeftDiv,
				"text" : this.lp.subject + "：" + userInfor.subjectCount + "，" + this.lp.replyCount + "：" + userInfor.replyCount + "，" + //this.lp.accessed + "：" + userInfor.popularity + "，" +
						this.lp.prime + "：" + userInfor.creamCount + "，" + this.lp.todaySubject + "：" + userInfor.subjectCountToday + "，" + this.lp.todayReply + "：" + userInfor.replyCountToday
			}).inject(personLeftContent);
			//var personLeftMemo = new Element("div.personLeftMemo", {
			//	"styles": this.css.personLeftMemo,
			//	"text" : this.personData.personDescription
			//}).inject(personLeftDiv)

			var personLeftDiv = new Element("div.personLeftDiv", {
				"styles": this.css.personLeftDiv,
				"text" : this.lp.signature + "：" + this.personData.signature
				//"text" : this.lp.mail + "：" + this.personData.mail + "，" + this.lp.mobile + "：" + this.personData.mobile + "，" + "QQ" + "：" + this.personData.qq + "，" + this.lp.weixin + "：" + this.personData.weixin
			}).inject(personLeftContent)
		}.bind(this))


	},
	_createMiddleNode : function(){
		this.contentDiv = new Element("div.contentDiv",{"styles":this.css.contentDiv}).inject(this.middleNode);
		if( this.contentDiv )this.contentDiv.empty();
		if( this.explorer ){
			this.explorer.destroy();
			delete this.explorer;
		}
		this.explorer = new MWF.xApplication.ForumPerson.Explorer(this.contentDiv, this, this,{
			style:this.options.style,
			type : ( this.status && this.status.type ) ? this.status.type : "subject",
			viewPageNum : ( this.status && this.status.viewPageNum ) ? this.status.viewPageNum : 1
		});
		this.explorer.load();
	},
	setContentSize: function () {
		//var topSize = this.topNode ? this.topNode.getSize() : {"x": 0, "y": 0};
		var topSize = {"x": 0, "y": 0};
		var nodeSize = this.node.getSize();
		var pt = this.contentContainerNode.getStyle("padding-top").toFloat();
		var pb = this.contentContainerNode.getStyle("padding-bottom").toFloat();

		var height = nodeSize.y - topSize.y - pt - pb;
		this.contentContainerNode.setStyle("height", "" + height + "px");
	},
	recordStatus: function(){
		return {
			type : this.explorer.options.type,
			personName : this.options.personName,
			viewPageNum : this.explorer.view.getCurrentPageNum()
		};
	},
	getDateDiff: function (publishTime) {
		var dateTimeStamp = Date.parse(publishTime.replace(/-/gi, "/"));
		var minute = 1000 * 60;
		var hour = minute * 60;
		var day = hour * 24;
		var halfamonth = day * 15;
		var month = day * 30;
		var year = month * 12;
		var now = new Date().getTime();
		var diffValue = now - dateTimeStamp;
		if (diffValue < 0) {
			//若日期不符则弹出窗口告之
			//alert("结束日期不能小于开始日期！");
		}
		var yesterday = new Date().decrement('day', 1);
		var beforYesterday = new Date().decrement('day', 2);
		var yearC = diffValue / year;
		var monthC = diffValue / month;
		var weekC = diffValue / (7 * day);
		var dayC = diffValue / day;
		var hourC = diffValue / hour;
		var minC = diffValue / minute;
		if (yesterday.getFullYear() == dateTimeStamp.getFullYear() && yesterday.getMonth() == dateTimeStamp.getMonth() && yesterday.getDate() == dateTimeStamp.getDate()) {
			result = "昨天 " + dateTimeStamp.getHours() + ":" + dateTimeStamp.getMinutes();
		} else if (beforYesterday.getFullYear() == dateTimeStamp.getFullYear() && beforYesterday.getMonth() == dateTimeStamp.getMonth() && beforYesterday.getDate() == dateTimeStamp.getDate()) {
			result = "前天 " + dateTimeStamp.getHours() + ":" + dateTimeStamp.getMinutes();
		} else if (yearC > 1) {
			result = dateTimeStamp.getFullYear() + "年" + (dateTimeStamp.getMonth() + 1) + "月" + dateTimeStamp.getDate() + "日";
		} else if (monthC >= 1) {
			//result= parseInt(monthC) + "个月前";
			// s.getFullYear()+"年";
			result = (dateTimeStamp.getMonth() + 1) + "月" + dateTimeStamp.getDate() + "日";
		} else if (weekC >= 1) {
			result = parseInt(weekC) + "周前";
		} else if (dayC >= 1) {
			result = parseInt(dayC) + "天前";
		} else if (hourC >= 1) {
			result = parseInt(hourC) + "小时前";
		} else if (minC >= 1) {
			result = parseInt(minC) + "分钟前";
		} else
			result = "刚刚发表";
		return result;
	}
});


MWF.xApplication.ForumPerson.Explorer = new Class({
	Extends: MWF.widget.Common,
	Implements: [Options, Events],
	options: {
		"style": "default",
		"type" : "subject",
		"viewPageNum" : 1
	},
	initialize: function (container, app, parent, options) {
		this.setOptions( options );
		this.container = container;
		this.parent = parent;
		this.app = app;
		this.css = this.parent.css;
		this.lp = this.app.lp;
	},
	load: function () {
		this.container.empty();

		this.loadToolbar();

		this.viewContainer = Element("div",{
			"styles" : this.css.viewContainer
		}).inject(this.container);

		this.loadToolbar();

		if( this.options.type == "subject" ){
			this.loadSubjectView();
		}else{
			this.loadReplyView();
		}
	},
	destroy : function(){
		if(this.resizeWindowFun)this.app.removeEvent("resize",this.resizeWindowFun)
		this.view.destroy();
	},
	loadToolbar: function(){
		var toolbar = new Element("div",{
			styles : this.css.toolbar
		}).inject(this.container)

		if( !this.toolbarTop ){
			if( this.app.isCurrentUser ){
				this.toolbarLeft = new Element("div.toolbarLeft",{
					"styles" : this.css.toolbarLeft
				}).inject( toolbar )
				this.mySubjectNode = new Element("div.toolbarLeftItem",{
					"styles" : this.css.toolbarLeftItem,
					"text" : this.lp.mySubject
				}).inject( this.toolbarLeft );
				this.mySubjectNode.addEvents({
					"mouseover" : function(){
						if(this.currentNaviNode!=this.mySubjectNode)this.mySubjectNode.setStyles( this.css.toolbarLeftItem_over );
					}.bind(this),
					"mouseout" : function(){
						if(this.currentNaviNode!=this.mySubjectNode)this.mySubjectNode.setStyles( this.css.toolbarLeftItem );
					}.bind(this),
					"click" : function(){
						this.options.type = "subject";
						if(this.currentNaviNode)this.currentNaviNode.setStyles( this.css.toolbarLeftItem );
						this.currentNaviNode = this.mySubjectNode;
						this.mySubjectNode.setStyles( this.css.toolbarLeftItem_current );
						this.loadSubjectView();
					}.bind(this)
				})
				this.myReplyNode = new Element("div.toolbarLeftItem",{
					"styles" : this.css.toolbarLeftItem,
					"text" : this.lp.myReply
				}).inject( this.toolbarLeft )
				this.myReplyNode.addEvents({
					"mouseover" : function(){
						if(this.currentNaviNode!=this.myReplyNode)this.myReplyNode.setStyles( this.css.toolbarLeftItem_over );
					}.bind(this),
					"mouseout" : function(){
						if(this.currentNaviNode!=this.myReplyNode)this.myReplyNode.setStyles( this.css.toolbarLeftItem );
					}.bind(this),
					"click" : function(){
						this.options.type = "reply";
						if(this.currentNaviNode)this.currentNaviNode.setStyles( this.css.toolbarLeftItem );
						this.currentNaviNode = this.myReplyNode;
						this.myReplyNode.setStyles( this.css.toolbarLeftItem_current )
						this.loadReplyView();
					}.bind(this)
				})

				if( this.options.type == "reply"){
					this.myReplyNode.setStyles( this.css.toolbarLeftItem_current );
					this.currentNaviNode = this.myReplyNode;
				}else{
					this.mySubjectNode.setStyles( this.css.toolbarLeftItem_current );
					this.currentNaviNode = this.mySubjectNode;
				}
			}else{
				this.toolbarLeft = new Element("div.toolbarLeft",{
					"styles" : this.css.toolbarLeft
				}).inject( toolbar )
				this.mySubjectNode = new Element("div.toolbarLeftItem",{
					"styles" : this.css.toolbarLeftItem,
					"text" : this.app.personData.genderType.toLowerCase() == "f" ? this.lp.herSubject : this.lp.hisSubject
				}).inject( this.toolbarLeft );
				this.mySubjectNode.setStyles( this.css.toolbarLeftItem_current );
				this.mySubjectNode.setStyle("cursor","default");
			}

		}

		if( this.toolbarTop ){
			this.toolbarBottom = toolbar;
		}else{
			this.toolbarTop = toolbar;
		}

		var pagingBar = new Element("div",{
			styles : this.css.fileterNode
		}).inject(toolbar);
		if( this.pagingBarTop ){
			this.pagingBarBottom = pagingBar;
		}else{
			this.pagingBarTop = pagingBar;
		}
	},
	loadSubjectView : function(){
		if( this.view )this.view.destroy();

		this.view = new MWF.xApplication.ForumPerson.SubjectView( this.viewContainer, this.app, this, {
			templateUrl : this.parent.path+"listItem.json",
			pagingEnable : true,
			pagingPar : {
				//currentPage : this.options.viewPageNum,
				countPerPage : 30,
				onPostLoad : function( pagingBar ){
					if(pagingBar.nextPageNode){
						pagingBar.nextPageNode.inject( this.toolbarBottom, "before" );
					}
				}.bind(this),
				onPageReturn : function( pagingBar ){
					var appId = "Forum";
					if (this.app.desktop.apps[appId]){
						this.app.desktop.apps[appId].setCurrent();
					}else {
						this.app.desktop.openApplication(null, "Forum", { "appId": appId });
					}
					this.app.close();
				}.bind(this)
			}
		} )
		this.view.filterData = { creatorName : this.app.options.personName };
		this.view.pagingContainerTop = this.pagingBarTop;
		this.view.pagingContainerBottom = this.pagingBarBottom;
		this.view.load();
	},
	loadReplyView : function(){
		if( this.view )this.view.destroy();

		this.view = new MWF.xApplication.ForumPerson.ReplyView( this.viewContainer, this.app, this, {
			templateUrl : this.parent.path+"listItemReply.json",
			pagingEnable : true,
			pagingPar : {
				//currentPage : this.options.viewPageNum,
				countPerPage : 30,
				onPostLoad : function( pagingBar ){
					if(pagingBar.nextPageNode){
						pagingBar.nextPageNode.inject( this.toolbarBottom, "before" );
					}
				}.bind(this),
				onPageReturn : function( pagingBar ){
					var appId = "Forum";
					if (this.app.desktop.apps[appId]){
						this.app.desktop.apps[appId].setCurrent();
					}else {
						this.app.desktop.openApplication(null, "Forum", { "appId": appId });
					}
					this.app.close();
				}.bind(this)
			}
		} )
		this.view.filterData = { creatorName : this.app.options.personName };
		this.view.pagingContainerTop = this.pagingBarTop;
		this.view.pagingContainerBottom = this.pagingBarBottom;
		this.view.load();
	},
	resizeWindow: function(){
		var size = this.app.content.getSize();
		this.viewContainer.setStyles({"height":(size.y-121)+"px"});
	}
})

MWF.xApplication.ForumPerson.SubjectView = new Class({
	Extends: MWF.xApplication.Template.Explorer.ComplexView,
	_createDocument: function(data, index){
		return new MWF.xApplication.ForumPerson.SubjectDocument(this.viewNode, data, this.explorer, this, null,  index);
	},
	_getCurrentPageData: function(callback, count, pageNum){
		this.clearBody();
		if(!count)count=30;
		if(!pageNum)pageNum = 1;
		var filter = this.filterData || {};
		if( this.app.isCurrentUser ){
			this.actions.listMySubjectPage( pageNum, count, filter, function(json){
				if( !json.data )json.data = [];
				if( !json.count )json.count=0;
				if( callback )callback(json);
			}.bind(this))
		}else{
			this.actions.listUserSubjectPage( pageNum, count, filter, function(json){
				if( !json.data )json.data = [];
				if( !json.count )json.count=0;
				if( callback )callback(json);
			}.bind(this))
		}
	},
	_removeDocument: function(documentData, all){
		this.actions.deleteSubject(documentData.id, function(json){
			this.reload();
			this.app.reloadAllParents( documentData.sectionId );
			this.app.notice(this.app.lp.deleteDocumentOK, "success");
		}.bind(this));
	},
	_create: function(){

	},
	_openDocument: function( documentData,index ){
		var appId = "ForumDocument"+documentData.id;
		if (this.app.desktop.apps[appId]){
			this.app.desktop.apps[appId].setCurrent();
		}else {
			this.app.desktop.openApplication(null, "ForumDocument", {
				"sectionId" : documentData.sectionId,
				"id" : documentData.id,
				"appId": appId,
				"isEdited" : false,
				"isNew" : false,
				"index" : index
			});
		}
	},
	_queryCreateViewNode: function(){
	},
	_postCreateViewNode: function( viewNode ){
	},
	_queryCreateViewHead:function(){
	},
	_postCreateViewHead: function( headNode ){
	}

})

MWF.xApplication.ForumPerson.SubjectDocument = new Class({
	Extends: MWF.xApplication.Template.Explorer.ComplexDocument,
	_queryCreateDocumentNode:function( itemData ){
	},
	_postCreateDocumentNode: function( itemNode, itemData ){
	},
	open: function (e) {
		this.view._openDocument(this.data, this.index);
	},
	edit : function(){
		var appId = "ForumDocument"+this.data.id;
		if (this.app.desktop.apps[appId]){
			this.app.desktop.apps[appId].setCurrent();
		}else {
			this.app.desktop.openApplication(null, "ForumDocument", {
				"sectionId" : this.data.sectionId,
				"id" : this.data.id,
				"appId": appId,
				"isEdited" : true,
				"isNew" : false,
				"index" : this.index
			});
		}
	},
	openSection : function( ev ){
		var data = this.data;
		var appId = "ForumSection"+ data.sectionId;
		if (this.app.desktop.apps[appId]){
			this.app.desktop.apps[appId].setCurrent();
		}else {
			this.app.desktop.openApplication(ev, "ForumSection", {
				"sectionId": data.sectionId,
				"appId": appId
			});
		}
		ev.stopPropagation();
	},
	isAdmin: function(){
		return this.app.access.isAdmin();
	}
})



MWF.xApplication.ForumPerson.ReplyView = new Class({
	Extends: MWF.xApplication.Template.Explorer.ComplexView,
	_createDocument: function(data, index){
		return new MWF.xApplication.ForumPerson.ReplyDocument(this.viewNode, data, this.explorer, this, null,  index);
	},
	_getCurrentPageData: function(callback, count, pageNum){
		this.clearBody();
		if(!count)count=30;
		if(!pageNum)pageNum = 1;
		var filter = this.filterData || {};
		this.actions.listMyReplyPage( pageNum, count, filter, function(json){
			if( !json.data )json.data = [];
			if( !json.count )json.count=0;
			if( callback )callback(json);
		}.bind(this))
	},
	_removeDocument: function(documentData, all){
		this.actions.deleteReply(documentData.id, function(json){
			this.reload();
			this.app.notice(this.app.lp.deleteDocumentOK, "success");
		}.bind(this));
	},
	_create: function(){

	},
	_openDocument: function( documentData,index ){
		var appId = "ForumDocument"+documentData.id;
		if (this.app.desktop.apps[appId]){
			this.app.desktop.apps[appId].setCurrent();
		}else {
			this.app.desktop.openApplication(null, "ForumDocument", {
				"sectionId" : documentData.sectionId,
				"id" : documentData.subjectId,
				"replyIndex" : documentData.orderNumber,
				"appId": appId,
				"isEdited" : false,
				"isNew" : false,
				"index" : index
			});
		}
	},
	_queryCreateViewNode: function(){
	},
	_postCreateViewNode: function( viewNode ){
	},
	_queryCreateViewHead:function(){
	},
	_postCreateViewHead: function( headNode ){
	}

})

MWF.xApplication.ForumPerson.ReplyDocument = new Class({
	Extends: MWF.xApplication.Template.Explorer.ComplexDocument,
	_queryCreateDocumentNode:function( itemData ){
	},
	_postCreateDocumentNode: function( itemNode, itemData ){
	},
	open: function (e) {
		this.view._openDocument(this.data, this.index);
	},
	edit : function(){
		var appId = "ForumDocument"+this.data.id;
		if (this.app.desktop.apps[appId]){
			this.app.desktop.apps[appId].setCurrent();
		}else {
			this.app.desktop.openApplication(null, "ForumDocument", {
				"sectionId" : this.data.sectionId,
				"id" : this.data.id,
				"appId": appId,
				"isEdited" : true,
				"isNew" : false,
				"index" : this.index
			});
		}
	},
	openSection : function( ev ){
		var data = this.data;
		var appId = "ForumSection"+ data.sectionId;
		if (this.app.desktop.apps[appId]){
			this.app.desktop.apps[appId].setCurrent();
		}else {
			this.app.desktop.openApplication(ev, "ForumSection", {
				"sectionId": data.sectionId,
				"appId": appId
			});
		}
		ev.stopPropagation();
	},
	isAdmin: function(){
		return this.app.access.isAdmin();
	},
	htmlToString : function( html ){
		html = html.replace( /<img[^>]+>/g," [图片] ")
		return html.replace(/<[^>]+>/g,"");
	}
})