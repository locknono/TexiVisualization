# -*- coding: utf-8 -*-
"""
Created on Thu May 10 13:57:51 2018

@author: 44219
"""

import json
import os
import csv
from itertools import islice  
import math
import pandas as pd



top = 22.80550
bottom = 22.454
left = 113.75643
right = 114.65191
sideLength=(right-left)/350
rowWidth=2*sideLength*math.cos((math.pi/180)*30)
colCount=int((right-left)/rowWidth)
rowCount=int(((top-bottom)/(3*sideLength))*2)



cigma=sideLength*2.5


fp = 'D:/Texi/myapp/public/data/originalData/processedData'
os.chdir(fp)


hexagonList=[]
with open('D:/Texi/myapp/public/data/drawData/hexagon.json','r',encoding='utf-8') as f:
    hexagonList=json.loads(f.read())
matrix=[]
maxRow=hexagonList[len(hexagonList)-1]['row']
for j in range(maxRow+1):
    rowList=[]
    for i in hexagonList:
        if(i['row'] == j):
            i['value']=0
            rowList.append(i)
    matrix.append(rowList)


def getDis(p1,p2):
    dis=math.sqrt(math.pow(p1[0]-p2[0],2)+math.pow(p1[1]-p2[1],2))
    return dis
def write(matrix,cigma):
    output = []
    for i in range(len(matrix)):
        for j in range(len(matrix[i])):
            output.append(matrix[i][j])
    with open('D:/Texi/myapp/public/data/drawData/valueHexagon'+str(cigma/sideLength)+'_'+str(getClassNumber(matrix))+'.json','w',encoding='utf-8') as f:
        writeStr=json.dumps(hexagonList)
        f.write(writeStr)
        
#找出当前正六边形和它周围的六边形的最大值
def getMax(thisHexagon,surround):
    maxValue = thisHexagon['value']
    for s in range(len(surround)):
        if(surround[s]['value']>maxValue):
            maxValue = surround[s]['value']
    return maxValue
    

classNumber=0
chain = []
def getClass(thisHexagon,matrix):
    global classNumber
    global chain
    row = thisHexagon['row']
    col = thisHexagon['col']
    a=row-1
    b=row+1
    c=col-1
    d=col+1
    if(a<0):
        a=row
    if(b>rowCount):
        b=row
    if(c<0):
        c=col
    if(d>colCount):
        d=col
    if(row%2 !=0):
        surround=[matrix[a][col],matrix[a][d],matrix[row][c],matrix[row][d],matrix[b][col],matrix[b][d]]
    else:
        surround=[matrix[a][c],matrix[a][col],matrix[row][c],matrix[row][d],matrix[b][c],matrix[b][col]]
    """#如果周围的六边形已经有了归属类，那这个六边形不进行比较，从surround中删除
    for g in range(len(surround)-1,-1,-1):
        if(surround[g]['category']!=-1):
            surround.pop(g)
    """
    maxValue=getMax(matrix[row][col],surround)
    #有大量的正六边形的值都是0,如果它和它周围的值都是0,那么就进入下一次查找，保留他们的类别为-1
    if(maxValue == 0):
        chain=[]
        return
    
    #如果起点的值是最大的，那么他就是波峰
    if(maxValue == matrix[row][col]['value']):
        #如果它的类已经被设置过了，那么就保留他原来的类
        if(matrix[row][col]['category']!=-1):
            chain=[]
            return
        #如果它的类还没有被设置，把它的类设置为一个从未出现过的新类
        elif(matrix[row][col]['category']==-1):
            matrix[row][col]['category']=classNumber
            #print(maxValue)
            chain=[]
            #classNumber+=1
            return
        
    #如果当前的值不是最大的，找出他周围最大的一个
    else:
        maxIndex=-1
        for s in range(len(surround)):
            if(surround[s]['value'] == maxValue):
                maxIndex=s
        #print(row,col,'chain')
        """
        if(matrix[row][col]['category']!=-1):
            if(surround[maxIndex]['category']!=-1):
                for z in range(len(matrix)):
                    for b in range(len(matrix[z])):
                        if(matrix[z][b]['category']==matrix[row][col]['category']):
                            matrix[z][b]['category']=surround[maxIndex]['category']
            elif(surround[maxIndex]['category']==-1):
                surround[maxIndex]['category']=matrix[row][col]['category']
            return
            
            surround[maxIndex]['category']=matrix[row][col]['category']
        else:
        """
        #如果它周围最大的一个已经有了归属类，就把这次寻找的整条链的类都设置成它周围的最大的六边形的归属类
        #周围最大的一个有了归属类，那么这个点是终点吗？
        
        if(surround[maxIndex]['category']!=-1):
            matrix[row][col]['category']=surround[maxIndex]['category']
            if len(chain)>0 :
                for c in range(len(chain)):
                    row2 = chain[c][0]
                    col2 = chain[c][1]
                    matrix[row2][col2]['category']= surround[maxIndex]['category']
                chain=[]
            return
            #getClass(surround[maxIndex],matrix) 
        #如果周围最大的正六边形还没有归属类，把当前正六边形的归属类和最大的六边形的归属类设置为当前的类，并以这个最大的为起点继续找
        elif(surround[maxIndex]['category']==-1):
            chain.append([row,col])
            chain.append([surround[maxIndex]['row'],surround[maxIndex]['col']])
            #if(len(chain)==2):
            #    classNumber+=1
            matrix[row][col]['category']=classNumber
            surround[maxIndex]['category']=classNumber
            #把起点和周围最大点加入寻找链
            getClass(surround[maxIndex],matrix)
        
        
