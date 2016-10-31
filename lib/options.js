"use strict";

const {CompositeDisposable, Emitter} = require("atom");

class Options{
	
	init(){
		this.disposables = new CompositeDisposable();
		this.emitter = new Emitter();
		
		const options = [
			"coloured",
			"defaultIconClass"
		];
		
		for(const op of options){
			const name = "file-icons." + op;
			const observer = atom.config.observe(name, value => {
				this[op] = value;
				this.emitter.emit("did-change-" + op, value);
			});
			this.disposables.add(observer);
		}
		
		this.registerCommands();
	}
	
	
	reset(){
		this.disposables.dispose();
		this.disposables = null;
		this.emitter.emit("did-destroy");
		this.emitter.dispose();
		this.emitter = null;
	}
	
	
	registerCommands(){
		const target = "atom-workspace";
		
		this.disposables.add(
			atom.commands.add(target, "file-icons:toggle-colours", _=> {
				const name = "file-icons.coloured";
				atom.config.set(name, !(atom.config.get(name)));
			}),
			
			atom.commands.add(target, "file-icons:debug-outlines", _=> {
				document.body.classList.toggle("file-icons-debug-outlines");
			})
		);
	}
}

module.exports = new Options();