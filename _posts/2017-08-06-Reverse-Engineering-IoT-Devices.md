---
title: "Reverse Engineering IoT Devices"
share: true
author_profile: true
header:
  image: /assets/images/re.png
comments: true  
---

### Edit 1: This blog post has been featured on:
#### [Hackaday](http://hackaday.com/2017/08/13/reverse-engineering-a-ble-service-to-control-a-light-bulb/)
#### [O'reilly](https://www.oreilly.com/ideas/four-short-links-16-august-2017)
#### [Apple iBeacons](http://appleibeacons.com/reverse-engineering-a-ble-service-to-control-a-light-bulb-hackaday/)
#### [HckrNews](https://news.ycombinator.com/item?id=15022631)
#### [Appmarsh](https://www.appmarsh.com/reverse-engineering-a-ble-service-to-control-a-light-bulb/), Go Checkout!!

======================================================================


Video:
<iframe width="560" height="315" src="https://www.youtube.com/embed/tbqPOHwuPiw" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>



======================================================================


Talk PPT presented at Indian Linux User Group - Delhi 

======================================================================


Presentation:

<iframe src="//www.slideshare.net/slideshow/embed_code/key/qQt0ysA5V5HUuf" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/AyanPahwa1/reverse-engineering-iot-devices-86475004" title="Reverse engineering IoT Devices" target="_blank">Reverse engineering IoT Devices</a> </strong> from <strong><a href="https://www.slideshare.net/AyanPahwa1" target="_blank">Ayan Pahwa</a></strong> </div>



======================================================================

As an IoT enthusiast and night time security researcher, it always intrigues me, how easy our lives have become with IoT applications which we use on daily basis intuitively, and this scratches that part of my brain which always wanted to see what's going on deep down inside, from using a mobile application to monitoring and controlling devices, what all is making it possible.

