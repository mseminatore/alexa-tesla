# Alexa-Tesla
[![Version](http://img.shields.io/npm/v/alexa-tesla.png)](https://www.npmjs.org/package/alexa-tesla)
[![License](https://img.shields.io/npm/l/alexa-tesla.svg)](https://github.com/mseminatore/alexa-esla/blob/master/LICENSE)

Alexa Skills Kit (ASK) project - Monitoring and control of Tesla vehicles using Amazon Echo devices

# Installation

In order to create your Alexa skill you must first download and install [NodeJS](http://nodejs.org).

An installable TeslaJS module for [npm](http://npmjs.org) is now available.  To download and install the library 
to a local project directory use the following:

    npm install alexa-tesla

If you are building your own project that will depend upon this library then you will want to use 
the **--save** parameter in order to update the **package.json** file for your package as follows:

    npm install alexa-tesla --save

You may also install directly from the Github [source](https://github.com/mseminatore/alexa-tesla).
Either download and unzip the source, or clone the repository.

>Remember, whether you install via npm, ZIP source or Git clone you must install the dependencies before using
>alexa-tesla.

To install dependencies via npm, From the root level of the library directory type:

    npm install

This library is under active development.  New features and bug fixes are being added
regularly.  To ensure that you have the very latest version and it's dependencies be sure to update frequently.

To do so, from your project directory type:

    npm update

# Setup

Currently you must set this skill up by creating your own AWS Lambda function.  Simply ZIP up the directory
contents and upload to a new AWS Lambda function.  While Alexa skills can also be served from other cloud
services such as Microsoft Azure I have not yet personally tested these configurations and so cannot 
provide instructions.

While I do have account linking support working in the project and have an account linking website established
I am unclear on whether this would be OK with Tesla Motors.  My strong preference would be for them to 
officially support account linking scenarios via their own website.  So for now you must setup your 
AWS Lambda function to provide either:

1. Two environment variables called `USER` and `PASS` which contain your Tesla.com credentials.
2. OR one environment variable called `TOKEN` which contains a valid Tesla.com OAuth token [**Recommended**]

>Note that environment variables are case sensitive.  I was caught by this several times during development!

While using option #1 above works it is far less secure to use your login credentials.  Unlike logon credentials
an OAuth token will eventually expire, and can be revoked at any time by changing your account password.  
Additionally using the username and password requires an extra call on each skill invocation to acquire a
new OAuth token.  These calls not only put undue load on the Tesla servers but are also relatively slow.

# Testing

In order to test this app locally you will need to install the Alexa-Server project.  
_Instruction reference pending_.

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

# Supported Alexa Intents

`Intents` is just another name for functions or behaviors exposed by an Alexa skill.

This skill currently supports the following intents:

* Start/Stop charge
* Get/Set the charge limit
* Lock/Unlock doors
* Start/stop climate system
* Set climate temperature
* Beep the horn
* Get the odometer reading
* Get the current battery-level/range
* Check if vehicle is plugged in

The basic goal is to support all of Tesla REST API capabilities that make sense.  If there is functionality
that you would like to see exposed please let us know.

Additionally, some new behaviors may be created such as charge scheduling, reminders, etc.

# Utterances

`Utterances` is the term for the specific phrases that an Alexa skill can recognize.  All utterances are
eventually mapped to intents.  Many utterances can, and very often do, map to a single intent.

The complete set of recognized utterances and custom types can typically be found in 
[utterances.txt](https://github.com/mseminatore/alexa-tesla/blob/master/utterances.txt) 
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
