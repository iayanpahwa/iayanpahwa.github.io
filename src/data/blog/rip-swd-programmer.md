---
title: "Raspberry Pi as SWD Programmer: Flash CircuitPython on Particle Xenon"
author: "Ayan Pahwa"
pubDatetime: 2020-04-22T17:20:51.000Z
modDatetime: 2026-04-05T10:00:00.000Z
description: "How to use a Raspberry Pi as an SWD programmer with OpenOCD to flash the CircuitPython UF2 bootloader onto a Particle Xenon (Nordic NRF52840) board."
tags: ["raspberry-pi", "circuitpython", "embedded-systems", "tutorial"]
draft: false
featured: false
---

If you have used Arduino, you'd know how easy it it to program the microcontroller, just press the upload button on the IDE and your program is magically flashed to the chip.

That is because of a serial bootloader allowing you to flash new code without an external programmer and that's why bootloaders are great. With more advanced microcontrollers coming up, having high processing speeds and large memory, more sophisticated bootloaders have also evolved and became a reality, such as UF2 or USB Flashing Format bootloader developed by Microsoft, which mounts your uC as a drive on your system and you can drag your hex file to that drive to flash it with new piece of code, hence needed no extra serial drivers such as FTDI or CPxx.

The ease of CircuitPython comes from it's UF2 bootloader.

But you still need an external programmer to flash that bootloader one time, after which things get easy but you still have to go thru that one time process called bootloading a chip.

In the case of Arduino Uno like boards which are essentially AVR architecture, cheap programmers are available working on SPI protocol, but for these advanced uC such as ARM cortex M0, M4 etc series, some advanced programmers are needed and they changed from manufacturer by manufacturer, company by company, architecture by architecture on both hardware and software usage level.

Some common programmers and debuggers protocols are JTAG, Lauterbach, ST-LINK, and one of the most common one which we going to need is SWD programmer/debugger.

![AVR ISP programmer](/optimized/assets/images/swd/1.webp) 

A good SWD programmer with lifetime of updates (uC profiles) can cost about 100$ such as Seggar J-Link, it also has a cheaper educational version as well.

I have ordered mine but haven't received it yet because of the whole pandemic situation but I wanted one right now because recently particle announced that they're withdrawing support for their Xenon lines of boards and I've couple of xenon boards and since they run on Nordic NRF52840 SoC it can run CircuitPython.

In fact CircuitPython has a port of it already with Adafruit's UF2 bootloader.

But the board defaults comes with particle boot loader so in order to use CircuitPython we need to re-flash a new boot loader and to do that we need an SWD programmer which can connect to the on-board mini JTAG connector.

Most of the programmers-debuggers I've mentioned above comes with their own set of software and integrations with IDEs but there is one amazing open source project called OpenOCD which can work on different debuggers and uC platforms, having profile of almost all available ARM Cortex SoC and the best part about OpenOCD is that it has support for Raspberry PI GPIO bit-bang programmer profile which means that we can use Raspberry Pi GPIOs to behave as a programmer pins and connect it to our uC to flash bootloaders, this is implemented using bit-banging a concept of using GPIOs to implement a protocol.

So I decided to use my raspberry pi 3 to flash CircuitPython on the Particle xenon boards, and here are the steps to do that on a raspberry pi:

## Step 1: Install openOCD and its dependencies

```bash
sudo apt-get install autoconf libtool libusb-dev
git clone --recursive git://git.code.sf.net/p/openocd/code openocd-code
cd openocd-code
```

## Step 2: Build openOCD with Raspberry Pi GPIO support

```bash
./bootstrap
./configure --enable-bcm2835gpio
make
sudo make install
```

## Step 3: Prepare a config file to use Raspberry Pi GPIOs as programmer

```bash
mkdir openocd-config
cd openocd-config
nano openocd.cfg
```

Paste the following into `openocd.cfg`:

