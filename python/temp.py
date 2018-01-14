#!/usr/bin/python
# -*- coding: utf-8 -*-
import sys
import Adafruit_DHT
import re
import time
import argparse
import json

from luma.led_matrix.device import max7219
from luma.core.interface.serial import spi, noop
from luma.core.render import canvas
from luma.core.virtual import viewport
from luma.core.legacy import text, show_message
from luma.core.legacy.font import proportional, CP437_FONT, TINY_FONT, SINCLAIR_FONT, LCD_FONT

def demo(n, block_orientation, rotate):
  # create matrix device
  serial = spi(port=0, device=0, gpio=noop())
  device = max7219(serial, cascaded=n or 1, block_orientation=block_orientation, rotate=rotate or 0)
  Humidity, Celsius = Adafruit_DHT.read_retry(11, 4)
  Fahrenheit = 9.0/5.0 * Celsius + 32
  print json.dumps({ 'temp': Fahrenheit, 'humidity': Humidity })
  msg = 'Temp: {0:0.1f} F  Humidity: {1:0.1f} %'.format(Fahrenheit, Humidity)
  show_message(device, msg, fill="white", font=proportional(CP437_FONT))

if __name__ == "__main__":
  try:
    demo(4, -90, 0)
  except KeyboardInterrupt:
    pass
