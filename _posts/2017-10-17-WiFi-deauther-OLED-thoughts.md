---
title: "WiFi deAuther OLED v2.5 thoughts and review"
share: true
author_profile: true
header:
  image: /assets/images/wifi.png
comments: true  

---
I recently came across a cool open source project [esp8266_deauther](https://github.com/spacehuhn/esp8266_deauther) , which uses my favourite WiFi SoC the ESP8266 to inject DeAuth packets on a WiFi Access point. DeAuth packet is generally used by WiFi 802.11 protocol to safely disconnect the devices from an Access Point, since it's unencrypted and only require AP's MAC Address it is easy to spoof and this attack can thus be performed even using those devices which are not connected to that Access Point such as our ESP8266 in this case.  

The attack is launched as a continuous instance, hence all the devices will keep disconnecting and connecting to that AP against which it is being used, jamming the clients to use AP a sort of Denial of service attack we can say? Maybe ;-). Other than this it can use to launch beacon probe attack which make multiple access points with similar SSID as the attack vector AP. I shall add a screenshot below where I used beacon flood against my home AP named "NEXTRA1918", it created multiple AP(s) with same SSID, making it impossible for someone to figure out which one to connect.

![Beacon Flood](https://iayanpahwa.github.io/assets/images/beacon.png "Beacon Flood Attack")

I've previously used the release firmware binary from project's github page and flash it on a NodeMCU board to test it and it worked. The entire functionality can be controlled over a webpage hosted by esp8266 itself but I Later discovered a dedicated board for this with an OLED display selling on [Tindie](https://www.tindie.com/products/lspoplove/wifi-deauther-oled-v25-case-and-antenna/) and decided to purchase it, as it is directly suporting the developer of this cool project.

Few thoughts on the board:

1. The white silk screen looks really good and the quality of PCB is also nice.
2. USB connector was not properly soldered and it ripped off completely taking a PAD off along.
3. 8dbi antenna provided a really long range, and buttons along with OLED provides intuitive UI.
4. I used 18650 battery and don't know why but it smoked out as soon as I plugged in, burning the power supply circuitory, I am pretty sure it was not reverse polarity, even though I assume the board has reverse polarity protection and battery charging circuit.
P.S I've not asked for replacement and refund...

![DeAuth Board](https://iayanpahwa.github.io/assets/images/board.png "DeAuth Board")

Overall the concept is nice with a dedicated OLED display but poor Quality control. I shall add the board pic down below, more pics and video are there on Tindie product page. I've removed battery holder and using it off a USB cable to power connector which I made using a Servo connector and powering it from provided pin header slots.

I remember a similar kind of project which I used back in my undergrad days which doesn't deAuth entire AP but jammed client connected to an AP, making it impossible for them to stay connected till the attack instance is running. It's an open source project based on Python called [KickThemOut](https://github.com/k4m4/kickthemout) and it require you to be on same network as the clients you want to deAuth. Clone it from github on your linux or OSX workstation and it can be used for similar kind of applications.

##### How to protect your Access point against DeAuth and Beacon Flood attacks?

Update/Upgrade your router to support management frame protection, Rare but important thing manufacturers miss out to support. For beacon flood attack I'm not sure if theres a way to protect it from, device is just creating APs with same SSID and you cannot stop anyone to do that, can you? :P

### Disclaimer: Don't use it against an Access point which you don't own. It's meant for pentesting not black hat stuffs :P
