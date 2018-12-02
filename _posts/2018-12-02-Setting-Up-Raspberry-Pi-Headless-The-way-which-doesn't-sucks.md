---
title: "Setting Up Raspberry Pi Headless - The way which doesn't sucks"
share: true
author_profile: true
header:
  image: /assets/images/rpi.jpg
comments: true  
---

Setting up a Raspberry Pi for the very first time is always in a pain in the a**, especially when you're at a hackathon and don't have access to a spare montior, keyboard and mouse to plug it in and setup, or you don't want to do that instead just wanted to use it headless over ssh remotely. But again you need to bring pi to your home network either using LAN cable or WiFi, If you don't have access to router physically option 1 rules out. Another issue is ssh is disabled by default for security reasons. In this blog I'll share one simple way to connect to WiFi and enable ssh even before booting in for the very first time, and this way is as easy as creating files in linux ;)

<iframe width="560" height="315" src="https://www.youtube.com/embed/TYSKECcTr7c" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


So first step is to download latest raspbian image, flash it onto the micro SD card, if you need any assistance in that department check video above

After the image is flashed, your SD card will show a 'boot' partition, with linux and dtb files required to boot the Pi.

Now in this partition we need to create a file with exact name -> wpa_supplicant.conf. This will save our WiFi credentials which later will be parsed to connect to WiFi hotspots. The content of the file must exact be as follows:

```

ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

 
network={
    ssid="YOURSSID"
    psk="YOURPASSWORD"
    scan_ssid=1
}

```

Replace it with your router/hotspot name/SSID and password and save the file.

The next step is to enable the ssh, it can be easily done by just creating a file name 'ssh' in boot partition.

```
touch ssh
```

and that will be all, now eject the SD card, plug it into the Pi and boot it in range of the hotspot. Once booted you'll be able to ping and ssh into the pi:

```
ping raspberrypi.local
ssh pi@raspberrypi.local
```

### Explanation

Raspberry Pi runs on debian derived raspbian which uses a package called wpa_supplicant to do WiFi stuff - connect/disconnect . wpa_supplicant uses a file called wpa_supplicant.conf to store credentials on known APs, here at boot it will take this file and parse information to conenct to the WiFi.

You can also use wpa_supplicant to manually connect to router using following command:

 ```
 wpa_supplicant -Dwext -iwlan0 -c/etc/wpa_supplicant/wpa_supplicant.conf &
 ```

 -D refers to driver, in this case wext which is a newer one, a few years back nl80211 was more common WiFi driver
 -i refers to WiFi interface of the machine
 -c refers to configuration file location

Note: This will only authenticate with router, but you'll still need to request an IP address from DHCP server running on router, You can do this with the help of command:

```
dhclient -v wlan0
```

Cheers! :D
