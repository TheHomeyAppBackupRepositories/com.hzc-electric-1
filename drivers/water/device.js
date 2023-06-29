'use strict';

const Homey = require('homey');

const { ZwaveDevice } = require('homey-zwavedriver');

class WaterSensor extends ZwaveDevice {
	async onNodeInit({ node }) {
		// this.enableDebug;
		// this.printNode;

		// this.registerCapability('onoff', 'BASIC_SET');
		this.registerCapability('alarm_water', 'NOTIFICATION');
		this.registerCapability('measure_battery', 'BATTERY');
		this.registerCapability('alarm_battery', 'BATTERY');
	}
}


module.exports = WaterSensor;
