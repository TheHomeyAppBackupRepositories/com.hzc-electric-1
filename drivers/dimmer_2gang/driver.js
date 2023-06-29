'use strict';
 
const HzcZigBeeDriver = require('../../lib/HzcZigBeeDriver')

class dimmer_2gang extends HzcZigBeeDriver {
    onInit () {
        super.onInit()
    
        try {

            this._levelStepActionCard = this.getActionCard('dimmer_2gang_level_step_with_onoff') 
            this._levelStepActionCard.registerRunListener((args, state) => {
            return args.device.levelStepRunListener(args, state).catch(this.error)
            })

            this._levelMoveActionCard = this.getActionCard('dimmer_2gang_level_move_with_onoff')
            this._levelMoveActionCard.registerRunListener((args, state) => {
            return args.device.levelMoveRunListener(args, state).catch(this.error)
            })

            this._levelStopActionCard = this.getActionCard('dimmer_2gang_level_stop_with_onoff')
            this._levelStopActionCard.registerRunListener((args, state) => {
            return args.device.levelStopRunListener(args, state).catch(this.error)
            })

 
        } catch (error) {
          
        }
        
    
      }
}

module.exports = dimmer_2gang;