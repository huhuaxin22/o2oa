MWF.xApplication.SelecterTest.options.multitask = true;
MWF.xApplication.SelecterTest.Main = new Class({
	Extends: MWF.xApplication.Common.Main,
	Implements: [Options, Events],

	options: {
		"style": "default",
		"name": "SelecterTest",
		"icon": "icon.png",
		"width": "1200",
		"height": "600",
		"isResize": true,
		"isMax": true,
		"title": MWF.xApplication.SelecterTest.LP.title
	},
	onQueryLoad: function(){
		this.lp = MWF.xApplication.SelecterTest.LP;
	},
	loadApplication: function(callback){
        this.createNode();
        this.sel1Content = new Element("div", {"styles":{"padding": "10px"}}).inject(this.node);
        this.sel2Content = new Element("div", {"styles":{"padding": "10px"}}).inject(this.node);

        MWF.require("MWF.widget.Tab", function(){
            this.tab = new MWF.widget.Tab(this.node, {"style": "processlayout"});
            this.tab.load();
            this.page1 = this.tab.addTab(this.sel1Content, "组织选人", false);
            this.page2 = this.tab.addTab(this.sel2Content, "缓存选人", false);
            this.page1.showIm();

            this.setContentHeight();
            this.addEvent("resize", function(){this.setContentHeight();}.bind(this));
        }.bind(this));

        this.loadApplicationContent();
	},
    createNode: function(){
        this.content.setStyle("overflow", "hidden");
        this.node = new Element("div", {
            "styles": {"width": "100%", "height": "100%", "overflow": "hidden"}
        }).inject(this.content);
    },

    loadApplicationContent: function(){
        MWF.xDesktop.requireApp("Organization", "Selector.package", null, false);

        var textareaStyle = {
            "height": "120px",
            "width": "360px"
        };

        this.textarea1 = new Element("textarea", {
            "value": "{\n\t\"title\": \"Select Identity\", \n\t\"count\": 0, \n\t\"groups\": [], \n\t\"roles\": [], \n\t\"companys\": [], \n\t\"departments\": []\n}",
            "styles": textareaStyle
        }).inject(this.sel1Content);

        this.selecteds = [];

        this.textareaResault1 = new Element("textarea", {
            "value": "",
            "styles": textareaStyle
        }).inject(this.sel1Content);
        this.textareaResault2 = new Element("textarea", {
            "value": "",
            "styles": textareaStyle
        }).inject(this.sel1Content);

        this.selecteds = [];

        new Element("p").inject(this.sel1Content);
        //new Element("br").inject(this.sel1Content);

        this.createButton1("选择人员", "Person");
        this.createButton1("选择群组", "Group");
        this.createButton1("选择角色", "Role");
        this.createButton1("选择身份", "Identity");
        this.createButton1("选择部门", "Department");
        this.createButton1("选择公司", "Company");

        new Element("p").inject(this.sel1Content);

        //this.createButton2("选择人员", "Person");
        //this.createButton2("选择群组", "Group");
        //this.createButton2("选择角色", "Role");
        //this.createButton2("选择身份", "Identity");
        //this.createButton2("选择部门", "Department");
        //this.createButton2("选择公司", "Company");


        this.currentButton = null;
    },

    createButton1: function(text, type){
        var button = new Element("input", {
            "type": "button",
            "value": text,
            "events": {
                "click": function(e){

                    if (this.currentButton!= e.target){
                        this.textareaResault1.set("value", "");
                        this.textareaResault2.set("value", "");
                        this.selecteds = [];
                        this.currentButton = e.target;
                    }else{
                        var v = this.textareaResault1.get("value");
                        if (v){this.selecteds = v.split("\n");}else{this.selecteds = [];}
                    }

                    var options = {
                        "type": type,
                        "values": this.selecteds,
                        "onComplete": function(items){
                            var ids = [];
                            var names = [];
                            items.each(function(item){
                                ids.push(item.data.id);
                                names.push(item.data.name);
                            });
                            this.selecteds = ids;
                            this.textareaResault1.set("value", this.selecteds.join("\n"));
                            this.textareaResault2.set("value", names.join("\n"));
                        }.bind(this)
                    };
                    try {
                        var jsonStr = this.textarea1.get("value");
                        var json = JSON.decode(jsonStr);
                        Object.each(json, function(v, k){
                            options[k] = v;
                        });

                        var selector = new MWF.Selector(this.content, options);
              //          selector.load();
                    }catch(e){
                        this.notice("json参数有错误："+ e.message, "error");
                    }

                }.bind(this)
            }
        }).inject(this.sel1Content);
    },
    createButton2: function(text, type){
        var button = new Element("input", {
            "type": "button",
            "value": text,
            "events": {
                "click": function(e){

                    if (this.currentButton!= e.target){
                        this.textareaResault1.set("value", "");
                        this.textareaResault2.set("value", "");
                        this.selecteds = [];
                        this.currentButton = e.target;
                    }else{
                        var v = this.textareaResault1.get("value");
                        if (v){this.selecteds = v.split("\n");}else{this.selecteds = [];}
                    }

                    var options = {
                        "type": type,
                        "values": this.selecteds,
                        "onComplete": function(items){
                            var ids = [];
                            var names = [];
                            items.each(function(item){
                                ids.push(item.data.id);
                                names.push(item.data.name);
                            });
                            this.selecteds = ids;
                            this.textareaResault1.set("value", this.selecteds.join("\n"));
                            this.textareaResault2.set("value", names.join("\n"));
                        }.bind(this)
                    };
                    try {
                        var jsonStr = this.textarea1.get("value");
                        var json = JSON.decode(jsonStr);
                        Object.each(json, function(v, k){
                            options[k] = v;
                        });

                        var selector = new MWF.Selector(this.content, options);
                        //          selector.load();
                    }catch(e){
                        this.notice("json参数有错误："+ e.message, "error");
                    }

                }.bind(this)
            }
        }).inject(this.sel1Content);
    },
    setContentHeight: function(node){
        var size = this.node.getSize();
        var tabSize = this.tab.tabNodeContainer.getSize();
        var height = size.y-tabSize.y-20;

        this.sel1Content.setStyle("height", height);
        this.sel2Content.setStyle("height", height);
    }
});
