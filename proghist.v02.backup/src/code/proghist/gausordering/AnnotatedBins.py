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
from warnings import catch_warnings
 

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
    
class AnnotatedBins(object):
    
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
    
    def normalize(self, bins):
        s = sum(bins)
        a = map(lambda x: float(x)/s, bins)
        return list(a)
    
    def split(self, a, n):
        return np.array_split(np.array(a),n)
    
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
    def categorizeData(self, idx=0, bincount=5, chunksize=6):
        #categorized data
        self.bins=[]
        self.bincount = bincount
        self.binchanges = []
        
        
        
        
        histogramDataPolulationSize= bincount * chunksize * (idx+1)
        histogramDataPolulation = np.array(self.values[:histogramDataPolulationSize])
        print ("histogramDataPolulation\n", histogramDataPolulation)
        values_max = max(histogramDataPolulation)
        values_min = min(histogramDataPolulation)
        bins_width = (values_max-values_min)/ ((self.bincount)*1.0)
        bins_ranges = np.arange(min(histogramDataPolulation), max(histogramDataPolulation), bins_width)
        bins_ranges = np.append(bins_ranges, [values_max], axis=0)
        
        
        for i in range(self.bincount):
            binsize = ((bins_ranges[i] <= histogramDataPolulation) & (histogramDataPolulation < bins_ranges[i+1])).sum()
            #data = histogramDataPolulation[( bins_ranges[i] <= histogramDataPolulation) & (histogramDataPolulation < bins_ranges[i+1])]
            data = histogramDataPolulation[( bins_ranges[i] <= histogramDataPolulation) & (histogramDataPolulation < bins_ranges[i+1])]
            self.bins.append(PHBin("real", bins_ranges[i], bins_ranges[i+1], binsize, data))
            print ("bins[lower, upper, size]:", bins_ranges[i], bins_ranges[i+1], binsize)
            
        
        lowerBoundIndexInStream = bincount * chunksize * (idx)
        upperBoundIndexInStream = bincount * chunksize * (idx+1)
        streamedData = histogramDataPolulation[lowerBoundIndexInStream:upperBoundIndexInStream ]
        print ("streamedData", streamedData)

        
        self.binchanges=[]
        for i, h_ in enumerate(self.bins):
            if (i+2)>len(self.bins):
                break
            
            categoricalDataByMLE = self.makeCategorical([self.bins[i],self.bins[i+1]], streamedData) #MLE: maximum likelihood estimation


            bin1LowerBoundIdx = chunksize * (i)
            bin2LowerBoundIdx = chunksize * (i+1)
            bin2UpperBoundIdx = chunksize * (i+2)
            
            firstBin= categoricalDataByMLE[bin1LowerBoundIdx:bin2LowerBoundIdx]
            secondBin= categoricalDataByMLE[bin2LowerBoundIdx:bin2UpperBoundIdx]
            twoBinsCategoricalData = [firstBin, secondBin]
            print ("twoBinsCategoricalData",twoBinsCategoricalData)
            freqs = self.prepareWeightedFreqs(twoBinsCategoricalData, chunksize, [self.bins[i].size, self.bins[i+1].size])
            self.bins[i].freqs = freqs
            #catDataChunkedby6 = np.array([catData[i:i+chunkSize] for i in range(len(catData))[::chunkSize]]).tolist()

            print ("freqs",freqs)
            binchanges = self.determineChangeBtwTwoBins(freqs)
            print ("binchanges",binchanges)
            self.bins[i].binchanges = binchanges
            self.binchanges.append(binchanges)
        
    
    
    def makeCategorical(self, bins, data):
        origData = data
        #categorized data
        catData = []
        for idx, x in enumerate(origData):
            tetas=[]
            for bin in bins:
                if bin.type_=="intersection":
                    continue
                tetas_ = [bin.gausses[i].norm.pdf(x) for i in range(len(bin.gausses))]
                tetas = tetas + tetas_
            catData.append( np.argmax(tetas))
        return catData
    
    def prepareWeightedFreqs(self, chunkedArr, chunkSize, binsHeights):
        pass
        #chunkedArr = [twoBinsData[:chunkSize], twoBinsData[chunkSize:]]
        
        ratio =0
        try:
            ratio =  ( 1.0 * binsHeights[0] ) / binsHeights[1]
        except ZeroDivisionError:
            ratio =  10
        
        
        freqs = []
        for i, chunk in enumerate(chunkedArr):
            freq=[]
            for k,c in enumerate(chunk):
                if (k>2):#if it is in second bin, apply ratio, this results in removing effect of bin height differencies on similarity check 
                    freq.append(chunk.count(k) * ratio)
                else:
                    freq.append(chunk.count(k))
            freqs.append(freq)
        return freqs
    
    def determineChangeBtwTwoBins(self, bins):
        #between two bins
        CHANGE_LABELS_BTW_BINS=["BECOMING_FAR", "SUPPORTS_INCREASE", "MERGING"]
        CHANGE_LABELS_OF_BIN=["SPLITTING", "SUPPORTS_CONCEPT", "SPLITTING"]
        #hist=[[0,0.2,10],[0.15,0.35,20],[0.3,0.40,30] ]
        #first element added artificially. it shows baseline entropy. entropy higher than this value means there is more uncertainty,
        #lower than that mean there is a definite move among bins.
        #bins = [[0, 1.0, 0, 0, 1.0, 0.0], [0, 2, 0, 1.0, 1.0, 0.0], [0, 1, 0, 0.0, 2.5, 0.0], [0, 1, 0, 0.5, 2.0, 0.0], [0, 3, 0, 0.0, 1.5, 0.0]]
        #bins = [[0, 1.0, 0, 0, 1.0, 0.0], [0, 2, 2, 2.0, 1.0, 0.0], [2, 1, 0, 0.0, 2.5, 4.0], [0, 1, 0, 0.5, 2.0, 0.0], [2, 0, 2, 0.0, 1.5, 0.0]]
        
        #bins_probs = [[self.normalize(x)] for x in bins]
        
        bins_probs =[]
        for bin in bins:
            if sum(bin)==0:
                continue
            n = self.normalize(bin)
            bins_probs.append([n])
        
        
        #bins_entropy = [stats.entropy(x) for x in bins_probs]
        #bins = self.normalize(bins[0])
        #print ("entropy",bins_entropy)
        #f = np.vectorize(self.logTransform, otypes=[np.float])
        
        changesInBins=[]
        for bin in bins_probs:
            binchanges=[]
            X = np.array(bin)
            Xt = np.transpose(X)
            P = np.dot(Xt,X)
            
            #P = f(P)
            b1b2_corr = P[0:3,3:6]
            b1b2 = np.fliplr(b1b2_corr)
            diagonals = b1b2.diagonal()
            if (len(diagonals)==0):
                continue
            argmax_idx = np.argmax(diagonals)
            #print (CHANGE_LABELS_BTW_BINS[argmax_idx]) #
            binchanges.append(CHANGE_LABELS_BTW_BINS[argmax_idx])
            #np.apply_along_axis(self.logTransform,1, P )
            
            b1_corr = P[0:3,0:3]
            b1 = np.fliplr(b1_corr)
            diagonals = b1.diagonal()
            argmax_idx = np.argmax(diagonals)
            #print (CHANGE_LABELS_OF_BIN[argmax_idx])
            binchanges.append(CHANGE_LABELS_OF_BIN[argmax_idx])

            
            b2_corr = P[3:6,3:6]
            b2 = np.fliplr(b2_corr)
            diagonals = b2.diagonal()
            argmax_idx = np.argmax(diagonals)
            #print (CHANGE_LABELS_OF_BIN[argmax_idx])
            binchanges.append(CHANGE_LABELS_OF_BIN[argmax_idx])
            changesInBins.append(binchanges)
        return changesInBins
    
    def plotData(self):
        binwidth=0.2
        plt.hist(self.values, bins=np.arange(min(self.values), max(self.values) + binwidth, binwidth))
        plt.show()
   
            
    
    
       
            
        
    
    def start(self):
        self.produceData(datacount=1, chunksize=6)
        self.categorizeData(idx=0, bincount=3, chunksize=6)
        
            
# [[bin_lowerbound, bin_upperbound, bin_popul_size]] 
#definition of histogram : [ [0.2, 0.45, 10], [0.4, 1.0, 20] ]

# hist=[ [0, 0.2, 10], [0.15, 0.35, 20], [0.25, 0.50, 30], [0.50, 0.60, 40], [0.55, 0.65, 50] ]
# #hist=[[0.2, 0.45, 10], [0.4, 0.65, 20] ]
# bpp = ManyBinsGausOrderingBetaParamProducer(hist=hist)
# bpp.start()


anb = AnnotatedBins(distcount=3)
anb.start()
