"use strict";

var tjs = require("teslajs");
//var _ = require('lodash');
var Alexa = require('alexa-app');
//var request = require('request');

// Allow this module to be reloaded by hotswap when changed
module.change_code = 1;

var app = new Alexa.app('tesla');

// tell alexa-app to be sure to fully expand utterance generation!
// TODO - this may NOT actually be required OR desirable
app.exhaustiveUtterances = true;

// TODO - this could/should? be a session prop instead?
var options = {};

// ENV variables used for configuration

// set these if you are using username/password auth [NOT RECOMMENDED for security!]
var username = process.env.USER;
var password = process.env.PASS;

// set this if you are using a Tesla acquired OAuth token
var token = process.env.TOKEN;

// set this if you want to have the code verify the AppID
var appid = process.env.APPID || 0;

//
//  Might be overthinking the env toggles here
//
function log(str) {
    if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'debug' || process.env.NODE_ENV != 'production') {
        console.log(str);
    }
}

//
// Convert fahrenheit to celcius
//
function f2c(degf) {
    return (degf - 32) * 5 / 9;
}

//
// Convert celcius to fahrenheit
//
function c2f(degc) {
    return degc * 9 / 5 + 32;
}

//
//  Turn compass heading into friendly heading (NSEW, etc.)
//
function compassDirs(heading) {
    if (heading > 337 || heading < 23) {
        return "North";
    }

    if (heading < 67) {
        return "North East";
    }

    if (heading < 112) {
        return "East";
    }

    if (heading < 157) {
        return "South East";
    }

    if (heading < 202) {
        return "South";
    }

    if (heading < 247) {
        return "South West";
    }

    if (heading < 292) {
        return "West";
    }

    if (heading < 337) {
        return "North West";
    }

    return heading;
}

//
// Verify the requester appID = amzn1.ask.skill.xxx 
//
app.pre = function(request, response, type) {
  if (appid && process.env.NODE_ENV == 'production' && request.applicationId != appid) {

    // fail ungracefully
    log("Error: Invalid applicationId");
    response.fail("Error: Invalid applicationId");
  }
};

//
//
//
app.launch(function(req, res) {

    var prompt = 'What would you like to do?';
  
    // if user/pass provided then login
    if (username && password) {
        log("username/pwd found");
        tjs.loginAsync(username, password)
        .then(vehiclesCall)
        .done(function(result) {
            res.say(prompt).reprompt(prompt).shouldEndSession(false).send();
        });
        
        return false;
    }
    
    // if a token was provided then use that otherwise use account linking
    if (token) {
        log("token found in process env");
        vehiclesCall({authToken: token})
        .done(function(vehicle) {
            res.say(prompt).reprompt(prompt).shouldEndSession(false).send();
        });
        
        return false;
    } else if (req.sessionDetails.accessToken) {
        log("token passed by Alexa");
//        log(req.sessionDetails.accessToken);

        vehiclesCall({authToken: req.sessionDetails.accessToken})
        .done(function(result) {
            res.say(prompt).reprompt(prompt).shouldEndSession(false).send();
        });

        return false;        
    } else {
        log("Account link required");
        res.linkAccount();
    }
});

//
// TODO - see if we can make this inline instead
//
function vehiclesCall(result) {
//    log("logged in: " + result.authToken);
    options = {authToken: result.authToken};

    log("vehiclesCall");
    return tjs.vehiclesAsync(options);
}

//
//
//
app.intent('VehicleCountIntent', {
    "utterances": ['How many {cars|vehicles} do I {have|own}', 'to list my {cars|vehicles}']
}, function(req, res) {
    tjs.allVehiclesAsync(options)
    .done(function(vehicles) {
        var str = "I see that you have " + vehicles.length;
        if (vehicles.length > 1) {
            str += " vehicles. ";
        } else {
            str += " vehicle. ";
        }

        for (var i = 0; i < vehicles.length; i++) {
            if (i === 0) {
                str += "A ";
            } else {
                str += " and a ";
            }

            var paintColor = tjs.getPaintColor(vehicles[i]);
            if (paintColor) {
                str += paintColor + " ";
            }

            str += tjs.getModel(vehicles[i]);

            if (vehicles[i].display_name) {
                str += " called " + vehicles[i].display_name;
            }
        }

        res.say(str).send();
    });

    // signal that we will send the response asynchronously    
    return false;
});

//
//
//
app.intent('BatteryIntent', {
    "utterances": ['{What is|What\'s|For|To get} {the|my} {battery level|charge|power|soc}']
}, function(req, res ){
    tjs.chargeStateAsync(options)
    .done(function(chargeState) {
        res.say("The battery level is " + Math.round(chargeState.battery_level) + "%").send();
    });

    // signal that we will send the response asynchronously    
    return false;
});

//
//
//
app.intent('RangeIntent', {
    "utterances": ['{What is|What\'s|For|To get} the range']
}, function(req, res) {
    tjs.chargeStateAsync(options)
    .done(function(chargeState) {
        res.say("The rated range left is " + Math.round(chargeState.battery_range) + " miles").send();
    });

    // signal that we will send the response asynchronously    
    return false;
});

