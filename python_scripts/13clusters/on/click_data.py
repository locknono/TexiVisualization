# -*- coding: utf-8 -*-
"""
Created on Thu May 31 11:24:15 2018

@author: 44219
"""

# -*- coding: utf-8 -*-
"""
Created on Mon May 21 20:42:48 2018

@author: 44219
"""
import os
import csv
from itertools import islice  
import json
import math
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

classNumber=rootPath.rootPath.split('/')[-3]

fp = 'D:/Texi/myapp/public/data/sevenDayData'
os.chdir(fp)

pathdir=os.listdir(fp)

fileCount=0

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

hexagonClickData=[]
for index,i in enumerate(matrix):
    hexagonClickData.append([])
    for j in i:
        thisHex={}
        thisHex['row']=j['row']
        thisHex['col']=j['col']
        thisHex['n']=int(classNumber)
        thisHex['con']=[]
        thisHex['off']=[]
        for j in range(24):
            thisHex['con'].append(0)
        for j in range(24):
            thisHex['off'].append(0)
        hexagonClickData[index].append(thisHex)

#numberList:the number of hexagon each sorted class has
        
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
    
clickData=[]
for i in range(len(categoryList)):
    thisClass={}
    thisClass['class']=categoryList[i]
    thisClass['con']=[]
    thisClass['off']=[]
    for j in range(24):
        thisClass['con'].append(0)
    for j in range(24):
        thisClass['off'].append(0)
    clickData.append(thisClass)
    
        
for path in pathdir:
    newdir = os.path.join(fp,path) # 将文件名加入到当前文件路径后面
    if os.path.isfile(newdir):     #如果是文件
        with open (newdir,'r',encoding='utf-8') as f:
            """
            fileCount+=1
            print(fileCount)
            """
            reader=csv.reader(f)
            tmp=0
            for line in islice(reader, 1, None):
                
                status=int(line[3])
                
                time=line[0]
                #day:from 18 to 24
                day = int(time.split('-')[0])
                hour=int(time.split('-')[1])
                
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
                
                thisClass=matrix[row][col]['category']
                
                if thisClass<0:
                    continue
                if status ==1:
                    clickData[thisClass]['con'][hour]+=1
                    hexagonClickData[row][col]['con'][hour]+=1
                elif status==0:
                    clickData[thisClass]['off'][hour]+=1
                    hexagonClickData[row][col]['off'][hour]+=1
                    
            
for i in range(len(clickData)):
    for j in range(len(clickData[i]['con'])):
        clickData[i]['con'][j]/=7
        clickData[i]['off'][j]/=7
        clickData[i]['con'][j]=clickData[i]['con'][j]/numberList[clickData[i]['class']]
        clickData[i]['off'][j]=clickData[i]['off'][j]/numberList[clickData[i]['class']]
        clickData[i]['con'][j]=round(clickData[i]['con'][j],6)
        clickData[i]['off'][j]=round(clickData[i]['off'][j],6)

for i in hexagonClickData:
    for s in i:
        for j in range(len(s['con'])):
            s['con'][j]=s['con'][j]/7
            s['off'][j]=s['off'][j]/7
            if s['con'][j]==0:
                s['con'][j]=int(s['con'][j])
            else:
                s['con'][j]=round(s['con'][j],6)
            if s['off'][j]==0:
                s['off'][j]=int(s['off'][j])
                s['con'][j]=round(s['con'][j],6)
            

        
        
with open(rootPath.rootPath+'classClickData.json','w',encoding='utf-8') as f:
    writeStr=json.dumps(clickData)
    f.write(writeStr)

with open(rootPath.rootPath+'hexClickData.json','w',encoding='utf-8') as f:
    output =[]
    for i in hexagonClickData:
        for s in i:
            output.append(s)
    writeStr=json.dumps(output)
    f.write(writeStr)
    

    


    
    