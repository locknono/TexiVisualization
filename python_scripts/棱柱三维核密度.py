# -*- coding: utf-8 -*-
"""
Created on Wed May 23 20:39:46 2018

@author: 44219
"""

import os
import csv
from itertools import islice  
import json
import math
import pandas as pd
from collections import Counter

top = 22.80550
bottom = 22.454
left = 113.75643
right = 114.65191
sideLength=(right-left)/350
rowWidth=2*sideLength*math.cos((math.pi/180)*30)

#colCount代表列数
colCount=int((right-left)/rowWidth)
rowCount=int(((top-bottom)/(3*sideLength))*2)




fp = 'D:/Texi/myapp/public/data/sevenDayData'
os.chdir(fp)

pathdir=os.listdir(fp)


with open('D:/Texi/myapp/public/data/prism/hexPrism.json','r',encoding='utf-8') as f:
    matrix=json.loads(f.read())
for i in range(len(matrix)):
    for j in range(len(matrix[i])):
        for s in range(len(matrix[i][j]['z'])):
            matrix[i][j]['z'][s]['row']=matrix[i][j]['row']
            matrix[i][j]['z'][s]['col']=matrix[i][j]['col']
            matrix[i][j]['z'][s]['level']=s
cigma=sideLength*2.5
timeN=len(matrix[0][0]['z'])
timeCigma=(24/timeN)*2.5


def getDis(p1,p2):
    dis=math.sqrt(math.pow(p1[0]-p2[0],2)+math.pow(p1[1]-p2[1],2))
    return dis


fileCount=0
for path in pathdir:
    thisFile=[]
    newdir = os.path.join(fp,path)
    if os.path.isfile(newdir):     
        with open (newdir,'r',encoding='utf-8') as f:
            fileCount+=1
            print(fileCount)
            """
            if(fileCount>2000):
                break
            """
            reader=csv.reader(f)
            for line in islice(reader, 1, None):
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
                
                
                
                #开始核密度
                matrix[row][col]['pointCount']+=1
                #空间
                position=[lat,lng]
                hexagonPoint=[matrix[row][col]['lat'],matrix[row][col]['lng']]
                
                spaceExp=-(math.pow(getDis(position,hexagonPoint),2)/(2*math.pow(cigma,2)))
                spaceCons=1/(cigma*math.sqrt(2*math.pi))
                spaceValue=spaceCons*math.pow(math.e,spaceExp)
                matrix[row][col]['value']+=spaceValue
                
                #时间
                for m in range(int(hour-3*timeCigma),int(hour+3*timeCigma)+1):
                    if(m<0 or m >23):
                        continue
                    timeExp=-(math.pow((hour-m),2)/(2*math.pow(timeCigma,2)))
                    timeCons=1/(timeCigma*math.sqrt(2*math.pi))
                    timeValue=timeCons*math.pow(math.e,timeExp)
                    
                    value = spaceValue * timeValue
                    matrix[row][col]['z'][m]['value']+=value
                    
                    
for i in range(len(matrix)):
    for j in range(len(matrix[i])):
        for s in range(len(matrix[i][j]['z'])):
            denominator=matrix[i][j]['pointCount']*math.pow(cigma,2)*timeCigma
            if(denominator==0):
                matrix[i][j]['z'][s]['value']=0
            else:
                matrix[i][j]['z'][s]['value']=matrix[i][j]['z'][s]['value']/denominator
            
def clustering():
    for i in range(len(matrix)):
        for j in range(len(matrix[i])):
            thisHex=matrix[i][j]
            for s in range(len(matrix[i][j]['z'])):
                thisPrism=matrix[i][j]['z'][s]
                curLevel=s
                thisPrism['level']=curLevel
                category = thisPrism['c']
                if(category==-1):
                    getClass(thisPrism,thisHex)
                else:
                    continue
                    
classNumber=0
chain=[]
def getMax(surround):
    max={}
    max['index']=-1
    max['value']=-1
    for each in surround:
        if(each['value']>max['value']):
            max['value']=each['value']
            max['index']=surround.index(each)
    return surround[max['index']]
