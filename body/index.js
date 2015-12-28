require("./main.styl");
var template = require("./main.tpl");

function replaceClass(classList, c1, c2){
	c1.split(" ").forEach(function(className){
		classList.remove(className);
	});
	c2.split(" ").forEach(function(className){
		classList.add(className);
	});
}

function Body(){
	//var docFragment = document.createDocumentFragment();
	var docFragment = document.createElement("div");
	docFragment.innerHTML = template;

	this.container = docFragment.children[0];
	this.panels = this.container.children;

	document.body.appendChild(this.container);
	docFragment = null;
}

Body.prototype = {
	pre: function(){
		for(var i = 0, l = this.panels.length, classList; i < l; i ++){
			classList = this.panels[i].classList;
			if(classList.contains("pre")){
				replaceClass(classList, "pre", "current animate");
			}else if(classList.contains("current")){
				replaceClass(classList, "current", "next animate");
			}else if(classList.contains("next")){
				replaceClass(classList, "next animate", "pre");
			}
		}
	},
	next: function(){
		for(var i = 0, l = this.panels.length, classList; i < l; i ++){
			classList = this.panels[i].classList;
			if(classList.contains("pre")){
				replaceClass(classList, "pre animate", "next");
			}else if(classList.contains("current")){
				replaceClass(classList, "current", "pre animate");
			}else if(classList.contains("next")){
				replaceClass(classList, "next", "current animate");
			}
		}
	},
	get: function(name){
		name = name || "next";
		for(var i = 0, l = this.panels.length; i < l; i ++){
			if(this.panels[i].classList.contains(name)){
				return this.panels[i];
			}
		}
	}
};

module.exports = Body;