```
interface bcm2835gpio

# Raspi1 peripheral_base address
# bcm2835gpio_peripheral_base 0x20000000
# Raspi2 and Raspi3 peripheral_base address
bcm2835gpio_peripheral_base 0x3F000000

# Raspi1 BCM2835: (700Mhz)
# bcm2835gpio_speed_coeffs 113714 28
# Raspi2 BCM2836 (900Mhz):
# bcm2835gpio_speed_coeffs 146203 36
# Raspi3 BCM2837 (1200Mhz):
bcm2835gpio_speed_coeffs 194938 48

# SWD GPIO set: swclk swdio
bcm2835gpio_swd_nums 25 24

transport select swd

set CHIPNAME nrf52840
source [find target/nrf52.cfg]

# Uncomment & lower speed to address errors
# adapter_khz 1000

init
targets
reset halt
```

Save the file.

## Step 4: Prepare the hardware

You need to connect SWDIO pin of the xenon board to GPIO 24 and SWDCLK of xenon to GPIO 25. Additionally you also need to connect ground and power which I did by connecting Xenon to raspberry pi USB port.

SWD and SWC pins on xenon boards are not broken out but are available on the mini JTAG port so you need a cable to expose the pins out, since I didn't have the cable I soldered two cables directly on the pin headers, which I won't recommend unless you're good at soldering.

![SWDIO to GPIO24, SWCLK to GPIO25 wiring](/optimized/assets/images/swd/2.webp) 

## Step 4 (IMPORTANT): Put Xenon board in DFU mode

This is an important step, I spend 2 hours banging my head around until I did this, so in order to refresh the bootloader you need to first put the Xenon board to DFU mode and the way to do it is to press both MODE and RESET button at same time for about 2 seconds and then release the RESET button but continue holding the MODE button until the on-board RGB LED start flashing in green colour.

## Step 5: Download the bootloader file

You need the hex file of bootloader which you want to flash, you can build it yourself using the instructions provided on Adafruit GitHub repo https://github.com/adafruit/Adafruit_nRF52_Bootloader or you can directly download from the releases page. In the same directory as our config file run:

```bash
wget https://github.com/adafruit/Adafruit_nRF52_Bootloader/releases/download/0.3.2/particle_xenon_bootloader-0.3.2_s140_6.1.1.hex
```

This will download the bootloader hex file for xenon. If you are using some other NRF based board download the relevant file and do check for updates before downloading — you should always download the latest release.

## Step 6: Start OpenOCD

![OpenOCD setup on Raspberry Pi](/optimized/assets/images/swd/3.webp) 

Now that we have done the setup and have everything we need, from the same directory run:

```bash
sudo openocd
```

You'll get some output like this:

```
Open On-Chip Debugger 0.10.0+dev-00689-g6c2020eb (2019-02-11-21:41)
Licensed under GNU GPL v2
...
Listening on port 6666 for tcl connections
Info : Listening on port 4444 for telnet connections
```

Now open a new terminal window and in the same directory as the config file run:

```bash
telnet localhost 4444
```

If it says telnet not found, install it:

```bash
sudo apt install telnet
```

## Step 7: Flash the bootloader

Execute the following commands in order in the telnet session:

```
flash write_image <name of the hex file>
verify_image <name of the hex file>
reset run
```

The `verify_image` output should say "verified". If not, repeat after checking connections.

## Step 8: Flashing CircuitPython

If everything worked fine, you have UF2 bootloader on the board and the next step is to flash the CircuitPython binary. I usually do it on my host computer and not raspberry pi.

Plug the xenon board to your computer and it should appear as a drive named XENONBOOT.

- Download the latest CircuitPython image for xenon board from the CircuitPython downloads page
- Drag the uf2 image to the drive

The old drive will disappear and you'll see a new drive with name CIRCUITPY — and voilà!! You can run CircuitPython on your Xenon board.

**Note:** Currently the on-board RGB LEDs are not user usable because of the way board is configured in CircuitPython, however I am gonna propose changes and might open a PR to CircuitPython to make it available to use for Xenon board. Rest everything is working fine with latest CircuitPython 5.x release including the Bluetooth Low Energy features.

![Particle Xenon board](/optimized/assets/images/swd/4.webp)

![CircuitPython on Xenon](/optimized/assets/images/swd/5.webp)  

---

Special thanks to:
- https://www.rototron.info/circuitpython-nrf52840-dongle-openocd-pi-tutorial/ for setup pointers
- https://docs.particle.io/tutorials/learn-more/xenon-circuit-python/ for setup pointers
- https://adafruit.com for spending time and open sourcing UF2 bootloader port for NRF
- https://circuitpython.com project
