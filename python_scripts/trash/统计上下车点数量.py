# -*- coding: utf-8 -*-
"""
Created on Fri May 25 20:21:27 2018

@author: 44219
"""


import pandas as pd
import os
fp = 'D:/Texi/myapp/public/data/sevenDayData'
os.chdir(fp)

pathdir=os.listdir(fp)

for index,path in enumerate(pathdir):
    print(index)
    thisFile=[]
    newdir = os.path.join(fp,path)
    
    if os.path.isfile(newdir):
        
        if(index==0):
            allData=pd.read_csv(newdir,engine='python')
        else:
            df=pd.read_csv(newdir,engine='python')
            allData=pd.concat([allData,df],ignore_index=True)
            #allData.append(df,ignore_index=True)
            
                
