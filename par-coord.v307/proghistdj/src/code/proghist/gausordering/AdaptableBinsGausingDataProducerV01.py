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
from code.proghist.gausordering.TwoBinsGausingOrderBetaParamProducer import PHGauss,\
    PHBin
from builtins import staticmethod
from code.proghist.gausordering.AdaptableTwoBinsGausingOrderBetaParamProducer import AdaptableTwoBinsGausOrderingBetaParamProducer
import copy
 

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
    
class AdaptableBinsGausDataProducer(object):
    
    #gaussess: [ [lower, upper, data-count]] mean and variance generated automatically by using lower and upper bounds
    def __init__(self, distcount=3):
        pass
        self.dists = [ 
                        [ [0, 0.99, 10] ],    
                        [ [0, 0.55, 10],  [0.45, 0.99, 10] ],
                        [ [0, 0.4, 10], [0.33, 0.73, 10], [0.60, 0.99, 10] ],
                        [ [0, 0.27, 10], [0.23, 0.52, 10], [0.48, 0.77, 10],  [0.73, 0.99, 10] ],
                        [ [0, 0.22, 10], [0.18, 0.42, 10], [0.38, 0.62, 10], [0.58, 0.82, 10], [0.78, 0.99, 10] ],
                        [ [0, 0.18, 10], [0.14, 0.34, 10], [0.32, 0.50, 10], [0.46, 0.66, 10], [0.62, 0.82, 10], [0.78, 0.99, 10] ]
                    ]
        self.distcount = distcount
        self.initGausses()
    
    def initGausses(self):
        self.gaussdescs = self.dists[ self.distcount-1 ]
        self.gausses = []
        for gaussdesc in self.gaussdescs:
            phg = PHGauss()
            x1,x2,size = gaussdesc
            phg.create(x1, x2)
            self.gausses.append(phg)
        
    
    def produceData(self, datacount=10, chunksize=6): #multiplied by 6, by default 60 data point will be generated
        self.chunksize=chunksize
        self.values = []
        for i, gd in enumerate(self.gaussdescs):
            bincount = gd[2]
            a,b = self.gausses[i].betas
            values_ = beta.rvs(a, b, size=bincount * datacount * chunksize)
            self.values = self.values + values_.tolist()
        self.originalValues = copy.deepcopy( self.values) 
        random.shuffle(self.values) 
        
    def init(self, datacount=10, chunksize=6):
        self.initGausses()
        self.produceData(datacount, chunksize)
    
    # produce 0,1,2 categorical values which can be represented by beta-bernoulli tetas. argmax returns the index of max value.
    def categorizeData(self, bincount=5):
        #categorized data
        self.bins=[]
        self.bincount = bincount
        self.binchanges = []
        
        values_max = max(self.values)
        values_min = min(self.values)
        bins_width = (values_max-values_min)/ ((self.bincount)*1.0)
        bins_ranges = np.arange(min(self.values), max(self.values), bins_width)
        bins_ranges = np.append(bins_ranges, [values_max], axis=0)
        
        
        for i in range(self.bincount):
            binsize = ((bins_ranges[i] < self.values) & (self.values < bins_ranges[i+1])).sum()
            self.bins.append(PHBin("real", bins_ranges[i], bins_ranges[i+1], binsize))
        
        
        for i, h_ in enumerate(self.bins):
            if (i+2)>len(self.bins):
                break
            
            twobins = AdaptableTwoBinsGausOrderingBetaParamProducer(bins=self.bins[i:(i+2)], data=self.values )
            changesOfTwoBins = twobins.twoBinsProgHistData(chunkSize=6)
            self.binchanges.append(changesOfTwoBins)
    
    def plotData(self):
        binwidth=0.2
        plt.hist(self.values, bins=np.arange(min(self.values), max(self.values) + binwidth, binwidth))
        plt.show()
   
            
    
    
       
            
        
    
    def start(self):
        self.produceData(datacount=5, chunksize=6)
        self.categorizeData(bincount=2)  
        for i,bc in enumerate(self.binchanges):
            print(bc)      
        
            
# [[bin_lowerbound, bin_upperbound, bin_popul_size]] 
#definition of histogram : [ [0.2, 0.45, 10], [0.4, 1.0, 20] ]

# hist=[ [0, 0.2, 10], [0.15, 0.35, 20], [0.25, 0.50, 30], [0.50, 0.60, 40], [0.55, 0.65, 50] ]
# #hist=[[0.2, 0.45, 10], [0.4, 0.65, 20] ]
# bpp = ManyBinsGausOrderingBetaParamProducer(hist=hist)
# bpp.start()


#bpp = AdaptableBinsGausDataProducer(distcount=3)
#bpp.start()
