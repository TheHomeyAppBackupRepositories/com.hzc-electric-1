'use strict'
 
 
const { CLUSTER, Cluster } = require('zigbee-clusters')
const HzcBasicCluster = require('../../lib/HzcBasicCluster')   
Cluster.addCluster(HzcBasicCluster)  

const HzcSwitch2GangZigBeeDevice = require('../../lib/HzcSwitch2GangZigBeeDevice')  



class SmartSwitch_ZG_Device extends HzcSwitch2GangZigBeeDevice {
  
  async onNodeInit ({ zclNode }) {
    super.onNodeInit( { zclNode })

    //this.enableDebug();
    //this.printNode(); 

    await this.addCapability('onoff'); 
    //await this.addCapability('meter_power'); 
    //await this.addCapability('measure_power');
    //await this.addCapability('rms_voltage');
    //await this.addCapability('rms_current');
    
    this.registerSwitchOnoff(1);
    //this.registerMeterPowerMeasurePower(1);    
    //await this.registerRmsVoltage(1)
    //await this.registerRmsCurrent(1)
    
  }   
}

module.exports = SmartSwitch_ZG_Device;