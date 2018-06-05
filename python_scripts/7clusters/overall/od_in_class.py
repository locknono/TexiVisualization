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
import rootPath


with open(rootPath.rootPath+'matrixCluster.json','r',encoding='utf-8') as f:
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
            rowList.append(i)
    matrix.append(rowList)



fp = 'D:/Texi/myapp/public/data/sevenDayData'
os.chdir(fp)

pathdir=os.listdir(fp)

odData=[]
for i in range(0,classCount-1):
    od={}
    od['class']=i
    od['od']=[]
    odData.append(od)

oneDayMinute = 24*60

minuteSec=10


for i in range(len(matrix)):
    for j in range(len(matrix[i])):
        matrix[i][j]['od']=[]
        
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
                if len(track)>2:
                    print('>')
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
                    
                    sourceRow=int(round((top-sourceLat)/(1.5*sideLength)))
                    if(sourceRow<0 or sourceRow>=rowCount):
                        track=[]
                        continue
                    if(sourceRow%2==0):
                        sourceCol=(round((sourceLng-left)/rowWidth))           
                    elif(sourceRow%2!=0):
                        sourceCol=(round((sourceLng-left-sideLength*math.cos((math.pi/180)*30))/rowWidth))
                    if(sourceCol<0 or sourceCol>=colCount):
                        track=[]
                        continue
                    
                    sourceMinuteInOneDay=sourceHour*60+souceMinute
                    
                    sourceSecIndex=int(sourceMinuteInOneDay/minuteSec)
                    
                    sourceClassId=matrix[sourceRow][sourceCol]['category']
                    
                    targetTime=target[0]
                    targetDay=int(targetTime.split('-')[0])
                    targetHour=int(targetTime.split('-')[1])
                    souceMinute=int(targetTime.split('-')[2])
                    
                    targetLng=float(target[1])
                    targetLat=float(target[2])
                    
                    #status=int(line[3])
                    
                    targetRow=int(round((top-targetLat)/(1.5*sideLength)))
                    if(targetRow<0 or targetRow>=rowCount):
                        track=[]
                        continue
                    if(targetRow%2==0):
                        targetCol=(round((targetLng-left)/rowWidth))           
                    elif(targetRow%2!=0):
                        targetCol=(round((targetLng-left-sideLength*math.cos((math.pi/180)*30))/rowWidth))
                    if(targetCol<0 or targetCol>=colCount):
                        track=[]
                        continue
                    
                    targetMinuteInOneDay=targetHour*60+souceMinute
                    
                    targetSecIndex=int(targetMinuteInOneDay/minuteSec)
                    
                    targetClassId=matrix[targetRow][targetCol]['category']
                    
                    
                    #for each hex
                    if sourceRow == targetRow and sourceCol == targetCol:
                        if sourceMinuteInOneDay>=targetMinuteInOneDay:
                            track=[]
                            continue
                        matrix[sourceRow][sourceCol]['od'].append([sourceMinuteInOneDay,targetMinuteInOneDay])
                        
                    if sourceClassId == targetClassId:
                        if sourceMinuteInOneDay>=targetMinuteInOneDay:
                            track=[]
                            continue
                        
                        odData[sourceClassId]['od'].append([sourceMinuteInOneDay,targetMinuteInOneDay])
                    track=[]
                    
                    
for i in odData:
    a=set()
    for od in i['od']:
        a.add(tuple(od))
    b=[]
    for each in a:
        b.append(list(each))
    i['od']=b

for i in odData:
    print(len(i['od']))
        
for s in odData:
    a=set()
    for od in s['od']:
        a.add(tuple(od))
    b=[]
    for each in a:
        b.append(list(each))
    s['od']=b
    
    
with open(rootPath.rootPath+'odIn.json','w',encoding='utf-8') as f:
    writeStr=json.dumps(odData)
    f.write(writeStr)

for i in range(len(matrix)):
    for j in range(len(matrix[i])):
        a=set()
        for od in matrix[i][j]['od']:
            a.add(tuple(od))
        b=[]
        for each in a:
            b.append(list(each))
        matrix[i][j]['od']=b
        with open(rootPath.rootPath+'eachOdData/'+str(i)+'_'+str(j)+'.json','w',encoding='utf-8') as f:
            writeStr=json.dumps(matrix[i][j]['od'])
            f.write(writeStr)
        















