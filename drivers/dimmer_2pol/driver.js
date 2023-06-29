'use strict';

const { Driver } = require('homey');  
const ZHC_Dimmer_2pol = require('./device');
  
class Dimmer2polDriver extends Driver {
  /**
   * onInit is called when the driver is initialized.
   */
  async onInit() {
    this.log('Dimmer2polDriver has been initialized');
 
  } 

  onMapDeviceClass2( device ) {
    if( device.hasCapability('dim') ) {
      return ZHC_Dimmer_2pol;
    } else {
      return ZHC_Dimmer_2pol;
    }
  }
   
}

module.exports = Dimmer2polDriver;