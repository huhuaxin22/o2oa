MWF.xDesktop.requireApp("cms.Xform", "$Input", null, false);
MWF.xApplication.cms.Xform.Checkbox = MWF.CMSCheckbox =  new Class({
	Implements: [Events],
	Extends: MWF.CMS$Input,

    _loadNode: function(){
        if (this.readonly){
            this._loadNodeRead();
        }else{
            this._loadNodeEdit();
        }
    },
    _loadNodeRead: function(){
        this.node.empty();
        var radioValues = this.getOptions();
        var value = this.getValue();
        if (value){
            var texts = [];
            radioValues.each(function(item){
                var tmps = item.split("|");
                var t = tmps[0];
                var v = tmps[1] || text;

                if (value.indexOf(v)!=-1){
                    texts.push(t);
                }
            });
            this.node.set("text", texts.join(", "));
        }
    },

    _loadNodeEdit: function(){
		//this.container = new Element("select");
		var div = new Element("div");
		div.set(this.json.properties);
		div.inject(this.node, "after");
	
		this.node.destroy();
		this.node = div;
		this.node.set({
			"id": this.json.id,
			"MWFType": this.json.type,
			"styles": {
				"display": "inline"
			}
		});
		this.setOptions();
	},
	
	getOptions: function(){
		if (this.json.itemType == "values"){
			return this.json.itemValues;
		}else{
			return this.form.CMSMacro.exec(this.json.itemScript.code, this);
		}
		return [];
	},
	
	setOptions: function(){
		var radioValues = this.getOptions();
		radioValues.each(function(item){
			var tmps = item.split("|");
			var text = tmps[0];
			var value = tmps[1] || text;
			

			
			var radio = new Element("input", {
				"type": "checkbox",
				"name": this.json.id,
				"value": value,
				"showText": text,
				"styles": this.json.buttonStyles
			}).inject(this.node);
			radio.appendText(text, "after");

            radio.addEvent("click", function(){
                this.validationMode();
                if (this.validation()) this._setBusinessData(this.getInputData("change"));
            }.bind(this));

		}.bind(this));
	},
    _setValue: function(value){
        this._setBusinessData(value);
        var radios = this.node.getElements("input");
        for (var i=0; i<radios.length; i++){
            var radio = radios[i];
            if (value.indexOf(radio.value)!=-1){
                radio.checked = true;
            }else{
                radio.checked = false;
            }
        }
    },
	getTextData: function(){
		var inputs = this.node.getElements("input");
		var value = [];
		var text = [];
		if (inputs.length){
			inputs.each(function(input){
				if (input.checked){
					var v = input.get("value");
					var t = input.get("showText");
					value.push(v || "");
					text.push(t || v || "");
				}
			});
		}
		if (!value.length) value = [""];
		if (!text.length) text = [""];
		return {"value": value, "text": text};
	},
    //getData: function(){
		//var inputs = this.node.getElements("input");
		//var value = [];
		//if (inputs.length){
		//	inputs.each(function(input){
		//		if (input.checked){
		//			var v = input.get("value");
		//			if (v) value.push(v || "");
		//		}
		//	});
		//}
		//return (value.length==1) ? value[0] : value;
    //},
    getInputData: function(){
        var inputs = this.node.getElements("input");
        var value = [];
        if (inputs.length){
            inputs.each(function(input){
                if (input.checked){
                    var v = input.get("value");
                    if (v) value.push(v || "");
                }
            });
        }
        return (value.length) ? value : null;
    },
    resetData: function(){
        this.setData(this.getValue());
    },
	setData: function(data){
        this._setBusinessData(data);

		var inputs = this.node.getElements("input");
		if (inputs.length){
			inputs.each(function(input){
				if (typeOf(data)=="array"){
					if (data.indexOf(input.get("value"))!=-1){
						input.set("checked", true);
					}else{
						input.set("checked", false);
					}
				}else{
					if (data == input.get("value")){
						input.set("checked", true);
					}else{
						input.set("checked", false);
					}
				}
			});
		}
	},

    notValidationMode: function(text){
        if (!this.isNotValidationMode){
            this.isNotValidationMode = true;
            this.node.store("background", this.node.getStyles("background"));
            this.node.setStyle("background", "#ffdcdc");

            this.errNode = this.createErrorNode(text)
            if (this.iconNode){
                this.errNode.inject(this.iconNode, "after");
            }else{
                this.errNode.inject(this.node, "after");
            }

        }
    },
    validationMode: function(){
        if (this.isNotValidationMode){
            this.isNotValidationMode = false;
            this.node.setStyles(this.node.retrieve("background"));
            if (this.errNode){
                this.errNode.destroy();
                this.errNode = null;
            }
        }
    }
	
}); 