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
from sklearn import preprocessing
import timeit


# see http://scikit-learn.org/stable/auto_examples/gaussian_process/plot_gpr_noisy_targets.html

class GaussianProcessDataProducer(object):
    
   
    def f(self, x):
        """The function to predict."""
        return (x - x**2 + x**3 -x**4)
        #return  1/np.exp(x)
    
    # gaussian process for x*sinx. error bar and function x.sinx removed.
    def produceGaussian_X_SINX(self):
        pass
        
        np.random.seed(1)
        lowerX = 0.01
        range_ = 0.99
        freq = 10
        upperX = lowerX + range_
        
        x_orig = np.linspace(lowerX, upperX, freq)
        X = np.atleast_2d(x_orig).T
         
        # Observations and noise
        y = self.f(X).ravel()
        
        return self.produceGaussian(x_orig,y)
         
#       
    
    # gaussian process for x*sinx. error bar and function x.sinx removed.
    def produceGaussian(self, x_orig, y):
        pass
        
    
        # Instanciate a Gaussian Process model
        kernel = C(1.0, (1e-3, 1e3)) * RBF(10, (1e-2, 1e2))
        X = np.atleast_2d(x_orig).T
         
        # Instanciate a Gaussian Process model
        gp = GaussianProcessRegressor(kernel=kernel, alpha=2,
                                      n_restarts_optimizer=10)
         
        # Fit to data using Maximum Likelihood Estimation of the parameters
        gp.fit(X, y)
         
        # Make the prediction on the meshed x-axis (ask for MSE as well)
        y_pred, sigma = gp.predict(X, return_std=True)
        

        return (x_orig, y_pred, sigma)
        
        