I recently bought a smart LED RGB light bulb for my work desk from Amazon, A 7 watts [Syska Smartlight Rainbow LED bulb](http://www.amazon.in/Syska-Smartlight-Rainbow-smart-bulb/dp/B01FXQW3M8?_encoding=UTF8&portal-device-attributes=desktop&psc=1&redirect=true&ref_=oh_aui_detailpage_o01_s01) which can be controlled using a mobile application compatible with Android and Bluetooth. It was fun playing with it, a perfect mood lamp for my study room, blinks to notify of any new whatsApp message on phone, can wake me up in the morning and I can interact with it in so many ways BUT only through it's native application.

Unlike other famous smart light bulbs available in the market like Philips Hue, LIFX etc, this one works on Bluetooth Low Energy rather than WiFi and unlike them it has no API to interact with it your own custom made application. I still bought this knowing all just for it's cheap ₹1300/- price tag and the fact it's made by an Indian company.

After playing with it for couple of weeks, I decided to look whats's under the hood. I've been playing around Bluetooth and Bluetooth LOW energy protocol for quite sometimes now and know the nitty gritty functioning of it ( All thanks to Cypress Semiconductor for sending me a PSoC4 BLE evaluation kit last year ). Basically BLE(short for Bluetooth Low energy), provides a method to make user defined services on communication layer, providing the vendor using BLE in their product with utmost facility to define the protocol profile specific to the device they are making, though the BLE protocol has some already defined profiles such as basic old UART, BLE Heart Rate monitor, Beacons etc, the vendor is free to use what's called GATT or Generic Attribute and create their own custom profile of how they want communication to happen between master and slave.

The fact that this bulb is not using TCP/IP based protocol for communication makes it little hard to reverse engineer, I mean c'mon if it was suppose to be on my home network, things would be bit easier isn't it, I can just use it's MAC or IP to sniff and dump packets in a PCAP file to be later analyzed with Wireshark, it could have been cryptic but easy to sniff, Basically a Man in the Middle sort of thing, even a simple CLI tcpdump would also work, but rather it is using Bluetooth (*sigh*) which is meant for peer-to-peer networking, means at one time the device can only talk to one master.

From some previous project on BLE I knew about an amazing application by Nordic Semiconductor which runs on Android and ios called [nrf connect](https://play.google.com/store/apps/details?id=no.nordicsemi.android.mcp&hl=en) which can be used to explore GATT services and characteristics exposed by the device. I can use this app to connect to my light bulb, know it's Unique Address(sort of MAC address), find which GATT services are exposed by the light bulb and their corresponding characteristics, a good starting point isn't it? I quickly fire up the application on my android device, turn the bluetooth and light bulb on and scan for devices. The device was shown up swiftly with the name 'Cnligh' as shown in screenshot below.

![BLE Scanner](https://iayanpahwa.github.io/assets/images/BLE/1.png "Nordic BLE Scanner")

Connecting it reveals three available GATT services as shown below:
![GATT Services](https://iayanpahwa.github.io/assets/images/BLE/2.png "GATT Services")

The two out of three GATT Services exposed by the light bulb are generic to most of BLE Devices, the 0x1800 for Generic access to device and 0x1801 for Generic stuffs, you can check our [Bleutooth GATT website](https://www.bluetooth.com/specifications/gatt/services) to find more about this and other GATT services. These services defines device names, device type, and status as shown in screenshots below.

![Generic Access: 0x1800](https://iayanpahwa.github.io/assets/images/BLE/3.png "Generic Access:0x1800")

![Generic Attribute: 0x1801](https://iayanpahwa.github.io/assets/images/BLE/4.png "Generic Access:0x1800")

Other than these two, there is one more service exposed by the light bulb which is user-defined, I can tell by seeing it's 128-bit UUID which are meant for vendor defined BLE GATT profiles:

![Vendor Defined service](https://iayanpahwa.github.io/assets/images/BLE/5.png "Vendor defined service")

Now looking at the service I was very much sure that one of the characteristics under this is what is responsible for controlling the color of the light bulb, but I was truly disappointed, as all the services are labelled as unknown characteristics, either to keep it cryptic, a bad coding habit(not defining own service from scratch) or idk what! I was expecting a service named RGB color or something but nothing like that. Provided I've found the service name, UUID I'd be able to try sending some packets and see the results but it was not the case, hence the next step left was only to sniff the packets sent by the BLE app to the bulb. Though I knew from this search the device address, the GATT service and which characteristics is read, write or both enabled, this would be helpful later on.

I heard about a device called [Ubertooth One By Great Scott gadgets](https://greatscottgadgets.com/ubertoothone/) which makes possible sniffing of Bluetooth packets but seeing at the price tag and local availability, I decided to look for an alternative, there were some other hardwares too from Nordic and Cypress Semiconductor but spending more bucks than price of a light bulb wont make sense isn't it.
![ubertoothone](https://iayanpahwa.github.io/assets/images/BLE/ubertooth.png "UberToothOne")

Further Googling, I found on StackOverflow, that with Android KitKat update it is possible to log bluetooth packets in a file, I explored that option, basically you need to enable the option in developer's mode, connect to bluetooth device and interact with it as you do, all the packets transaction will be logged to a file in your SD card with name 'btsnoop_hci'.

If you've android phone with kitkat and above you can enable this feature by going to settings > Developer option > Enable Bluetooth HCI snoop log. This is basicaly a bluetooth debugging tool, after enabling it all the bluetooth transaction will be logged to the file 'btsnoop_hci'. I enabled the feature, and run the app controlling my light bulb changing different colors as I normally would, and focusing more on basic colors this time like pure red, blue and green which would help me filter data stream while analyzing packets, close the app and wolla! the file was actually generated, a merely 20Kb log file which could open the gates to the bulb without opening the hood :P .

![Android Bluetooth Sniffer](https://iayanpahwa.github.io/assets/images/BLE/snoop.png "Android Bluetooth Sniffer")

Next step was to bring the file on my workstation and try to visualize it using Wireshark which is a great tool for stuff like this, I've very basic understanding of using this tool but with some basic tutorial and hands-on, I was able to look around and find some interesting stuff.

The way the bulb could be working is by taking Red, Green, and Blue or so called RGB values from the application and reflecting it by changing corresponding LED colors inside the bulb, or it could be also just taking color name and have a lookup table in it's EEPROM to map the intensities. From couple of past RGB LED based projects, I know from the fact that any color can be mapped with values of Red Green and Blue intensities which are generally in an 8 bit scale. 0-255, 0 means off and 255 means full intensity of that specific color from RGB, and these intensities are varied using a Pulse Width Modulated signal(PWM) from a timer IC or microcontroller. I've made such kind of project in past, if interested go checkout my project [IoT Holicay Lights](https://github.com/iayanpahwa/IoT-Holiday-Lights) and [OpenHAB RGB Controller](https://github.com/iayanpahwa/OpenHab-Particle-MQTT-master), both uses same concept.

If you look closely on the screenshot below, you'll see some interesting things, which caught my eyes immediately, the destination has two kind of tags/values, the localhost, which is ofcourse our android mobile device, and the other is 'Texas Instruments' with a specific Unique address, Googling it, I found it a BLE based chip by Texas Instruments the 'CC2540' which the bulb is probably using, and the UUIDs we collected from examining GATT services were also example code meant for same chip :D So now without opening the bulb we know what's actually inside it ;)

![Wireshark](https://iayanpahwa.github.io/assets/images/BLE/wireshark.png "Analyzing snoop log file using Wireshark")

Investigating further, there are few types of protocol involved in overall communication as can be seen in wireshark- HCI_E, HCI_C, ATT etc. The ATT seems interesting and applying filter for ATT will only show ATT related packets. To only show packets for ATT, I applied filter for Bluetooth Logical Link Control and Adaptation Protocol (btl2cap) and tried to analyze the packets sent from my local host to light bulb.

After investigating 20-40 different packets, I was able to identify the string which had recurrence with slight changes, and here it is

###### Value: 00100006000a03000101000025ff00000000
###### Value: 00110006000a030001010049ff0000000000
###### Value: 00120006000a0300010100ff000000000000
###### Value: 00130006000a030001010049ff0000000000
###### Value: 00140006000a03000101000025ff00000000


### Found the pattern yet? Let me make it a bit easy for you:

###### Value: 0010000 6000a0300010100  0025ff  00000000
###### Value: 0011000 6000a0300010100  49ff00  00000000
###### Value: 0012000 6000a0300010100  ff0000  00000000
###### Value: 0013000 6000a0300010100  49ff00  00000000
###### Value: 0014000 6000a0300010100  0025ff  00000000

The first set is clearly an incrementing string, some sort of serial number for packets(maybe), which could be a write instruction Opcode or jsut packet number, the last set is just string of 8 zeroes. The middle string is where all the magic is happening, and I was so happy to see it's just exactly as I was speculating, 6 bytes of string with 2 byte each for Red Blue and Green Color:

###### 0025ff  --> 00 25 ff (Red off, Blue at 25 and Green at full intensity)
###### 9ff00  
###### ff0000  
###### 49ff00  
###### 0025ff   and so on .........

![Wireshark Packet Analysis](https://iayanpahwa.github.io/assets/images/BLE/ws.png "Wireshark Packet Analysis")


By this way if you want to produce Blue color you can use string 00ff00 concatenated between the uuid and eight zeroes like BLE Packet containing *"00140006000a030001010000ff0000000000"* and send it to bulb over BLE on that specific address of characteristic which is exposed by GATT, this is all good in theory. In actual practice it could be a reversed string also, like instead of RGB it could be BGR(another common way of color representation), or it can be (255-value) in case of common anode LEDs, where 0 means full brightness and 255 means off, still controllable, but worst it can be nothing, meaning it's not what responsible for controlling colors, can't really tell without controlling it ;) That't the most exciting thing in reverse engineering, you never know ;). The best way to tell this is by controlling it without using the native Syska bulb app.

I decided to use Bluez software stack which is available on Linux and I used my KALI Linux VM machine, because why not? Ain't we hacking? :P, Anyway, jokes apart, It is only possible to control the light bulb if you have an integrated Bluetooth in your workstation or you can use a USB Bluetooth Dongle which supports Bluetooth Low Energy, (LE v4). I am pretty sure that my Macbook Air has one. I set up my virtual machine to use host's ( Macbook air's ) built-in bluetooth hardware using USB passthrough feature of virtualbox. At this point I am not sure if Kali have supported driver for it but lets give it a shot, I do have a raspberry pi 3 with bluetooth support as a backup but first I shall use this option.

In my linux VM, I opened the terminal and checked if the device has been detected by running:

```
root@kali:~# hciconfig
hci0:	Type: Primary  Bus: USB
	BD Address: E0:AC:CB:81:CE:37  ACL MTU: 1021:8  SCO MTU: 64:1
	UP RUNNING
	RX bytes:1859 acl:2 sco:0 events:106 errors:0
	TX bytes:3059 acl:3 sco:0 commands:94 errors:0
```
Awesome! The device have been detected, now it's time to install required packages

I've worked with bluez stack before, but just to be sure I've all the necessary packages, run:

```
root@kali:~# apt-get install bluez bluez-hcidump, bluez-tools
```
Now to scan the BLE devices by running:
```
root@kali:~# hcitool lescan
LE Scan ...
88:C2:55:CA:F0:36 (unknown)
88:C2:55:CA:F0:36 Cnligh
```
Notice the device Cnligh which is our light bulb with same address as seen on nordic app, the other device is probably my smart fitness tracker band.

#### *If you cannot find the device, make sure bulb is powered on and not connected to your phone as BLE only scan peer-to-peer communication.*

Next we'll connect to this device using following command:
```
root@kali:~# gatttool -I
[                 ][LE]> connect 88:C2:55:CA:F0:36
Attempting to connect to 88:C2:55:CA:F0:36
Connection successful
[88:C2:55:CA:F0:36][LE]>
```

Here I've used gatttool Bleuz utilitiy to connect to the bulb using it's address:

#### Note: If you see any error such as connection refused, add following lines to the file *'/etc/bluetooth/main.conf'* to enable GATT
```
EnableLE = true           // Enable Low Energy support. Default is false.
AttributeServer = true    // Enable the GATT attribute server. Default is false.
```
and restart the service using :
`root@kali:~# etc/init.d/bluetooth restart` and try reconnecting again

Once you're connected with the light bulb you can explore it further:
```
[88:C2:55:CA:F0:36][LE]> help
help                                           Show this help
exit                                           Exit interactive mode
quit                                           Exit interactive mode
connect         [address [address type]]       Connect to a remote device
disconnect                                     Disconnect from a remote device
primary         [UUID]                         Primary Service Discovery
included        [start hnd [end hnd]]          Find Included Services
characteristics [start hnd [end hnd [UUID]]]   Characteristics Discovery
char-desc       [start hnd] [end hnd]          Characteristics Descriptor Discovery
char-read-hnd   <handle>                       Characteristics Value/Descriptor Read by handle
char-read-uuid  <UUID> [start hnd] [end hnd]   Characteristics Value/Descriptor Read by UUID
char-write-req  <handle> <new value>           Characteristic Value Write (Write Request)
char-write-cmd  <handle> <new value>           Characteristic Value Write (No response)
sec-level       [low | medium | high]          Set security level. Default: low
mtu             <value>                        Exchange MTU for GATT/ATT


[88:C2:55:CA:F0:36][LE]> primary
attr handle: 0x0001, end grp handle: 0x000b uuid: 00001800-0000-1000-8000-00805f9b34fb
attr handle: 0x000c, end grp handle: 0x000f uuid: 00001801-0000-1000-8000-00805f9b34fb
attr handle: 0x0010, end grp handle: 0xffff uuid: 0000f371-0000-1000-8000-00805f9b34fb


[88:C2:55:CA:F0:36][LE]> characteristics
handle: 0x0002, char properties: 0x02, char value handle: 0x0003, uuid: 00002a00-0000-1000-8000-00805f9b34fb
handle: 0x0004, char properties: 0x02, char value handle: 0x0005, uuid: 00002a01-0000-1000-8000-00805f9b34fb
handle: 0x0006, char properties: 0x0a, char value handle: 0x0007, uuid: 00002a02-0000-1000-8000-00805f9b34fb
handle: 0x0008, char properties: 0x08, char value handle: 0x0009, uuid: 00002a03-0000-1000-8000-00805f9b34fb
handle: 0x000a, char properties: 0x02, char value handle: 0x000b, uuid: 00002a04-0000-1000-8000-00805f9b34fb
handle: 0x000d, char properties: 0x20, char value handle: 0x000e, uuid: 00002a05-0000-1000-8000-00805f9b34fb
handle: 0x0011, char properties: 0x0a, char value handle: 0x0012, uuid: 0000fff1-0000-1000-8000-00805f9b34fb
handle: 0x0014, char properties: 0x0a, char value handle: 0x0015, uuid: 0000fff2-0000-1000-8000-00805f9b34fb
handle: 0x0017, char properties: 0x0a, char value handle: 0x0018, uuid: 0000fff3-0000-1000-8000-00805f9b34fb
handle: 0x001a, char properties: 0x0a, char value handle: 0x001b, uuid: 0000fff4-0000-1000-8000-00805f9b34fb
handle: 0x001d, char properties: 0x0a, char value handle: 0x001e, uuid: 0000fff5-0000-1000-8000-00805f9b34fb
handle: 0x0020, char properties: 0x0a, char value handle: 0x0021, uuid: 0000fff6-0000-1000-8000-00805f9b34fb
handle: 0x0023, char properties: 0x0a, char value handle: 0x0024, uuid: 0000fff7-0000-1000-8000-00805f9b34fb
handle: 0x0026, char properties: 0x0a, char value handle: 0x0027, uuid: 0000fff8-0000-1000-8000-00805f9b34fb
handle: 0x0029, char properties: 0x10, char value handle: 0x002a, uuid: 0000fff9-0000-1000-8000-00805f9b34fb
[88:C2:55:CA:F0:36][LE]>
```

Now let's try to control the color of light bulb as we've speculated by sending command for red color:
`[88:C2:55:CA:F0:36][LE]> char-write-cmd 0x0012 00140006000a0300010100ff000000000000`
and it literally does changed it color to RED! Awesome :D

Lets try Blue:
```
[88:C2:55:CA:F0:36][LE]> char-write-cmd 0x0012 00140006000a030001010000ff0000000000`
```
and Green
```
[88:C2:55:CA:F0:36][LE]> char-write-cmd 0x0012 00140006000a03000101000000ff00000000`
```
And everything works as expected even keeping the first string of serial number same(non-incrementing) :D

'char-write-cmd' is basically sending a string message to address 0x0012 which we found by analyzing bluetooth traffic in Wireshark. So now we've a working API to control our very own Bluetooth LE Smart Light bulb.

### DEMO
To demonstrate the working I've prepared a small bash script which cycles color of bulb to Red --> Green --> Blue --> White -- > Off
```
#!/bin/bash

echo "Controlling SYSKA Smart light bulb"
sleep 3
echo "Look Mah! No App ;)"
sleep 3

while true;
do
gatttool -i hci0 -b 88:C2:55:CA:F0:36 --char-write-req -a 0x0012 -n 00100006000a030001010000000000000000 > /dev/null
sleep 3
echo "RED"
gatttool -i hci0 -b 88:C2:55:CA:F0:36 --char-write-req -a 0x0012 -n 00100006000a0300010100ff000000000000 > /dev/null
sleep 3
echo "GREEN"
gatttool -i hci0 -b 88:C2:55:CA:F0:36 --char-write-req -a 0x0012 -n 00100006000a030001010000ff0000000000 > /dev/null
sleep 3
echo "BLUE"
gatttool -i hci0 -b 88:C2:55:CA:F0:36 --char-write-req -a 0x0012 -n 00100006000a03000101000000ff00000000 > /dev/null
sleep 3
echo "WHITE"
gatttool -i hci0 -b 88:C2:55:CA:F0:36 --char-write-req -a 0x0012 -n 00100006000a0300010100ffffff00000000 > /dev/null
sleep 3
echo "OFF"
gatttool -i hci0 -b 88:C2:55:CA:F0:36 --char-write-req -a 0x0012 -n 00100006000a030001010000000000000000 > /dev/null
done
exit 0
```
Script also available on [Github](https://github.com/iayanpahwa/ReverseEngineeringIoTDevices)

You can mimic any color using RGB values from a color picker like a [HTML color picker](https://www.w3schools.com/colors/colors_picker.asp).


Video:
<iframe width="560" height="315" src="https://www.youtube.com/embed/g1_8cY--fIM" frameborder="0" allowfullscreen></iframe>

### Thoughts
Though it was a fun project to reverse engineer the functioning of an IoT Device, it was sad to see the packets were not cryptic or ciphered. Companies are focusing on reducing time to market of their IoT product but in this process they're not taking utmost measure to secure there devices, this is a mere Bluetooth Smart bulb which cannot do much cyber harm and damage, the best a hacker can do is change your room lights color :P, but think of same as your smart door lock, then the entry to your garage or home can be compromised, or a tcp based device which can act as botnet in time of DDoS attacks, The most disappointed part is seeing vendor using example codes by chip-manufacturers, Texas Instruments in this case. Not even changing 128-bit UUID flexibility of which is provided by Bluetooth protocol itself.

### Next step
Since I've a working API now, I am planning to make a small project, fetching weather data of my location from an online service such as Yahoo Weather or Weather Underground and making my bulb reflect to weather changes, like breathing blue in case of rain, white if bright sunny or orange on a warm day. I may use Python Bluez API(pyBlue or something) Stay Tuned and thanks for reading :)
