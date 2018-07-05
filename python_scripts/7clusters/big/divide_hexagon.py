# -*- coding: utf-8 -*-
"""
Created on Thu May 10 12:31:36 2018

@author: 44219
"""

import math
import json
import rootPath

top = rootPath.top
bottom = rootPath.bottom
left = rootPath.left
right = rootPath.right

sideLength=rootPath.sideLength

rowWidth=2*sideLength*math.cos((math.pi/180)*30)
print(rowWidth)
rowCount=int((right-left)/rowWidth)
print(rowCount)
colCount=int(((top-bottom-0.5*sideLength)/(3*sideLength))*2)
print(colCount)


hexagonList=[]
for j in range(0,rowCount+1):
    for i in range(0,colCount+1):
        if(i%2==0):
            pointLng=left+j*rowWidth
        else:
            pointLng=left+j*rowWidth+sideLength*math.cos((math.pi/180)*30)
            
        pointLat=top-1.5*i*sideLength
        point={}
        point['lat']=pointLat
        point['lng']=pointLng
        point['row']=i
        point['col']=j
        point['category']=-1
        hexagonList.append(point)
        point1=[pointLat-sideLength/2,pointLng-sideLength*math.cos((math.pi/180)*30)]
        point2=[pointLat+sideLength/2,pointLng-sideLength*math.cos((math.pi/180)*30)]
        point3=[pointLat+sideLength,pointLng]
        point4=[pointLat+sideLength/2,pointLng+sideLength*math.cos((math.pi/180)*30)]
        point5=[pointLat-sideLength/2,pointLng+sideLength*math.cos((math.pi/180)*30)]
        point6=[pointLat-sideLength,pointLng]
        path=[point1,point2,point3,point4,point5,point6,point1]
        point['path']=path

with open(rootPath.rootPath+'hexagon.json','w',encoding='utf-8') as f:
    writeStr=json.dumps(hexagonList)
    f.write(writeStr)
    
        
    
