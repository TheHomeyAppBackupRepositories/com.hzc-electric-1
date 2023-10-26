'use strict' 

const { Cluster, ZCLDataTypes, zclTypes } = require(
  'zigbee-clusters') 

const ATTRIBUTES = {
  measuredValue: { id: 0, type: ZCLDataTypes.int16 },
  minMeasuredValue: { id: 1, type: ZCLDataTypes.int16 },
  maxMeasuredValue: { id: 2, type: ZCLDataTypes.int16 }, 
   
  measuredValue2: { id: 4, type: ZCLDataTypes.int16 },

  resistanceValue1:{
    id: 0x0005,
    type: ZCLDataTypes.enum8({
      r0: 0,
      r1: 1,
      r2: 2,
      r3: 3,
      r4: 4,
      r5: 5
    }),
  },

  resistanceValue2:{
    id: 0x0006,
    type: ZCLDataTypes.enum8({
      r0: 0,
      r1: 1,
      r2: 2,
      r3: 3,
      r4: 4,
      r5: 5
    })
  }, 

  waterSensorValue:{
    id: 0x0007,
    //type: ZCLDataTypes.map8('water alarm')
    type: ZCLDataTypes.bool
  },

  waterAlarmRelayAction: {
    id: 0x000A,
    type: ZCLDataTypes.enum8({
      noAction: 0,
      turnOffRelay: 1
    })
  },

  ntcOperationSelect:{
    id: 0x000B,
    type: ZCLDataTypes.enum8({
      unuse: 0,
      ntc1: 1,
      ntc2: 2
    })
  },
 
  nctMin: {
    id: 0x000C,
    type: ZCLDataTypes.int16
  },
 
  nctMax: {
    id: 0x000D,
    type: ZCLDataTypes.int16
  },

  NTCCalibration1:{
    id: 0x0008,
    type: ZCLDataTypes.int8
  },
  
  NTCCalibration2:{
    id: 0x0009,
    type: ZCLDataTypes.int8
  }
        
}
 
const COMMANDS = {};

class HzcTemperatureMeasurementCluster extends Cluster {

  static get ID() {
    return 1026; // 0x0402
  }

  static get NAME() {
    return 'temperatureMeasurement';
  }

  static get ATTRIBUTES() {
    return ATTRIBUTES;
  }

  static get COMMANDS() {
    return COMMANDS;
  }

}
 
Cluster.addCluster(HzcTemperatureMeasurementCluster);

module.exports = HzcTemperatureMeasurementCluster
