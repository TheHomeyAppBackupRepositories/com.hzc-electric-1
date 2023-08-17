'use strict'

const { CLUSTER, Cluster } = require('zigbee-clusters')
const { ZigBeeDevice } = require("homey-zigbeedriver");
const destructConstProps = function({
  ID, NAME, ATTRIBUTES, COMMANDS,
}) {
  return Object.freeze({
    ID, NAME, ATTRIBUTES, COMMANDS,
  });
}   


const HzcTempertureMeasurementCluster = require('../../lib/HzcTempertureMeasurementCluster')   
Cluster.addCluster(HzcTempertureMeasurementCluster)  
CLUSTER['TEMPERATURE_MEASUREMENT'] = destructConstProps(HzcTempertureMeasurementCluster)  
//CLUSTER.TEMPERATURE_MEASUREMENT = destructConstProps(HzcTempertureMeasurementCluster)

const HzcSwitch2GangZigBeeDevice = require('../../lib/HzcSwitch2GangZigBeeDevice') 

class s730_zg_Device extends HzcSwitch2GangZigBeeDevice {

  async onNodeInit ({ zclNode, node }) {
    super.onNodeInit({ zclNode: zclNode, node: node })   


    //this.printNode()
    //this.enableDebug()
    
    await this.addCapability('onoff'); 
    await this.addCapability('meter_power'); 
    await this.addCapability('measure_power');
    //await this.addCapability('s726_zg_voltage_overload_alarm')  
    //await this.addCapability('s726_zg_current_overload_alarm')
    //await this.addCapability('alarm_contact')

    await this.addCapability('rms_voltage')
    await this.addCapability('rms_current')

    await this.addCapability('ac_alarm')
    await this.addCapability('device_temperature_alarm')
     
    //Temp measurement 
    await this.addCapability('hzc_tm_measured_value_1')
    await this.addCapability('hzc_tm_measured_value_2')
    //await this.addCapability('hzc_tm_resistance_value_1')
    //await this.addCapability('hzc_tm_resistance_value_2')

    if (this.hasCapability('hzc_tm_resistance_value_1')) await this.removeCapability('hzc_tm_resistance_value_1')
    if (this.hasCapability('hzc_tm_resistance_value_2')) await this.removeCapability('hzc_tm_resistance_value_2')


    //await this.addCapability('hzc_tm_water_sensor_value') 
    if (this.hasCapability('hzc_tm_water_sensor_value')) {
      await this.removeCapability('hzc_tm_water_sensor_value')
    }
    if (!this.hasCapability('hzc_tm_water_sensor_alarm')){
      await this.addCapability('hzc_tm_water_sensor_alarm')
    } 
    

    //init settings

    this.temperatureMeasurementCluster().on('attr.resistanceValue1', async value => {
      this.log('==========report resistanceValue1: ', value)
      this.setSettings({ resistance_value_1: ''+value })
    })

    this.temperatureMeasurementCluster().on('attr.resistanceValue2', async value => {
      this.log('==========report resistanceValue2: ', value)
      this.setSettings({ resistance_value_2: ''+value })
    })
 
    
    this.app_inited = false
    this.params = {}
    
    this._app_register()

    //init app
    this._init_app()  
  }

  async _app_register(){

    //register
    await this.registerSwitchOnoff(1)
    await this.registerMeterPowerMeasurePower(1)

    await this.registerRmsVoltage(1)
    await this.registerRmsCurrent(1)

    //this.registerAlarm()
    this.registerAcAlarm()
    this.registerDeviceTemperatureAlarm() 

    this._setupTemperatureMeasurement() 
  } 

  temperatureMeasurementCluster() { return this.zclNode.endpoints[1].clusters.temperatureMeasurement }

