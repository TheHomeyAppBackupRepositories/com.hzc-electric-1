'use strict';

const Homey = require('homey');   
const log = require('./lib/log');
const { HomeyAPIApp } = require('homey-api');

class MyApp extends Homey.App {
  
	onInit() { 

		const dbg = true; 
		log.syslog(dbg);
		this.log('App is running...');  
		 
	}

	
  
}

module.exports = MyApp;