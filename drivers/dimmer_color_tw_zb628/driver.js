'use strict';

const { ZigBeeDriver } = require('homey-zigbeedriver');

class dimmer_rbzb extends ZigBeeDriver {
    async onInit() {
        this.log('dimmer_rbzb has been initialized');
      } 
}

module.exports = dimmer_rbzb;