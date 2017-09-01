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
from code.parallelcoord.IrisDataEigens import IrisDataEigens



class IrisDataProvider(object):
    pass

    def __init__(self):
        csvFile = "/Users/halil/Yandex.Disk.localized/root/academic/myphd/phd/0070-coding/parallel-coord/frontend/public/data/iris.data.csv"
        self.csvDictReader = csv.DictReader(open(csvFile))
        self.df = pd.read_csv(csvFile)
        
    
    def getData(self):
        pass
        csv = [ row for row in self.csvDictReader ] 
        eigens = IrisDataEigens().eigens()

        return {"csv":csv, "eigens":eigens}
        

#IrisDataProvider().getData()
