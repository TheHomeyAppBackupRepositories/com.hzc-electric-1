'use strict'

const { ZigBeeLightDevice } = require("homey-zigbeedriver");
const { CLUSTER, TimeCluster } = require("zigbee-clusters");

class HzcDimmerSwitch2GangZigBeeDevice extends ZigBeeLightDevice {

  async onNodeInit ({
    zclNode, supportsHueAndSaturation, supportsColorTemperature,
  }) {
    super.onNodeInit(
      { zclNode, supportsHueAndSaturation, supportsColorTemperature })
     
  } 
 

  async registerDimSwitchOnoff(endpoint){

    if (this.hasCapability('switch_'+endpoint)){
      this.registerCapability("switch_"+endpoint, CLUSTER.ON_OFF, {
        set: value => (value ? 'setOn' : 'setOff'),
        setParser: function(setValue) {
          return setValue ? 'setOn' : 'setOff'; // This could also be an object for more complex 
        },
        get: 'onOff',
        report: 'onOff',
        endpoint: endpoint,
        reportParser: function(value){
          this.log('++=================================== onoff '+endpoint+' = ', value)
          return value;
        }, 
      }); 
    }

    if (this.hasCapability('dimmer_switch_'+endpoint)){
      this.registerCapability('dimmer_switch_'+endpoint, CLUSTER.LEVEL_CONTROL, {
        get: 'currentLevel', report: 'currentLevel', reportParser: async value => {

          this.log(`+++++++++ currentLevel report `, value) 
 
          let newValue = parseFloat((value / 0xFE * 100).toFixed(2)) 
          return newValue 
  
        }, getOpts: {
          getOnStart: true, 
          pollInterval: 60*60*1000,  
          getOnOnline: true,
        },
        endpoint:endpoint,
        reportOpts: {
          configureAttributeReporting: {
            minInterval: 0,  
            maxInterval: 600,  
            minChange: 5,
          },
        }, 
      }); 

      this.registerCapabilityListener('dimmer_switch_'+endpoint, async value => { 
        
        let level = (value * 254 / 100).toFixed(2)

        this.log(`========== dimmer_switch  set `, value, level)    

        const moveToLevelWithOnOffCommand = {
          level: level, 
          transitionTime: 0xFFFF,
        }; 
        this.debug('changeDimLevel() → ', value, moveToLevelWithOnOffCommand);
        return this.zclNode.endpoints[endpoint].clusters[CLUSTER.LEVEL_CONTROL.NAME] 
          .moveToLevelWithOnOff(moveToLevelWithOnOffCommand)
          .then(async result => { 
            if (this.hasCapability('switch_'+endpoint)){
              if (value === 0) {
                await this.setCapabilityValue('switch_'+endpoint, false);
              } else if (this.getCapabilityValue('switch_'+endpoint) === false && value > 0) {
                await this.setCapabilityValue('switch_'+endpoint, true);
              }
            }  
            return result;
          });
      })  

    }

    if (this.hasCapability('onoff_'+endpoint)){
      this.registerCapability("onoff_"+endpoint, CLUSTER.ON_OFF, {
        set: value => (value ? 'setOn' : 'setOff'),
        setParser: function(setValue) {
          return setValue ? 'setOn' : 'setOff';
        },
        get: 'onOff',
        report: 'onOff',
        endpoint: endpoint,
        reportParser: function(value){
          this.log('++onoff '+endpoint+' = ', value)
          return value;
        }, 
      }); 
    }

    if (this.hasCapability('onoff') && endpoint === 1){
      this.registerCapability("onoff", CLUSTER.ON_OFF, {
        set: value => (value ? 'setOn' : 'setOff'),
        setParser: function(setValue) {
          return setValue ? 'setOn' : 'setOff';
        },
        get: 'onOff',
        report: 'onOff',
        endpoint: endpoint,
        reportParser: function(value){
          this.log('++++++++++++++++onoff 1 = ', value)
          return value;
        }, 
      }); 
    }

    if (this.hasCapability('dim') && endpoint === 1) {
      this.registerCapability("dim", CLUSTER.LEVEL_CONTROL); 
    }
    
  }

  

