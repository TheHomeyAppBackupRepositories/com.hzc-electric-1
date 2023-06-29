'use strict'
 
 
const { CLUSTER, Cluster } = require('zigbee-clusters')
const HzcBasicCluster = require('../../lib/HzcBasicCluster')   
Cluster.addCluster(HzcBasicCluster)  

const HzcSwitch2GangZigBeeDevice = require('../../lib/HzcSwitch2GangZigBeeDevice')  



class SmartSwitch_2gang_ZG_Device extends HzcSwitch2GangZigBeeDevice {
  
  async onNodeInit ({ zclNode }) {
    super.onNodeInit( { zclNode })

    //this.enableDebug();
    //this.printNode();  
  
    await this.addCapability('switch_1');
    await this.addCapability('switch_2');
    //await this.addCapability('meter_power_1');
    //await this.addCapability('measure_power_1'); 
    //await this.addCapability('meter_power_2');
    //await this.addCapability('measure_power_2');  

    //await this.addCapability('rms_voltage_1');
    //await this.addCapability('rms_current_1');
    //await this.addCapability('rms_voltage_2');
    //await this.addCapability('rms_current_2');

    this.registerSwitchOnoff(1);
    //this.registerMeterPowerMeasurePower(1); 
    this.registerSwitchOnoff(2);
    //this.registerMeterPowerMeasurePower(2); 

    //await this.registerRmsCurrent(1);
    //await this.registerRmsVoltage(1);
    //await this.registerRmsCurrent(2);
    //await this.registerRmsVoltage(2);  
      
    
  }  

  

  async trunOnoffRunListener (args, state) {
    //this.log('device . trunOnoffRunListener : ', args)
    const payload = {
      onoff: args.onoff,
      endpoint: args.endpoint
    }
    this.log(`trunOnoffRunListener => `, payload)
    if (args.onoff === 1) {
      this.zclNode.endpoints[args.endpoint].clusters[CLUSTER.ON_OFF.NAME].setOn()
      .then(async result => { 
        if (onoff === 0) {
          await this.setCapabilityValue('onoff', false);  
        } else if (onoff === 1) {
          await this.setCapabilityValue('onoff', true);  
        }
        return result
      }).catch(this.error)
    }
    else if (args.onoff === 0) {
      this.zclNode.endpoints[args.endpoint].clusters[CLUSTER.ON_OFF.NAME].setOff()
      .then(async result => { 
        if (onoff === 0) {
          await this.setCapabilityValue('onoff', false);  
        } else if (onoff === 1) {
          await this.setCapabilityValue('onoff', true);  
        }
        return result
      }).catch(this.error)
    }
  }
 
}

module.exports = SmartSwitch_2gang_ZG_Device;