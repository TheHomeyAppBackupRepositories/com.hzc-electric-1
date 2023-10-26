'use strict';

const { Driver } = require('homey');  

  
class thermostat_t5_zg_Driver extends Driver {
 
  async onInit() {
    this.log('@@@thermostat_t5_zg_Driver has been initialized');
 
  } 

  async ready(){
    this.log('@@@thermostat_t5_zg_Driver.ready')
  } 
  
}

module.exports = thermostat_t5_zg_Driver;