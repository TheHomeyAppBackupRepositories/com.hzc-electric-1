'use strict'

const { Cluster, ZCLDataTypes } = require(
  'zigbee-clusters')

const ATTRIBUTES = {
  onOff: {
    id: 0x0000,
    type: ZCLDataTypes.bool
    
    /*type: ZCLDataTypes.enum8({
      off: 0,
      on: 1
    }),*/
  }
}

const COMMANDS = {}

class HzcThermostatOnoffCluster extends Cluster {

  static get ID() {
    return 0x0006;
  }

  static get NAME() {
    return 'thermostatOnoff';
  }

  static get ATTRIBUTES () {
    return ATTRIBUTES
  }

  static get COMMANDS () {
    return COMMANDS
  }

}

module.exports = HzcThermostatOnoffCluster
