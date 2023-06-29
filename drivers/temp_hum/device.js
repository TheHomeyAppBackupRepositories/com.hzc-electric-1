'use strict';

const Homey = require('homey');

const { ZwaveDevice } = require('homey-zwavedriver');

class TempHumSensor extends ZwaveDevice {
	async onNodeInit({ node }) {
		this.registerCapability('measure_temperature', 'SENSOR_MULTILEVEL');
		this.registerCapability('measure_humidity', 'SENSOR_MULTILEVEL');
		this.registerCapability('measure_battery', 'BATTERY');
		this.registerCapability('alarm_battery', 'BATTERY');
	}
}


module.exports = TempHumSensor;
