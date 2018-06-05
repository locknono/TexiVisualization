# -*- coding: utf-8 -*-
"""
Created on Sun May 20 16:16:18 2018

@author: 44219
"""

import os
import csv
from itertools import islice  
import json
import math
import pandas as pd
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
            i['value']=0
            i['kClass']=-1
            rowList.append(i)
    matrix.append(rowList)
    
classPieData=[]
for i in range(0,classCount-1):
    append={}
    append['class']=i
    
    pieData=[]
    for s in range(0,7):
        pieData.append([])
        for j in range(0,24):
            pieData[s].append(0)
    append['pieData']=pieData
    
    classPieData.append(append)
    
fp = 'D:/Texi/myapp/public/data/sevenDayData'
os.chdir(fp)

pathdir=os.listdir(fp)

pieData=[]
for i in range(0,7):
    pieData.append([])
    for j in range(0,24):
        pieData[i].append(0)
        
for path in pathdir:
    newdir = os.path.join(fp,path)
    if os.path.isfile(newdir):     
        with open (newdir,'r',encoding='utf-8') as f:
            reader=csv.reader(f)
            for line in islice(reader,1, None): 
                #2011.4.18 Mondy
                #2011.4.24 Sunday
                status=float(line[3])
                if status!=0:
                    continue
                time=line[0]
                day = int(time.split('-')[0])
                hour = int(time.split('-')[1])
                
                lng=float(line[1])
                lat=float(line[2])
                
                row=int((top-lat)/(1.5*sideLength))
                if(row<0 or row>rowCount):
                    continue
                if(row%2==0):
                    col=int((lng-left)/rowWidth)
                else:
                    col=int((lng-left-sideLength*math.cos((math.pi/180)*30))/rowWidth)
                if(col<0 or col>colCount):
                    continue
                
                #day:from 18 to 24
                dayIndex=day-18
                pieData[dayIndex][hour]+=1
                
                classId=matrix[row][col]['category']
                
                classPieData[classId]['pieData'][dayIndex][hour]+=1
                
for i in classPieData:
    b=np.array(i['pieData']) 
    minFlux=np.min(b)
    maxFlux=np.max(b)
    i['min']=int(minFlux)
    i['max']=int(maxFlux)

                
with open(rootPath.rootPath+'pieData.json','w',encoding='utf-8') as f:
    writeStr=json.dumps(pieData)
    f.write(writeStr)
with open(rootPath.rootPath+'classPieData.json','w',encoding='utf-8') as f:
    writeStr=json.dumps(classPieData)
    f.write(writeStr)
                
                
                
