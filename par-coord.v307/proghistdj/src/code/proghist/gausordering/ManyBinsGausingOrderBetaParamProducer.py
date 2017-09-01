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
import json
from code.proghist.gausordering.TwoBinsGausingOrderBetaParamProducer import TwoBinsGausOrderingBetaParamProducer
 
 

class MyJsonEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        else:
            return super(MyJsonEncoder, self).default(obj)
    
class ManyBinsGausOrderingBetaParamProducer(object):
    
    def __init__(self, hist=[ [0, 0.2, 10], [0.15, 0.35, 20], [0.25, 0.50, 30], [0.50, 0.60, 40], [0.55, 0.65, 50] ]):
        pass
        #self.b1n = [.1, (0.1/3.)**2]
        #self.b2n = [.25, (0.2/3.)**2]
        
        
        #[lower-bound, upper-bound, count]
        #self.hist = [ [0.2, 0.45, 10], [0.4, 1.0, 20] ]
        #self.hist = [ [0.2, 0.6, 10] ]
        self.hist = hist
        self.binchanges = []
        for i, h_ in enumerate(self.hist):
            if (i+2)>len(self.hist):
                break
            print (i)
            twobins = TwoBinsGausOrderingBetaParamProducer(self.hist[i:(i+2)] )
            changesOfTwoBins = twobins.twoBinsProgHistData(dataCount=10, chunkSize=6)
            self.binchanges.append(changesOfTwoBins)
            
        #self.plotGausses()
#         for c in self.binchanges:
#             print("\n",c)

    
    
    def start(self):
        #self.twoBinsProgHistData(dataCount=10, chunkSize=6)
        for c in self.binchanges:
            print(c)
            #print(json.dumps(c,cls=MyJsonEncoder))
        

# [[bin_lowerbound, bin_upperbound, bin_popul_size]] 
#definition of histogram : [ [0.2, 0.45, 10], [0.4, 1.0, 20] ]

# hist=[ [0, 0.2, 10], [0.15, 0.35, 20], [0.25, 0.50, 30], [0.50, 0.60, 40], [0.55, 0.65, 50] ]
# # #hist=[[0.2, 0.45, 10], [0.4, 0.65, 20] ]
# bpp = ManyBinsGausOrderingBetaParamProducer(hist=hist)
# bpp.start()
