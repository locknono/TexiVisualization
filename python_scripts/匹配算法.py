# -*- coding: utf-8 -*-
"""
Created on Sat May 26 16:33:21 2018

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

decimal.getcontext().prec = 20


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

pathdir=os.listdir(fp)


def getSiArray(hourDataArray):
    siArray=[]
    for i in range(len(hourDataArray)-1):
        si=hourDataArray[i+1]-hourDataArray[i]
        siArray.append(si)
    return siArray

def fourierTransform(siArray,k):
    cValueArray=[]
    for k in range(k):
        value=0
        for index,si in enumerate(siArray):
            exp=-(2*math.pi*index*k)/(len(siArray))
            value+=(decimal.Decimal(decimal.Decimal(si)*(decimal.Decimal(decimal.Decimal(math.e)**decimal.Decimal(exp)))))
            
        cValueArray.append(value)
    return cValueArray

def getResult(cValueArray1,cValueArray2):
    result=0
    for i in range(len(cValueArray1)):
        c1=cValueArray1[i]
        c2=cValueArray2[i]
        if((c1+c2)==0):
            value=0
        else:
            value=(decimal.Decimal(decimal.Decimal((c1-c2))**2))/decimal.Decimal(math.fabs(c1+c2))
        result+=value
    result=result/2
    return result
    

def match(arr1,arr2):
    siArray1=getSiArray(arr1)
    siArray2=getSiArray(arr2)
    cValueArray1=fourierTransform(siArray1,10)
    cValueArray2=fourierTransform(siArray2,10)
    result=getResult(cValueArray1,cValueArray2)
    return result

    
arr1=[1,2,3,4,5]
arr2=[5,4,3,2,1]
#result:-288.18973568767774


arr1=[1,2,3,4,5,6,7,8,9,10]
arr2=[1,2,3,4,5,6,7,8,9,10]
#result:0


arr1=[1,0,0,0,0,0,0]
arr2=[2,1,1,1,1,1,1]
#result:0


arr1=[1,2,3,4,5,6,7,8,9,10]
arr2=[1,2,3,4,5,6,7,8,9,11]
#result:1.5734923952001658e-05


arr1=[1,0]
arr2=[0,2]
#result:4.5


arr1=[1,1000]
arr2=[0,2]
#result:496.507992007992

with open('D:/Texi/myapp/public/data/drawData/asd.json','r',encoding='utf-8') as f:
    hexagonList=json.loads(f.read())

fileCount=0

maxRow=0
for i in range(len(hexagonList)):
    if hexagonList[i]['row']>maxRow:
        maxRow=hexagonList[i]['row']
        
matrix=[]
for j in range(maxRow+1):
    rowList=[]
    for i in hexagonList:
        if(i['row'] == j):
            rowList.append(i)
    matrix.append(rowList)


hexagonListDF=pd.DataFrame(hexagonList)
classCount=len(hexagonListDF.groupby(['category']))
fluxArray=[]
for i in range(classCount):
    fluxArray.append([])
    for j in range(168):
        fluxArray[i].append(0)
for path in pathdir:
    newdir = os.path.join(fp,path) # 将文件名加入到当前文件路径后面
    if os.path.isfile(newdir):     #如果是文件
        with open (newdir,'r',encoding='utf-8') as f:
            fileCount+=1
            #print(fileCount)
            reader=csv.reader(f)
            for line in islice(reader, 2, None):
                time=line[0]
                day=int(time.split('-')[0])
                hour=int(time.split('-')[1])
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
                
                classId=matrix[row][col]['category']
                #fluxArray中,-1的类别占索引0
                hourIndex=(day-18)*24+hour
                fluxArray[classId+1][hourIndex]+=1
                
matchMatrix=[]
for i in range(len(fluxArray)):
    matchMatrix.append([])
    if(i==0):
        continue
    for j in range(len(fluxArray)):
        if(j==0):
            continue
        print(i,j)
        print(match(fluxArray[i],fluxArray[j]))
        matchMatrix[i].append(match(fluxArray[i],fluxArray[j]))
        

        

                
                

        
    

























            