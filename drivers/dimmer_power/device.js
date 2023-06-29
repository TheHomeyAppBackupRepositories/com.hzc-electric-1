const { ZigBeeDevice } = require("homey-zigbeedriver");
const { CLUSTER } = require("zigbee-clusters");
const HzcSwitch2GangZigBeeDevice = require('../../lib/HzcSwitch2GangZigBeeDevice')
const HzcDimmerZigBeeDevice = require('../../lib/HzcDimmerZigBeeDevice')

class DimmerPowerDevice extends HzcDimmerZigBeeDevice {
    async onNodeInit({ zclNode }) {

        this.app_inited = false
        this.params = {}

        if (!this.hasCapability('onoff')) {
            await this.addCapability('onoff'); 
        }
        if (!this.hasCapability('dim')){
            await this.addCapability('dim'); 
        }  

        //add measure power
        if (!this.hasCapability('measure_power')) {
            await this.addCapability('measure_power')
        }

        //add meter
        if (!this.hasCapability('meter_power')) {
            await this.addCapability('meter_power')
        }

        /*
        this.registerCapability("dim", CLUSTER.LEVEL_CONTROL);     
        this.registerSwitchOnoff(1)
        this.registerMeterPowerMeasurePower(1)  
        this._init_app()
        */

        //way 2
        this.registerSwitchOnoff()
        this.registerDim() 
        this.registerMeterPowerMeasurePower(1)
        this._init_app()

    }
}

module.exports = DimmerPowerDevice;