'use strict';

const { sync } = require('git-branch');
const Homey = require('homey');  

const appkit = require('./lib/');
   
const { ZwaveDevice } = require('homey-zwavedriver'); 
 

class Dimmer2pol extends ZwaveDevice {
  
  appkits = {};

  async onNodeInit({ node }) { 
    
    this.disableDebug();
    //this.enableDebug();
    //this.printNode();   

    this.log('Dimmer2pol node init!');
    
    this.unsetWarning();

    

    appkit.switch.init(this, node); 

    appkit.meters.init(this, node).registerCapability(this).startReport(this);

    appkit.Configuration.init(this, this.node).startReport();

    appkit.configuration_param.init(998, this, this.node);

    this.registerCapabilityListener('button.reset_meter', async () => {
      // Maintenance action button was pressed
      this.meterReset();
      
    });

    this.registerCapabilityListener('button.calibrate', async () => {
      // Maintenance action button was pressed, return a promise
      
    });
    
    //settings
    await this.setSettings({

    });
    const settings = this.getSettings();
 
  };

  async onSettings({ oldSettings, newSettings, changedKeys }) {
    this.log(oldSettings, newSettings, changedKeys);

    this.saveSettings(newSettings, changedKeys);

  };
  
   
 
  async showMessage(msg){
    this.log('show message: ', msg);
    await this.setWarning(msg);
    this.unsetWarning();
  }

  async saveSettings(newSettings, changedKeys){

    //this.showMessage("set .....");

    changedKeys.forEach(element => {
      this.log("");this.log("");this.log("");
      this.log("-----------------------config:", element);

      let theElement = element;
      let theValue = newSettings[element];
      if (element.includes('configuration_param')){
        theElement = 'configuration_param';
      } 

      let o = appkit[theElement];
      if (o != undefined){
        if (o['setConfig']){
          //configuration_param_6
          o.setConfig(this, this.node, element, theValue);
        } 
      }
    }) 
  };

}

module.exports = Dimmer2pol;