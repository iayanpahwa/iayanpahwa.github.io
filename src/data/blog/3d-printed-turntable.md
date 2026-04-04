---
title: DiY motorised 3D Printed TurnTable
author: "Ayan Pahwa"
pubDatetime: 2021-07-08T09:47:19.000Z
description: "Building a motorised 3D printed turntable using Adafruit M4 Feather and DC motor FeatherWing to create smooth 360° showcase videos of 3D prints."
tags: []
draft: false
---

## Problem Statement

![TurnTable overview](/optimized/assets/images/turntable/1.webp)
I like to show my 3D prints on Instagram and Youtube and while a still photo is a great way to show often people have asked for a 360* video showcasing the thing in more immersive manner, and to achieve the same I decided to build a TurnTable.

## The Idea !!

I had many ideas about how to go about this but I am not a very big fan of re-inventing the wheel.

I already had a Adafruit M4 board feather board and a DC motor/stepper feather wing lying around which I planned on using.

I look up thingiverse for similar projects and found many but none of the electrical one was around the platform I wanted to use so I decided to tweak a manual mechanical hand crank lever based turntable and convert it into the electrical one using a DC motor.

## Implementation

I am not a very experienced and skill CAD designer but I know how to combine basic shapes and cut holes.

The plan was to remove the hand crank and replace it with a shaft coupler that connects to the shaft of a Geared DC motor.

So I quickly designed the same using tinkercad and after 2 prototypes I had exactly what I needed.

The next thing is to create a sort of platform which can mount the DC motor, house the electronics and have a hole for Potentiometer which I'll use to change the RPM of the motor, it was quite straightforward but to get all the measurements right it took about 5 different iterations.

## Parts & Assembly

![Parts and components](/optimized/assets/images/turntable/2.webp)

The brain of the project is Adafruit M4 Express feather board which is definitely very overkill for this project but I'd a few lying around and it's pretty compact so I decided to use it.

To control the motor I'm using Adafruit DC Motor + Stepper FeatherWing which comes with a super simple CircuitPython Library to control motor RPM.

This featherWing can control 4 DC or 2 stepper motor.

I've used 12v 3.5RPM high torque geared DC motor which I ordered from amazon.

To control the RPM of motor or the speed of turntable I used a 10K potentiometer.

The overall circuit is made compact using FeatherWing Doubler - Prototyping board.

![Assembled circuit](/optimized/assets/images/turntable/3.webp)

## Code

The program is written in CircuitPython, it just reads the potentiometer and rotate the motor with required RPM in required direction.

Download the code from Github.

## Final thoughts!

This is not the smoothest of turntable out their but it's a great cheap run & gun weekend project which solved my need and saves me some cash from not buying a professional setup which I definitely don't need.

Few things I tweaked to get better results:

1. Use a high torque, low RPM DC motor
2. Mount the base of turntable on a vibration dampening surface like clay or TPU stands
3. Sand and Oil the inside of gear assembly to get smooth rotations.

Finally you can check the result on my Instagram reel below — a post shared by DiY Technology W/ Ayan Pahwa (@iayanpahwa).
