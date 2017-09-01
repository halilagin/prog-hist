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
from code.proghist.gausordering.GaussianProcessDataProducer import GaussianProcessDataProducer
 

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
                        #[ [0.2, 0.5, 10], [0.2, 0.5, 10], [0., 0.99, 10] ],
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
        np.random.seed(seed=2018)
        random.seed(2018)
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
        
    
    def calculateBinSizesAtStreamedIndex(self, idx=0, bincount=3, chunksize=3):
        pass
        if idx==0:
            return [1]*bincount
        
        histogramDataPopulationSize= bincount * chunksize * (idx+1)
        histogramDataPopulation = np.array(self.values[:histogramDataPopulationSize])
        self.histogramDataPopulation = histogramDataPopulation
        values_max = max(histogramDataPopulation)
        values_min = min(histogramDataPopulation)
        bins_width = (values_max-values_min)/ ((self.bincount)*1.0)
        bins_ranges = np.arange(min(histogramDataPopulation), max(histogramDataPopulation), bins_width)
        bins_ranges = np.append(bins_ranges, [values_max], axis=0)
        
        bins_ranges[0]= bins_ranges[0] - 0.01
        bins_ranges[0]= 0 if bins_ranges[0]<0.0 else bins_ranges[0]
        bins_ranges[len(bins_ranges)-1]= bins_ranges[len(bins_ranges)-1]+ 0.01
        bins_ranges[len(bins_ranges)-1]= 0.999999 if bins_ranges[len(bins_ranges)-1]>1.0 else bins_ranges[len(bins_ranges)-1]
        
        binsizes = []
        for i in range(self.bincount):
            binsize = ((bins_ranges[i] <= histogramDataPopulation) & (histogramDataPopulation <= bins_ranges[i+1])).sum()
            binsizes.append(binsize)
        return binsizes
            
    
    # produce 0,1,2 categorical values which can be represented by beta-bernoulli tetas. argmax returns the index of max value.
    def categorizeData(self, idx=0, bincount=5, chunksize=6):
        #categorized data
        self.bins=[]
        self.bincount = bincount
        self.binchanges = []
        
        
        
        
        histogramDataPopulationSize= bincount * chunksize * (idx+1)
        histogramDataPopulation = np.array(self.values[:histogramDataPopulationSize])
        self.histogramDataPopulation = histogramDataPopulation
        values_max = max(histogramDataPopulation)
        values_min = min(histogramDataPopulation)
        bins_width = (values_max-values_min)/ ((self.bincount)*1.0)
        bins_ranges = np.arange(min(histogramDataPopulation), max(histogramDataPopulation), bins_width)
        bins_ranges = np.append(bins_ranges, [values_max], axis=0)
        
        bins_ranges[0]= bins_ranges[0] - 0.01
        bins_ranges[0]= 0 if bins_ranges[0]<0.0 else bins_ranges[0]
        bins_ranges[len(bins_ranges)-1]= bins_ranges[len(bins_ranges)-1]+ 0.01
        bins_ranges[len(bins_ranges)-1]= 0.999999 if bins_ranges[len(bins_ranges)-1]>1.0 else bins_ranges[len(bins_ranges)-1]
        
        #print ("bins_ranges", bins_ranges)
        
        for i in range(self.bincount):
            binsize = ((bins_ranges[i] <= histogramDataPopulation) & (histogramDataPopulation <= bins_ranges[i+1])).sum()
            #data = histogramDataPopulation[( bins_ranges[i] <= histogramDataPopulation) & (histogramDataPopulation < bins_ranges[i+1])]
            data = histogramDataPopulation[( bins_ranges[i] <= histogramDataPopulation) & (histogramDataPopulation <= bins_ranges[i+1])]
            self.bins.append(PHBin("real", bins_ranges[i], bins_ranges[i+1], binsize, data))
            #print ("bins[x1,x2,size]", bins_ranges[i], bins_ranges[i+1], binsize)
        
        
        lowerBoundIndexInStream = bincount * chunksize * (idx)
        upperBoundIndexInStream = bincount * chunksize * (idx+1)
        streamedData = histogramDataPopulation[lowerBoundIndexInStream:upperBoundIndexInStream ]
        self.streamedData = streamedData

        #print("streamedData",streamedData)
        
        self.binchanges=[]
        for i, h_ in enumerate(self.bins):
            if (i+2)>len(self.bins):
                break
            
            bin1LowerBoundIdx = chunksize * (i)
            bin2LowerBoundIdx = chunksize * (i+1)
            bin2UpperBoundIdx = chunksize * (i+2)
            #print ("makeCategorical.input",streamedData[bin1LowerBoundIdx:bin2UpperBoundIdx])
            categoricalDataByMLE = self.makeCategorical([self.bins[i],self.bins[i+1]], streamedData[bin1LowerBoundIdx:bin2UpperBoundIdx]) #MLE: maximum likelihood estimation
            #print ("makeCategorical.output",categoricalDataByMLE)
            #print ("bin.size", [self.bins[i].size, self.bins[i+1].size])
            
            
            firstBin= categoricalDataByMLE[0:chunksize]
            secondBin= categoricalDataByMLE[chunksize:2*chunksize]
            twoBinsCategoricalData = [firstBin, secondBin]
            binsizes = self.calculateBinSizesAtStreamedIndex( idx=idx, bincount=bincount, chunksize=chunksize)
            freqs = self.prepareWeightedFreqs(twoBinsCategoricalData, chunksize, [binsizes[i], binsizes[i+1]])
            self.bins[i].freqs = freqs
            #catDataChunkedby6 = np.array([catData[i:i+chunkSize] for i in range(len(catData))[::chunkSize]]).tolist()
            #print("freqs",freqs)
            
            binchanges = self.determineChangeBtwTwoBins(freqs)
            self.bins[i].binchanges = binchanges
            self.binchanges.append(binchanges)
        #print ("bc", self.binchanges)
    
    
    def makeCategorical(self, bins, data):
        #categorized data
        binsCatData = []
        for bin in bins:
            catData = [0,0,0]
            
            for idx, x in enumerate(data):
                if bin.type_=="intersection":
                    continue
                if x>=bin.x1 and x<=bin.x2: 
                    tetas = [gaus.norm.pdf(x) for gaus in bin.gausses]
                    means = [ [gaus.mean, gaus.sigma] for gaus in bin.gausses]
                    argmax  = np.argmax(tetas)
                    #catData.append( np.argmax(tetas))
                    catData[argmax] = catData[argmax] + 1
            binsCatData = binsCatData + catData
        return binsCatData
    
    def prepareWeightedFreqs(self, twoBins, chunkSize, binsHeights):
        pass
        #chunkedArr = [twoBinsData[:chunkSize], twoBinsData[chunkSize:]]
        
        ratio =0
        try:
            ratio =  ( 1.0 * binsHeights[0] ) / binsHeights[1]
        except ZeroDivisionError:
            ratio =  10
        
        tb = np.array(twoBins[1])
        weighted = tb*ratio
        result = twoBins[0]+weighted.tolist()
        return result
    
    def determineChangeBtwTwoBins(self, bin):
        #between two bins
        CHANGE_LABELS_BTW_BINS=["BECOMING_FAR", "SUPPORTS_INCREASE", "MERGING"]
        CHANGE_LABELS_OF_BIN=["SPLITTING", "SUPPORTS_CONCEPT", "SPLITTING"]
        #hist=[[0,0.2,10],[0.15,0.35,20],[0.3,0.40,30] ]
        #first element added artificially. it shows baseline entropy. entropy higher than this value means there is more uncertainty,
        #lower than that mean there is a definite move among bins.
        #bins = [[0, 1.0, 0, 0, 1.0, 0.0], [0, 2, 0, 1.0, 1.0, 0.0], [0, 1, 0, 0.0, 2.5, 0.0], [0, 1, 0, 0.5, 2.0, 0.0], [0, 3, 0, 0.0, 1.5, 0.0]]
        #bins = [[0, 1.0, 0, 0, 1.0, 0.0], [0, 2, 2, 2.0, 1.0, 0.0], [2, 1, 0, 0.0, 2.5, 4.0], [0, 1, 0, 0.5, 2.0, 0.0], [2, 0, 2, 0.0, 1.5, 0.0]]
        
        #bins_probs = [[self.normalize(x)] for x in bins]
        
        if sum(bin)==0:
            return ["SUPPORTS_INCREASE", "SUPPORTS_CONCEPT", "SUPPORTS_CONCEPT"]
        
        bins_probs =[]
        n = self.normalize(bin)
        bins_probs.append([n])
        
        
        #bins_entropy = [stats.entropy(x) for x in bins_probs]
        #bins = self.normalize(bins[0])
        #print ("entropy",bins_entropy)
        #f = np.vectorize(self.logTransform, otypes=[np.float])
        binchanges=[]
        for bin in bins_probs:
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
            #changesInBins.append(binchanges)
        return binchanges
    
    def plotData(self):
        binwidth=0.2
        plt.hist(self.values, bins=np.arange(min(self.values), max(self.values) + binwidth, binwidth))
        plt.show()
   
            
    
    
    def run(self,idx=0, bincount=5, chunksize=6):
        self.produceData(datacount=1, chunksize=6)
        self.categorizeData(idx=idx, bincount=bincount, chunksize=chunksize)
        return self.collectResult()
        
        
    def collectResult(self):
        result={}
        
        result["histogramData"]=self.histogramDataPopulation
        result["streamedData"]=self.streamedData
        result["bins"]=[]
        for bin in self.bins:
            result["bins"].append({
                "size": bin.size,
                "y":bin.size,
                "x1":bin.x1,
                "x":bin.x1,
                
                "x2":bin.x2,
                "data":bin.data,
                "dx":bin.x2-bin.x1
                })
        result["binchanges"] = self.binchanges
        result["gaussianRibbons"] = self.gaussianProcessEstimation(self.bins) #gaussian processes' result
        
        return result
    
    def gaussianProcessEstimation(self, bins):#bins:self.bins
        gpdp = GaussianProcessDataProducer()
        x=[]
        y=[]
        for bin_ in bins:
            #bdata = np.sort(bin_.data)
            bdata = np.sort(bin_.data[-3:])
            for bindata in bdata:
                x.append(bindata) 
                y.append(bin_.size)
                
        x,y,sigma = gpdp.produceGaussian(x,y)
        print (x,y,sigma)
        return {"x":x,"y":y,"sigma":sigma.tolist()}
    
    def start(self):
        #self.produceData(datacount=1, chunksize=6)
        result = self.run(idx=0, bincount=4, chunksize=3)
        print (result)
        
            
# [[bin_lowerbound, bin_upperbound, bin_popul_size]] 
#definition of histogram : [ [0.2, 0.45, 10], [0.4, 1.0, 20] ]

# hist=[ [0, 0.2, 10], [0.15, 0.35, 20], [0.25, 0.50, 30], [0.50, 0.60, 40], [0.55, 0.65, 50] ]
# #hist=[[0.2, 0.45, 10], [0.4, 0.65, 20] ]
# bpp = ManyBinsGausOrderingBetaParamProducer(hist=hist)
# bpp.start()


#anb = AnnotatedBins(distcount=3)
#anb.start()
