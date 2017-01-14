# Alexa-Tesla
[![Version](http://img.shields.io/npm/v/alexa-tesla.png)](https://www.npmjs.org/package/alexa-tesla)
[![License](https://img.shields.io/npm/l/alexa-tesla.svg)](https://github.com/mseminatore/alexa-esla/blob/master/LICENSE)

Alexa Skills Kit (ASK) project - Monitoring and control of Tesla vehicles using Amazon Echo devices

# Installation

In order to create your Alexa skill you must first download and install [NodeJS](http://nodejs.org).

You will then want to acquire the [source](https://github.com/mseminatore/alexa-tesla) from GitHub.
Either download and unzip the source, or clone the repository.

>Remember, whether you install from ZIP source or Git clone you must install the dependencies before using TeslaJS.

Remember to install the project dependencies via npm.  From the root level of the library directory type:

    npm install

# Setup

Currently you must set this skill up by creating your own AWS Lambda function.  Simply ZIP up the directory
contents and upload to a new AWS Lambda function.  While Alexa skills can also be served from other services such
as Microsoft Azure I have not yet personally tested this configuration and so cannot provide instructions.

At some point I hope to enable account linking support.  For now you must setup your AWS Lambda function to
provide either:

1. Two environment variables called `USER` and `PASS` which contain your Tesla.com credentials.
2. OR one environment variable called `TOKEN` which contains a valid Tesla.com OAuth token [**Recommended**]


While using option #1 above works it is less secure to use your login credentials.  Unlike logon credentials
an OAuth token will eventually expire, and can be revoked at any time by changing your account password.  Additionally
using the username and password requires an extra call on each skill invocation to acquire a new OAuth token.  These
calls not only put undue load on the Tesla servers but are also relatively slow.

# Testing

In order to test this app locally you will need to install the Alexa-Server project.  Instruction reference pending.

# Warranty Disclaimer

You may use this skill with the understanding that doing so is **AT YOUR OWN RISK**.
No warranty, express or implied, is made with regards to the fitness or safety of 
this code for any purpose.  If you use this library to query or change settings of 
your vehicle you understand that it is possible to make changes that could 
inadvertently lower the security of your vehicle, or cause damage, through actions 
including but not limited to:

* Unlocking the vehicle
* Remotely starting the vehicle
* Opening the sunroof
* Opening the frunk or trunk
* Lowering the battery charge level
* Impacting the long-term health of your battery

# Supported intents

This skill currently supports the following intents:

* Start/Stop charge
* Get/Set the charge limit
* Lock/Unlock doors
* Start/stop climate
* Set climate temperature
* Beep the horn
* Get odometer value
* Get battery level
* Check if vehicle is plugged in

The goal is to support all Tesla REST API capabilities that make sense.  Additionally, some new behaviors
could be created such as charge scheduling, reminders, etc.

# Utterances

The complete set of recognized utterances and custom types can be found in [utterances.txt](https://github.com/mseminatore/alexa-tesla/blob/master/utterances.txt) 
and [customTypes.json](https://github.com/mseminatore/alexa-tesla/blob/master/customTypes.json).

Some examples utterances are provided below:

"[Alexa] ask Tesla..."

* What is the battery level
* What is the range
* If my car is plugged in
* to start warming
* to set temperature to 67
* to beep the horn
* to lock the doors
* What is the mileage
* What is the charge level
* to set the charge limit to standard
* Where is my car
