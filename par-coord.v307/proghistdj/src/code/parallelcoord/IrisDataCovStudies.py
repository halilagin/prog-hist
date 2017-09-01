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

import timeit
import csv
import pandas as pd
from matplotlib.patches import Ellipse


import pylab



class IrisDataCovStudies(object):
    pass

    def __init__(self):
        csvFile = "/Users/halil/Yandex.Disk.localized/root/academic/myphd/phd/0070-coding/parallel-coord/frontend/public/data/iris.data.csv"
        csvDictReader = csv.DictReader(open(csvFile))
        self.df = pd.read_csv(csvFile)
        
    
    def eigens(self):
        pass
    
        vars=['petal_len','petal_w','sepal_len','sepal_w','t_set_ver_vir']
        eigens = {}
        for var1 in vars:
            for var2 in vars:
                if var1==var2:
                    continue
                x =np.asfarray(self.df[var1].values, dtype='float')
                y =np.asfarray(self.df[var2].values, dtype='float')
                x_extent = [np.min(x),np.max(x)]
                y_extent = [np.min(y),np.max(y)]
                extents = [x_extent, y_extent]
                m1 = np.mean(x)
                m2 = np.mean(y)
                X = np.vstack((x,y))
                cov_ = np.cov(X)
                invconv_ = np.linalg.inv(cov_)
                lambda_1, v1 = np.linalg.eig(cov_)
                lambda_1 = np.sqrt(lambda_1)
                angle_ = np.rad2deg(np.arccos(v1[0, 0]))
                
                eigens[var1+"___"+var2] = { 
                               "eigvals":lambda_1.tolist(), 
                               "eigvecs":v1.tolist(), 
                               "angle":angle_, 
                               "cov":cov_.tolist(), 
                               "invcov":invconv_.tolist(), 
                               "extents":extents,
                               "m1":m1,
                               "m2":m2}
        #print ("eigens", eigens)
        return eigens
    
    def covTest01(self):
        pass
    
        vars=['petal_len','petal_w','sepal_len','sepal_w','t_set_ver_vir']
        
        for var1 in vars:
            for var2 in vars:
                if var1==var2:
                    continue
                #var1 = vars[2]
                #var2 = vars[3]
                
                x =np.asfarray(self.df[var1].values, dtype='float')
                y =np.asfarray(self.df[var2].values, dtype='float')
                X = np.vstack((x,y))
                corr_ = np.ma.corrcoef(X)[0][1]
                cov_ = np.array([np.var(x),corr_,corr_,np.var(y)]).reshape(2,2)
                print (cov_)
                #print (var1+":"+var2,np.ma.corrcoef(X))
        
    def covTest02(self):
        pass
    
        vars=['petal_len','petal_w','sepal_len','sepal_w','t_set_ver_vir']
        var1=vars[1]
        var2 = vars[0]
        x = np.asfarray(self.df[var1].values, dtype='float')
        y = np.asfarray(self.df[var2].values, dtype='float')
        print (np.sort(x))
        print (var1,np.mean(x),np.var(x),np.std(x))
 
    def covTest03(self):
        pass
    
        vars=['petal_len','petal_w','sepal_len','sepal_w','t_set_ver_vir']
        var1=vars[2]
        var2 = vars[3]
        x = np.asfarray(self.df[var1].values, dtype='float')
        y = np.asfarray(self.df[var2].values, dtype='float')
        print (var1,np.mean(x),np.var(x),np.std(x))
        print (var2,np.mean(y),np.var(y),np.std(y))
        

#IrisDataCovStudies().eigens()

#IrisDataCovStudies().covTest01()
#IrisDataCovStudies().covTest02()
IrisDataCovStudies().covTest03()

