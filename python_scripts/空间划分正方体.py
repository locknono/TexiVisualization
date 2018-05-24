# -*- coding: utf-8 -*-
"""
Created on Wed May 23 20:17:35 2018

@author: 44219
"""

top = 22.80550
bottom = 22.454
left = 113.75643
right = 114.65191

#划分每行500个正方形
colCount=500

borderLength=(left-right)/colCount

rowCount=(top-bottom)/borderLength

matrixList=[]

for i in range(rowCount):
    for j in range(colCount):
        centerLat=top-borderLength*0.5+i*borderLength
        centerLng=left+borderLength*0.5+j*borderLength
        center=[centerLat,centerLng]
        matrixList.append('')
        


