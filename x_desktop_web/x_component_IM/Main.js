MWF.xApplication.IM.options.multitask = false;
MWF.require("MWF.widget.Tree", null, false);
MWF.xDesktop.requireApp("IM", "Actions.RestActions", null, false);
MWF.xApplication.IM.Main = new Class({
	Extends: MWF.xApplication.Common.Main,
	Implements: [Options, Events],

	options: {
		"style": "default",
		"name": "IM",
        "icon": "icon.png",
		"title": MWF.xApplication.IM.LP.title
	},
	onQueryLoad: function(){
		this.lp = MWF.xApplication.IM.LP;
        this.left = null;
        this.top = null;
        this.height = null;
        if (!this.userAction) this.userAction = new MWF.xApplication.IM.Actions.RestActions();
	},
    loadWindow: function(isCurrent){
        this.fireAppEvent("queryLoadWindow");
        this.window = new MWF.xDesktop.WindowTransparent(this);
        this.fireAppEvent("loadWindow");
        this.window.show();
        this.content = this.window.content;
        if (isCurrent) this.setCurrent();
        this.fireAppEvent("postLoadWindow");
        this.fireAppEvent("queryLoadApplication");
        this.loadApplication(function(){
            this.fireAppEvent("postLoadApplication");
        }.bind(this));
    },

	loadApplication: function(callback){
        this.node = new Element("div#IM", {"styles": this.css.panelNode}).inject(this.content);
        this.titleNode = new Element("div", {"styles": this.css.titleNode}).inject(this.node);
        this.userInforNode = new Element("div", {"styles": this.css.userInforNode}).inject(this.node);
        this.userSearchNode = new Element("div", {"styles": this.css.userSearchNode}).inject(this.node);
        this.userListNode = new Element("div", {"styles": this.css.userListNode}).inject(this.node);
        this.userMenuNode = new Element("div", {"styles": this.css.userMenuNode}).inject(this.node);

        this.createTitle();
        this.createUserInfor();
        this.createSearch();
        this.createUserList();

        this.setResizeEvent();

        this.checkPersonOnline();
        this.addEvent("queryClose", function(){
            if (this.checkPersonOnlineTimerID) window.clearInterval(this.checkPersonOnlineTimerID);
        }.bind(this));
        //this.createBottomMenu();
	},
    checkPersonOnline: function(){
        this.checkPersonOnlineTimerID = window.setInterval(function(){
            if (this.onlineList) this.checkOnline(this.onlineList.personList);
            if (this.searchList)  this.checkOnline(this.searchList.personList);
            if (this.chatList) this.checkOnline(this.chatList.personList);
        }.bind(this), 20000);
    },
    checkOnline: function(personList){
        Object.each(personList, function(v, k){
            this.userAction.personOnline(function(json){
                if (json.data.onlineStatus == "online"){
                    v.online();
                }else{
                    v.offline();
                }
            }.bind(this), null, v.data.name);
        }.bind(this));
    },
    setNodePosition: function(){
        if (this.top) this.node.setStyle("top", ""+this.top+"px");
        if (this.left) this.node.setStyle("left", ""+this.top+"px");
        if (this.height) this.node.setStyle("height", ""+this.top+"px");
    },
    setResizeEvent: function(){
        this.setNodePositionAndSizeFun = this.setNodePositionAndSize.bind(this);
        this.setNodePositionAndSizeFun();
        this.addEvent("current", this.setNodePositionAndSizeFun);
        this.desktop.addEvent("resize", this.setNodePositionAndSizeFun);
        this.addEvent("postClose", function(){
            if (this.desktop) this.desktop.removeEvent("resize", this.setNodePositionAndSizeFun);
        }.bind(this));
    },
    setNodePositionAndSize: function(){
        this.setNodePosition();

        var size = this.desktop.desktopNode.getSize();
        var position = this.desktop.desktopNode.getPosition();
        var nodeSize = this.node.getSize();

        if (!this.left || (this.left>(size.x-nodeSize.x-10)) || this.left<0){
            var left = size.x-nodeSize.x-10;
            if (left<0) left = 0;
            this.node.setStyle("left", ""+left+"px");
        }
        if (!this.top || this.top<(position.y+10)){
            var top = position.y+10;
            this.node.setStyle("top", ""+top+"px");
        }
        if (!this.height || this.height>(size.y-24)){
            var height = size.y-24;
            this.node.setStyle("height", ""+height+"px");
        }
        this.setNodeSize();
    },

    setNodeSize: function(){
        var size = this.node.getSize();
        var titleSize = this.titleNode.getSize();
        var userInforSize = this.userInforNode.getSize();
        var userSearchSize = this.userSearchNode.getSize();
        var userMenuSize = this.userMenuNode.getSize();

        var height =  size.y-(titleSize.y+userInforSize.y+userSearchSize.y+userMenuSize.y);
        this.userListNode.setStyle("height", ""+height+"px");

        var userListTitleSize = this.userListTitleNode.getSize();
        height = height-userListTitleSize.y;
        this.userListScrollNode.setStyle("height", ""+height+"px");
    },


    createTitle: function(){
        this.closeAction = new Element("div", {"styles": this.css.closeActionNode}).inject(this.titleNode);
        this.closeAction.addEvent("click", function(e){
            this.close();
            e.stopPropagation();
        }.bind(this));

        var drag = new Drag.Move(this.node, {
            "handle": this.titleNode,
            "container": this.desktop.desktopNode,
            "onDrop": function(){
                var p = this.node.getPosition();
                this.left = p.x;
                this.top = p.y;
            }.bind(this)
        });
    },
    createUserInfor: function(){
        this.userIconAreaNode = new Element("div", {"styles": this.css.userIconAreaNode}).inject(this.userInforNode);
        this.userIconNode = new Element("img", {"styles": this.css.userIconNode}).inject(this.userIconAreaNode);
        this.userTextInforNode = new Element("div", {"styles": this.css.userTextInforNode}).inject(this.userInforNode);

        this.userNameInforNode = new Element("div", {"styles": this.css.userNameInforNode}).inject(this.userTextInforNode);
        this.userNameTextInforNode = new Element("div", {"styles": this.css.userNameTextInforNode}).inject(this.userNameInforNode);
        this.userDutyTextInforNode = new Element("div", {"styles": this.css.userDutyTextInforNode}).inject(this.userNameInforNode);

        this.userSignInforNode = new Element("div", {"styles": this.css.userSignInforNode}).inject(this.userTextInforNode);

        if (!this.userAction) this.userAction = new MWF.xApplication.Selector.Actions.RestActions();
        this.userAction.getPersonComplex(function(json){
            if (!json.data) json.data = {"display": layout.desktop.session.user.name, "name": layout.desktop.session.user.name, "identityList": []};
            this.owner = json.data;
            if (json.data.icon){
                this.userIconNode.set("src", "data:image/png;base64,"+json.data.icon+"");
            }else{
                if (json.data.genderType=="f"){
                    this.userIconNode.set("src", ""+MWF.defaultPath+"/xDesktop/$UserPanel/default/icon/female.png");
                }else{
                    this.userIconNode.set("src", ""+MWF.defaultPath+"/xDesktop/$UserPanel/default/icon/man.png");
                }
            }

            this.userNameTextInforNode.set("text", json.data.display);
            var departments = [];
            json.data.identityList.each(function(id){
                departments.push(id.departmentName);
            }.bind(this));

            var text = departments.join(", ");
            this.userDutyTextInforNode.set("text", text);

            this.userSignInforNode.set("text", json.data.signature || MWF.LP.desktop.nosign);

        }.bind(this), null, layout.desktop.session.user.id);
    },
    createSearch: function(){
        this.searchInput = new Element("input", {
            "styles": this.css.searchInput,
            "type": "text",
            "value": MWF.LP.desktop.searchUser
        }).inject(this.userSearchNode);

        this.searchInput.addEvents({
            "focus": function(){ if (this.searchInput.get("value")==MWF.LP.desktop.searchUser) this.searchInput.set("value", "");}.bind(this),
            "blur": function(){ if (!this.searchInput.get("value")) this.searchInput.set("value", MWF.LP.desktop.searchUser);}.bind(this),
            "keydown": function(e){ if (e.code==13) this.doSearch(); }.bind(this)
        });
    },
    doSearch: function(){
        var key = this.searchInput.get("value");
        if (key){
            this.userListSearchTab.click();
            this.userAction.listPersonByKey(function(json){
                if (this.searchList) this.searchList.empty();
                json.data.each(function(user){
                    if (user.name!=layout.desktop.session.user.name){
                        this.userAction.getPersonComplex(function(pjson){
                            if (pjson.data.onlineStatus == "online"){
                                this.searchList.appendIdentityTreeNode(pjson.data, this.searchList.onlineTree);
                            }else{
                                this.searchList.appendIdentityTreeNode(pjson.data, this.searchList.offlineTree);
                            }
                            //this.appendIdentityTreeNode(pjson.data, item);
                        }.bind(this), null, user.name);
                    }
                }.bind(this));
            }.bind(this), null, key);
        }
    },

    createUserList: function(){
        this.userListTitleNode = new Element("div", {"styles": this.css.userListTitleNode}).inject(this.userListNode);
        this.userListChatTab = new Element("div", {"styles": this.css.userListChatTab}).inject(this.userListTitleNode);
        this.userListOnlineTab = new Element("div", {"styles": this.css.userListOnlineTab}).inject(this.userListTitleNode);
        this.userListSearchTab = new Element("div", {"styles": this.css.userListSearchTab}).inject(this.userListTitleNode);
        //    this.userListGroupTab = new Element("div", {"styles": this.css.userListChartTab}).inject(this.userListTitleNode);

        this.userListChatTab.addEvents({
            "mouseover": function(){if (this.currentList != this.userListChatTab) this.userListChatTab.setStyles(this.css.userListChatTab_over);}.bind(this),
            "mouseout": function(){ if (this.currentList != this.userListChatTab) this.userListChatTab.setStyles(this.css.userListChatTab); }.bind(this),
            "click": function(){this.loadChatList();}.bind(this)
        });
        this.userListOnlineTab.addEvents({
            "mouseover": function(){ if (this.currentList != this.userListOnlineTab) this.userListOnlineTab.setStyles(this.css.userListOnlineTab_over); }.bind(this),
            "mouseout": function(){ if (this.currentList != this.userListOnlineTab) this.userListOnlineTab.setStyles(this.css.userListOnlineTab); }.bind(this),
            "click": function(){this.loadOnlineList();}.bind(this)
        });
        this.userListSearchTab.addEvents({
            "mouseover": function(){ if (this.currentList != this.userListSearchTab) this.userListSearchTab.setStyles(this.css.userListSearchTab_over); }.bind(this),
            "mouseout": function(){ if (this.currentList != this.userListSearchTab) this.userListSearchTab.setStyles(this.css.userListSearchTab); }.bind(this),
            "click": function(){this.loadSearchList();}.bind(this)
        });

        this.currentList = this.userListOnlineTab;
        this.userListScrollNode = new Element("div", {"styles": this.css.userListScrollNode}).inject(this.userListNode);

        this.userListChatAreaNode = new Element("div", {"styles": this.css.userListAreaNode}).inject(this.userListScrollNode);
        this.userListChatAreaOnlineNode = new Element("div", {"styles": this.css.userListAreaNode}).inject(this.userListChatAreaNode);
        this.userListChatAreaOfflineNode = new Element("div", {"styles": this.css.userListAreaNode}).inject(this.userListChatAreaNode);

        this.userListOnlineAreaNode = new Element("div", {"styles": this.css.userListAreaNode}).inject(this.userListScrollNode);
        this.userListOnlineAreaTreeNode = new Element("div", {"styles": this.css.userListAreaNode}).inject(this.userListOnlineAreaNode);

        this.userListSearchAreaNode = new Element("div", {"styles": this.css.userListAreaNode}).inject(this.userListScrollNode);
        this.userListSearchAreaOnlineNode = new Element("div#online", {"styles": this.css.userListAreaNode}).inject(this.userListSearchAreaNode);
        this.userListSearchAreaOfflineNode = new Element("div#offline", {"styles": this.css.userListAreaNode}).inject(this.userListSearchAreaNode);

        MWF.require("MWF.widget.ScrollBar", function(){
            new MWF.widget.ScrollBar(this.userListScrollNode, {
                "style":"xDesktop_Message", "where": "before", "indent": false, "distance": 50, "friction": 6,	"axis": {"x": false, "y": true}
            });
        }.bind(this));

        //this.loadChatOnlineList();
        this.loadOnlineList();
    },
    loadChatList: function(){
        this.userListOnlineAreaNode.setStyle("display", "none");
        this.userListChatAreaNode.setStyle("display", "block");
        this.userListSearchAreaNode.setStyle("display", "none");
        this.userListChatAreaOnlineNode.setStyle("display", "block");
        this.userListChatAreaOfflineNode.setStyle("display", "block");

        this.userListOnlineTab.setStyles(this.css.userListOnlineTab);
        this.userListChatTab.setStyles(this.css.userListChatTab_current);
        this.userListSearchTab.setStyles(this.css.userListSearchTab);

        this.currentList = this.userListChatTab;
        if (!this.chatList){
            this.chatList = new MWF.xApplication.IM.ChatList(this);
        }
    },
    loadOnlineList: function(){
        this.userListOnlineAreaNode.setStyle("display", "block");
        this.userListChatAreaNode.setStyle("display", "none");
        this.userListSearchAreaNode.setStyle("display", "none");
        this.userListOnlineAreaTreeNode.setStyle("display", "block");

        this.userListOnlineTab.setStyles(this.css.userListOnlineTab_current);
        this.userListChatTab.setStyles(this.css.userListChatTab);
        this.userListSearchTab.setStyles(this.css.userListSearchTab);

        this.currentList = this.userListOnlineTab;

        if (!this.onlineList){
            this.onlineList = new MWF.xApplication.IM.OnlineList(this);
        }
    },
    loadSearchList: function(){
        this.userListOnlineAreaNode.setStyle("display", "none");
        this.userListChatAreaNode.setStyle("display", "none");
        this.userListSearchAreaNode.setStyle("display", "block");
        this.userListSearchAreaOnlineNode.setStyle("display", "block");
        this.userListSearchAreaOfflineNode.setStyle("display", "block");

        this.userListOnlineTab.setStyles(this.css.userListOnlineTab);
        this.userListChatTab.setStyles(this.css.userListChatTab);
        this.userListSearchTab.setStyles(this.css.userListSearchTab_current);

        this.currentList = this.userListSearchTab;
        if (!this.searchList){
            this.searchList = new MWF.xApplication.IM.SearchList(this);
        }
    },

    checkUnread: function(from){
        var person = null;
        if (this.onlineList){
            person = this.onlineList.personList[from];
            if (person) person.checkUnread();
        }
        person = null;
        if (this.searchList){
            person = this.searchList.personList[from];
            if (person) person.checkUnread();
        }
        person = null;
        if (this.chatList){
            person = this.chatList.personList[from];
            if (person) person.checkUnread();
        }
    }
});
MWF.xApplication.IM.OnlineList = new Class({
    initialize: function(app){
        this.app = app;
        this.userAction = this.app.userAction;
        this.css = this.app.css;
        this.container = this.app.userListOnlineAreaNode;
        this.personList = {};
        this.load();
    },
    load: function(){
        this.tree = new MWF.widget.Tree(this.container, {"style": "chat"});
        this.tree.addEvent("queryExpand", function(item){
            this.expandItem(item);
        }.bind(this));
        this.tree.load();
        this.userAction.listTopCompany(function(json){
            json.data.each(function(data){
                var topItem = this.appendCompanyItem(data, this.tree);
                topItem.expandOrCollapse();
            }.bind(this));
        }.bind(this));
    },
    appendCompanyItem: function(data, item){
        var obj = {
            "expand": false,
            "title": data.name,
            "text": data.name,
            "action": function(item){item.expandOrCollapse();}.bind(this),
            "icon": "companyicon.png",
            "style": "company"
        };
        var subitem = item.appendChild(obj);
        subitem.data = data;
        subitem.itemType = "company";
        if (data.departmentSubDirectCount || data.companySubDirectCount) this.appendLoaddingItem(subitem);
        return subitem;
    },
    appendDepartmentItem: function(data, item){
        var obj = {
            "expand": false,
            "title": data.display,
            "text": data.display,
            "action": function(item){item.expandOrCollapse();}.bind(this),
            "icon": "departmenticon.png",
            "style": "company"
        };
        var subitem = item.appendChild(obj);
        subitem.data = data;
        subitem.itemType = "department";
        if (data.departmentSubDirectCount || data.companySubDirectCount || data.identitySubDirectCount) this.appendLoaddingItem(subitem);
        return subitem;
    },
    appendIdentityItem: function(data, item){
        this.userAction.getPersonComplex(function(json){
            this.appendIdentityTreeNode(json.data, item);
        }.bind(this), null, data.person);
    },
    appendIdentityTreeNode: function(data, item){
        var person = new MWF.xApplication.IM.Person(data, item, this);
        //this.personList[data.id] = person;
        this.personList[data.name] = person;
    },

    expandItem: function(item){
        var sub = item.firstChild;
        if (sub && sub.options.text=="loadding..."){
            var method = "";
            if (item.itemType=="company") method = "listCompanySub";
            if (item.itemType=="department") method = "listDepartmentSub";
            if (method){
                sub.destroy();
                this.userAction[method](function(json){
                    if (json.data.companyList) json.data.companyList.each(function(data){
                        this.appendCompanyItem(data, item);
                    }.bind(this));
                    if (json.data.departmentList) json.data.departmentList.each(function(data){
                        this.appendDepartmentItem(data, item);
                    }.bind(this));
                    if (json.data.identityList) json.data.identityList.each(function(data){
                        this.appendIdentityItem(data, item);
                    }.bind(this));
                }.bind(this), null, item.data.id);
            }
        }
    },
    appendLoaddingItem: function(item){
        item.appendChild({ "expand": false,"title": "loadding...","text": "loadding...","icon": ""});
    }
});