def getClass(thisPrism,thisHex):
    global classNumber
    global chain
    curLevel=thisPrism['level']
    row=thisHex['row']
    col=thisHex['col']
    
    surround=[]
    surround.append(thisPrism)
    
    surroundRowAndCol=[]
    rowAndCol={}
    rowAndCol['row']=row
    rowAndCol['col']=col
    rowAndCol['level']=curLevel
    surroundRowAndCol.append(rowAndCol)
    
    for i in range(row-1,row+2):
        for j in range(col-1,col+2):
            if(i<0 or i >rowCount or j<0 or j >colCount):
                continue
            if(row%2 != 0):
                if(i!=j):
                    """
                    prism=matrix[i][j]['z'][curLevel]
                    prism['row']=i
                    prism['col']=j
                    """
                    rowAndCol={}
                    rowAndCol['row']=i
                    rowAndCol['col']=j
                    rowAndCol['level']=curLevel
                    surroundRowAndCol.append(rowAndCol)
                    for s in range(curLevel-1,curLevel+2):
                        if(s<0 or s>95):
                            continue
                        surround.append(matrix[i][j]['z'][s])
                    
            else:
                if(((i==-1) and (j==1)) or ((i==0) and (j==0))or((i==1) and (j==1))):
                    continue
                else:
                    rowAndCol={}
                    rowAndCol['row']=i
                    rowAndCol['col']=j
                    rowAndCol['level']=curLevel
                    surroundRowAndCol.append(rowAndCol)
                    
                    for s in range(curLevel-1,curLevel+2):
                        if(s<0 or s>95):
                            continue
                        surround.append(matrix[i][j]['z'][s])
                        """
                        surround.append(matrix[i][j]['z'][curLevel])
                        """
    if(curLevel!=0):
        rowAndCol={}
        rowAndCol['row']=i
        rowAndCol['col']=j
        rowAndCol['level']=curLevel-1
        surroundRowAndCol.append(rowAndCol)
        
        surround.append(thisHex['z'][(curLevel-1)])
    if(curLevel!=95):
        
        rowAndCol={}
        rowAndCol['row']=i
        rowAndCol['col']=j
        rowAndCol['level']=curLevel+1
        surroundRowAndCol.append(rowAndCol)
        surround.append(thisHex['z'][(curLevel+1)])
    
    
    if(getMax(surround)['value']==0):
        chain=[]
        return
    
    if(getMax(surround)==thisPrism):
        if(thisPrism['c']==-1):
            thisPrism['c']=classNumber
            classNumber+=1
        #如果寻找的起点是最大值，并且已经有了类别：
        #对应的情况就是递归进入且递归进入点是最大的
        elif (thisPrism['c']!=-1):
            classNumber+=1
            chain=[]
            return
            """
            for s in surroundRowAndCol:
                row=s['row']
                col=s['col']
                level=s['level']
                matrix[row][col]['z'][level]['c']=thisPrism['c']
            """
    else:
        maxPrism=getMax(surround)
        if(maxPrism['c']==-1):
            thisPrism['c']=classNumber
            maxPrism['c']=classNumber
            
            maxHexRow=maxPrism['row']
            maxHexCol=maxPrism['col']
            
            maxHexLevel=maxPrism['level']
            maxHex=matrix[maxHexRow][maxHexCol]
            
            #把起点和周围最大点加入寻找链
            this={'row':row,'col':col,'level':curLevel}
            SurroundMax={'row':maxHexRow,'col':maxHexCol,'level':maxHexLevel}
            
            chain.append(this)
            chain.append(SurroundMax)
               
            getClass(maxPrism,maxHex)
        if(maxPrism['c']!=-1):
            thisPrism['c']=maxPrism['c']
            for c in chain:
                row=c['row']
                col=c['col']
                level=c['level']
                matrix[row][col]['z'][level]['c']=maxPrism['c']
            chain=[]
            return
            
            
            
                
                
                
def reduction():
    for i in range(len(matrix)):
        for j in range(len(matrix[i])):
            thisClass=-1
            classList=[]
            for s in range(len(matrix[i][j]['z'])):
                classList.append(matrix[i][j]['z'][s]['c'])
            mostCommon=Counter(classList).most_common(2)
            thisClass=mostCommon[0][0]
            
            if(len(mostCommon)==1):
                thisClass=mostCommon[0][0]
            else:   
                if(mostCommon[0][0]==-1):
                    thisClass=mostCommon[1][0]
                else:
                    thisClass=mostCommon[0][0]
            
            matrix[i][j]['category']=thisClass
    classSet=[]
    for i in range(len(matrix)):
        for j in range(len(matrix[i])):
            if matrix[i][j]['category'] not in classSet:
                classSet.append(matrix[i][j]['category'])
    classSet.sort()
    print(classSet)
    print(len(classSet))

def write():
    for i in range(len(matrix)):
        for j in range(len(matrix[i])):
            matrix[i][j].pop('z')
    with open('D:/Texi/myapp/public/data/drawData/prism.json','w',encoding='utf-8') as f:
        writeStr=json.dumps(matrix)
        f.write(writeStr)
clustering()
reduction()
write()
            
            
    
    
    
    

    
    
    
                
                
                
                    
            