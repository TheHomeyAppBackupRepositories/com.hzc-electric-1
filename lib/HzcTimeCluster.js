'use strict'

const { Cluster, TimeCluster, ZCLDataTypes, ZCLDataType, zclTypes } = require(
  'zigbee-clusters')

const utcDataType = new ZCLDataType(226 , 'UTC', 4, intToBuf, intFromBuf)

function intToBuf(buf, v, i) {
  return buf.writeIntLE(v, i, this.length) - i;
}

function intFromBuf(buf, i) {
  if (buf.length - i < this.length) return 0;
  return buf.readIntLE(i, this.length);
}

const ATTRIBUTES = {
  time: { id: 0x0000, type: utcDataType }, 
  timezone: { id: 0x0002, type: ZCLDataTypes.uint32 },
  localTime: { id: 0x0007, type: ZCLDataTypes.uint32 }, 
}

const COMMANDS = {

  getTimeConfigNotification : {
    id: 0x01,
    args:{
      time: ZCLDataTypes.uint32
    }
  },
 
  setTimeConfig: {
    id: 0x02,
    args:{
      time: ZCLDataTypes.uint32
    }
  },
}

class HzcTimeCluster extends TimeCluster {

  static get ATTRIBUTES () {
    return ATTRIBUTES
  }

  static get COMMANDS () {
    return COMMANDS
  }

}

module.exports = HzcTimeCluster
