# -*- coding: utf-8 -*-
"""
Created on Thu May 17 11:39:32 2018

@author: 44219
"""

import json
import os
import csv
from itertools import islice  
import math
import pandas as pd
import rootPath

top = 22.80550
bottom = 22.454
left = 113.75643
right = 114.65191

sideLength=(right-left)/150

rowWidth=2*sideLength*math.cos((math.pi/180)*30)

#colCount代表列数
colCount=int((right-left)/rowWidth)

rowCount=int(((top-bottom)/(3*sideLength))*2)


fp = 'D:/Texi/myapp/public/data/sevenDayData'
os.chdir(fp)


with open(rootPath.rootPath+'matrixCluster.json','r',encoding='utf-8') as f:
    classList=json.loads(f.read())

#matrix for all hexagon
matrix=[]
maxRow=classList[len(classList)-1]['row']
for j in range(maxRow+1):
    rowList=[]
    for i in classList:
        if(i['row'] == j):
            rowList.append(i)
    matrix.append(rowList)

nodes=[]
numberList=[]
with open(rootPath.rootPath+'matrixCluster.json','r',encoding='utf-8') as f:
    hexagonList=json.loads(f.read())
    categoryList=[]
    for i in range(len(hexagonList)):
        if hexagonList[i]['category'] not in categoryList:
            numberList.append(1)
            categoryList.append(hexagonList[i]['category'])
    categoryList.sort()
    categoryList.pop(0)
    for i in range(len(hexagonList)):
        if hexagonList[i]['category']==-1:
            continue
        numberList[hexagonList[i]['category']]+=1
    
    for i in categoryList:
        node={}
        node['class']=i
        node['number']=numberList[i]
        nodes.append(node)

pathdir=os.listdir(fp)

links=[]

statusDict={}
for path in pathdir:
    newdir = os.path.join(fp,path) # 将文件名加入到当前文件路径后面
    if os.path.isfile(newdir):     #如果是文件
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
                    
                    
                    targetClassId=matrix[targetRow][targetCol]['category']
                    
                    
                    
                    #如果links之中没有这条轨迹，就把这条轨迹加入links中，赋值value为0
                    #如果links之中已经有了这条轨迹，那么links中这条轨迹的value+=1
                    
                    if sourceClassId == -1 or targetClassId ==-1:
                        track=[]
                        continue
                    exist=False
                    for each in links:
                        if each['source']==sourceClassId and each['target']==targetClassId:
                            exist=True
                            each['value']+=1
                            break
                    if(exist ==False):
                        trackLink={}
                        trackLink['source']=sourceClassId
                        trackLink['target']=targetClassId
                        trackLink['value']=1
                        links.append(trackLink)
                    track=[]
                    
        

with open(rootPath.rootPath+'netFlux.json','w',encoding='utf-8') as f:
    write={}
    for each in links:
        each['value']=math.log2(each['value'])
    write['nodes']=nodes
    write['links']=links
    writeStr=json.dumps(write)
    f.write(writeStr)
                
                
                    
            
                    
                
                