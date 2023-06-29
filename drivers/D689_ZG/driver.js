'use strict';

const { ZigBeeDriver } = require('homey-zigbeedriver');

class dimmer_2pol_zb689 extends ZigBeeDriver {
    async onInit() {
        this.log('1402767 - 2 pol Dimmer(Zigbee) :  has been initialized');
      }
}

module.exports = dimmer_2pol_zb689;