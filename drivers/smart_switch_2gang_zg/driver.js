'use strict';
 
const HzcZigBeeDriver = require('../../lib/HzcZigBeeDriver')

class smart_switch_2gang_zg_driver extends HzcZigBeeDriver {
 
  onInit () {
    super.onInit()

    try {
      this._trunOnoffActionCard = this.getActionCard('smart_switch_with_onoff')  
      this._trunOnoffActionCard.registerRunListener((args, state) => {
        this.log('call trunOnoffRunListener')
        return args.device.trunOnoffRunListener(args, state).catch(this.error)
      })


      this._turnOnActionCard1 = this.getActionCard('smart_switch_turned_on_for_switch_1')
      this._turnOffActionCard1 = this.getActionCard('smart_switch_turned_off_for_switch_1')
      this._turnOnActionCard2 = this.getActionCard('smart_switch_turned_on_for_switch_2')
      this._turnOffActionCard2 = this.getActionCard('smart_switch_turned_off_for_switch_2')

      this._turnOnActionCard1.registerRunListener( (args, state) => {
        let playload = { onoff: 1, endpoint:1 }
        return args.device.trunOnoffRunListener(playload, state).catch(this.error)
      })

      this._turnOffActionCard1.registerRunListener( (args, state) => {
        let playload = { onoff: 0, endpoint:1 }
        return args.device.trunOnoffRunListener(playload, state).catch(this.error)
      })

      this._turnOnActionCard2.registerRunListener( (args, state) => {
        let playload = { onoff: 1, endpoint:2 }
        return args.device.trunOnoffRunListener(playload, state).catch(this.error)
      })

      this._turnOffActionCard2.registerRunListener( (args, state) => {
        let playload = { onoff: 0, endpoint:2 }
        return args.device.trunOnoffRunListener(playload, state).catch(this.error)
      })
    } catch (error) {
      
    }
    

  }


}

module.exports = smart_switch_2gang_zg_driver;