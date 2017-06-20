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
from builtins import staticmethod
from code.proghist.gausordering.AdaptableBinsGausingDataProducer import AdaptableBinsGausDataProducer
 
 
    
class TestCaseAdaptableBinsGausDataProducer(object):
    
    #gaussess: [ [lower, upper, data-count]] mean and variance generated automatically by using lower and upper bounds
    def __init__(self, distcount=3):
        pass
    
    
    
    def split(self, a, n):
        return np.array_split(np.array(a),n)
    
    
    #split an array  into n parts
    def test0(self):
        a = list(self.split(range(11), 3))
        print (a)
    
    #check the data have the properties of distribution cenerated from.
    def test1(self):
        pass    
        distcount = 3
        chunksize = 6
        bincount = 2
        datacount = 1
        bpp = AdaptableBinsGausDataProducer(distcount=distcount)
        bpp.produceData(datacount=datacount, chunksize=chunksize)
        dists= self.split(bpp.originalValues, distcount)
        print ("original dist properties[lower, upper, data size]:", bpp.dists[distcount-1])
        for dist in dists:
            m = np.mean(dist)
            std = np.std(dist)
            print ("[lower, upper]:", [m - 3*std,m+3*std])
#         bpp.categorizeData(bincount=bincount)  
#         print ("original values", bpp.originalValues)
#         
#         for i,bc in enumerate(bpp.binchanges):
#             
#             print(bc["binSizes"])   
#             print(bc["origDataChunkedBy6"])
#             print(bc["catDataChunkedBy6"])
#             print(bc["freqs"])
#             print(bc["changes"])
            
        
    #bins tests. check the number of bins, boundaries and heights. it should math original distribution's values.
    def test2(self):
        pass
        distcount = 3
        chunksize = 6
        bincount = 3
        datacount = 1
        bpp = AdaptableBinsGausDataProducer(distcount=distcount)
        bpp.produceData(datacount=datacount, chunksize=chunksize)
        bpp.categorizeData(bincount=bincount)
        print ("original dist properties [lower, upper, data size]:", bpp.dists[distcount-1])
        print ("bins.count", len(bpp.bins))
        for bin in bpp.bins:
            print (bin.x1,bin.x2, bin.size)
#         print ("orig.data.size", len(bpp.values))
#         for i,bc in enumerate(bpp.binchanges):
#             print("binSizes", bc["binSizes"])   
#             print("origDataChunkedBy6", bc["origDataChunkedBy6"])
#             print("catDataChunkedBy6", bc["catDataChunkedBy6"])
#             print("freqs", bc["freqs"])
#             print("changes", bc["changes"])
    
    
    def start(self):
        self.test0()
        #self.test1()
        #self.test2()
            


tc = TestCaseAdaptableBinsGausDataProducer()
tc.start()

