'use strict'

const { BoundCluster } = require('zigbee-clusters')

class HzcTimeBoundCluster extends BoundCluster {

  constructor ({
    onGetTimeConfigNotification, 
    setTimeConfig,
    endpoint,
  }) {
    super()
    this._onGetTimeConfigNotification = onGetTimeConfigNotification 
    this._setTimeConfig = setTimeConfig
    this._endpoint = endpoint
  } 

  getTimeConfigNotification (payload) {
    this.log(`getTimeConfigNotification in bound cluster`)
    if (typeof this._onGetTimeConfigNotification === 'function') {
      this._onGetTimeConfigNotification(payload)
    }
  }

}

module.exports = HzcTimeBoundCluster
