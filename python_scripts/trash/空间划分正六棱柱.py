xiangwoxi # -*- coding: utf-8 -*-
"""
Created on Wed May 23 20:26:42 2018

@author: 44219
"""

import math
import json

top = 22.80550
bottom = 22.454
left = 113.75643
right = 114.65191


sideLength=(right-left)/350
rowWidth=2*sideLength*math.cos((math.pi/180)*30)
print(rowWidth)

#rowCount代表每行有多少列
rowCount=int((right-left)/rowWidth)
print(rowCount)

#colCount代表每列有多少行
colCount=int(((top-bottom)/(3*sideLength))*2)
print(colCount)


hexagonList=[]
for j in range(0,rowCount+1):
    for i in range(0,colCount+1):
        #i代表行
        #j代表列
        
        
        point={}
        point['category']=-1
        
        if(i%2==0):
            pointLng=left+j*rowWidth
        else:
            pointLng=left+j*rowWidth+sideLength*math.cos((math.pi/180)*30)
        pointLat=top-1.5*i*sideLength
        
        point['lat']=pointLat
        point['lng']=pointLng
        point['row']=i
        point['col']=j
        
        
        
        point1=[pointLat-sideLength/2,pointLng-sideLength*math.cos((math.pi/180)*30)]
        point2=[pointLat+sideLength/2,pointLng-sideLength*math.cos((math.pi/180)*30)]
        point3=[pointLat+sideLength,pointLng]
        point4=[pointLat+sideLength/2,pointLng+sideLength*math.cos((math.pi/180)*30)]
        point5=[pointLat-sideLength/2,pointLng+sideLength*math.cos((math.pi/180)*30)]
        point6=[pointLat-sideLength,pointLng]
        path=[point1,point2,point3,point4,point5,point6,point1]
        point['path']=path
        point['pointCount']=0
        point['z']=[]
        for s in range(24):
            prism = {}
            prism['c']=-1
            prism['value']=0
            point['z'].append(prism)
            
        hexagonList.append(point)


matrix=[]
maxRow=hexagonList[len(hexagonList)-1]['row']
for j in range(maxRow+1):
    rowList=[]
    for i in hexagonList:
        if(i['row'] == j):
            i['value']=0
            rowList.append(i)
    matrix.append(rowList)
    
    
with open('D:/Texi/myapp/public/data/prism/hexPrism.json','w',encoding='utf-8') as f:
    writeStr=json.dumps(matrix)
    f.write(writeStr)