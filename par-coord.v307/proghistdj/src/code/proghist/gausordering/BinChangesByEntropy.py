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



class BinChangesByEntropy(object):
    
    
    def __init__(self):
        pass
    
    
    #bins sample. [0,2,0,0,4,0] has more information than [1,1,1,1,1,1]
    #[[0, 2, 0, 1.0, 1.0, 0.0], [0, 1, 0, 0.0, 2.5, 0.0], [0, 1, 0, 0.5, 2.0, 0.0], [0, 3, 0, 0.0, 1.5, 0.0]]
    def test1(self):
        pass
        bins = [[0, 2, 0, 1.0, 1.0, 0.0], [0, 1, 0, 0.0, 2.5, 0.0], [0, 1, 0, 0.5, 2.0, 0.0], [0, 3, 0, 0.0, 1.5, 0.0]]
        
        e = stats.entropy([5])
        print([5], "\t\t\t\t\t\t\t\t\t\t",e)
        
        e = stats.entropy([0.5,0.5])
        print([0.5,0.5], "\t\t\t\t\t\t\t\t\t",e)
        a = np.array([0.1]*10)
        e = stats.entropy(a)
        print(a,"\t\t\t\t",e)
        a = np.array([0.01]*100)
        e = stats.entropy(a)
        print(a,"\t\t\t\t\t\t\t",e)
        e = stats.entropy([0.3,0.7])
        print([0.3,0.7],"\t\t\t\t\t\t\t\t\t", e)
        e = stats.entropy([0.4,0.6])
        print([0.4,0.6],"\t\t\t\t\t\t\t\t\t",e)
        
        e = stats.entropy([0.5,0.25,0.25])
        print([0.5,0.25,0.25],"\t\t\t\t\t\t\t\t",e)
        e = stats.entropy([1./3.5,2.5/3.5])
        print([1./3.5,2.5/3.5],"\t\t\t\t\t", e)
    
    def normalize(self, bins):
        s = sum(bins)
        a = map(lambda x: float(x)/s, bins)
        return list(a)
    
    #array values are normalized according to their heights. first chunk's real value is [[0, 2, 0, 2.0, 2.0, 0.0]] instead of [0, 2, 0, 1.0, 1.0, 0.0]
    #[[0, 2, 0, 1.0, 1.0, 0.0], [0, 1, 0, 0.0, 2.5, 0.0], [0, 1, 0, 0.5, 2.0, 0.0], [0, 3, 0, 0.0, 1.5, 0.0]]
    def test2(self):
        pass
        bins = [[0, 2, 0, 1.0, 1.0, 0.0], [0, 1, 0, 0.0, 2.5, 0.0], [0, 1, 0, 0.5, 2.0, 0.0], [0, 3, 0, 0.0, 1.5, 0.0]]
        print (bins)
        bins = [self.normalize(x) for x in bins]
        #bins = self.normalize(bins[0])
        print (bins)
    
    def test3(self):
        pass
        #first element added artificially. it shows baseline entropy. entropy higher than this value means there is more uncertainty,
        #lower than that mean there is a definite move among bins.
        bins = [[0, 1.0, 0, 0, 1.0, 0.0], [0, 2, 0, 1.0, 1.0, 0.0], [0, 1, 0, 0.0, 2.5, 0.0], [0, 1, 0, 0.5, 2.0, 0.0], [0, 3, 0, 0.0, 1.5, 0.0]]
        print("samples in bin",bins)
        bins = [self.normalize(x) for x in bins]
        print("probability of samples",bins)
        bins = [stats.entropy(x) for x in bins]
        #bins = self.normalize(bins[0])
        print ("entropy",bins)
    
    
    
    def logTransform(self, a_ij):
        try:
            return a_ij * math.log(a_ij)
        except ValueError:
            return 0
        
    
    #X . X^T shows the relation between sub-gaussian counts, namely correlation.
    def test4(self):
        pass
        #first element added artificially. it shows baseline entropy. entropy higher than this value means there is more uncertainty,
        #lower than that mean there is a definite move among bins.
        bins = [[0, 1.0, 0, 0, 1.0, 0.0], [0, 2, 0, 1.0, 1.0, 0.0], [0, 1, 0, 0.0, 2.5, 0.0], [0, 1, 0, 0.5, 2.0, 0.0], [0, 3, 0, 0.0, 1.5, 0.0]]
        print("samples in bin",bins)
        bins_probs = [[self.normalize(x)] for x in bins]
        print("probability of samples",bins_probs)
        #bins_entropy = [stats.entropy(x) for x in bins_probs]
        #bins = self.normalize(bins[0])
        #print ("entropy",bins_entropy)
        ones = [[1] for i in range(6)]
        ones = np.dot(ones, np.transpose(ones))
        for bin in bins_probs:
            X = np.array(bin)
            Xt = np.transpose(X)
            P = np.dot(Xt,X)
            np.ones(6)
            print (P)
    
    #apply p*logp to matrix a_ij
    def test5(self):
        pass
        #first element added artificially. it shows baseline entropy. entropy higher than this value means there is more uncertainty,
        #lower than that mean there is a definite move among bins.
        bins = [[0, 1.0, 0, 0, 1.0, 0.0], [0, 2, 0, 1.0, 1.0, 0.0], [0, 1, 0, 0.0, 2.5, 0.0], [0, 1, 0, 0.5, 2.0, 0.0], [0, 3, 0, 0.0, 1.5, 0.0]]
        print("samples in bin",bins)
        bins_probs = [[self.normalize(x)] for x in bins]
        print("probability of samples",bins_probs)
        #bins_entropy = [stats.entropy(x) for x in bins_probs]
        #bins = self.normalize(bins[0])
        #print ("entropy",bins_entropy)
        f = np.vectorize(self.logTransform, otypes=[np.float])
        for bin in bins_probs:
            X = np.array(bin)
            Xt = np.transpose(X)
            P = np.dot(Xt,X)
            P = f(P)
            print (P)
            print(-sum(sum(P))/2)
            #np.apply_along_axis(self.logTransform,1, P )
            
    #produce correlation matrix correlation. matrix has this labels for rows&columns. rows=b(1)_0,b(1)_1,b(1)_2, cols=b(2)_2,b(2)_1,b(2)_0
    def test6(self):
        pass
        #first element added artificially. it shows baseline entropy. entropy higher than this value means there is more uncertainty,
        #lower than that mean there is a definite move among bins.
        bins = [[0, 1.0, 0, 0, 1.0, 0.0], [0, 2, 0, 1.0, 1.0, 0.0], [0, 1, 0, 0.0, 2.5, 0.0], [0, 1, 0, 0.5, 2.0, 0.0], [0, 3, 0, 0.0, 1.5, 0.0]]
        print("samples in bin",bins)
        bins_probs = [[self.normalize(x)] for x in bins]
        print("probability of samples",bins_probs)
        #bins_entropy = [stats.entropy(x) for x in bins_probs]
        #bins = self.normalize(bins[0])
        #print ("entropy",bins_entropy)
        f = np.vectorize(self.logTransform, otypes=[np.float])
        for bin in bins_probs:
            X = np.array(bin)
            Xt = np.transpose(X)
            P = np.dot(Xt,X)
            #P = f(P)
            corr = P[0:3,3:6]
            b1b2 = np.fliplr(corr)
            print (b1b2)
            #np.apply_along_axis(self.logTransform,1, P )

    #calculate argmax, and label the changes in the bins by looking at corr matrix.
    # we have 5 labels cor changes, increase, decrease, separation of single bin, merging of two bins, becoming far away from each others
    # first three can be determined by looking at the internal correlation of a single bin.
    # last two can be determined by looking at the correlation of two bins.  
    def test7(self):
        #between two bins
        CHANGE_LABELS_BTW_BINS=["BECOMING FAR", "SUPPORTS INCREASE", "MERGING"]
        CHANGE_LABELS_OF_BIN=["SPLITTING", "SUPPORTS CONCEPT", "SPLITTING"]
        
        #first element added artificially. it shows baseline entropy. entropy higher than this value means there is more uncertainty,
        #lower than that mean there is a definite move among bins.
        #bins = [[0, 1.0, 0, 0, 1.0, 0.0], [0, 2, 0, 1.0, 1.0, 0.0], [0, 1, 0, 0.0, 2.5, 0.0], [0, 1, 0, 0.5, 2.0, 0.0], [0, 3, 0, 0.0, 1.5, 0.0]]
        bins = [[0, 1.0, 0, 0, 1.0, 0.0], [0, 2, 2, 2.0, 1.0, 0.0], [2, 1, 0, 0.0, 2.5, 4.0], [0, 1, 0, 0.5, 2.0, 0.0], [2, 0, 2, 0.0, 1.5, 0.0]]
        print("samples in bin",bins)
        bins_probs = [[self.normalize(x)] for x in bins]
        print("probability of samples",bins_probs)
        #bins_entropy = [stats.entropy(x) for x in bins_probs]
        #bins = self.normalize(bins[0])
        #print ("entropy",bins_entropy)
        f = np.vectorize(self.logTransform, otypes=[np.float])
        for bin in bins_probs:
            X = np.array(bin)
            Xt = np.transpose(X)
            P = np.dot(Xt,X)
            
            #P = f(P)
            b1b2_corr = P[0:3,3:6]
            b1b2 = np.fliplr(b1b2_corr)
            print(b1b2)
            diagonals = b1b2.diagonal()
            argmax_idx = np.argmax(diagonals)
            print (CHANGE_LABELS_BTW_BINS[argmax_idx]) #
            #np.apply_along_axis(self.logTransform,1, P )
            
            b1_corr = P[0:3,0:3]
            b1 = np.fliplr(b1_corr)
            diagonals = b1.diagonal()
            argmax_idx = np.argmax(diagonals)
            print (CHANGE_LABELS_OF_BIN[argmax_idx])
            
            b2_corr = P[3:6,3:6]
            



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
        bins_probs = [[self.normalize(x)] for x in bins]
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

    # replicate of test7. returns an array whose elements indicate the changes in bins and among 2 bins. 
    # for each chunk having 6 categorical value, this operation is done.
    # [[bin1_change, bin2_change, bin1-bin2-change]]
    def determineChangeOfBins(self,bins):
        c = self.determineChangeBtwTwoBins(bins)
        print (c)
        return c

            
    
    def run(self):
        #self.test1()
        #self.test2()
        #self.test3()
        #self.test4()
        #self.test5()
        #self.test6()
        self.test7()