def getClassNumber(matrix):   
    value=[] 
    for i in range(len(matrix)):
        for j in range(len(matrix[i])):
            if(matrix[i][j]['category'] not in value):
                value.append(matrix[i][j]['category'])   
    value.sort()
    for i in range(len(matrix)):
        for j in range(len(matrix[i])):
            for s in range(len(value)):
                if(value[s]==matrix[i][j]['category']):
                    matrix[i][j]['category']=s-1
    print(value)
    print(len(value))
    return len(value)

            
def clustering(matrix):
    global classNumber
    for i in range(len(matrix)):
        for j in range(len(matrix[i])):
            classNumber+=1
            if(matrix[i][j]['category']!=-1):
                continue
            getClass(matrix[i][j],matrix)
    for i in range(len(matrix)):
        for j in range(len(matrix[i])):
            if(matrix[i][j]['value']==0):
                matrix[i][j]['category']=-1

pathdir=os.listdir(fp)
fileCount=0

for c in [1.5,1.75,1.8,2]:
    cigma=sideLength*c
    for path in pathdir:
        newdir = os.path.join(fp,path) # 将文件名加入到当前文件路径后面
        if os.path.isfile(newdir):     #如果是文件
            #print(newdir)
            with open (newdir,'r',encoding='utf-8') as f:
                fileCount+=1
                if(fileCount>=1000):
                    break
                print(fileCount)
                reader=csv.reader(f)
                tmp=0;
                for line in islice(reader, 1, None): 
                    status=float(line[4])
                    if(status!=0 and status!=1):
                        continue
                    if(tmp != status):
                        lat = float(line[3])
                        lng = float(line[2])
                        position=[lat,lng]
                        """判断有没有在海里的点
                        if(lat<22.524 and lng>113.784 and lng <113.90 and lat>22.522):
                            print(position)
                        #print(position)
                        """
                        row=int((top-lat)/(1.5*sideLength))
                        if(row<0):
                            continue
                        if(row%2==0):
                            col=int((lng-left)/rowWidth)
                        else:
                            col=int((lng-left-sideLength*math.cos((math.pi/180)*30))/rowWidth)
                        if(col<0):
                            continue
                        for s in range(row-8,row+8):
                            if(s<0 or s >rowCount):
                                continue
                            for t in range(col-8,col+8):
                                if(t<0 or t>colCount):
                                    continue
                                if(s==0 and t == 0):
                                    print(row,col)
                                hexagonPoint=[matrix[s][t]['lat'],matrix[s][t]['lng']]
                                #print(position[0]-matrix[s][t]['lat'])
                                if(getDis(position,hexagonPoint)<(3*cigma)):
                                    exp=-(math.pow(getDis(position,hexagonPoint),2)/(2*math.pow(cigma,2)))
                                    cons=1/(cigma*math.sqrt(2*math.pi))
                                    value=cons*math.pow(math.e,exp)
                                    matrix[s][t]['value']+=value
                        tmp=status
                        #print(tmp)
    clustering(matrix)
    write(matrix,cigma)
    hexagonList=[]
    with open('D:/Texi/myapp/public/data/drawData/hexagon.json','r',encoding='utf-8') as f:
        hexagonList=json.loads(f.read())
    matrix=[]
    maxRow=hexagonList[len(hexagonList)-1]['row']
    for j in range(maxRow+1):
        rowList=[]
        for i in hexagonList:
            if(i['row'] == j):
                i['value']=0
                rowList.append(i)
        matrix.append(rowList)
    fileCount=0
    

                    
            
            
        
        
        
        
                        

    
        
