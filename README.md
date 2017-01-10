# Alexa-Tesla
Alexa Skills Kit (ASK) project - Monitoring and control of Tesla vehicles

# Installation

In order to create your Alexa skill you must first download and install [NodeJS](http://nodejs.org).

Then you will want to 

# Setup

Currently you must set this skill up by creating your own AWS Lambda function.  Simply ZIP up the directory
contents and upload to a new AWS Lambda function.

You will then want to acquire the [source](https://github.com/mseminatore/alexa-tesla) from GitHub.
Either download and unzip the source, or clone the repository.

>Remember, whether you install from ZIP source or Git clone you must install the dependencies before using TeslaJS.

To install dependencies via npm, from the root level of the library directory type:

    npm install

At some point I hope to enable account linking support.  For now you must setup your AWS Lambda function to
provide either:

1. Two environment variables called `USER` and `PASS` which contain your Tesla.com credentials.
2. OR one environment variable called `TOKEN` which contains a valid Tesla.com OAuth token [**Recommended**]

# Warranty Disclaimer

You may use this skill with the understanding that doing so is **AT YOUR OWN RISK**.  No warranty, express or implied, 
is made with regards to the fitness or safety of this code for any purpose.  If you use this library to query or change 
settings of your vehicle you understand that it is possible to make changes that could inadvertently lower the security 
of your vehicle, or cause damage, through actions including but not limited to:

* Unlocking the vehicle
* Remotely starting the vehicle
* Opening the sunroof
* Opening the frunk or trunk
* Lowering the battery charge level
* Impacting the long-term health of your battery

