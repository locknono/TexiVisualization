# -*- coding: utf-8 -*-
"""
Created on Sat May 26 12:34:31 2018

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


with open('D:/Texi/myapp/public/data/drawData/524valueHexagon2.0_202.json','r',encoding='utf-8') as f:
    hexagonList=json.loads(f.read())
"""
for i in range(len(hexagonList)-1,-1,-1):
    if hexagonList[i]['category']==-1:
        hexagonList.pop(i)
"""
        
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
    
for row in matrix:
    for hexagon in row:
        hexagon['matrix']=[[0]*classCount]*7




def getRowAndCol(line):
    lng=float(line[1])
    lat=float(line[2])
    
    row=int((top-lat)/(1.5*sideLength))
    if(row<0 or row>rowCount):
        return [-1,-1]
    if(row%2==0):
        col=int((lng-left)/rowWidth)
    else:
        col=int((lng-left-sideLength*math.cos((math.pi/180)*30))/rowWidth)
    if(col<0 or col>colCount):
        return [-1,-1]
    
    return [row,col]
    
fileCount=0
for path in pathdir:
    newdir = os.path.join(fp,path) # 将文件名加入到当前文件路径后面
    if os.path.isfile(newdir):     #如果是文件
        
        with open (newdir,'r',encoding='utf-8') as f:
            fileCount+=1
            
            print(fileCount)
            reader=csv.reader(f)
            tmp=1
            #track[0]表示起点
            track=[]
            for line in islice(reader,2, None):
                
                track.append(line)
                
                if(len(track)==2):
                    
                    source=track[0]
                    target=track[1]
                    
                        
                    
                    day=int(source[0].split('-')[0])
                    hour=int(source[0].split('-')[1])
                    
                    if day>=18 and day <=22:
                        if hour>=7 and hour <11:
                            tmRow=0
                        elif hour>=11 and hour <16:
                            tmRow=1
                        elif hour>=16 and hour <21:
                            tmRow=2
                        elif hour>=21 and hour <24:
                            tmRow=3
                        elif hour>=0 and hour <7:
                            tmRow=3
                    if day==23 or day == 24:
                        if hour>=0 and hour <9:
                            tmRow=4
                        elif hour>=9 and hour <19:
                            tmRow=5
                        elif hour>=19 and hour <24:
                            tmRow=6
                    targetRowCol=getRowAndCol(target)
                    if targetRowCol!=[-1,-1]:
                        targetCategory=matrix[targetRowCol[0]][targetRowCol[1]]['category']
                    
                    tmCol=targetCategory
                    
                    #print(tmRow,tmCol)
                        
                    sourceRowCol=getRowAndCol(source)
                    if sourceRowCol!=[-1,-1]:
                        matrix[sourceRowCol[0]][sourceRowCol[1]]['matrix'][tmRow][tmCol]+=1
                    
                    track=[]

for i in matrix:
    for j in i:
        for index,tmRow in enumerate(j['matrix']):
            for value in tmRow:
                if index==0:
                    value=value/4
                elif index==1 or index ==2:
                    value=value/5
                elif index==3:
                    value=value/10
                elif index==4:
                    value=value/9
                elif index==5:
                    value=value/10
                elif index==6:
                    value=value/5





class KMeans():
    def __init__(self, n_clusters=4):
        self.k = n_clusters

    def fit(self, data):
        """
        Fits the k-means model to the given dataset
        """
        n_samples, _ = data.shape
        # initialize cluster centers
        self.centers = np.array(random.sample(list(data), self.k))
        self.initial_centers = np.copy(self.centers)

        # We will keep track of whether the assignment of data points
        # to the clusters has changed. If it stops changing, we are 
        # done fitting the model
        old_assigns = None
        n_iters = 0

        while True:
            new_assigns = [self.classify(datapoint) for datapoint in data]

            if new_assigns == old_assigns:
                print(f"Training finished after {n_iters} iterations!")
                return

            old_assigns = new_assigns
            n_iters += 1

            # recalculate centers
            for id_ in range(self.k):
                points_idx = np.where(np.array(new_assigns) == id_)
                datapoints = data[points_idx]
                self.centers[id_] = datapoints.mean(axis=0)

    def l2_distance(self, datapoint):
        dists = np.sqrt(np.sum((self.centers - datapoint)**2, axis=1))
        return dists

    def classify(self, datapoint):
        """
        Given a datapoint, compute the cluster closest to the
        datapoint. Return the cluster ID of that cluster.
        """
        dists = self.l2_distance(datapoint)
        return np.argmin(dists)

    def plot_clusters(self, data):
        plt.figure(figsize=(12,10))
        plt.title("Initial centers in black, final centers in red")
        plt.scatter(data[:, 0], data[:, 1], marker='.', c=y)
        plt.scatter(self.centers[:, 0], self.centers[:,1], c='r')
        plt.scatter(self.initial_centers[:, 0], self.initial_centers[:,1], c='k')
        plt.show()
        
     
        
    def getDis(self,hex1,hex2):
        tm1=hex1['matrix']
        tm2=hex2['matrix']
        
        np1=np.array(tm1)
        np2=np.array(tm2)
        
        return ((np1-np2)**2).sum()
    
    
    def getInitialCenters(self,matrix):
        self.centers=[]
        for i in range(self.k):
            row=int(random.random()*rowCount)
            col=int(random.random()*colCount)
            if matrix[row][col] not in self.centers:
                center=copy.deepcopy(matrix[row][col])
                center['kClass']=i
                center['count']=0
                self.centers.append(center)
        
    def clustering(self):
        dists = self.getDis(datapoint)
        return np.argmin(dists)
        
    def fitCenter(self,matrix):
        old_assings=copy.deepcopy(self.centers)
        while True:
            for hexagon in np.array(matrix).flat:         
                distances=[]
                for center in self.centers:
                    distances.append(self.getDis(center,hexagon))
                #print(distances)
                #print(min(distances))
                minIndex=distances.index(min(distances))
                hexagon['kClass']=self.centers[minIndex]['kClass']
                self.centers[minIndex]['count']+=1
            for hexagon in np.array(matrix).flat:
                kClass=hexagon['kClass']
                center=self.centers[kClass]
                centerMatrix=np.array(center['matrix'])
                hexMatrix=np.array(hexagon['matrix'])
                center['matrix']=(centerMatrix+hexMatrix).tolist()
            for center in self.centers:
                centerMatrix=np.array(center['matrix'])
                centerMatrix=centerMatrix/center['count']
                center['matrix']=centerMatrix.tolist()
            new_assings=self.centers
            if new_assings==old_assings:
                break
            else:
                for center in self.centers:
                    center['count']=0
            
kmeans = KMeans(n_clusters=4)
kmeans.getInitialCenters(matrix)
kmeans.fitCenter(matrix)

                    
with open('D:/Texi/myapp/public/data/drawData/asd.json','w',encoding='utf-8') as f:
    output=[]
    for hexagon in np.array(matrix).flat:
        hexagon.pop('matrix')
        output.append(hexagon)
    writeStr=json.dumps(output)
    f.write(writeStr)
                    
                
                
                
                
        
                
                
                
            
            
                    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    