# -*- coding: utf-8 -*-
"""
Created on Mon May 28 21:09:09 2018

@author: 44219
"""

# -*- coding: utf-8 -*-
"""
Created on Mon May 28 20:50:49 2018

@author: 44219
"""

# -*- coding: utf-8 -*-
"""
Created on Sun May 27 10:54:50 2018

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
import numpy as np
from sklearn.decomposition import NMF
from sklearn.cluster import KMeans
import rootPath


top = 22.80550
bottom = 22.454
left = 113.75643
right = 114.65191

print(rootPath.rootPath)
sideLength=(right-left)/150

rowWidth=2*sideLength*math.cos((math.pi/180)*30)

#colCount代表列数
colCount=int((right-left)/rowWidth)

rowCount=int(((top-bottom)/(3*sideLength))*2)

fp = 'D:/Texi/myapp/public/data/sevenDayData'
os.chdir(fp)

pathdir=os.listdir(fp)

with open(rootPath.rootPath+'hexagon.json','r',encoding='utf-8') as f:
    hexagonList=json.loads(f.read())
    
matrix=[]


for i in range(len(hexagonList)):
    hexagonList[i]['value']=0
    matrix.append([])
    
for row in matrix:
    for i in range(168):
        row.append(0)

pointList=[]

fileCount=0

for path in pathdir:
    thisFile=[]
    newdir = os.path.join(fp,path)
    if os.path.isfile(newdir):     
        with open (newdir,'r',encoding='utf-8') as f:
            fileCount+=1
            #print(fileCount)
            """
            if(fileCount>2000):
                break
            """
            reader=csv.reader(f)
            writeList=[]
            for line in islice(reader,1, None):
                time=line[0]
                day=int(time.split('-')[0])
                hour=int(time.split('-')[1])
                lng=float(line[1])
                lat=float(line[2])
                status=line[3]
                status=int(line[3])
                row=int(round((top-lat)/(1.5*sideLength)))
                if(row<0 or row>=rowCount):
                    continue
                if(row%2==0):
                    col=(round((lng-left)/rowWidth))           
                elif(row%2!=0):
                    col=(round((lng-left-sideLength*math.cos((math.pi/180)*30))/rowWidth))
                if(col<0 or col>=colCount):
                    continue
                
                
                if status !=1:
                    continue
                
                position = (col*rowCount)+row
                hexagonList[position]['value']+=1
                hour=(day-18)*24+hour
                matrix[position][hour]+=1


nCom=7
firstSecNCom=4
secondSecNcom=3
X = np.array(matrix)
model = NMF(n_components=nCom, init='random', random_state=0)
W = model.fit_transform(X)
H = model.components_

maxIndexList=np.argmax(W,axis=1)

maxValueList=[]
for i in range(len(maxIndexList)):
    value=math.log2(W[i][maxIndexList[i]]+1)
    
    maxValue={}
    maxValue['index']=i
    maxValue['value']=value
    
    maxValueList.append(maxValue)
"""
maxValueList3=[]
for i in range(len(maxIndexList)):
    value=math.log2(W[i][maxIndexList[i]]+1)
    maxValueList3.append(value)
maxValueList3.sort()
    
maxValueList2=copy.deepcopy(maxValueList)
kList=[]
for i in range(len(maxValueList2)-1):
    value=maxValueList2[i]['value']
    nextValue=maxValueList2[i+1]['value']
    k=nextValue-value
    kList.append(k)
"""
maxValueList=sorted(maxValueList, key=lambda m: m['value'])
         
for i in range(len(maxValueList)-1):
    value=maxValueList[i]['value']
    nextValue=maxValueList[i+1]['value']
    maxValueList[i]['k']=nextValue-value

minValue=maxValueList[0]['value']

"""
firstSecMaxValue=0
for i in range(len(maxValueList)-1):
    if(maxValueList[i]['k']>0.5):
        firstSecMaxValue=maxValueList[i+1]['value']
        print(i,(maxValueList[i]['k']))
        break
"""

secondSecMaxValue=maxValueList[-1]['value']

#maxValue=maxValueList[-int(len(maxValueList)/5)]['value']

firstSecMaxValue=maxValueList[-int(len(maxValueList)/5)]['value']

secondSecMaxValue=maxValueList[-1]['value']

firstSecDiff=firstSecMaxValue-minValue

secondSecDiff=secondSecMaxValue-firstSecMaxValue

#diff=maxValue-minValue

#secLength=diff/nCom

firstSecLength=1/firstSecNCom

secondSecLength=1/secondSecNcom

for i in range(len(maxValueList)):
    
    value=maxValueList[i]['value']
    index=maxValueList[i]['index']
    """
    if(i!=len(maxValueList)-1):
        k=maxValueList[i]['k']
    """
    
    if value<=firstSecMaxValue:
        normalValue=(value-minValue)/firstSecDiff
        normalCommunity=int((normalValue)/firstSecLength-1)
        if normalCommunity>firstSecNCom:
            print('>')
    elif value>firstSecMaxValue and value < secondSecMaxValue:
        normalValue=(value-firstSecMaxValue)/secondSecDiff
        normalCommunity=int((normalValue)/secondSecLength)+firstSecNCom
      
    #normalValue=(value-minValue)/(maxValue-minValue)
    
    #normalCommunity=int((normalValue-minValue)/secLength-1)
    
    if(value==0):
        hexagonList[index]['category']=-1
    elif(normalValue>1):
        hexagonList[index]['category']=nCom+1
    else:
        if(normalCommunity>=nCom):
            print(normalCommunity)
        hexagonList[index]['category']=normalCommunity
        
with open(rootPath.rootPath+'matrixCluster.json','w',encoding='utf-8') as f:
    writeStr=json.dumps(hexagonList)
    f.write(writeStr)

        


                
                
                
                
                
                
                
                
                
                
                
                