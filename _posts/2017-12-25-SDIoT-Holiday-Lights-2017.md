---
title: "SDIoT Holiday Lights"
share: true
author_profile: true
header:
  image: /assets/images/tree.jpg
comments: true  

---

[SDIoT](http://sdiot.in) Holiday Lights is a smart Christmas tree lights project meant for adding smart, bright and colorful lights to holiday season. It is based around Neopixel addressable LEDs which can display virtually any color imaginable. Our controller deliver animation in single- as well as expanded- color light strands The basic idea is to design, develop and deploy a platform that interfaces user with the Christmas Holiday light at our office premise in order to control color and animations of these LEDs over internet and see the live feed of the same over the platform using Raspberry Pi camera. The team at SDIoT also added Alexa enable voice-driven capabilities using Amazon's Alexa Bot. It is a heavily scaled down version of IoT holiday Lights created by team member Ayan Pahwa, last year, which was based around Particle Photon board. The project is part of SDIoT initiative to build DIY project under Made With Code campaign. 

## Features:

1. Controllable over Internet, webpage hosted over a public server.
2. Controllable with Alexa, Amazon echo smart home speakers.
3. Real time live feed using RaspberryPi camera.
4. An offline Star for tree top Bling ;)
5. Exposing an API for future expansion over MQTT.

## The Hardware:

ESP8266 NodeMCU board: To control neopixel LEDs over Internet using MQTT.
Arduino Pro Mini: To control offline tree top Star, which is also made using Neopixel LEDs.
Neopixel ws82xx LEDs: Hell lot of them, we used around 100 LEDs, best to get them in strips form.
Raspberry Pi + PiCam: For live streaming

## The Server: 

Server is hosted on a public domain, you can use AWS, DigitalOcean or any public hosting service. The server in our case is an instance of Ubuntu 16.04 running Mosquitto MQTT broker and Apache2 for hosting the static webpage written in CSS and Javascript backend.

## The frontend:

Front End contains a page where you can see the color palette and live feed of the Christmas tree, on Click event triggers mqtt client which sends value to the topic and Esp8266 listening over the topic will listen to the value from the broker and changes the led color. Thanks to [Akshay Kumar](https://github.com/git-akshay) for creating this amazing frontend for this project


![Fig: Screen grab of the user platform ](https://iayanpahwa.github.io/assets/images/FE/jpg "Fig: Screen grab of the user platform")

## The Backend:

MQTT client publishes value from the page using javascript , we have used Eclipse Paho Javascript library ( https://www.eclipse.org/paho/clients/js/ ) , scroll down for a test program in the link shared or you can find our Github link for whole working js code. Thanks to [Anshul Katta](https://www.linkedin.com/in/anshul-katta-93a48354) for helping with backend, AWS server implementation, Pi camera live feed setup.

include the script - <script src="https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.1/mqttws31.min.js" type="text/javascript"></script>


Raspberry Pi with pi Cam is used to capture live feed, hosting it on localhost webpage using library (https://elinux.org/RPi-Cam-Web-Interface) 

```
git clone https://github.com/silvanmelchior/RPi_Cam_Web_Interface.git
cd RPi_Cam_Web_Interface
./install.sh
./start.sh

```

[ngrok](https://ngrok.com/) is used to make raspberry pi to be hosted online and made accessible from the internet .  (https://ngrok.com/download ) , Choose Linux(ARM) , extract ngrok  in any directory
run command ./ngrok http 80  ( Port 80 is choosen here , you can use any port )
copy the forwarding link from below as http://6e54b569.ngrok.io , through this link you can access your raspberry pi on 80 server from anywhere 

![Fig: ngrok command output](https://iayanpahwa.github.io/assets/images/ng.jpg "Fig: ngrok command output")


After setting uptil here, ngrok link will point you to your raspberry pi camera live feed on URL which look something like this - http://xxxx.ngrok.io/html

There's also a neopixel star created as a tree top bling made with Arduino and neopixel LED running stunning animations. The project is docuemnted on [Instructables](https://www.instructables.com/id/Christmas-Tree-Stop-Star-Bling/) by team member [Abhishek Maurya](https://github.com/iabhi16)

The entire project using AlexaSkill files are opensourced under MIT Lincense and is available at SDIoT [github repo](https://github.com/Team-SDIoT/IoT-Holiday-Lights) . You can control the project sandbox instance running at Greater Noida, India using this [link]() --> http://sdiot.in/sdiot-holiday-light.html

The demo video is available on youtube linked down below:

Video:
<iframe width="560" height="315" src="https://www.youtube.com/embed/XNCqcjIpwTw" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>