MWF.xApplication.IM.ChatList = new Class({
    Extends: MWF.xApplication.IM.OnlineList,
    load: function(){
        this.onlineTree = new MWF.widget.Tree(this.app.userListChatAreaOnlineNode, {"style": "chat"});
        this.onlineTree.load();
        this.offlineTree = new MWF.widget.Tree(this.app.userListChatAreaOfflineNode, {"style": "chat"});
        this.offlineTree.load();

        this.userAction.listChat(function(json){
            json.data.each(function(data){
                var pName = (data.from==this.app.owner.name) ? data.person : data.from;
                if (pName!=this.app.owner.name){
                    this.userAction.getPersonComplex(function(pjson){
                        if (pjson.data.onlineStatus == "online"){
                            this.appendIdentityTreeNode(pjson.data, this.onlineTree);
                        }else{
                            this.appendIdentityTreeNode(pjson.data, this.offlineTree);
                        }
                        //this.appendIdentityTreeNode(pjson.data, item);
                    }.bind(this), null, pName);
                }
            }.bind(this));
        }.bind(this));
    }
});
MWF.xApplication.IM.SearchList = new Class({
    Extends: MWF.xApplication.IM.OnlineList,
    load: function(){
        this.onlineTree = new MWF.widget.Tree(this.app.userListSearchAreaOnlineNode, {"style": "chat"});
        this.onlineTree.load();
        this.offlineTree = new MWF.widget.Tree(this.app.userListSearchAreaOfflineNode, {"style": "chat"});
        this.offlineTree.load();
    },
    empty: function(){
        this.onlineTree.empty();
        this.offlineTree.empty();
        this.personList = null;
        this.personList = {};
    }
});

