const {
    setConfiguratrion
}                               = require('./utils');
  
module.exports = {
  device:null,
  node:null,
  pu:999,
  init:function(ipu, device, node){
    this.pu = ipu;
    this.node = node;
    device.appkits['pu'+this.pu] = this;
    return this;
  },
  
  setConfig:function(device, node, param, payload){
    
    console.log('******************set config : ', param, payload);  ////configuration_param_6, 1

    let p = param.split('_');

    if (p[2] != undefined){
      //device.showMessage('set p'+param + ' value ' + payload);
      let pv = parseInt(p[2]);
      console.log('%%%%%%%%%%%%%%%%set config: ', p, pv, payload);
      setConfiguratrion(device, node, pv, 1, false, payload);
      console.log('############### set config end.');
    }
    
    
  }
}  