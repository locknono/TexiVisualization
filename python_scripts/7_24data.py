# -*- coding: utf-8 -*-
"""
Created on Sun May 20 16:16:18 2018

@author: 44219
"""

import os
import csv
from itertools import islice  
import json

fp = 'D:/Texi/myapp/public/data/sevenDayData'
os.chdir(fp)

pathdir=os.listdir(fp)

fileCount=0

pieData=[]
for i in range(0,7):
    pieData.append([])
    for j in range(0,24):
        pieData[i].append(0)
        
for path in pathdir:
    newdir = os.path.join(fp,path)
    if os.path.isfile(newdir):     
        with open (newdir,'r',encoding='utf-8') as f:
            fileCount+=1
            print(fileCount)
            reader=csv.reader(f)
            for line in islice(reader,1, None): 
                #2011.4.18 Mondy
                #2011.4.24 Sunday
                status=float(line[3])
                if(status!=0 and status!=1):
                    continue
                time=line[0]
                day = int(time.split('-')[0])
                hour = int(time.split('-')[1])
                #day:from 18 to 24
                dayIndex=day-18
                pieData[dayIndex][hour]+=1

with open('D:/Texi/myapp/public/data/drawData/pieData.json','w',encoding='utf-8') as f:
    writeStr=json.dumps(pieData)
    f.write(writeStr)
    
                
                
                
