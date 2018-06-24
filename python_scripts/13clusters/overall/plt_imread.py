# -*- coding: utf-8 -*-
"""
Created on Sat Jun 23 15:35:04 2018

@author: 44219
"""


from __future__ import print_function

import numpy as np
import matplotlib.cm as cm
import matplotlib.pyplot as plt
import matplotlib.cbook as cbook
from matplotlib.path import Path
from matplotlib.patches import PathPatch

with cbook.get_sample_data('D:/top_mosaic_09cm_area1.tif') as image_file:
    image = plt.imread(image_file)

fig, ax = plt.subplots()
ax.imshow(image)
ax.axis('off')
w, h = 512, 512
plt.show()