'use strict'

const { BoundCluster } = require('zigbee-clusters')

class HzcThermostatBoundCluster extends BoundCluster {

  constructor ({
    onGetReportResponse,
    setEco,   
    endpoint,
  }) {
    super()
    this._onGetReportResponse = onGetReportResponse
    this._setEco = setEco 
    this._endpoint = endpoint
  }

  setEcoCommand(payload){
    this.log(' setEcoCommand in bound cluster')
    if (typeof this._setEco === 'function') {
      this._setEco(payload)
    }
  }

  getReportResponse (payload) {
    this.log(`getReportResponse in bound cluster`)
    if (typeof this._onGetReportResponse === 'function') {
      this._onGetReportResponse(payload)
    }
  }

}

module.exports = HzcThermostatBoundCluster
