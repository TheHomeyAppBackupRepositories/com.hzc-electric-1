'use strict' 

const { ZwaveDevice } = require('homey-zwavedriver'); 

class d088_zv_Device extends ZwaveDevice {
  
  cur_meter_power = 0

  async onNodeInit({ node }) { 
      
    this.enableDebug()
    this.printNode()

    if (this.hasCapability('measure_power')) {
      await this.removeCapability('measure_power') 
    }
    
    if (this.hasCapability('meter_power')){
      await this.removeCapability('meter_power')
    }

    if (!this.hasCapability('switch_1')){
        this.addCapability('switch_1')
    }
    if (!this.hasCapability('switch_2')){
        this.addCapability('switch_2')
    }
    if (!this.hasCapability('dimmer_switch_1')){
        this.addCapability('dimmer_switch_1')
    }
    if (!this.hasCapability('dimmer_switch_2')){
        this.addCapability('dimmer_switch_2')
    }
    
    //this.registerMultiChannelReportListener(0, )
    this.registerCapability('switch_1', 'SWITCH_MULTILEVEL', { multiChannelNodeId: 0 })
    this.registerCapability('switch_2', 'SWITCH_MULTILEVEL', { multiChannelNodeId: 1 })
    this.registerCapability('dimmer_switch_1', 'SWITCH_MULTILEVEL', { multiChannelNodeId: 0 })  
    this.registerCapability('dimmer_switch_2', 'SWITCH_MULTILEVEL', { multiChannelNodeId: 1 })  
         
    
  } 

} 

module.exports = d088_zv_Device