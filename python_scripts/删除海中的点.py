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



top = 22.80550
bottom = 22.454
left = 113.75643
right = 114.65191

sideLength=(right-left)/150

rowWidth=2*sideLength*math.cos((math.pi/180)*30)

#colCount代表列数
colCount=int((right-left)/rowWidth)

rowCount=int(((top-bottom)/(3*sideLength))*2)

fp = 'D:/TexiData/sevenDayData'
os.chdir(fp)

pathdir=os.listdir(fp)

with open('D:/Texi/myapp/public/data/drawData/hexagon.json','r',encoding='utf-8') as f:
    hexagonList=json.loads(f.read())
    
matrix=[]


for i in range(len(hexagonList)):
    hexagonList[i]['value']=0
    matrix.append([])
for row in matrix:
    for i in range(24):
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
            appendFlag=True
            for line in islice(reader,2, None):
                if(appendFlag==False):
                    appendFlag=True
                    continue
                errorFlag=False
                time=line[0]
                day=int(time.split('-')[0])
                hour=int(time.split('-')[1])
                lng=float(line[1])
                lat=float(line[2])
                status=line[3]
                if(lat<22.583866203519154 and lng<113.82621641266742):
                    pointList.append([lat,lng])
                    errorFlag=True
                    continue
                if(lat<22.546777729214295 and lng<113.84360258269093):
                    pointList.append([lat,lng])
                    errorFlag=True
                    continue
                if(lat<22.661937473503606 and lng<113.77960689611685):
                    pointList.append([lat,lng])
                    errorFlag=True
                    continue
                if(lat<22.668134633616596 and lng<113.76507939363574):
                    pointList.append([lat,lng])
                    errorFlag=True
                    continue
                if((lng>114.3149538 and lng <114.4441157)and(lat >22.4528778 and lat < 22.58540067)):
                    pointList.append([lat,lng])
                    errorFlag=True
                    continue
                status=int(line[3])
                row=int(round((top-lat)/(1.5*sideLength)))
                if(row<0 or row>=rowCount):
                    errorFlag=True
                    continue
                if(row%2==0):
                    col=(round((lng-left)/rowWidth))           
                elif(row%2!=0):
                    col=(round((lng-left-sideLength*math.cos((math.pi/180)*30))/rowWidth))
                if(col<0 or col>=colCount):
                    errorFlag=True
                    continue
                if(row==14 and col == 78):
                    errorFlag=True
                    continue
                if(row==33 and col==66):
                    errorFlag=True
                    continue
                if(row==38 and col==10):
                    errorFlag=True
                    continue
                if(row==36 and col==21):
                    errorFlag=True
                    continue
                if(row==38 and col==19):
                    errorFlag=True
                    continue
                if(row==27 and col==49):
                    errorFlag=True
                    continue
                if(row==24 and col==63):
                    errorFlag=True
                    continue
                if(row==34 and col==22):
                    errorFlag=True
                    continue
                if(row==34 and col==23):
                    errorFlag=True
                    continue
                if(row==33 and col==22):
                    errorFlag=True
                    continue
                if(row==34 and col==24):
                    errorFlag=True
                    continue
                if(row==37 and col==15):
                    errorFlag=True
                    continue
                if(row==37 and col==16):
                    errorFlag=True
                    continue
                if(row==37 and col==17):
                    errorFlag=True
                    continue
                if(row==38 and col==15):
                    errorFlag=True
                    continue
                if(row==32 and col==24):
                    errorFlag=True
                    continue
                if(row==33 and col==24):
                    errorFlag=True
                    continue
                if(row==33 and col==25):
                    errorFlag=True
                    continue
                if(row==32 and col==52):
                    errorFlag=True
                    continue
                if(row==34 and col==20):
                    errorFlag=True
                    continue
                if(row==33 and col==19):
                    errorFlag=True
                    continue
                if(row==34 and col==19):
                    errorFlag=True
                    continue

                
                #如果上一条记录是上车，那么这一条记录一定是下车，那么连同上一条记录一起删除
                if(status==1 and errorFlag==True):
                    writeList.pop(len(writeList)-1)
                    continue
                elif(status==0 and errorFlag==True):
                    appendFlag=False
                    continue
                else:
                    writeList.append(line)
                    
            if(len(writeList)!=0):
                with open("D:/TexiData/cleanData/"+path,"w",encoding='utf-8',newline='') as csvfile: 
                    writer = csv.writer(csvfile)
                    #先写入columns_name
                    writer.writerow(['time','jd','wd','status'])
                    #写入多行用writerows
                    writer.writerows(writeList)
                        #如果上一条记录是下车，那么下一行也不要加入进来