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


def kMeans(X, K, maxIters = 5, plot_progress = None):

    centroids = X[np.random.choice(np.arange(len(X)), K), :]
    clusterMembers=[]
    for i in range(maxIters):
        # Cluster Assignment step
        C = np.array([np.argmin([np.dot(x_i-y_k, x_i-y_k) for y_k in centroids]) for x_i in X])
        # Move centroids step
        centroids = [X[C == k].mean(axis = 0) for k in range(K)]
        if i==(maxIters-1):
            clusterMembers = [X[C == k].tolist() for k in range(K)]
        if plot_progress != None: plot_progress(X, C, np.array(centroids))
    return np.array(centroids) , C, clusterMembers




def show(X, C, centroids, keep = False):
    import time
    time.sleep(0.5)
    plt.cla()
    plt.plot(X[C == 0, 0], X[C == 0, 1], '*b',
         X[C == 1, 0], X[C == 1, 1], '*r',
         X[C == 2, 0], X[C == 2, 1], '*g')
    plt.plot(centroids[:,0],centroids[:,1],'*m',markersize=20)
    plt.draw()
    if keep :
        plt.ioff()
        plt.show()



plt.ion()

# generate 3 cluster data
# data = np.genfromtxt('data1.csv', delimiter=',')
m1, cov1 = [9, 8], [[1.5, 2], [1, 2]]
m2, cov2 = [5, 13], [[2.5, -1.5], [-1.5, 1.5]]
m3, cov3 = [3, 7], [[0.25, 0.5], [-0.1, 0.5]]
data1 = np.random.multivariate_normal(m1, cov1, 30)
data2 = np.random.multivariate_normal(m2, cov2, 40)
data3 = np.random.multivariate_normal(m3, cov3, 30)
X = np.vstack((data1,np.vstack((data2,data3))))
np.random.shuffle(X)

centroids, C, CMembers = kMeans(X, K = 3, plot_progress = show)
#show(X, C, centroids, True)

print (CMembers[0])
print (CMembers[1])
print (CMembers[2])
#print ( np.vstack((data2,data3)) )


