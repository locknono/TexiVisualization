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
            for line in islice(reader,2, None):
                time=line[0]
                day=int(time.split('-')[0])
                hour=int(time.split('-')[1])
                minute=int(time.split('-')[2])
                
                lng=float(line[1])
                lat=float(line[2])
                
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
                
                minuteInOneDay=hour*60+minute
                
                secIndex=int(minuteInOneDay/minuteSec)
                
                


