  _setupTemperatureMeasurement() {
     
      if (this.hasCapability('hzc_tm_water_sensor_value')){ 
  
        this.registerCapability('hzc_tm_water_sensor_value', CLUSTER.TEMPERATURE_MEASUREMENT, {
          get: 'waterSensorValue',
          report: 'waterSensorValue',
          reportParser: value => { 
            this.log(`waterSensorValue `, value)  
            const res = value.getBits()
            if (res.length > 0){
              return res[0] 
            } 
            return 'Normal'
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

      //Water alarm
      if (this.hasCapability('hzc_tm_water_sensor_alarm')){
        this.registerCapability('hzc_tm_water_sensor_alarm', CLUSTER.TEMPERATURE_MEASUREMENT, {
          get: 'waterSensorValue',
          report: 'waterSensorValue',
          reportParser: value => { 
            this.log(`waterSensorValue `, value)  
            return value
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

      if (this.hasCapability('hzc_tm_measured_value_1')){

        this.registerCapability('hzc_tm_measured_value_1', CLUSTER.TEMPERATURE_MEASUREMENT, {
          get: 'measuredValue',
          report: 'measuredValue',
          reportParser: value => { 
            this.log(`measuredValue 1 = `, value) 
            return value / 10
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
      
      if (this.hasCapability('hzc_tm_measured_value_2')){
        
        this.registerCapability('hzc_tm_measured_value_2', CLUSTER.TEMPERATURE_MEASUREMENT, {
          get: 'measuredValue2',
          report: 'measuredValue2',
          reportParser: value => { 
            this.log(`measuredValue 2 = `, value) 
            if (value === 32768 || value === -32768){
              //return 0
            }
            return value / 10
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

      if (this.hasCapability('hzc_tm_resistance_value_1')){
        
        this.registerCapability('hzc_tm_resistance_value_1', CLUSTER.TEMPERATURE_MEASUREMENT, {
          get: 'resistanceValue1',
          report: 'resistanceValue1',
          reportParser: value => { 
            this.log(`resistanceValue 1 = `, value) 
            return value
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

      if (this.hasCapability('hzc_tm_resistance_value_2')){
        
        this.registerCapability('hzc_tm_resistance_value_2', CLUSTER.TEMPERATURE_MEASUREMENT, {
          get: 'resistanceValue2',
          report: 'resistanceValue2',
          reportParser: value => { 
            this.log(`resistanceValue 2 = `, value) 
            return value
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

  async registerSwitchOnoff1(endpoint){

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
          this.log('+++++++++++++++++onoff ', setValue)
          if (!setValue) {
            if (this.hasCapability('measure_power')){
              this.setCapabilityValue('measure_power', 0).catch(this.error) 
            }
            if (this.hasCapability('rms_voltage')){
              this.setCapabilityValue('rms_voltage', "0.00").catch(this.error) 
            } 
            if (this.hasCapability('rms_current')){
              this.setCapabilityValue('rms_current', "0.00").catch(this.error) 
            } 
     
          }
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
    
  }

  async registerMeterPowerMeasurePower1(endpoint) {
     
 
    //=========================================================================
    //=========================================================================
    //  meter_power 

    this.meter_power_meterFactory = 1.0 / 3600000 

    if (this.hasCapability('meter_power_'+endpoint)) { 
      let meterFactory = 1.0 / 3600000 
      try {
        const {
          multiplier,
          divisor,
        } = await this.zclNode.endpoints[endpoint].clusters[CLUSTER.METERING.NAME].readAttributes(
          'multiplier', 'divisor')
        
        if (multiplier != undefined && divisor != undefined &&
           multiplier > 0 && divisor > 0) {
          meterFactory = multiplier / divisor
        }  
      } catch (error) {
        this.log('------------read meter_power params: ', error)
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

      let meterFactory = 1.0 / 3600000
      try {
        const {
          multiplier,
          divisor,
        } = await this.zclNode.endpoints[endpoint].clusters[CLUSTER.METERING.NAME].readAttributes(
          'multiplier', 'divisor')
        
        if (multiplier > 0 && divisor > 0) {
          meterFactory = multiplier / divisor
        }
      }catch(e1) {
        this.log(e1)
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
      let measureFactory = 0.1
      try {
        const {
          acPowerMultiplier,
          acPowerDivisor,
        } = await this.zclNode.endpoints[endpoint].clusters[CLUSTER.ELECTRICAL_MEASUREMENT.NAME].readAttributes(
          'acPowerMultiplier', 'acPowerDivisor')
        
        if (acPowerMultiplier != undefined && acPowerDivisor != undefined &&
          acPowerMultiplier > 0 && acPowerDivisor > 0) {
          measureFactory = acPowerMultiplier / acPowerDivisor
        }
      } catch (error) {
        this.log('-----------------read measure_power params: ', error)
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
      let measureFactory = 0.1
      try{
        const {
          acPowerMultiplier,
          acPowerDivisor,
        } = await this.zclNode.endpoints[endpoint].clusters[CLUSTER.ELECTRICAL_MEASUREMENT.NAME].readAttributes(
          'acPowerMultiplier', 'acPowerDivisor')
       
        if (acPowerMultiplier != undefined && acPowerDivisor != undefined && 
          acPowerMultiplier > 0 && acPowerDivisor > 0) {
          measureFactory = acPowerMultiplier / acPowerDivisor
        }
      }
      catch(err){
        this.log('---------read measure_power param: ', err)
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
 
  registerDeviceTemperatureAlarm1(){
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
          return '-'
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

  registerAcAlarm1(){
    if (this.hasCapability('ac_alarm')){ 

      this.registerCapability('ac_alarm', CLUSTER.ELECTRICAL_MEASUREMENT, {
        get: 'acAlarmsMask',
        report: 'acAlarmsMask',
        reportParser: value => { 
          this.log(`acAlarmsMask `, value) 
          const res = value.getBits()
          if (res.length > 0){
            return res[0] 
          } 
          return 'No'
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

  registerAlarm1(){
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

  async registerRmsVoltage1(endpoint){
     
    if (this.hasCapability('rms_voltage') && endpoint === 1){ 
      let measureFactory = 0.1
      try {
        const {
          acVoltageMultiplier,
          acVoltageDivisor,
        } = await this.zclNode.endpoints[endpoint].clusters[CLUSTER.ELECTRICAL_MEASUREMENT.NAME].readAttributes(
          'acVoltageMultiplier', 'acVoltageDivisor')
        
        if (acVoltageMultiplier != undefined && acVoltageDivisor != undefined && 
          acVoltageMultiplier > 0 && acVoltageDivisor > 0) {
          measureFactory = acVoltageMultiplier / acVoltageDivisor
        }
      } catch (error) {
        this.log('-----------read rms_voltage param: ', error)
      }
      

      this.registerCapability('rms_voltage', CLUSTER.ELECTRICAL_MEASUREMENT, {
        get: 'rmsVoltage',
        report: 'rmsVoltage',
        reportParser: value => {  
          this.log('========report: rmsVoltage-'+endpoint, value, measureFactory)
          return (value * measureFactory).toFixed(1)
        },
        getParser: value => ( value * measureFactory ).toFixed(1),
        getOpts: {
          getOnStart: true 
        },
        endpoint:endpoint
      }) 
    }

    if (this.hasCapability('rms_voltage_'+endpoint)){
      let measureFactory = 0.1
      try { 
        const {
          acVoltageMultiplier,
          acVoltageDivisor,
        } = await this.zclNode.endpoints[endpoint].clusters[CLUSTER.ELECTRICAL_MEASUREMENT.NAME].readAttributes(
          'acVoltageMultiplier', 'acVoltageDivisor')
        
        if (acVoltageMultiplier != undefined && acVoltageDivisor != undefined &&
           acVoltageMultiplier > 0 && acVoltageDivisor > 0) {
          measureFactory = acVoltageMultiplier / acVoltageDivisor
        }
      } catch (error) {
        this.log('---------read rms_voltage params : ', error)
      }
      

      this.registerCapability('rms_voltage_'+endpoint, CLUSTER.ELECTRICAL_MEASUREMENT, {
        get: 'rmsVoltage',
        report: 'rmsVoltage',
        reportParser: value => {  
          this.log('========report: rmsVoltage-'+endpoint, value, measureFactory)
          return (value * measureFactory).toFixed(1)
        },
        getParser: value =>   ( value * measureFactory ).toFixed(1),
        getOpts: {
          getOnStart: true 
        },
        endpoint:endpoint
      }) 
    }  
       
  }

  async registerRmsCurrent1(endpoint){
     
    if (this.hasCapability('rms_current') && endpoint === 1){ 
      let measureFactory = 1 / 1000
      try {
        const {
          acCurrentMultiplier,
          acCurrentDivisor,
        } = await this.zclNode.endpoints[endpoint].clusters[CLUSTER.ELECTRICAL_MEASUREMENT.NAME].readAttributes(
          'acCurrentMultiplier', 'acCurrentDivisor')
        
        if (acCurrentMultiplier != undefined && acCurrentDivisor != undefined &&
           acCurrentMultiplier > 0 && acCurrentDivisor > 0) {
          measureFactory = acCurrentMultiplier / acCurrentDivisor
        }
      } catch (error) {
        this.log('-------------read rms_current params: ', error)
      }
      

      this.registerCapability('rms_current', CLUSTER.ELECTRICAL_MEASUREMENT, {
        get: 'rmsCurrent',
        report: 'rmsCurrent',
        reportParser: value => {  
          this.log('========report: rms_current-'+endpoint, value, measureFactory)
          return  (value * measureFactory).toFixed(2)
        },
        getParser: value => ( value * measureFactory ).toFixed(2),
        getOpts: {
          getOnStart: true 
        },
        endpoint:endpoint
      }) 
    }

    if (this.hasCapability('rms_current_'+endpoint)){
      let measureFactory = 1 / 1000
      try {
        const {
          acCurrentMultiplier,
          acCurrentDivisor,
        } = await this.zclNode.endpoints[endpoint].clusters[CLUSTER.ELECTRICAL_MEASUREMENT.NAME].readAttributes(
          'acCurrentMultiplier', 'acCurrentDivisor')
        
        if (acCurrentMultiplier > 0 && acCurrentDivisor > 0) {
          measureFactory = acCurrentMultiplier / acCurrentDivisor
        }
      } catch (error) {
        this.log('--------------read rms_current params: ', error)
      }
      

      this.registerCapability('rms_current_'+endpoint, CLUSTER.ELECTRICAL_MEASUREMENT, {
        get: 'rmsCurrent',
        report: 'rmsCurrent',
        reportParser: value => {  
          this.log('========report: rms_current-'+endpoint, value, measureFactory)
          return  (value * measureFactory).toFixed(2)
        },
        getParser: value =>  ( value * measureFactory ).toFixed(2),
        getOpts: {
          getOnStart: true 
        },
        endpoint:endpoint
      }) 
    }  
       
  }
  

  onDeleted(){
		this.log("s730_zg_Device, channel ", " removed")
	} 


  async onSettings({ oldSettings, newSettings, changedKeys }) { 
    this._setDeviceSettings(newSettings, changedKeys); 
  } 

  async _setDeviceSettings (newSettings, changedKeys) {
    
    this.log('+++++ settings ： ', newSettings, changedKeys);

    changedKeys.forEach(element => { 

      if (element === 'resistance_value_1'){
        this.temperatureMeasurementCluster().writeAttributes({ resistanceValue1 : newSettings[element] }).catch(this.error)
      } 

      else if (element === 'resistance_value_2'){
        this.temperatureMeasurementCluster().writeAttributes({ resistanceValue2 : newSettings[element] }).catch(this.error)
      } 

      else if (element === 'water_alarm_relay_action'){
        this.temperatureMeasurementCluster().writeAttributes({ waterAlarmRelayAction : newSettings[element] }).catch(this.error)
      }


      else if (element === 'ntcOperationSelect'){
        this.temperatureMeasurementCluster().writeAttributes({ ntcOperationSelect : newSettings[element] }).catch(this.error)
      }

      else if (element === 'nctMin') {
        this.temperatureMeasurementCluster().writeAttributes({ nctMin : 10 * newSettings[element] }).catch(this.error)
      }

      else if (element === 'nctMax') {
        this.temperatureMeasurementCluster().writeAttributes({ nctMax : 10 * newSettings[element] }).catch(this.error)
      }

      else if (element === 'NTCCalibration1'){
        this.temperatureMeasurementCluster().writeAttributes({ NTCCalibration1 : 10 * newSettings[element] }).catch(this.error)
      }

      else if (element === 'NTCCalibration2'){
        this.temperatureMeasurementCluster().writeAttributes({ NTCCalibration2 : 10 * newSettings[element] }).catch(this.error)
      }

    }) 

  }




  ///====================================================================================================
  ///====================================================================================================
  ///====================================================================================================


  /**
   * 系统启动，初始化参数
   */
  async _init_app() {

    if (this.params === undefined) {
      this.params = {}
    } 

    if (this.app_inited === undefined){
      this.app_inited = false
    }

    this.log('-------app inited start: ', this.params)
    let inited = true

    await this.unsetWarning();
    
    if (this.hasCapability('meter_power') || this.hasCapability('meter_power_1')){ 
                let meterFactory = 1.0 / 3600000
                try {
                  const {
                    multiplier,
                    divisor,
                  } = await this.zclNode.endpoints[1].clusters[CLUSTER.METERING.NAME].readAttributes(
                    'multiplier', 'divisor')
                  
                  if (multiplier != undefined && divisor != undefined &&
                    multiplier > 0 && divisor > 0) {
                    meterFactory = multiplier / divisor
                    this.params.meter_power = { multiplier : meterFactory, updated : true } 
                  }
                } catch (error) {
                  this.log('------------read meter power params: ', error)
                  this.tipinfo = "Error: Device is not responding, make sure the device has power."
                  inited = false
                } 
    }

    if (this.hasCapability('measure_power') || this.hasCapability('measure_power_1')){  
            let measureFactory = 0.1
            try {
              const {
                acPowerMultiplier,
                acPowerDivisor,
              } = await this.zclNode.endpoints[1].clusters[CLUSTER.ELECTRICAL_MEASUREMENT.NAME].readAttributes(
                'acPowerMultiplier', 'acPowerDivisor') 
              
              if (acPowerMultiplier != undefined && acPowerDivisor != undefined &&
                acPowerMultiplier > 0 && acPowerDivisor > 0) {
                measureFactory = acPowerMultiplier / acPowerDivisor
                this.params.measure_power = { multiplier : measureFactory, updated : true } 
              }
            } catch (error) {
              this.log('------------read measure_power params: ', error)
              this.tipinfo = "Error: Device is not responding, make sure the device has power."
              inited = false
            } 
    }

    if (this.hasCapability('rms_voltage') || this.hasCapability('rms_voltage_1')){ 
          
              let measureFactory = 0.1
              try {
                const {
                  acVoltageMultiplier,
                  acVoltageDivisor,
                } = await this.zclNode.endpoints[1].clusters[CLUSTER.ELECTRICAL_MEASUREMENT.NAME].readAttributes(
                  'acVoltageMultiplier', 'acVoltageDivisor')
                
                if (acVoltageMultiplier > 0 && acVoltageDivisor > 0) {
                  measureFactory = acVoltageMultiplier / acVoltageDivisor
                  this.params.rms_voltage = { multiplier : measureFactory, updated : true }
                }  
              } catch (error) {
                this.log('xxxxxx read rms_voltage params : ', error)
                this.tipinfo = "Error: Device is not responding, make sure the device has power."
                inited = false
              }

    }

    if (this.hasCapability('rms_current') || this.hasCapability('rms_current_1')){ 
        
                let measureFactory = 1 / 1000
                try {
                  const {
                    acCurrentMultiplier,
                    acCurrentDivisor,
                  } = await this.zclNode.endpoints[1].clusters[CLUSTER.ELECTRICAL_MEASUREMENT.NAME].readAttributes(
                    'acCurrentMultiplier', 'acCurrentDivisor')
                  
                  if (acCurrentMultiplier > 0 && acCurrentDivisor > 0) {
                    measureFactory = acCurrentMultiplier / acCurrentDivisor
                    this.params.rms_current = { multiplier : measureFactory, updated : true } 
                  }
                } catch (error) {
                  this.log('xxxxxxx read rms current params: ', error)
                  inited = false
                  this.tipinfo = "Error: Device is not responding, make sure the device has power."
                }
          
    }


    try {
      let resistanceValue = await this.temperatureMeasurementCluster().readAttributes(
        "resistanceValue1", "resistanceValue2", "measuredValue", "measuredValue2",
        "waterAlarmRelayAction", "ntcOperationSelect", "nctMin", "nctMax", "NTCCalibration1", "NTCCalibration2")
      if (resistanceValue != undefined) {
        this.log('==========read temperatureMeasurementCluster =', resistanceValue)

        if (resistanceValue.hasOwnProperty('measuredValue')){
          if (this.hasCapability("hzc_tm_measured_value_1")){
            let measuredValue = resistanceValue['measuredValue'] / 10
            this.setCapabilityValue('hzc_tm_measured_value_1', measuredValue)
          }
        }

        if (resistanceValue.hasOwnProperty('measuredValue2')){
          if (this.hasCapability("hzc_tm_measured_value_2")){
            let measuredValue = resistanceValue['measuredValue2'] / 10
            this.setCapabilityValue('hzc_tm_measured_value_2', measuredValue)
          }
        }


        if (resistanceValue.hasOwnProperty('resistanceValue1')){
          this.setSettings({ resistance_value_1 : ''+resistanceValue['resistanceValue1'] })
        }
        if (resistanceValue.hasOwnProperty('resistanceValue2')){
          this.setSettings({ resistance_value_2 : ''+resistanceValue['resistanceValue2']  })
        }

        if (resistanceValue.hasOwnProperty('waterAlarmRelayAction')){
          this.setSettings({ water_alarm_relay_action: ''+resistanceValue['waterAlarmRelayAction'] })
        }
        if (resistanceValue.hasOwnProperty('ntcOperationSelect')){
          this.setSettings({ ntcOperationSelect: ''+resistanceValue['ntcOperationSelect'] })
        }
        if (resistanceValue.hasOwnProperty('nctMin')){
          this.setSettings({ nctMin: resistanceValue['nctMin'] / 10 })
        }
        if (resistanceValue.hasOwnProperty('nctMax')){
          this.setSettings({ nctMax: resistanceValue['nctMax'] / 10 })
        }
        if (resistanceValue.hasOwnProperty("NTCCalibration1")){
          this.setSettings({ NTCCalibration1: resistanceValue['NTCCalibration1'] / 10 })
        }
        if (resistanceValue.hasOwnProperty("NTCCalibration2")){
          this.setSettings({ NTCCalibration2: resistanceValue['NTCCalibration2'] / 10 })
        }
      }

    } catch (error) {
        this.log('-----read temperatureMeasurementCluster ', error)
        inited = false
        this.tipinfo = "Error: Device is not responding, make sure the device has power."
    } 



    if (inited === false){  

      this.homey.setTimeout( () => {
            this._init_app()
      }, 10000)

      this.log('xxxxxxxxxx init :', this.tipinfo)
      await this.setWarning("Error: Device is not responding, make sure the device has power."); 
      return  
    }

    this.app_inited = true  
    this.log('-------app inited : ', this.params)
 
    this.homey.setTimeout( async () => {
      await this._timer_loop()
    }, 5000)  

  } //end of init app


  async _timer_loop() {
    if (!this.app_inited) return;
 
    try {
      let resistanceValue = await this.temperatureMeasurementCluster().readAttributes(
        "measuredValue", "measuredValue2", "waterSensorValue")
      if (resistanceValue != undefined) {
        this.log('==========read temperatureMeasurementCluster =', resistanceValue)

        if (resistanceValue.hasOwnProperty('measuredValue')){
          if (this.hasCapability("hzc_tm_measured_value_1")){
            let measuredValue = resistanceValue['measuredValue'] / 10
            this.setCapabilityValue('hzc_tm_measured_value_1', measuredValue)
          }
        }

        if (resistanceValue.hasOwnProperty('measuredValue2')){
          if (this.hasCapability("hzc_tm_measured_value_2")){
            let measuredValue = resistanceValue['measuredValue2'] / 10
            this.setCapabilityValue('hzc_tm_measured_value_2', measuredValue)
          }
        } 

        if (resistanceValue.hasOwnProperty('waterSensorValue')){
          if (this.hasCapability('hzc_tm_water_sensor_alarm')){
            this.setCapabilityValue('hzc_tm_water_sensor_alarm', resistanceValue['waterSensorValue']) 
          }
        }
         
      }

    } catch (error) {
        this.log('-----read temperatureMeasurementCluster ', error) 
    } 

    this.homey.setTimeout( async () => {
      await this._timer_loop()
    }, 5 * 60 * 1000) 

  }

}

module.exports = s730_zg_Device;