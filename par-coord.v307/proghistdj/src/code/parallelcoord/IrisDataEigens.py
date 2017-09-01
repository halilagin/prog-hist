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



class IrisDataEigens(object):
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
                corr_ = np.ma.corrcoef(X)
                cov_ = corr_
                invconv_ = np.linalg.inv(cov_)
                
                lambda_1, v1 = np.linalg.eig(corr_)
                lambda_1 = np.sqrt(lambda_1)
                if var1=="petal_len" and var2=="sepal_w":
                    print(corr_, v1)
                
                #angle_ = np.rad2deg(np.arccos(v1[0, 0]))
                #https://stackoverflow.com/questions/20126061/creating-a-confidence-ellipses-in-a-sccatterplot-using-matplotlib
                angle_ = np.degrees(np.arctan2(*v1[:,0][::-1]))

                
                eigens[var1+"___"+var2] = { 
                               "eigvals":lambda_1.tolist(), 
                               "eigvecs":v1.tolist(), 
                               "angle":angle_, 
                               "cov":cov_.tolist(), 
                               "corr":cov_.tolist(), 
                               
                               "invcov":invconv_.tolist(), 
                               "extents":extents,
                               "m1":m1,
                               "m2":m2}
        #print ("eigens", eigens)
        return eigens
        

print (IrisDataEigens().eigens())
