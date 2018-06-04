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

for i in range(len(matrix)):
    for j in range(len(matrix[i])):
        pieData=[]
        for s in range(0,7):
            pieData.append([])
            for m in range(0,24):
                pieData[s].append(0)
        matrix[i][j]['p']=pieData
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
                
                matrix[row][col]['p'][dayIndex][hour]+=1
                
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



eachMin=0;
eachMax=0;
for i in range(len(matrix)):
    for j in range(len(matrix[i])):
        thismin=2000
        thismax=0
        for s in range(len(matrix[i][j]['p'])):
            for m in range(len(matrix[i][j]['p'][s])):
                if matrix[i][j]['p'][s][m]>thismax:
                    thismax=matrix[i][j]['p'][s][m]
                if matrix[i][j]['p'][s][m]<thismin:
                    thismin=matrix[i][j]['p'][s][m]
                matrix[i][j]['min']=thismin
                matrix[i][j]['max']=thismax
"""
for i in range(len(matrix)):
    for j in range(len(matrix[i])):
        thisClass =matrix[i][j]['category']
        write={}
        pieData=matrix[i][j]['p']
        write['min']=classPieData[thisClass]['min']
        write['max']=classPieData[thisClass]['max']
        write['pieData']=pieData
        matrix[i][j]['w']=write
"""

  
for i in range(len(matrix)):
    for j in range(len(matrix[i])):
        thisClass =matrix[i][j]['category']
        write={}
        pieData=matrix[i][j]['p']
        write['min']=matrix[i][j]['min']
        write['max']=matrix[i][j]['max']
        write['pieData']=pieData
        matrix[i][j]['w']=write
        
        
for i in range(len(matrix)):
    for j in range(len(matrix[i])):
        with open(rootPath.rootPath+'eachPieData/'+str(matrix[i][j]['row'])+'_'+str(matrix[i][j]['col'])+'.json','w',encoding='utf-8') as f:
            writeStr=json.dumps(matrix[i][j]['w'])
            f.write(writeStr)
        


                
                
