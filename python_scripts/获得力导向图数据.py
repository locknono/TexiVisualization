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


with open('D:/Texi/myapp/public/data/drawData/matrixCluster_7.json','r',encoding='utf-8') as f:
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
with open('D:/Texi/myapp/public/data/drawData/matrixCluster_7.json','r',encoding='utf-8') as f:
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
            reader=csv.reader(f)
            tmp=0
            nextPass=False
            for line in islice(reader, 1, None): 
                status=int(line[3])
                #statusDict[status]=0
                
                #两两读，如果有其中一个不满足条件，那就两条都跳过
                
                #从空载到打表，上车了 
                if ((tmp==0) and (status==1)):
                    sourceLat=float(line[2])
                    sourceLng=float(line[1])
                    row=int((top-sourceLat)/(1.5*sideLength))
                    if(row<0):
                        nextPass=True
                        continue
                    if(row%2==0):
                        col=int((sourceLng-left)/rowWidth)
                    else:
                        col=int((sourceLng-left-sideLength*math.cos((math.pi/180)*30))/rowWidth)
                    if(col<0):
                        nextPass=True
                        continue
                    if(row>rowCount or col>colCount):
                        nextPass=True
                        continue
                    sourceClass=matrix[row][col]['category']
                    tmp=1
                    continue
                #下车
                elif ((tmp==1) and (status==0) and nextPass==False):
                    targetLat=float(line[2])
                    targetLng=float(line[1])
                    row=int((top-targetLat)/(1.5*sideLength))
                    if(row<0):
                        continue
                    if(row%2==0):
                        col=int((targetLng-left)/rowWidth)
                    else:
                        col=int((targetLng-left-sideLength*math.cos((math.pi/180)*30))/rowWidth)
                    if(col<0):
                        continue
                    if(row>rowCount or col>colCount):
                        continue
                    targetClass=matrix[row][col]['category']
                    tmp=0
                    
                    
                    #如果links之中没有这条轨迹，就把这条轨迹加入links中，赋值value为0
                    #如果links之中已经有了这条轨迹，那么links中这条轨迹的value+=1
                    
                    exist=False
                    for each in links:
                        if each['source']==sourceClass and each['target']==targetClass:
                            exist=True
                            each['value']+=1
                            break
                    if(exist ==False):
                        track={}
                        track['source']=sourceClass
                        track['target']=targetClass
                        track['value']=1
                        links.append(track)
                    
        

with open('D:/Texi/myapp/public/data/drawData/netFlux_7.json','w',encoding='utf-8') as f:
    write={}
    write['nodes']=nodes
    write['links']=links
    writeStr=json.dumps(write)
    f.write(writeStr)
                
                
                    
            
                    
                
                