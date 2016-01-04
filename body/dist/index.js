;(function(main){
	window["MBody"] = main;
})((function(){
	var mods = {};
	function require(id){
		return mods[id];
	}
	function define(id, factory){
		var module = {exports: {}};
		factory(require, module.exports, module);
		mods[id] = module.exports;
	}

	function $all_in_one_css_injector(content){
		var styleNode = document.createElement("div");
		styleNode.innerHTML = '<br /><style type="text/css">' + content + '</style>';
		return styleNode = document.getElementsByTagName("head")[0].appendChild(styleNode.lastChild);
	}
	
	
	// main.styl
	define("1", function(require, exports, module){
		module.exports = $all_in_one_css_injector('.body,\n.body .pre,\n.body .current,\n.body .next {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  background-color: #fff;\n}\n.body {\n  overflow: hidden;\n}\n.body .current {\n  z-index: 1;\n}\n.body-scroll .pre {\n  transform: translateX(-33%);\n  box-shadow: 0 0 0 rgba(0,0,0,0);\n}\n.body-scroll .current {\n  transform: translateX(0);\n  box-shadow: 0 0 30px rgba(0,0,0,0.3);\n}\n.body-scroll .next {\n  transform: translateX(100%);\n  box-shadow: 0 0 0 rgba(0,0,0,0);\n}\n.body-scroll.scroll-next .animate {\n  transition: transform 0.5s cubic-bezier(0, 0, 0, 1), box-shadow 0.5s cubic-bezier(0, 1, 0, 1);\n}\n.body-scroll.scroll-pre .animate {\n  transition: transform 0.5s cubic-bezier(0, 0, 0, 1), box-shadow 0.5s cubic-bezier(1, 0, 1, 0);\n}\n.body-scroll.scroll-pre .next {\n  z-index: 2;\n}\n.body-opacity .animate {\n  transition: opacity 0.5s linear;\n}\n.body-opacity .pre,\n.body-opacity .next {\n  opacity: 0;\n}\n.body-opacity .current {\n  opacity: 1;\n}\n');
	});

	// main.tpl
	define("2", function(require, exports, module){
		module.exports = '<div class="body">\r\n\t<div class="pre"></div>\r\n\t<div class="current"></div>\r\n\t<div class="next"></div>\r\n</div>';
	});

	// index.js
	define("0", function(require, exports, module){
		require("1");
		var template = require("2");
		
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
					}.bind(this), 5000);
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
					}.bind(this), 5000);
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
	});

	return require("0");
})());