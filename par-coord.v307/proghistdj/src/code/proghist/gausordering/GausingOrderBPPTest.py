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
from code.proghist.gausordering.TwoBinsGausingOrderBetaParamProducer import TwoBinsGausOrderingBetaParamProducer



# [[bin_lowerbound, bin_upperbound, bin_popul_size]] 
#definition of histogram : [ [0.2, 0.45, 10], [0.4, 1.0, 20] ]

hist=[ [0.2, 0.45, 10], [0.4, 0.65, 20] ]
bpp = TwoBinsGausOrderingBetaParamProducer(hist = hist)
bpp.start()