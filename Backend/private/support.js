const config = require('../init_config.json');

module.exports = {
    getBasicDate: function(){
        var date_time = new Date();
        return date_time;
    },
    isEmptyObject: function(obj){           
        // CITATION: https://stackoverflow.com/questions/11480769/how-can-i-check-if-a-json-is-empty-in-nodejs
        // CODE Used to help differentiate between home page calls and homework assingment GET Forms request on /    
        return !Object.keys(obj).length;
    },
    //#region Winston Logging
    log: function(level,message){
        // import winston for logging
        const winston = require('winston');

        // declare required winston functions for creating custom log format
        const {format, transports } = require('winston');
        const { combine, timestamp, label, printf } = format;

        // define custom log format
        const customFormat = printf(({ level, message, label, timestamp }) => {
            return `${timestamp} [${label}] ${level}: ${message}`;
          });
        
        // configure log locations
        const combined_log = config.log_root + "/API_Log.log"
        const error_log = config.log_root + "/API_Error.log"

        var console_stream_config; // create console configuration object to support logging modes adjustment based on configfile
        var file_stream_config;

        // Configure console log mode
        if(config.debug_mode ==  true){
            console_stream_config =  {
                colorize: true,
                level: "debug"
            };
            file_stream_config = {
                filename: combined_log,
                level: "debug"
            }
        }
        else{
            console_stream_config =  {
                colorize: true,
                level: "info"
            };
            file_stream_config = {
                filename: combined_log,
                level: "info"
            }
        }

        // configure logger
        const logger = winston.createLogger({
            // establish format
            format: combine(
                label({ label: config.app_name }),
                timestamp(),
                customFormat
              ),
            // establish destinations
            transports: [
                new winston.transports.Console(console_stream_config),  //log data to console
                new winston.transports.File(file_stream_config),    // log data to a combined file
                new winston.transports.File({ filename: error_log, level: 'error' }) // log errors to another file
            ]
        });

        // call the right logging event based on the event type
        switch(level){
            case 'info':
                logger.info(message);
                break;
            case 'error':
                logger.error(message);
                break;
            case 'debug':
                logger.debug(message);
                break;
        }

    }
    //#endregion
}