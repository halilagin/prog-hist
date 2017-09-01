"""
Inferring a binomial proportion via exact mathematical analysis.
"""
import sys
import numpy as np
from scipy.stats import beta
from scipy.special import beta as beta_func
import matplotlib.pyplot as plt
import matplotlib.patches as patches
#from HDIofICDF import *
from scipy.optimize import fmin
#from scipy.stats import *
from scipy.stats import beta
from scipy import special
from scipy import stats
import random
from scipy.special.basic import bernoulli
import math
from pylab import mlab
import json
from builtins import staticmethod
import copy
from sklearn.gaussian_process import GaussianProcessRegressor
from sklearn.gaussian_process.kernels import RBF, ConstantKernel as C
from sklearn.gaussian_process import GaussianProcessClassifier
import sklearn.preprocessing as skpre
import timeit
import csv
import pandas as pd
from matplotlib.patches import Ellipse


import pylab



class IrisDataSpatialSign(object):
    pass

    def __init__(self):
        csvFile = "/Users/halil/Yandex.Disk.localized/root/academic/myphd/phd/0070-coding/parallel-coord/frontend/public/data/iris.data.csv"
        csvDictReader = csv.DictReader(open(csvFile))
        self.cols =['petal_len','petal_w','sepal_len','sepal_w','t_set_ver_vir']

        self.df = pd.read_csv(csvFile)
        
        #hash for columns scaled and centered
        self.dfscaled = {}
        #hash for columns spatial signed
        self.ss = {}
        
        #sepal_w___petal_len data points on circles
        self.ssmatrix={}
        
    
    
    def scaleAndCenter(self):
        pass
        #skpre.scale(self.df)
        mmscaler = skpre.MinMaxScaler(feature_range=(-1,1))
        #print (mmscaler.data_max_, mmscaler.data_min_)
        for col in self.cols:
            if col=="t_set_ver_vir":
                continue
            mmscaler.fit(self.df[col].values.reshape(-1,1))
            nvals = mmscaler.transform(self.df[col].values.reshape(-1,1))
            nvals = nvals.ravel()
            self.dfscaled[col]=nvals
    
    def applySpatialSign(self):
        self.scaleAndCenter()
        
        
        for col in self.cols:
            if col=="t_set_ver_vir":
                continue
            vals = self.dfscaled[col]
            denom =math.sqrt( np.sum(np.multiply(vals, vals)) )
            vals = vals*(1.0/denom)
            self.ss[col] = vals
        
    
    def projectOnCircle(self, x, y):
        r=1
        p=np.sqrt(x**2+y**2)
        nx=(r/p)*x        
        ny=(r/p)*y
        return [nx,ny]
    
    
        
    
    def produceSSMatrix(self):
        self.applySpatialSign()

        for n in self.cols:
            if n=="t_set_ver_vir":
                continue
            for m in self.cols:
                if m=="t_set_ver_vir":
                    continue
                if n==m:
                    continue
                x = self.ss[n]
                y = self.ss[m]
                self.ssmatrix[n+"___"+m] = self.projectOnCircle(x, y)
                
    
    def plotProjectOnCircle(self, x, y):
        c = self.projectOnCircle(x,y)
        plt.scatter(c[0],c[1])
        plt.show()
    
    def test3ProjectOnCircle(self):
        self.applySpatialSign()
        x = self.ss['sepal_len']
        y = self.ss['petal_w']
        self.plotProjectOnCircle(x, y)
        
        
    def test4ProduceSSMatrix(self):
        pass
        self.produceSSMatrix()
        print (self.ssmatrix)


#IrisDataSpatialSign().test1ScaleAndCenter()
#IrisDataSpatialSign().test2SpatialSigned()

#IrisDataSpatialSign().test3ProjectOnCircle()

IrisDataSpatialSign().test4ProduceSSMatrix()
