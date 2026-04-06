---
title: 3D Printed Owl TeaLight — Weekend Project
author: "Ayan Pahwa"
pubDatetime: 2020-07-18T16:50:54.000Z
description: "A weekend project: 3D printing an owl tea light with programmable NeoPixel LEDs, controlled by Adafruit Gemma M0 and CircuitPython with capacitive touch input for color cycling."
ogImage: "/optimized/assets/images/oled/1.webp"
tags: ["3d-printing", "circuitpython", "adafruit", "diy", "neopixel"]
draft: false
---

## Parts Needed

- Access to 3D Printer: If you don't have one at home consider using one from your nearby Maker/Hackerspace or 3D printed service shops
- Soldering Station: To solder LEDs
- Adafruit Gemma M0 Microcontroller: For programming LED effects, you can also use Arduino.
- Neopixel / WS82xx LEDs: One wire interface based addressable LEDs

## Let's Begin

The owl and the base is not my design, I've taken it from Thingiverse. Download the design files links below and do consider donating and supporting (if you can) the original designer Pamela Palitzsch for the amazing owl and Jamie Bolton for the base.

1. Owl stl file
2. Base stl file

## Step 1: Print the Owl

I've printed it using Brown-Gold PLA on my Creality Ender3d printer, sliced using Cura at .2mm layer height, 25% infill, no supports and no rafts.

It took around 5.5 hours to print it at 50mm/s.

## Step 2: Assemble the circuit

I've used 4 neopixel LEDs mounted on custom circular PCB and soldered them together in a daisy chain, that's how addressable LEDs supposed to work and finally soldered the input of first LED to a digital pin of Gemma M0 board and I've also soldered a naked wire to another touch input compatible pin of Gemma M0 which I'll be later using as my capacitive input interface to control the color of the LEDs.

I've also placed a small piece of butter paper to diffuse the LEDs.

P.S - If you print this in PLA like I did, don't use a real candle underneath, it can probably melt it.

I've left a small wire hanging out to which I'll stick copper tape, wrap it around the base to be used to capacitive touch.

## Step 3: Programming

I've used CircuitPython to program the board, the code is really simple and straight-forward.

It used neopixel library to control the color and take input via touchio.

The code is available on my GitHub. You can download and use it using the button below.

So that was all for this project, enjoy your new cute tea light and will see you again soon with a new project.

