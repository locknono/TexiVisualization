# -*- coding: utf-8 -*-
"""
Created on Tue May 22 19:42:31 2018

@author: 44219
"""

import os
import csv
from itertools import islice  
import json



fp = 'D:/Texi/myapp/public/data/originalData/processedData'
os.chdir(fp)

pathdir=os.listdir(fp)

fileCount=0


for path in pathdir:
    thisFile=[]
    newdir = os.path.join(fp,path)
    if os.path.isfile(newdir):     
        with open (newdir,'r',encoding='utf-8') as f:
            tmp=0
            fileCount+=1
            print(fileCount)
            reader=csv.reader(f)
            tmp=0
            for line in islice(reader, 1, None): 
                time=line[1]
                day=int(time.split(' ')[0].split('/')[2])
                if(day<18 or day>24):
                    continue
                thisFile.append(line)
    with open("D:/Texi/myapp/public/data/sevenDayData/"+path,"w",encoding='utf-8',newline='') as csvfile: 
        writer = csv.writer(csvfile)
        #先写入columns_name
        writer.writerow(['name','time','jd','wd','status','v','angle'])
        #写入多行用writerows
        writer.writerows(thisFile)