# -*- coding: utf-8 -*-
"""
Created on Tue May 15 15:31:25 2018

@author: xlh
"""
import math
import json
import random

top = 23.10550
bottom = 22.1540
left = 113.75643
right = 114.65191
sideLength=(right-left)/350

def getDis(p1,p2):
    dis=math.sqrt(math.pow(p1[0]-p2[0],2)+math.pow(p1[1]-p2[1],2))
    return dis


AllLine=[]
with open('D:/Texi/myapp/public/data/drawData/valueHexagon2_399.json','r',encoding='utf-8') as f:
    hexagonList=json.loads(f.read())
    categoryList=[]
    for i in range(len(hexagonList)):
        if hexagonList[i]['category'] not in categoryList:
            categoryList.append(hexagonList[i]['category'])
    categoryList.sort()
    categoryList.pop(0)
    classList=[] #for a class
    for i in range(len(categoryList)):
        classList.append([])
        for j in range(len(hexagonList)):
            if categoryList[i]==hexagonList[j]['category']:
                classList[i].append(hexagonList[j])
                
    for i in range(len(classList)):
        pointDict={}
        boundList=[]
        lineList=[]
        for j in range(len(classList[i])):
            for s in range(len(classList[i][j]['path'])-1):
                pointPositonStr=str(round(classList[i][j]['path'][s][0],5))+'-'+str(round(classList[i][j]['path'][s][1],5))
                pointDict[pointPositonStr]=0
        for j in range(len(classList[i])):
            for s in range(len(classList[i][j]['path'])-1):
                pointPositonStr=str(round(classList[i][j]['path'][s][0],5))+'-'+str(round(classList[i][j]['path'][s][1],5))
                pointDict[pointPositonStr]+=1
        for point in pointDict:
            if pointDict[point]<=2:
                boundList.append(point)
        lineList.append(boundList[0])
        boundList.pop(0)
        while(len(boundList)>0):
            #print(len(boundList))
            for p in range(len(boundList)):
                p1str=boundList[p]
                p2str=lineList[len(lineList)-1]
                p1=[float(p1str.split('-')[0]),float(p1str.split('-')[1])]
                p2=[float(p2str.split('-')[0]),float(p2str.split('-')[1])]
                #print(getDis(p1,p2))
                if (round(getDis(p1,p2),5)<=(sideLength*1.2)):
                    lineList.append(boundList[p])
                    boundList.pop(p)
                    break
                elif(p==(len(boundList)-1)):
                    for b in range(len(lineList)):
                        boundList.append(lineList[b])
                    random.shuffle(boundList)
                    lineList=[]
                    lineList.append(boundList[0])
                    boundList.pop(0)
                    #print('none')
                    break
                    """
                    last=lineList.pop(len(lineList)-1)
                    print(last)
                    boundList.insert(0,last)
                    """
                    
                
                    
                
                """
                satisPoint=[]
                for m in range(len(boundList)):
                    p1str=boundList[m]
                    p2str=lineList[len(lineList)-1]
                    p1=[float(p1str.split('-')[0]),float(p1str.split('-')[1])]
                    p2=[float(p2str.split('-')[0]),float(p2str.split('-')[1])]
                    if (round(getDis(p1,p2),5)<=(sideLength*1.2)):
                        satisPoint.append(boundList[m])
                if(len(satisPoint)>=2):
                    for s in range(len(satisPoint)):
                        if(pointDict[satisPoint[s]])==1:
                            pushIndex=s
                            lineList.append(satisPoint[pushIndex])
                            index=boundList.index(satisPoint[pushIndex])
                            boundList.pop(index)
                            break
                    break
                else:
                    lineList.append(satisPoint[0])
                    index=boundList.index(satisPoint[0])
                    boundList.pop(index)
                    break
                """
        lineList.append(lineList[0])
        thisClass={}
        thisClass['class']=classList[i][0]['category']
        for s in range(len(lineList)):
            lineList[s]=lineList[s].split('-')
            lineList[s][0]=float(lineList[s][0])
            lineList[s][1]=float(lineList[s][1])
        thisClass['path']=lineList
        
        AllLine.append(thisClass)
        
        with open('D:/Texi/myapp/public/data/drawData/bound_432.json','w',encoding='utf-8') as f:
            writeStr=json.dumps(AllLine)
            f.write(writeStr)
        
            
                
        