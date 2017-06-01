"""
Inferring a binomial proportion via exact mathematical analysis.
"""
import sys
import numpy as np
from scipy.stats import beta
from scipy.special import beta as beta_func
import matplotlib.pyplot as plt
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
from code.proghist.gausordering.BinChangesByEntropy import BinChangesByEntropy


hist = [ [0, 0.2, 10], [0.15, 0.25, 20], [0.22, 0.35, 30] ]
#bins = [[0, 1.0, 0, 0, 1.0, 0.0], [0, 2, 0, 1.0, 1.0, 0.0], [0, 1, 0, 0.0, 2.5, 0.0], [0, 1, 0, 0.5, 2.0, 0.0], [0, 3, 0, 0.0, 1.5, 0.0]]
bins = [[0, 1.0, 0, 0, 1.0, 0.0], [0, 2, 2, 2.0, 1.0, 0.0], [2, 1, 0, 0.0, 2.5, 4.0], [0, 1, 0, 0.5, 2.0, 0.0], [2, 0, 2, 0.0, 1.5, 0.0]]
bet = BinChangesByEntropy()
#bet.run()
bet.determineChangeOfBins( bins)