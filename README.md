# Alexa-Tesla
Alexa Skills Kit (ASK) project - Monitoring and control of Tesla vehicles

# Installation

In order to create your Alexa skill you must first download and install [NodeJS](http://nodejs.org).

You will then want to acquire the [source](https://github.com/mseminatore/alexa-tesla) from GitHub.
Either download and unzip the source, or clone the repository.

>Remember, whether you install from ZIP source or Git clone you must install the dependencies before using TeslaJS.

Remember to install the project dependencies via npm.  From the root level of the library directory type:

    npm install

# Setup

Currently you must set this skill up by creating your own AWS Lambda function.  Simply ZIP up the directory
contents and upload to a new AWS Lambda function.

At some point I hope to enable account linking support.  For now you must setup your AWS Lambda function to
provide either:

1. Two environment variables called `USER` and `PASS` which contain your Tesla.com credentials.
2. OR one environment variable called `TOKEN` which contains a valid Tesla.com OAuth token [**Recommended**]

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

TBD
