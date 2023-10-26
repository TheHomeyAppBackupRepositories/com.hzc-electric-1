const { ZigBeeDevice } = require("homey-zigbeedriver");
const { CLUSTER } = require("zigbee-clusters");
const HzcZigBeeLightDevice = require("./HzcZigBeeLightDevice");
  
class D689ZG_1402767 extends HzcZigBeeLightDevice {
  async onNodeInit({ zclNode }) { 

    //D689-ZG, 1402767
    await super.onNodeInit({ zclNode, supportsHueAndSaturation: false, supportsColorTemperature: true });
     
  }
 
}

module.exports = D689ZG_1402767;