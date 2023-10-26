const { ZigBeeDevice } = require("homey-zigbeedriver");
const { CLUSTER } = require("zigbee-clusters");

const HzcDimmerZigBeeDevice = require('../../lib/HzcDimmerZigBeeDevice')

class DimmerDevice extends HzcDimmerZigBeeDevice {
    async onNodeInit({ zclNode }) {

        if (this.hasCapability('measure_power')) {
            await this.removeCapability('measure_power')
        }

        if (this.hasCapability('meter_power')) {
            await this.removeCapability('meter_power')
        }

        if (!this.hasCapability('onoff')) {
            await this.addCapability('onoff'); 
        }
        if (!this.hasCapability('dim')){
            await this.addCapability('dim'); 
        }  

        //this.registerCapability("onoff", CLUSTER.ON_OFF);
        //this.registerCapability("dim", CLUSTER.LEVEL_CONTROL);

        this.registerSwitchOnoff()
        this.registerDim()

        this._init_app()
    }
}

module.exports = DimmerDevice;