//
// Check whether the car is plugged in or not
//
app.intent('PluggedInIntent', {
    "utterances": ['{If|whether} {|the|my} car is plugged in']
}, function(req, res) {
    tjs.chargeStateAsync(options)
    .done(function(chargeState) {
        var str = "";
        if (chargeState.charging_state != "Disconnected") {
            str = "The car is plugged in.";
        } else {
            str = "The car is not plugged in.";
        }
        res.say(str).send();
    });

    // signal that we will send the response asynchronously    
    return false;
});

//
// Start charging the car
//
app.intent('StartChargeIntent', {
    "utterances": ['{to|} {start charging|charge}']
}, function(req, res) {
    tjs.startChargeAsync(options)
    .done(function(result) {
        res.say("Charging has begun").send();
    });

    // signal that we will send the response asynchronously    
    return false;
});

//
// Stop charging the car
//
app.intent('StopChargeIntent', {
    "utterances": ['{to|} stop charging']
}, function(req, res) {
    tjs.stopChargeAsync(options)
    .done(function(result) {
        res.say("Charging has stopped").send();
    });

    // signal that we will send the response asynchronously    
    return false;
});

//
// Turn on the climate system
//
app.intent('climateStartIntent', {
    "utterances": ['{to|} start {climate|cooling|heating|warming}']
}, function(req, res) {
    tjs.climateStartAsync(options)
    .done(function(result) {
        res.say("Climate system is now on").send();
    });

    // signal that we will send the response asynchronously    
    return false;
});

//
// Turn off the climate system
//
app.intent('climateStopIntent', {
    "utterances": ['{to|} stop {climate|cooling|heating|warming}']
}, function(req, res) {
    tjs.climateStopAsync(options)
    .done(function(result) {
        res.say("Climate system is now off").send();
    });

    // signal that we will send the response asynchronously    
    return false;
});

//
// Set the climate temperatures
//
app.intent('setTempsIntent', {
    "slots": { "number": "AMAZON.NUMBER"},
    "utterances": ['{to|} set temperature to {-|number} {|degrees}']
}, function(req, res) {
    var temp = req.slot("number");
    // TODO - clamp temp here?

    tjs.setTempsAsync(options, f2c(temp), null)
    .done(function(result) {
        var str = "The temperature is now set to " + temp + " degrees";
        res.say(str).send();
    });

    // signal that we will send the response asynchronously    
    return false;
});

//
// Climate settings
//
app.intent('climateSettingIntent', {
    "utterances": ['{What are|For|To get} the climate settings']
}, function(req, res) {
    tjs.climateStateAsync(options)
    .done(function(climate_state) {
        var state = climate_state.is_auto_conditioning_on ? "on" : "off";
        var str = "The climate system is currently " + state + ". ";
        
        if (climate_state.driver_temp_setting != climate_state.passenger_temp_setting ) {
            str += "The driver temperature is set to " + Math.round(c2f(climate_state.driver_temp_setting)) + " degrees ";
            str += "and the passenger temperature is set to " + Math.round(c2f(climate_state.passenger_temp_setting)) + " degrees.";
        } else {
            str += "The temperature is set to " + Math.round(c2f(climate_state.driver_temp_setting)) + " degrees.";
        }
        res.say(str).send();
    });

    // signal that we will send the response asynchronously    
    return false;
});

//
// Honk the car horn
//
app.intent('BeepIntent', {
    "utterances": ['{to|} {beep|honk} {the horn|}']
}, function(req, res) {
    tjs.honkHornAsync(options)
    .done(function(result) {
        res.say("Beep Beep did you hear it?").send();
    });

    // signal that we will send the response asynchronously    
    return false;
});

//
//
//
app.intent('FlashIntent', {
    "utterances": ['{to|} flash {the lights|}']
}, function(req, res) {
    tjs.flashLightsAsync(options)
    .done(function(result) {
        res.say("Don't blink or you might miss it?").send();
    });

    // signal that we will send the response asynchronously    
    return false;
});

//
//
//
app.intent('LockIntent', {
    "slots": { "state": "LOCK_PRESETS" },
    "utterances": ['{to|} {-|state} {|the|my} {door|doors|car}']
}, function(req, res) {
    var state = req.slot("state");

    if (state == 'lock') {
        tjs.doorLockAsync(options)
        .done(function(result) {
            res.say("The doors are now locked.").send();
        });
    } else if (state == 'unlock') {
        tjs.doorUnlockAsync(options)
        .done(function(result) {
            res.say("The doors are now unlocked.").send();
        });
    } else {
        res.say("Unknown request");
        return true;
    }

    // signal that we will send the response asynchronously    
    return false;
});

//
// Valet mode
//
app.intent('ValetIntent', {
    "slots": { "onoff": "ONOFF" , "pin": "AMAZON.FOUR_DIGIT_NUMBER"},
    "utterances": ['{|to} {Turn|Set} valet mode {-|onoff} {-|pin}']
}, function(req, res) {
    var onoff = req.slot("onoff");
    var pin = req.slot("pin");
    var mode = false;

    if (onoff.toUpperCase() == "ON") {
        mode = true;
    } else {
        mode = false;
    }

    tjs.setValetModeAsync(options, mode, pin)
    .done(function(result) {
        var str = "Valet mode is now " + onoff;
        res.say(str).send();
    });

    // signal that we will send the response asynchronously    
    return false;
});

