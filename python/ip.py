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
from luma.core.legacy.font import proportional, LCD_FONT

def demo(n, block_orientation, rotate, msg):
  # create matrix device
  serial = spi(port=0, device=0, gpio=noop())
  device = max7219(serial, cascaded=n or 1, block_orientation=block_orientation, rotate=rotate or 0)
  show_message(device, msg, fill="white", font=proportional(LCD_FONT))

if __name__ == "__main__":

  parser = argparse.ArgumentParser(description='matrix_demo arguments',
    formatter_class=argparse.ArgumentDefaultsHelpFormatter)

  parser.add_argument('--string', help='Display the local IP address')

  args = parser.parse_args()

  try:
    demo(4, -90, 0, args.string)
  except KeyboardInterrupt:
    pass
