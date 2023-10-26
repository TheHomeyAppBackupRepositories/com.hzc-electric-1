
module.exports = {
    init : function(dbg){
        const log = console.log;
        console.log = function(...data){
            if (dbg){
                const icons = ["🌵", "🎍", "🐾", "🌀", "🐚", "🥝", "🥜", "🥕", "🥒", "🌽", "🍒", "🍅", "🍑", "🍋", "🍈", "🌶", "🌰", "🍠", "🍆", "🍄", "🍐", "🍌", "🍍", "🍇", "🍏", "🍓", "🍎", "🍊", "🐴", "🐗", "🦄", "🐑", "🐶", "🐔", "🐼", "🐒", "🌝", "💄", "💋", "👠", "👗", "👙", "🧣", "🍰", "🍭", "🍳", "🎄", "🎱", "⚽", "🏀", "🎵", "🚄", "⭕", "❌", "❓", "❗", "💯"]
                const icon = icons[Math.floor(Math.random() * icons.length)];
                log(`%c ${icon} `, ``, ...data); 
            } 
        };

    },
    syslog: function(dbg){
        this.init(dbg); 
    }


}


/*
module.exports = console.ll = (function(oriLogFunc){
    return function(show, ...data)
    { 
        if (show == 'd'){
                const icons = ["🌵", "🎍", "🐾", "🌀", "🐚", "🥝", "🥜", "🥕", "🥒", "🌽", "🍒", "🍅", "🍑", "🍋", "🍈", "🌶", "🌰", "🍠", "🍆", "🍄", "🍐", "🍌", "🍍", "🍇", "🍏", "🍓", "🍎", "🍊", "🐴", "🐗", "🦄", "🐑", "🐶", "🐔", "🐼", "🐒", "🌝", "💄", "💋", "👠", "👗", "👙", "🧣", "🍰", "🍭", "🍳", "🎄", "🎱", "⚽", "🏀", "🎵", "🚄", "⭕", "❌", "❓", "❗", "💯"]
                const icon = icons[Math.floor(Math.random() * icons.length)];
                
                oriLogFunc.call(console,`%c ${icon} `, ``, ...data);
        } 
    }
  })(console.log);
  */
 