MWF.xApplication.IM.Person = new Class({
    initialize: function(data, parent, list){
        this.list = list;
        this.app = this.list.app;
        this.css = this.app.css;
        this.parent = parent;
        this.data = data;
        //this.onlineStatus = "offline";
        this.load();
    },
    load: function(){
        this.treeItem = this.parent.appendChild(this.getTreenodeObj());
        this.createPersonInforNode();
        this.setEvent();
        this.checkUnread();
        if (this.img.status=="error"){
            window.setTimeout(this.checkOnline.bind(this), 2000);
        }
    },
    setEvent: function(){
        var _self = this;
        this.treeItem.itemNode.addEvents({
            "mouseover": function(){ this.setStyles(_self.css.chatUserNode_over); },
            "mouseout": function(){ this.setStyles(_self.css.chatUserNode); },
            "dblclick": function(e){_self.openChat(e);},
            "click": function(e){_self.openChat(e);}
        });
        this.treeItem.textNode.getElement("img").addEvents({
            "mouseover": function(){ _self.showPersonInfor(this); },
            "mouseout": function(){ _self.hidePersonInfor(this); }
        });

    },

    getImg: function(status){
        var src = "";
        if (this.data.icon){
            src = "data:image/png;base64,"+this.data.icon;
        }else{
            if (this.data.genderType=="f"){
                src = "/x_component_IM/$Main/"+this.app.options.style+"/icon/female.png";
            }else{
                src = "/x_component_IM/$Main/"+this.app.options.style+"/icon/man.png";
            }
        }

        srcObj = {"status": "success", "src": src};
        if (status=="online"){

        }else if (status=="offline"){
            srcObj = MWF.grayscale(src);
        }else{
            if (this.data.onlineStatus=="offline"){
                srcObj = MWF.grayscale(src);
            }
        }
        if (srcObj.status=="error") this.data.onlineStatus="unknow";

        return srcObj;
    },
    getTreenodeObj: function(){
        this.img = this.getImg();
        var html = "<div style='height: 56px; width: 56px; float: left'>"+"<img style='width:48px; height: 48px; margin:4px;' src='"+this.img.src+"' />"+"</div>" +
            "<div style='height: 56px; margin-left: 56px;'>" +
            "<div style='height: 30px; line-height: 36px; color: #666666'>"+this.data.display+"</div>" +
            "<div style='height: 26px; line-height: 22px; color: #999999'>"+(this.data.signature || this.app.lp.nosign)+"</div></div>";
        return {
            "expand": false,
            "title": this.data.display,
            "text": html,
            "action": "",
            "icon": "",
            "style": "person"
        };
    },

    createPersonInforNode: function(){
        var dutys = [];
        this.data.identityList.each(function(i){
            i.companyDutyList.each(function(duty){
                dutys.push(i.companyDutyList+"["+duty.name+"]");
            }.bind(this));
            i.departmentDutyList.each(function(duty){
                dutys.push(i.departmentName+"["+duty.name+"]");
            }.bind(this));
        }.bind(this));

        this.personInforNode =  new Element("div", {"styles": this.css.personInforNode});
        var html = "<table width=\"100%\" cellpadding=\"3px\" border=\"0\">";
        html += "<tr><td>"+MWF.LP.desktop.person.personEmployee+"</td><td>"+this.data.employee+"</td></tr>";
        html += "<tr><td>"+MWF.LP.desktop.person.personMobile+"</td><td>"+this.data.mobile+"</td></tr>";
        html += "<tr><td>"+MWF.LP.desktop.person.personMail+"</td><td>"+this.data.mail+"</td></tr>"
        html += "<tr><td>"+MWF.LP.desktop.person.personQQ+"</td><td>"+this.data.qq+"</td></tr>";
        html += "<tr><td>"+MWF.LP.desktop.person.personWeixin+"</td><td>"+this.data.weixin+"</td></tr>";
        if (dutys.length) html += "<tr><td>"+MWF.LP.desktop.person.duty+"</td><td>"+dutys.join(", ")+"</td></tr>";
        html += "</table>";
        this.personInforNode.set("html", html);
    },
    showPersonInfor: function(node){
        this.personInforNode.inject(this.app.content);
        this.personInforNode.setStyle("display", "block");
        var size = this.personInforNode.getSize();
        var position = node.getPosition(this.app.content);
        var p = this.treeItem.tree.container.getPosition(this.app.content);

        var top = position.y;
        var left = p.x - size.x-5;

        this.personInforNode.setStyles({
            "top": ""+top+"px",
            "left": ""+left+"px"
        });
    },
    hidePersonInfor: function(){
        this.personInforNode.setStyle("display", "none");
    },
    checkUnread: function(){
        if (layout.desktop.widgets["IMIMWidget"]){
            var unShowMessage = layout.desktop.widgets["IMIMWidget"].unShowMessage;
            var key = this.data.name+this.app.owner.name;
            if (unShowMessage[key]){
                var count = unShowMessage[key].length;
                if (count){
                    this.setUnread(count);
                }else{
                    this.clearUnread();
                }
            }else{
                this.clearUnread();
            }
            //layout.desktop.widgets["IMIMWidget"].setUnread();
        }
    },
    setUnread: function(count){
        if (!this.unreadNode){
            this.unreadNode = new Element("div", {"styles": this.css.userListUnreadNode}).inject(this.treeItem.textNode);
        }
        this.unreadNode.set("text", count);
    },
    clearUnread: function(){
        if (this.unreadNode){
            this.unreadNode.destroy();
            this.unreadNode = null;
            delete this.unreadNode;
        }
    },
    openChat: function(e){
        if (this.data.name!=this.app.owner.name){
            var chat = layout.desktop.apps["Chat"];
            if (chat){
                var key = this.data.name+layout.desktop.session.user.name;
                var dialogue = chat.dialogues[key];
                if (!dialogue) dialogue = chat.addDialogue(this.app.owner, [this.data]);
                dialogue.setCurrent();
            }
            var _self = this;
            layout.desktop.openApplication(e, "Chat", {
                "onPostLoad": function(){
                    dialogue = this.addDialogue(_self.app.owner, [_self.data]);
                }
            });
        }
    },
    checkOnline: function(){
        this.app.userAction.personOnline(function(json){
            if (json.data.onlineStatus == "online"){
                this.online();
            }else{
                this.offline();
            }
        }.bind(this), null, this.data.name);
    },
    online: function(){
        if (this.data.onlineStatus!="online"){
            this.img = this.getImg("online");
            if (this.img.status=="success") this.data.onlineStatus="online";

            var node = this.treeItem.textNode.getElement("img");
            node.set("src", this.img.src);
            if (this.onlineTree){
                this.parent = this.onlineTree;
                this.treeItem.destroy();
                this.treeItem = this.parent.appendChild(this.getTreenodeObj());
            }
        }
    },
    offline: function(){
        if (this.data.onlineStatus!="offline"){
            this.data.onlineStatus="offline";
            this.img = this.getImg("offline");
            if (this.img.status=="success") this.data.onlineStatus="offline";

            var node = this.treeItem.textNode.getElement("img");
            node.set("src", this.img.src);
            if (this.offlineTree){
                this.parent = this.offlineTree;
                this.treeItem.destroy();
                this.treeItem = this.parent.appendChild(this.getTreenodeObj());
            }
        }
    }
});