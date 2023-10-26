const {
    getCapabilityValue, 
    updateTempCapOptions,
    setConfiguratrion
}                               = require('./utils');
  
module.exports = {
  device:null,
  node:null,
  pu:127,
  capability: 'regulator_percentage',
  init:function(device, node){
    device.appkits['pu'+this.pu] = this;
    this.startReport(device, node);
    return this;
  },
  registerCapability:function(){
      return this;
  },

  startReport:function(device, node){
    device.registerCapabilityListener(this.capability,
        async (payload) => {  
          console.log('regulator_percentage SET:', payload); 
          /*
          let v = 10;
          if (v > 0 && v < 10) { v = 10; }
          if (v > 90 && v < 100) { v = 90;}
          if (v > 10 && v < 90) { v = (Math.round(payload / 10) * 10).toFixed(0); v += 10; }
          */

          const bufferValue = Buffer.alloc(1); 
          bufferValue.writeUInt16BE(payload); 

          let targetPayload = {
            'Channel': 0x0,
            'Level' : bufferValue,
            'Duration' : 0x0
          };
          console.log('SWITCH_MULTILEVEL_SET', targetPayload); 
          await node.CommandClass.COMMAND_CLASS_SWITCH_MULTILEVEL.SWITCH_MULTILEVEL_SET(targetPayload); 


          console.log('regulator_percentage SET 2:', payload);
          //setConfiguratrion(device, null, this.pu, 4, false, payload);  
          device.setStoreValue('regulator_percentage', payload);
          device.showMessage('Set '+payload+'%'); 

          
           
        }
    ); 
    return this;  
  },
  setConfig:function(device, payload){
    setConfiguratrion(device, null, this.pu, 4, false, payload);
  },
  update:function(device, payload, config){ 
    let runModeCapValue = device.getCapabilityValue('regulator_percentage');
    let v = (Math.round(config / 10) * 10).toFixed(0);
    console.log('regulator_percentage REV:', runModeCapValue, config, v);
    let vNew = parseInt(v, 10);
    device.setStoreValue('regulator_percentage', vNew);
    device.setCapabilityValue('regulator_percentage', vNew); 
  }
}  