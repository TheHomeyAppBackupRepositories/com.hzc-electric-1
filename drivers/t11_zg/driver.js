'use strict';

const { Driver } = require('homey');  

  
class t11_zg_Driver extends Driver {
 
  async onInit() {
    this.log('@@@t11_zg_Driver has been initialized');
 
  } 

  async ready(){
    this.log('@@@t11_zg_Driver.ready')
  } 
  
}

module.exports = t11_zg_Driver;