// 'use strict';

const Homey = require('homey');
// const ZwaveDevice = require('homey-meshdriver').ZwaveDevice;

const { ZwaveDevice } = require('homey-zwavedriver');

class MyZWaveDevice extends ZwaveDevice {
	async onNodeInit({ node }) {
		// this.enableDebug;
		// this.printNode;

		// this.registerCapability('onoff', 'BASIC');
		this.registerCapability('alarm_motion', 'NOTIFICATION');
		this.registerCapability('alarm_tamper', 'NOTIFICATION');
		//this.registerCapability('measure_luminance', 'SENSOR_MULTILEVEL');
		this.registerCapability('measure_battery', 'BATTERY');
		this.registerCapability('alarm_battery', 'BATTERY');

		// "onoff",
		// "measure_luminance"
	}
}


module.exports = MyZWaveDevice;
