# -*- coding: utf-8 -*-
"""
Created on Sun May 20 20:51:06 2018

@author: 44219
"""

# -*- coding: utf-8 -*-
"""
Created on Sun May 20 18:08:54 2018

@author: 44219
"""

import os
import csv
from itertools import islice  
import json
import math

top = 22.80550
bottom = 22.454
left = 113.75643
right = 114.65191
sideLength=(right-left)/350
rowWidth=2*sideLength*math.cos((math.pi/180)*30)
colCount=int((right-left)/rowWidth)
rowCount=int(((top-bottom)/(3*sideLength))*2)


fp = 'D:/Texi/myapp/public/data/originalData/processedData'
os.chdir(fp)

pathdir=os.listdir(fp)

fileCount=0

with open('D:/Texi/myapp/public/data/drawData/valueHexagon2.0_215.json','r',encoding='utf-8') as f:
    classList=json.loads(f.read())
    
matrix=[]
maxRow=classList[len(classList)-1]['row']
for j in range(maxRow+1):
    rowList=[]
    for i in classList:
        if(i['row'] == j):
            rowList.append(i)
    matrix.append(rowList)
    
#numberList:the number of hexagon each sorted class has
    
    
numberList=[]
with open('D:/Texi/myapp/public/data/drawData/valueHexagon2.0_215.json','r',encoding='utf-8') as f:
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
        

clickData=[]
for i in range(len(categoryList)):
    thisClass={}
    thisClass['class']=categoryList[i]
    thisClass['on']=[]
    thisClass['off']=[]
    for j in range(24):
        thisClass['on'].append(0)
    for j in range(24):
        thisClass['off'].append(0)
    clickData.append(thisClass)
        
        
        
        
for path in pathdir:
    newdir = os.path.join(fp,path) # 将文件名加入到当前文件路径后面
    if os.path.isfile(newdir):     #如果是文件
        with open (newdir,'r',encoding='utf-8') as f:
            fileCount+=1
            print(fileCount)
            reader=csv.reader(f)
            tmp=0
            for line in islice(reader, 1, None):
                
                status=float(line[4])
                if(status!=0 and status!=1):
                    continue
                
                time=line[1]
                #day:from 18 to 24
                day = int(time.split(' ')[0].split('/')[2])
                if(day<22 or day>24):
                    continue
                hour=int(time.split(' ')[1].split(':')[0])
                    
                #从空载到打表，上车了 
                if ((tmp==0) and (status==1)):
                    sourceLat=float(line[3])
                    sourceLng=float(line[2])
                    row=int((top-sourceLat)/(1.5*sideLength))
                    if(row<0):
                        continue
                    if(row%2==0):
                        col=int((sourceLng-left)/rowWidth)
                    else:
                        col=int((sourceLng-left-sideLength*math.cos((math.pi/180)*30))/rowWidth)
                    if(col<0):
                        continue
                    if(row>rowCount or col>colCount):
                        continue
                    
                    thisClass=matrix[row][col]['category']
                    clickData[thisClass]['on'][hour]+=1
                    tmp=1
                    continue
                #下车
                elif ((tmp==1) and (status==0)):
                    targetLat=float(line[3])
                    targetLng=float(line[2])
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
                    thisClass=matrix[row][col]['category']
                    clickData[thisClass]['off'][hour]+=1
                    tmp=0
                    continue
    
with open('D:/Texi/myapp/public/data/drawData/clickDataWeekend.json','w',encoding='utf-8') as f:
    writeStr=json.dumps(clickData)
    f.write(writeStr)
    
    
    
    
    
    
    
    
    
    
    
    
    