//
//
//
app.intent('ResetValetPinIntent', {
    "utterances": ['{|to} reset {|the} valet pin']
}, function(req, res) {
    tjs.resetValetPinAsync(options)
    .done(function(result) {
        var str = "The valet pin has been reset.";
        res.say(str).send();
    });

    // signal that we will send the response asynchronously    
    return false;
});

//
//
//
app.intent('OdoIntent', {
    "utterances": ['{|What is|What\'s|For|To get} {the|} {odometer|mileage}']
}, function(req, res) {
    tjs.vehicleStateAsync(options)
    .done(function(vehicleState) {
        var str = "The odometer reports " + Math.round(vehicleState.odometer) + " miles";
        res.say(str).send();
    });

    // signal that we will send the response asynchronously    
    return false;
});

//
//
//
app.intent('ChargeQueryIntent', {
    "utterances": ['{|What is|What\'s|For|To get} {the|} charge {|level|limit|setting}']
}, function(req, res) {
    tjs.chargeStateAsync(options)
    .done(function(chargeState) {
        var str = "The charge limit is currently set to " + chargeState.charge_limit_soc + "%";
        res.say(str).send();
    });

    // signal that we will send the response asynchronously    
    return false;
});

//
//
//
app.intent('ChargeTimeIntent', {
    "utterances": ['How {long|much time} until {charge|charging} {is done|completes|finishes}']
}, function(req, res) {
    tjs.chargeStateAsync(options)
    .done(function(chargeState) {
        if (chargeState.charging_state != "Charging") {
            res.say("The car is not currently charging.").send();
        } else {
            var hours = Math.floor(chargeState.time_to_full_charge);
            var mins = Math.round((chargeState.time_to_full_charge - hours) * 60);
            var mph = Math.round(chargeState.charge_rate);

            var str = "The car is currently charging at a rate of " + mph.toString() + " miles per hour.  The estimated time to finish charging to " + chargeState.charge_limit_soc + "% is ";
            if (hours > 0) {
                str += hours.toString();
                if (hours > 1) {
                    str += " hours ";
                } else {
                    str += " hour ";
                }
            }

            str += mins.toString() + " minutes.";
            res.say(str).send();
        }
    });

    // signal that we will send the response asynchronously    
    return false;
});

//
//
//
app.intent('ChargeLimitIntent', {
    "slots": { "number": "AMAZON.NUMBER", "preset": "CHARGE_PRESETS" },
    "utterances": ['{to|} set {the|} charge {limit|level} to {-|number}', '{to|} set {the|} charge {limit|level} to {-|preset}']
}, function(req, res) {
    var limit = req.slot("number");
    var preset = req.slot("preset");

    // translate preset values to percentages
    if (preset) {
        if (preset.toLowerCase() == "standard") {
            limit = 90;
        } else if (preset.toLowerCase() == "range") {
            limit = 100;
        } else if (preset.toLowerCase() == "storage") {
            limit = 50;
        }
    }

    // make sure we have a valid limit
    if (!limit) {
        limit = 90;
    }

    // clamp the limit to acceptable values
    if (limit < 50) {
        limit = 50;
    }
    if (limit > 100) {
        limit = 100;
    }

    tjs.setChargeLimitAsync(options, limit)
    .done(function(result) {
        var str = "I've set the charge limit to " + limit + "%";
        res.say(str).send();
    });

    // signal that we will send the response asynchronously    
    return false;
});

//
//
//
app.intent('LocationIntent', {
    "utterances": ['{|Where is|Where\'s} {the|my} car']
}, function(req, res) {
    tjs.driveStateAsync(options)
    .done(function(driveState) {
        var state = driveState.shift_state || "Parked";
        var str ="";
        var dir = compassDirs(driveState.heading);
/*
        var lat = driveState.latitude || 0;
        var long = driveState.longitude || 0;

        request({
            method: 'GET',
            url: "http://api.geonames.org/findNearestAddressJSON?lat=" + lat + "&lng=" + long + "&username=demo",
            headers: { 'Content-Type': 'application/json; charset=utf-8' }
        }, function (error, response, body) {
            var loc = JSON.parse(body).address;

            var address = loc.streetNumber + " " + loc.street + " " + loc.placename + " " + loc.adminCode1;

            if (state == "Parked") {
                str = "Car is parked facing " + dir + "near " + address;
            } else {
                str = "Car is traveling " + dir + " at " + driveState.speed + " miles per hour near " + address;
            }

            res.say(str).send();
        });
*/
        if (state == "Parked") {
            str = "Car is parked facing " + dir;
        } else {
            str = "Car is traveling " + dir + " at " + Math.round(driveState.speed) + " miles per hour";
        }

        res.say(str).send();
    });

    // signal that we will send the response asynchronously    
    return false;
});

module.exports = app;