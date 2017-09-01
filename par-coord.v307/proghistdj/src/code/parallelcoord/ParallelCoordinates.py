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








class ParallelCoordinates(object):
    pass

    def getIrisData(self):
        pass
        url = "/Users/halil/Yandex.Disk.localized/root/academic/myphd/phd/0091-mypapers/uv-in-pc/data/pc-data-sample.csv"
        data=pandas.read_csv(url)
        list= data.values.T.tolist()
        return list
    
        
    def start(self):
        pass
        #self.pcForFewData()
        #self.scatterPlot()
