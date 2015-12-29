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

function Body(config){
	this.config = config || {};
	this.config.animate = this.config.animate === false ? false : (this.config.animate || "scroll");

	var docFragment = document.createElement("div");
	docFragment.innerHTML = template;

	this.container = docFragment.children[0];
	this.panels = this.container.children;

	document.body.appendChild(this.container);
	docFragment = null;
}

Body.prototype = {
	pre: function(animate){
		if(this.animateHandler){
			clearTimeout(this.animateHandler);
			this.animateHandler = null;
		}

		this.config.animate && this.container.classList.remove("body-" + this.config.animate);
		animate = animate === false ? false : (animate || this.config.animate);
		animate && this.container.classList.add("body-" + animate);

		setTimeout(function(){
			var animateClass = "";

			if(animate !== false){
				replaceClass(this.container.classList, animate + "-next", animate + "-pre");
				animateClass = " animate";
			}
			
			for(var i = 0, l = this.panels.length, classList; i < l; i ++){
				classList = this.panels[i].classList;
				if(classList.contains("pre")){
					replaceClass(classList, "pre", "current" + animateClass);
				}else if(classList.contains("current")){
					replaceClass(classList, "current", "next" + animateClass);
				}else if(classList.contains("next")){
					replaceClass(classList, "next animate", "pre");
				}
			}

			this.animateHandler = setTimeout(function(){
				this.container.classList.remove(animate + "-pre");
				this.animateHandler = null;
			}.bind(this), 500);
		}.bind(this), 1);
	},
	next: function(animate){
		if(this.animateHandler){
			clearTimeout(this.animateHandler);
			this.animateHandler = null;
		}

		this.config.animate && this.container.classList.remove("body-" + this.config.animate);
		animate = animate === false ? false : (animate || this.config.animate);
		animate && this.container.classList.add("body-" + animate);

		setTimeout(function(){
			var animateClass = "";

			if(animate !== false){
				replaceClass(this.container.classList, animate + "-pre", animate + "-next");
				animateClass = " animate";
			}

			for(var i = 0, l = this.panels.length, classList; i < l; i ++){
				classList = this.panels[i].classList;
				if(classList.contains("pre")){
					replaceClass(classList, "pre animate", "next");
				}else if(classList.contains("current")){
					replaceClass(classList, "current", "pre" + animateClass);
				}else if(classList.contains("next")){
					replaceClass(classList, "next", "current" + animateClass);
				}
			}

			this.animateHandler = setTimeout(function(){
				this.container.classList.remove(animate + "-next");
				this.animateHandler = null;
			}.bind(this), 500);
		}.bind(this), 1);
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