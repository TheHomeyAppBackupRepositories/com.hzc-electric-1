'use strict';
 
const { CLUSTER } = require("zigbee-clusters");
const HzcDimmerSwitch2GangZigBeeDevice = require('../../lib/HzcDimmerSwitch2GangZigBeeDevice')  

class DimmerSwitch_2Gang_ZB extends HzcDimmerSwitch2GangZigBeeDevice {
  async onNodeInit ({ zclNode }) { 
    super.onNodeInit({ zclNode, supportsHueAndSaturation: false, supportsColorTemperature: false })  

    //this.printNode();   
    await this.addCapability('switch_1');
    await this.addCapability('switch_2'); 
    await this.addCapability("dimmer_switch_1"); 
    await this.addCapability("dimmer_switch_2"); 

    await this.registerDimSwitchOnoff(1)
    await this.registerDimSwitchOnoff(2) 


    /*
    await this.addCapability('debug_info') 
    await this.addCapability('switch'); 
    this.registerCapabilityListener('switch', async value => { 
      this._getDebugInfo(value ? 1: 0) 
      return value  
    })
   */
 
  }

  _getDebugInfo(endpoint){
    this.zclNode.endpoints[endpoint].clusters.levelControl.readAttributes("minlevel", "maxlevel").then(value =>{
      this.log('++++++++++ min max level report ', value)
      let outinfo = "" + endpoint + " - "
      if (value.hasOwnProperty('minlevel')){
        outinfo = outinfo + value['minlevel'] 
      }
      if (value.hasOwnProperty('maxlevel')){
        outinfo = outinfo + ", " + value['maxlevel']
      }
      this.setCapabilityValue('debug_info', outinfo)
    })
  }

  onDeleted(){
		this.log("2 Gang DimmerSwitch, channel ", " removed")
	}



  async levelStepRunListener (args, state) {

    const payload = {
      mode: args.mode,
      stepSize: Math.round(args.step_size * 0xFE),
      transitionTime: args.transition_time * 10,
    }
    this.log(`levelStepRunListener => `, payload)
    return this.zclNode.endpoints[args.endpoint].clusters.levelControl.stepWithOnOff(payload).then(() => {
      this.onLevelControlEnd(args.endpoint).catch(this.error)
    }).catch(this.error)
  }

  async levelMoveRunListener (args, state) {

    const payload = {
      moveMode: args.move_mode,
      rate: Math.round(args.rate * 0xFE),
    }
    this.log(`levelMoveRunListener => `, payload)
    return this.zclNode.endpoints[args.endpoint].clusters.levelControl.moveWithOnOff(payload).catch(this.error)
  }

  async levelStopRunListener (args, state) {

    this.log(`levelStopRunListener => `)
    return this.zclNode.endpoints[args.endpoint].clusters.levelControl.stopWithOnOff().then(() => {
      this.onLevelControlEnd(args.endpoint).catch(this.error)
    }).catch(this.error)
  }

  async onLevelControlEnd (endpoint) {

    let levelControlCluster
    try {
      levelControlCluster = this.zclNode.endpoints[endpoint].clusters.levelControl
    } catch (err) {
      return
    }

    const {
      currentLevel,
    } = await levelControlCluster.readAttributes(
      'currentLevel',
    ).catch(this.error)

    this.log('onLevelControlEnd', {
      currentLevel,
    })

    //await this.setCapabilityValue('dim', currentLevel / 0xFE).catch(this.error)
    await this.setCapabilityValue('dimmer_switch_'+endpoint, currentLevel / 0xFE).catch(this.error)

    if (currentLevel === 0) {
      //await this.setCapabilityValue('onoff', false).catch(this.error)
      await this.setCapabilityValue('switch_'+endpoint, false).catch(this.error)
    //} else if (this.getCapabilityValue('onoff') === false && currentLevel > 0) {
    } else if (this.getCapabilityValue('switch_'+endpoint) === false && currentLevel > 0) {
      //await this.setCapabilityValue('onoff', true).catch(this.error)
      await this.setCapabilityValue('switch_'+endpoint, true).catch(this.error)
    }
  }

}

module.exports = DimmerSwitch_2Gang_ZB;