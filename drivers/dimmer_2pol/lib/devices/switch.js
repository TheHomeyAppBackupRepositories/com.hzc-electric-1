const {
  returnCapabilityValue, 
  setupDevice 
}                               = require('./utils');

module.exports = {
    capability: 'switch',
    init:function(device, node){  
      this.registerCapability(device, node);
      return this;
    },
    switch_count:0,
    registerCapability:function(device, node){ 
      console.log('switch .....');
      //开关 
      device.registerCapability('onoff', 'SWITCH_MULTILEVEL');
      device.registerCapability('dim', 'SWITCH_MULTILEVEL');
      device.registerReportListener(
        'SWITCH_MULTILEVEL',
        'SWITCH_MULTILEVEL_REPORT',
        (payload) => {
          console.log('开关:SWITCH_MULTILEVEL_REPORT', payload);
          let curValue = payload['Current Value'];
          let targetValue = payload['Target Value'];
          if (payload['Current Value'] === 'on/enable') {
            //device.setCapabilityValue('onoff', false);
            //console.log("========switch ON")
          } else if (payload['Current Value'] === 'off/disable') {
            //device.setCapabilityValue('onoff', true);
            //console.log("========switch OFF")
          }  
          
          try {
             if (targetValue > 0){
              device.setStoreValue('regulator_percentage', targetValue);


             }
          } catch (error) {
            
          } 

        }
      );
      return this;
    } 
}
