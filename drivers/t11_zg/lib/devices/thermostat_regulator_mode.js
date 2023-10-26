'use strict'
const {CLUSTER, Cluster} = require('zigbee-clusters')
const {
    TIP_CHANGED
} = require('./utils');
module.exports = {

    async setConfig(device, payload) {
        console.log('regulator Mode SET:', device.getSettings(), payload);

        if (payload === false || payload === '0') {
            //不启用
            const settings = device.getSettings();
            let mode = settings.sensor_mode;
            if (mode === 'p') {
                mode = 'a';
            }

            let payload2 = {}
            //sensor_mode !p
            payload2['sensorMode'] = mode;
            //regulator set 0(off)
            payload2['regulator'] = parseInt(payload);

            device.thermostatCluster().writeAttributes(payload2).catch(this.error)

        } else if (payload === true || payload === '6') {

            if (device.hasCapability('t7e_zg_thermostat_mode')) {
                let cur_thermostat = device.getCapabilityValue('t7e_zg_thermostat_mode');
                if (cur_thermostat === 'cool') {
                    await device.setWarning("In cooling mode, the regulator heating cannot be switched.").catch(this.error);
                    return
                }
            }

            let payload2 = {}
            //sensor_mode
            payload2['sensorMode'] = 'p'

            //regulator set min
            payload2['regulator'] = parseInt(payload);

            device.thermostatCluster().writeAttributes(payload2).catch(this.error)

        }

        device.setStoreValue('regulator_mode', payload);
        device.setStoreValue('regulator_mode_changed', true);
        await device._start()
        await device.showMessage(TIP_CHANGED);


    },

}