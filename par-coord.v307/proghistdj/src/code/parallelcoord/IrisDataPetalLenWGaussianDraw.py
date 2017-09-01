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



class IrisDataPetalLenWGaussianDraw(object):
    pass

    def __init__(self):
        csvFile = "/Users/halil/Yandex.Disk.localized/root/academic/myphd/phd/0070-coding/parallel-coord/frontend/public/data/iris.data.csv"
        csvDictReader = csv.DictReader(open(csvFile))
        self.df = pd.read_csv(csvFile)
        
    
    def start(self):
        pass
    
        vars=['petal_len','petal_w','sepal_len','sepal_w','t_set_ver_vir']
        x1 =np.asfarray(self.df["petal_len"].values, dtype='float')
        x2 =np.asfarray(self.df["petal_w"].values, dtype='float')
        y =np.array(self.df["t_set_ver_vir"].values, dtype='int')
        X = np.array([x1,x2]).T
        print ("y",y)
        h = .02 # step size in the mesh
        kernel = 1.0 * RBF([1.0])
        gpc_rbf_isotropic = GaussianProcessClassifier(kernel=kernel).fit(X, y)
        kernel = 1.0 * RBF([1.0, 1.0])
        gpc_rbf_anisotropic = GaussianProcessClassifier(kernel=kernel).fit(X, y)
        # create a mesh to plot in
        x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
        y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
        xx, yy = np.meshgrid(np.arange(x_min, x_max, h),
        np.arange(y_min, y_max, h))
        titles = ["Isotropic RBF", "Anisotropic RBF"]
        plt.figure(figsize=(10, 5))
        
        for i, clf in enumerate((gpc_rbf_isotropic, gpc_rbf_anisotropic)):
            # Plot the predicted probabilities. For that, we will assign a color to
            # each point in the mesh [x_min, m_max]x[y_min, y_max].
            plt.subplot(1, 2, i + 1)
            Z = clf.predict_proba(np.c_[xx.ravel(), yy.ravel()])
            Z = Z.reshape((xx.shape[0], xx.shape[1], 3))
            plt.imshow(Z, extent=(x_min, x_max, y_min, y_max), origin="lower")
            # Plot also the training points
            plt.scatter(X[:, 0], X[:, 1], c=np.array(["r", "g", "b"])[y-1],
            edgecolors=(0, 0, 0))
            plt.xlabel('Petal Length')
            plt.ylabel('Petal Width')
            plt.xlim(xx.min(), xx.max())
            plt.ylim(yy.min(), yy.max())
            plt.xticks(())
            plt.yticks(())
            plt.title("%s, LML: %.3f" %
            (titles[i], clf.log_marginal_likelihood(clf.kernel_.theta)))
        
        plt.tight_layout()
        plt.show()

print (IrisDataPetalLenWGaussianDraw().start())
