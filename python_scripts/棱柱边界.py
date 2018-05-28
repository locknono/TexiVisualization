# -*- coding: utf-8 -*-
"""
Created on Thu May 24 19:28:23 2018

@author: 44219
"""

import math
import json
import random
import pandas as pd
top = 23.10550
bottom = 22.1540
left = 113.75643
right = 114.65191
sideLength=(right-left)/350

def getDis(p1,p2):
    dis=math.sqrt(math.pow(p1[0]-p2[0],2)+math.pow(p1[1]-p2[1],2))
    return dis


allBorder=[]
with open('D:/Texi/myapp/public/data/drawData/prism1056.json','r',encoding='utf-8') as f:
    hexagonList=json.loads(f.read())
    
    for i in range(len(hexagonList)):
        lineList=[]
        for j in range(len(hexagonList[i]['path'])-1):
            line=[hexagonList[i]['path'][j],hexagonList[i]['path'][j+1]]
            line2=[hexagonList[i]['path'][j+1],hexagonList[i]['path'][j]]
            lineList.append(line)
            lineList.append(line2)
        """
        for s in range(len(lineList)):
            for m in range(len(lineList[s])):
                lineList[s][m][0]=round(lineList[s][m][0],6)
                lineList[s][m][1]=round(lineList[s][m][1],6)
        """
        hexagonList[i]['path']=lineList
    df=pd.DataFrame(hexagonList)
    grouped=df.groupby(['category'])
    for name,group in grouped:
        classId=name
        classList=group
        classPathList=classList['path']
        borderPathList=[]
        for paths in classPathList:
            for path in paths:
               if path not in borderPathList:
                   borderPathList.append(path)
               elif path in borderPathList:
                   borderPathList.remove(path)
                
                   
        
        """
        borderList=[]
        borderList.append(borderPathList[0])
        borderPathList.pop(0)
        while(len(borderPathList)>0):
            for path in borderPathList:
                if(path)
        """
        allBorder.append(borderPathList)
with open('D:/Texi/myapp/public/data/drawData/prismBorder.json','w',encoding='utf-8') as f:
    writeStr=json.dumps(allBorder)
    f.write(writeStr)
            
        
    
        