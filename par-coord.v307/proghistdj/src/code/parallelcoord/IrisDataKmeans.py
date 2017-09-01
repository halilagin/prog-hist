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
import scipy
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
from scipy.stats import binom
from sklearn.preprocessing import normalize as probNorm
import timeit
import pandas
import matplotlib.pyplot as plt
from pandas.plotting import parallel_coordinates
import io
import requests
from matplotlib.pyplot import ylabel
import csv
import pandas as pd

class IrisDataKmeans(object):
    
    pass
    
    def __init__(self):
        pass
        csvFile = "/Users/halil/Yandex.Disk.localized/root/academic/myphd/phd/0070-coding/parallel-coord/frontend/public/data/iris.data.csv"
        csvDictReader = csv.DictReader(open(csvFile))
        self.df = pd.read_csv(csvFile)
    
    

    def kMeans(self, X, K, maxIters = 7):
        #np.seterr(divide='ignore', invalid='ignore')
        #print (np.random.choice(np.arange(len(X)), K))
        cents = np.random.choice(np.arange(len(X)), K)
        centroids = X[cents, :]
        clusterMembers=[]
        for i in range(maxIters):
            # Cluster Assignment step
            C = np.array([np.argmin([np.dot(x_i-y_k, x_i-y_k) for y_k in centroids]) for x_i in X])
            # Move centroids step
            centroids = [X[C == k].mean(axis = 0) for k in range(K)]
            if i==(maxIters-1):
                clusterMembers = [X[C == k].tolist() for k in range(K)]
        return np.array(centroids) , C, clusterMembers


    def kmeansOf(self, x1, x2, K=3):
        pass
        
        #X = np.vstack((data1,np.vstack((data2,data3))))
        
        X = np.vstack((x1,x2)).astype(np.float)
        print ("X.type", X.dtype)
        centroids, C, CMembers = self.kMeans(X.T, K)
        extents = [
            [np.min(x1), np.max(x1)],
            [np.min(x2), np.max(x2)]
            ]
         
        return {"extents":extents, "centroids":centroids.tolist(), "C":C.tolist(), "members":CMembers}
    
    def kmeansOfVars(self, var1n, var2n, K):
        pass
        x1 = np.array(self.df[var1n].values).astype(np.float)
        x2 = np.array(self.df[var2n].values).astype(np.float)
        return self.kmeansOf(x1,x2, K)

    def test(self):
        pass
        result= self.kmeansOfVars("petal_len", "petal_w", 3)
        print (result)
#print (CMembers[0])


#IrisDataKmeans().test()