  async registerMeterPowerMeasurePower(endpoint) {
 
    //=========================================================================
    //=========================================================================
    //  meter_power 

    if (this.hasCapability('meter_power_'+endpoint)) { 
      const {
        multiplier,
        divisor,
      } = await this.zclNode.endpoints[endpoint].clusters[CLUSTER.METERING.NAME].readAttributes(
        'multiplier', 'divisor').catch(this.error)
      let meterFactory = 1.0 / 3600000
      if (multiplier > 0 && divisor > 0) {
        meterFactory = multiplier / divisor
      } 

      this.registerCapability('meter_power_'+endpoint, CLUSTER.METERING, { 
        getParser: value => value * meterFactory,
        get: 'currentSummationDelivered',
        report: 'currentSummationDelivered',  
        reportParser: function(value){
          this.log('++report: meter_power_'+endpoint, value, meterFactory)
          return value * meterFactory;
        }, 
        endpoint:endpoint,
        getOpts: {
          getOnStart: true 
        } 
      })
    }
    if (this.hasCapability('meter_power') && endpoint === 1) {
      const {
        multiplier,
        divisor,
      } = await this.zclNode.endpoints[endpoint].clusters[CLUSTER.METERING.NAME].readAttributes(
        'multiplier', 'divisor').catch(this.error)
      let meterFactory = 1.0 / 3600000
      if (multiplier > 0 && divisor > 0) {
        meterFactory = multiplier / divisor
      }

      this.registerCapability('meter_power', CLUSTER.METERING, {
        get: 'currentSummationDelivered',
        report: 'currentSummationDelivered',  
        reportParser: function(value){
          this.log('++report: meter_power_'+endpoint, value, meterFactory)
          return value * meterFactory;
        }, 
        getParser: value => value * meterFactory,
        endpoint:endpoint,
        getOpts: {
          getOnStart: true 
        } 
      })
    }
    


    //=========================================================================
    //=========================================================================
    // measure_power  

    if (this.hasCapability('measure_power_'+endpoint)) { 
      const {
        acPowerMultiplier,
        acPowerDivisor,
      } = await this.zclNode.endpoints[endpoint].clusters[CLUSTER.ELECTRICAL_MEASUREMENT.NAME].readAttributes(
        'acPowerMultiplier', 'acPowerDivisor').catch(this.error)
      // this.log('acPowerMultiplier ' + acPowerMultiplier + ", acPowerDivisor " + acPowerDivisor)
      let measureFactory = 0.1
      if (acPowerMultiplier > 0 && acPowerDivisor > 0) {
        measureFactory = acPowerMultiplier / acPowerDivisor
      }

      this.registerCapability('measure_power_'+endpoint, CLUSTER.ELECTRICAL_MEASUREMENT, {
        get: 'activePower',
        report: 'activePower',
        reportParser: value => { 
          this.log('========report: measure_power_'+endpoint, value, measureFactory)
          return value * measureFactory
        },
        getParser: value => value * measureFactory,
        getOpts: {
          getOnStart: true 
        },
        endpoint:endpoint
      })
    }

    if (this.hasCapability('measure_power') && endpoint === 1) { 
      const {
        acPowerMultiplier,
        acPowerDivisor,
      } = await this.zclNode.endpoints[endpoint].clusters[CLUSTER.ELECTRICAL_MEASUREMENT.NAME].readAttributes(
        'acPowerMultiplier', 'acPowerDivisor').catch(this.error)
      // this.log('acPowerMultiplier ' + acPowerMultiplier + ", acPowerDivisor " + acPowerDivisor)
      let measureFactory = 0.1
      if (acPowerMultiplier > 0 && acPowerDivisor > 0) {
        measureFactory = acPowerMultiplier / acPowerDivisor
      }

      this.registerCapability('measure_power', CLUSTER.ELECTRICAL_MEASUREMENT, {
        get: 'activePower',
        report: 'activePower',
        reportParser: value => {  
          this.log('========report: measure_power_'+endpoint, value, measureFactory)
          return value * measureFactory
        },
        getParser: value => value * measureFactory,
        getOpts: {
          getOnStart: true 
        },
        endpoint:endpoint
      }) 

    }


  }
 
  registerDeviceTemperatureAlarm(){
    if (this.hasCapability('device_temperature_alarm')){ 

      this.registerCapability('device_temperature_alarm', CLUSTER.DEVICE_TEMPERATURE, {
        get: 'deviceTempAlarmMask',
        report: 'deviceTempAlarmMask',
        reportParser: value => { 
          this.log(`deviceTempAlarmMask `, value) 
          const res = value.getBits()
          if (res.length > 0){
            return res[0] 
          } 
          return 'Temperature Normal'
        },
        getOpts: {
          getOnStart: true, pollInterval: 60*60*1000, getOnOnline: true
        },
        reportOpts: {
          configureAttributeReporting: {
            minInterval: 10,  
            maxInterval: 60000,  
            minChange: 0.5,
          },
        },
      }) 

    }
  }

  registerAlarm(){
    if (this.hasCapability('alarm_contact')){ 

      this.registerCapability('alarm_contact', CLUSTER.ELECTRICAL_MEASUREMENT, {
        get: 'acAlarmsMask',
        report: 'acAlarmsMask',
        reportParser: value => { 
          this.log(`acAlarmsMask `, value) 
          const res = value.getBits()
          if (res.length > 0){
            return true 
          } 
          return false
        },
        getOpts: {
          getOnStart: true, pollInterval: 60*60*1000, getOnOnline: true
        },
        reportOpts: {
          configureAttributeReporting: {
            minInterval: 10,  
            maxInterval: 60000,  
            minChange: 0.5,
          },
        },
      }) 

    }

  }
}

module.exports = HzcDimmerSwitch2GangZigBeeDevice;