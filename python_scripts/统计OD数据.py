# -*- coding: utf-8 -*-
"""
Created on Tue May 29 19:17:07 2018

@author: 44219
"""

import os
import csv
from itertools import islice  
import json
import math
import pandas as pd
from collections import Counter
import numpy as np
import matplotlib.pyplot as plt
import random
from sklearn.datasets import make_blobs
import copy
import decimal
import numpy as np

with open('D:/Texi/myapp/public/data/drawData/asd.json','r',encoding='utf-8') as f:
    hexagonList=json.loads(f.read())


top = 22.80550
bottom = 22.454
left = 113.75643
right = 114.65191

sideLength=(right-left)/150

rowWidth=2*sideLength*math.cos((math.pi/180)*30)

#colCount代表列数
colCount=int((right-left)/rowWidth)

rowCount=int(((top-bottom)/(3*sideLength))*2)


maxRow=0
for i in range(len(hexagonList)):
    if hexagonList[i]['row']>maxRow:
        maxRow=hexagonList[i]['row']
        
hexagonListDF=pd.DataFrame(hexagonList)

classCount=len(hexagonListDF.groupby(['category']))

matrix=[]

for j in range(maxRow+1):
    rowList=[]
    for i in hexagonList:
        if(i['row'] == j):
            i['value']=0
            i['kClass']=-1
            rowList.append(i)
    matrix.append(rowList)



fp = 'D:/Texi/myapp/public/data/sevenDayData'
os.chdir(fp)

pathdir=os.listdir(fp)

odData=[]
for i in range(-1,classCount):
    od={}
    od['class']=i
    od['od']=[]
    odData.append(od)

oneDayMinute = 24*60

minuteSec=10


for path in pathdir:
    thisFile=[]
    newdir = os.path.join(fp,path)
    if os.path.isfile(newdir):     
        with open (newdir,'r',encoding='utf-8') as f:
            #print(fileCount)
            """
            if(fileCount>2000):
                break
            """
            reader=csv.reader(f)
            writeList=[]
            track=[]
            for line in islice(reader,1, None):
                track.append(line)
                if(len(track)==2):
                    source=track[0]
                    target=track[1]
                
                    sourceTime=source[0]
                    sourceDay=int(sourceTime.split('-')[0])
                    sourceHour=int(sourceTime.split('-')[1])
                    souceMinute=int(sourceTime.split('-')[2])
                    
                    sourceLng=float(source[1])
                    sourceLat=float(source[2])
                    
                    #status=int(line[3])
                    
                    row=int(round((top-sourceLat)/(1.5*sideLength)))
                    if(row<0 or row>=rowCount):
                        continue
                    if(row%2==0):
                        col=(round((sourceLng-left)/rowWidth))           
                    elif(row%2!=0):
                        col=(round((sourceLng-left-sideLength*math.cos((math.pi/180)*30))/rowWidth))
                    if(col<0 or col>=colCount):
                        continue
                    
                    sourceMinuteInOneDay=sourceHour*60+souceMinute
                    
                    sourceSecIndex=int(sourceMinuteInOneDay/minuteSec)
                    
                    sourceClassId=matrix[row][col]['category']
                    
                    targetTime=target[0]
                    targetDay=int(targetTime.split('-')[0])
                    targetHour=int(targetTime.split('-')[1])
                    souceMinute=int(targetTime.split('-')[2])
                    
                    targetLng=float(target[1])
                    targetLat=float(target[2])
                    
                    #status=int(line[3])
                    
                    row=int(round((top-targetLat)/(1.5*sideLength)))
                    if(row<0 or row>=rowCount):
                        continue
                    if(row%2==0):
                        col=(round((targetLng-left)/rowWidth))           
                    elif(row%2!=0):
                        col=(round((targetLng-left-sideLength*math.cos((math.pi/180)*30))/rowWidth))
                    if(col<0 or col>=colCount):
                        continue
                    
                    targetMinuteInOneDay=targetHour*60+souceMinute
                    
                    targetSecIndex=int(targetMinuteInOneDay/minuteSec)
                    
                    targetClassId=matrix[row][col]['category']
                    
                    if sourceClassId == targetClassId:
                        if sourceMinuteInOneDay>=targetMinuteInOneDay:
                            continue
                        odData[sourceClassId]['od'].append([sourceMinuteInOneDay,targetMinuteInOneDay])
                        
                
                
                

with open('D:/Texi/myapp/public/data/drawData/odIn.json','w',encoding='utf-8') as f:
    writeStr=json.dumps(odData)
    f.write(writeStr)

















