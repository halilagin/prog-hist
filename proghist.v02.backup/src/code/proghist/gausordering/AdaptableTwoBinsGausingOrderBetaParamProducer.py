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
from code.proghist.gausordering.TwoBinsGausingOrderBetaParamProducer import PHBin,\
    PHGauss

"""

1
down vote
For a generalized Beta distribution defined on the interval [a,b][a,b], you have the relations:

μ=aβ+bαα+β,σ2=αβ(b−a)2(α+β)2(1+α+β)
μ=aβ+bαα+β,σ2=αβ(b−a)2(α+β)2(1+α+β)
which can be inverted to give:

α=λμ−ab−a,β=λb−μb−a
α=λμ−ab−a,β=λb−μb−a
where

λ=(μ−a)(b−μ)σ2−1
λ=(μ−a)(b−μ)σ2−1


https://stats.stackexchange.com/questions/12232/calculating-the-parameters-of-a-beta-distribution-using-the-mean-and-variance

"""

#https://en.wikipedia.org/wiki/Normal_distribution

        
        
    
class AdaptableTwoBinsGausOrderingBetaParamProducer(object):
    
    def __init__(self, hist=[ [0.2, 0.45, 10], [0.4, 1.0, 20] ], bins=None, data=None):
        pass
        #self.b1n = [.1, (0.1/3.)**2]
        #self.b2n = [.25, (0.2/3.)**2]
        
        self.data = data
        #[lower-bound, upper-bound, count]
        #self.hist = [ [0.2, 0.45, 10], [0.4, 1.0, 20] ]
        #self.hist = [ [0.2, 0.6, 10] ]
        if (bins==None):
            self.hist = hist
            self.bins = []
            for i, h_ in enumerate(self.hist):
                x1,x2,size = h_
                bin = PHBin ("real", x1, x2, size)
                self.bins.append(bin)
        else:
            self.bins=bins

        #self.plotGausses()


   
            
    # produce 0,1,2 categorical values which can be represented by beta-bernoulli tetas. argmax returns the index of max value.
    def betaBernoulli3BinsRead(self, chunkSize=6):
        origData = self.data
        #categorized data
        catData = []
        for idx, x in enumerate(origData):
            tetas=[]
            for bin in self.bins:
                if bin.type_=="intersection":
                    continue
                tetas_ = [bin.gausses[i].norm.pdf(x) for i in range(len(bin.gausses))]
                tetas = tetas + tetas_
            catData.append( np.argmax(tetas))
        
        #makes array chunked by chunkSize
        origDataChunkedby6 = [origData[i:i+chunkSize] for i in range(len(origData))[::chunkSize]]
        catDataChunkedby6 = np.array([catData[i:i+chunkSize] for i in range(len(catData))[::chunkSize]]).tolist()
        freqs = self.prepareWeightedFreqs(catDataChunkedby6, [10, 20])
        binSizes = [catData.count(i) for i in range(6)]
        #print ("bin sizes", binSizes)
        return {"binSizes":binSizes, "origDataChunkedBy6":origDataChunkedby6, "catDataChunkedBy6":catDataChunkedby6, "freqs":freqs};
    
    def prepareWeightedFreqs(self, chunkedArr, binsHeights):
        pass
        ratio = ( 1.0 * binsHeights[0] ) / binsHeights[1]
        
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
    
    
    def normalize(self, bins):
        
        s = sum(bins)
        
        a = map(lambda x: float(x)/s, bins)
        return list(a)
    
    # replicate of test7. returns an array whose elements indicate the changes in bins and among 2 bins. 
    # for each chunk having 6 categorical value, this operation is done.
    # [[bin1_change, bin2_change, bin1-bin2-change]]
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
    
    
    def twoBinsProgHistData(self, chunkSize=6):
        data = self.betaBernoulli3BinsRead(chunkSize=chunkSize)
        changes = self.determineChangeBtwTwoBins(data["freqs"]) #frequencies
        data["changes"]=changes
        return data

    
    def start(self):
        #self.test0()
        #self.testB01B025()
        #self.argmaxInBinsTest()
        #self.read(datacount=10)
        #self.betaBernoulli3BinsRvsTest()
        #self.betaBernoulli3BinsReadTest()
        data = self.twoBinsProgHistData(dataCount=10, chunkSize=6)
        print (data)

# [[bin_lowerbound, bin_upperbound, bin_popul_size]] 
#definition of histogram : [ [0.2, 0.45, 10], [0.4, 1.0, 20] ]
 
#bpp = TwoBinsGausOrderingBetaParamProducer(hist=[ [0.2, 0.45, 10], [0.4, 1.0, 20] ])
#bpp.start()
