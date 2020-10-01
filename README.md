# Alexa-Tesla(Automation of Cars)
[![Version](http://img.shields.io/npm/v/alexa-tesla.png)](https://www.npmjs.org/package/alexa-tesla)
[![License](https://img.shields.io/npm/l/alexa-tesla.svg)](https://github.com/mseminatore/alexa-tesla/blob/master/LICENSE)
[![Dependencies](https://david-dm.org/mseminatore/alexa-tesla.svg)](https://david-dm.org/mseminatore/alexa-tesla)
[![Downloads](https://img.shields.io/npm/dt/alexa-tesla.svg)](https://www.npmjs.org/package/alexa-tesla)

Monitoring and control of Tesla vehicles using Amazon Echo devices using the Alexa Skills Kit (ASK).

[![NPM](https://nodei.co/npm/alexa-tesla.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/alexa-tesla/)

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
it is unclear whether this would be OK with Tesla Motors.  My strong preference would be for them to 
officially support account linking scenarios via their own website.  So for now you must setup your 
AWS Lambda function to provide either:

1. Two environment variables called `USER` and `PASS` which contain your Tesla.com credentials.
2. OR one environment variable called `TOKEN` which contains a valid Tesla.com OAuth token [**Recommended**]

> Note that environment variables are case sensitive!  I was caught by this 
> several times during development!

While using option #1 above works it is far less secure to use your login 
credentials.  Unlike logon credentials an OAuth token will eventually expire,
and can be revoked at any time by changing your account password.  

Additionally using the username and password can require an extra call on each
skill invocation to acquire a new OAuth token.  These calls not only put undue 
load on the Tesla servers but they are also relatively slow.

# Testing

In order to test this app locally you will first need to install the 
[Alexa-App-Server](https://github.com/alexa-js/alexa-app-server) project.  
Then `git clone` or `npm install` alexa-tesla into the apps subfolder.
_Additional instruction reference pending_.

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

# What's New!

Here are some of the most recent features and fixes:

1. In **0.0.10** added support for **charge time remaining** and **listing vehicles**
2. In **0.0.12** added **valet mode** and **reset valet pin** intents and simplified utterances using Amazon custom types
3. In **0.0.13** added **climate settings** intent
4. In **1.0.0** added beginnings of mult-car support and fixed issue with intens failing without launch

# Intents

The term `Intents` is just another name for functions or behaviors exposed by an Alexa skill.

This skill currently supports the following intents:

* Start/Stop charge
* Get/Set the charge limit
* Lock/Unlock doors
* Start/stop climate system
* Set climate temperature
* Beep the horn
* Flash the lights
* Get the odometer reading
* Get the current battery-level/range
* Check if vehicle is plugged in
* Check the charge time remaining
* List the vehicles attached to your account
* Enable/disable valet mode [NEW!]
* Reset the valet pin [NEW!]
* Get the climate settings

The goal is to eventually support all of the Tesla REST API capabilities that make sense.

> If there is functionality that you would like to see exposed please let us know.

Additionally, some new behaviors may be created such as charge scheduling, reminders, etc.

The complete set of intents can be found in
[intents.json](https://github.com/mseminatore/alexa-tesla/blob/master/intents.json) 

# Utterances

The term `Utterances` represents the set of specific phrases that an Alexa skill can recognize.  
All utterances are eventually mapped to `intents`.  Many utterances can, and very often do, map 
to a single intent.

The complete set of recognized utterances and custom types can typically be found in 
[utterances.txt](https://github.com/mseminatore/alexa-tesla/blob/master/utterances.txt) 
and [customTypes.json](https://github.com/mseminatore/alexa-tesla/blob/master/customTypes.json).

Some examples utterances are provided below:

"[Alexa] ask Tesla..."

* What is the battery level
* for the battery level of [car_name]
* What is the range
* to get the range of [car_name]
* If my car is plugged in
* if [car_name] is plugged in
* to start warming
* to set temperature to 67
* to beep the horn
* to flash the lights
* to lock the doors
* What is the mileage
* What is the charge level
* to set the charge limit to standard
* Where is my car
* How long until charging is done
* How many cars do I own
* Turn valet mode on|off 1234
* Reset the valet pin
* What are the climate settings
