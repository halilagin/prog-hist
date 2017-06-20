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

class PHGauss(object):
    
    
    def __init__(self): #lower bound, upper bound, height
        pass
        self.range = None
        self.sigma = None
        self.mean = None
        self.variance = None
        self.props = None
        self.norm = None
        self.betas = None
        self.betaBounds = [0,1]
    
    def create(self,x1,x2):
        self.x1 = x1
        self.x2 = x2
        self.range = self.x2 - self.x1
        self.boundaries = [self.x1, self.x2]
        self.sigma = self.range/6.0
        self.mean = (self.x1 + self.x2)/2.0
        self.variance = (self.sigma)**2
        self.props = [self.mean, self.variance]
        self.norm = stats.norm(self.mean, self.variance)
        self.betas = self.produceBeta(mean = self.mean, variance = self.variance)
    
    def produceBeta(self, mean=0, variance=1):
        lower = self.betaBounds[0]
        upper = self.betaBounds[1]
        ro= (1.0 * (mean-lower) * (upper-mean) / variance) -1
        alfa = 1.0 * ro * (mean-lower)/ (upper-lower)
        beta = 1.0 * ro * (upper-mean)/ (upper-lower)
        return [alfa, beta]
    
    
     #test0 passed the test with validating values from here: https://www.youtube.com/watch?v=G_UFHE93uXs
    def test0(self):
        params = self.produceBeta(mean=0.260, variance = 0.04**2)
        a,b = params
        print ("params", params )
        mean, var, skew, kurt = beta.stats(a, b, moments='mvsk')
        print (mean, var, skew, kurt)
        return params
    
    def test1(self):
        print ("PHGauss.test1")
        params = self.produceBeta(mean=0.4, variance = 0.0666**2)
        a,b = params
        print ("params", params )
        mean, var, skew, kurt = beta.stats(a, b, moments='mvsk')
        print ("mean, sigma",mean, math.sqrt(var))
        values = np.array(beta.rvs(a, b, size=1000))
        print ("rvs.m,s", np.mean(values), np.std(values))
        return params
    
class PHBin(object):
   
    
    def __init__(self, type_, x1, x2, size, data=None): #lower bound, upper bound, height
        pass
        self.x1 = x1
        self.x2 = x2
        self.size = size
        self.type_= type_
        self.gausses = [None, None, None]
        self.data = data
         
        self.type="real" or "intersection"
        
        
        #create main gauss
        #self.g = PHGauss()
        #self.g.create(self.x1, self.x2)
        
        #create child gausses 
        self.gausses[0] = PHGauss()
        self.gausses[1] = PHGauss()
        self.gausses[2] = PHGauss()
         
        #mean = (self.x1+self.x2)/2.0
        #sigma = (self.x2-self.x1)/6.0
         
#         self.gausses[1].create(mean-sigma, mean+sigma)
#         self.gausses[0].create(self.x1, mean-sigma)
#         self.gausses[2].create(mean+sigma, self.x2)
#         self.gausses[1] = self.g

        self.gausses[1].create(self.x1, self.x2)
        self.gausses[0].create(self.x1, self.gausses[1].mean-self.gausses[1].sigma/2)
        self.gausses[2].create(self.gausses[1].mean+self.gausses[1].sigma/2, self.x2)
    
        
        
        
        
    
    def printGausses(self):
        list = [ (self.gausses[i].mean, self.gausses[i].sigma, self.gausses[i].boundaries, self.gausses[i].betas) for i in range(len(self.gausses)) ]
        print ("mean, sigma, range, betas\n", list)
        

        
        
        
        
        
        
    
class TwoBinsGausOrderingBetaParamProducer(object):
    
    def __init__(self, hist=[ [0.2, 0.45, 10], [0.4, 1.0, 20] ], bins=None):
        pass
        #self.b1n = [.1, (0.1/3.)**2]
        #self.b2n = [.25, (0.2/3.)**2]
        
        
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


    def plotGausses(self):
        x = np.linspace(0, 1, 2000)
        for bin in self.bins:
            for gaus in bin.gausses:
                plt.plot(x,mlab.normpdf(x, gaus.mean, gaus.sigma))
        plt.show()
           
    
    def betaBernoulli3BinsRvs(self,datacount=1):
        values = []
        for i, bin in enumerate(self.bins):
            if bin.type_=="intersection":
                continue
            a,b = bin.gausses[1].betas
            values_ = beta.rvs(a, b, size=datacount*bin.size) 
            values = values + values_.tolist()
        return values
    
    def betaBernoulli3BinsRvsTest(self):
        for i, bin in enumerate(self.bins):
            if bin.type_=="intersection":
                continue
            values = self.betaBernoulli3BinsRvs(datacount=100)
            v_ = np.array(values)
            mean_ = np.mean(v_)
            sigma_ = np.std(v_)
            print("np.mean&std,mean, sigma", mean_,sigma_)
            
    # produce 0,1,2 categorical values which can be represented by beta-bernoulli tetas. argmax returns the index of max value.
    def betaBernoulli3BinsRead(self,datacount=1, chunkSize=6):
        origData = self.betaBernoulli3BinsRvs(datacount)
        random.shuffle(origData)
        #categorized data
        catData = []
    
        
        
#         for bin in self.bins:
#             bin.printGausses()
        
                
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

        freqs = self.prepareWeightedFreqs(catDataChunkedby6, [10,20])

        print ("bins.size", len(self.bins))
        binSizes = [catData.count(i) for i in range(6)]
        #print ("bin sizes", binSizes)
        
        return [binSizes, origDataChunkedby6, catDataChunkedby6, freqs];
        
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
    
    
    def twoBinsProgHistData(self, dataCount=10, chunkSize=6):
        data = self.betaBernoulli3BinsRead(datacount=dataCount, chunkSize=chunkSize)
        changes = self.determineChangeBtwTwoBins(data[3]) #freqs
        data.append(changes)
        return data
        
        
    def betaBernoulli3BinsReadTest(self):
        #returns array of array
        #array[0] stores real value
        #array[1] returns categorized values by gaussians.
        binSizes, origData, catData, freqs = self.betaBernoulli3BinsRead(datacount=10, chunkSize=6)
        print ("binSizes.json",json.dumps(binSizes))
        print ("origdata.json",json.dumps(origData)) 
        print("categorized data.json",json.dumps(catData))
        print("freqs.json", json.dumps(freqs))
        #print (streamedBinData)
#         
#     def betaBernoulliPredict(self):
#         
#         # theta is the vector of candidate values for the parameter theta.
#         # n_theta_vals is the number of candidate theta values.
#         # To produce the examples in the book, set n_theta_vals to either 3 or 63.
#         n_theta_vals = 3.
#         # Now make the vector of theta values:
#         theta = np.linspace(1/(n_theta_vals +1), n_theta_vals /(n_theta_vals +1), n_theta_vals )
#         print ("theta",theta)
#         # p_theta is the vector of prior probabilities on the theta values.
#         p_theta = np.minimum(theta, 1-theta)  # Makes a triangular belief distribution.
#         print ("p_theta1",p_theta)
#         p_theta = p_theta / np.sum(p_theta)     # Makes sure that beliefs sum to 1.
#         print ("p_theta2",p_theta)
#         
#         
#         # Specify the data. To produce the examples in the book, use either
#         # data = np.repeat([1,0], [3, 9]) or data = np.repeat([1,0], [1, 11])
#         #data = np.repeat([0,1,2], [1, 4, 1])
#         data = self.betaBernoulli3BinsRead(datacount=1000, heigtFactors=[[1,0,2]])
#         n_bin1 = data.count(0)
#         n_bin2 = data.count(1)
#         n_bin3 = len(data) - (n_bin1+n_bin2)
#         
#         
#         # Compute the likelihood of the data for each value of theta:
#         p_data_given_theta = [] #theta[0]**n_bin1 * (1-theta)**n_tails
# 
#         # Compute the posterior:
#         p_data = np.sum(p_data_given_theta * p_theta)
#         p_theta_given_data = p_data_given_theta * p_theta / p_data   # This is Bayes' rule!
#         print ("p_theta_given_data")
#         for i in p_theta_given_data:
#             print ("{:2.3f}".format(i)) 
#     
#     def transform(self, y, params=[2,2], bounds=[3,4]):
#         a,b = params
#         p,q = bounds
#         #print ("y,p,a",y,p,a)
#         #print ("yp",(y-p)**(a-1))
#         #return 1
#         return ( ( abs(y-p)**(a-1) ) * ( abs(q - y)**(b-1) ) ) / ( ( abs(q - p)**(a+b+1) ) * special.beta(a,b) )
# #     
#     def produceBeta(self, mean=0, variance=1, bounds=[-3,3]):
#         lower = bounds[0]
#         upper = bounds[1]
#         ro= (1.0 * (mean-lower) * (upper-mean) / variance) -1
#         alfa = 1.0 * ro * (mean-lower)/ (upper-lower)
#         beta = 1.0 * ro * (upper-mean)/ (upper-lower)
#         return [alfa, beta]
#     
#     #test0 passed the test with validating values from here: https://www.youtube.com/watch?v=G_UFHE93uXs
#     def test0(self):
#         params = self.produceBeta(mean=0.260, variance = 0.04**2, bounds=[0,1])
#         a,b = params
#         print ("params", params )
#         mean, var, skew, kurt = beta.stats(a, b, moments='mvsk')
#         print (mean, var, skew, kurt)
#         return params
# 
#     
#     def test1(self):
#         variance =  (5.0/3.0)**2
#         bounds = [5,15]
#         params = self.produceBeta(mean=10, variance = variance, bounds=bounds)
#         a,b = params
#         print ("params", params )
#          
#         beta_rvs = beta.rvs(a,b,size=10)
# #         for y in beta_rvs:
# #             print ("y",y)
# #             t = self.transform(y, params = params, bounds = bounds)
# #             print (t)
#         mean, var, skew, kurt = beta.stats(a, b, moments='mvsk')
#         print (mean, var, skew, kurt)
#         print (beta.rvs(a,b,size=10))
#     
#     def test2(self):
#         fig, ax = plt.subplots(1, 1)
#         a,b=[2.31, 0.627]
#         x = np.linspace(beta.ppf(0.01, a, b, loc=10, scale=1), beta.ppf(0.99, a, b), 100)
#         #print(x)
#         #ax.plot(x, beta.pdf(x, a, b),'r-', lw=5, alpha=0.6, label='beta pdf')
#         #plt.show()
#         a,b = self.test0()
#         rv = beta.rvs( a,b, loc=10, scale=1, size=1000)
#         rv = np.array(rv)
#         m = np.std(rv)
#         print (m)
#         
#         #ax.show()
#         #beta.pdf(x)
#         
#     #this test works for my POC. we have two bins with N(0.1, 0.001) and N(0.25, 0.004). it generates random values according to the gaussians.   
#     def testB01B025(self):
#          
#         self.b1beta = self.produceBeta(self.b1n[0],self.b1n[1], [0,1])
#         self.b2beta = self.produceBeta(self.b2n[0],self.b2n[1], [0,1])
#         b1rvs_props = beta.stats(self.b1beta[0], self.b1beta[1], moments='mvsk')
#         b2rvs_props = beta.stats(self.b2beta[0], self.b2beta[1], moments='mvsk')
#         print (b1rvs_props)
#         print (b2rvs_props)
#          
#         b1_rvs = beta.rvs(self.b1beta[0], self.b1beta[1], size=1000)        
#         print("b1_rvs.m,s",np.mean(b1_rvs), np.std(b1_rvs))
#  
#         self.bmbeta = self.produceBeta(self.bm[0],self.bm[1], [0,1])
#  
#         bm_rvs = beta.rvs(self.bmbeta[0], self.bmbeta[1], size=1000)      
#         print("bm_rvs.m,s",np.mean(bm_rvs), np.std(bm_rvs))
        #print(b1params, b2params)
#         
#         
#     #argmax test. it pick up the highest teta, that is more likely according to the data given x (  argmax P(teta | D) ), among distribution 
#     def argmaxInBinsTest(self):
#         tetas=[]
#         #test1 they are peak at their mean.
#         tetas.append( stats.norm(self.b1n[0], self.b1n[1]).pdf(self.b1n[0]) )
#         tetas.append( stats.norm(self.bm[0], self.bm[1]).pdf(self.bm[0]) )
#         tetas.append( stats.norm(self.b2n[0], self.b2n[1]).pdf(self.b2n[0]) )
#         print (tetas)
#         
#         #mean of b1n has highest teta value in b1n.
#         tetas=[]
#         tetas.append( stats.norm(self.b1n[0], self.b1n[1]).pdf(self.b1n[0]) )
#         tetas.append( stats.norm(self.bm[0], self.bm[1]).pdf(self.b1n[0]) )
#         tetas.append( stats.norm(self.b2n[0], self.b2n[1]).pdf(self.b1n[0]) )
#         print (tetas)
#         
#     
#     def gaussian_multiply(self, g1, g2):
#         mu1, var1 = g1
#         mu2, var2 = g2
#         mean = (var1*mu2 + var2*mu1) / (var1 + var2)
#         variance = (var1 * var2) / (var1 + var2)
#         return [mean, variance]
    
    
    #test succesfully demonstrates that generated beta values generates mean&variance data. 
    def test0(self):
        phg = PHGauss()
        phg.create(0.2,0.6)
        print ("phg.mean, sigma, variance", phg.mean, phg.sigma, phg.variance)
        #betas = self.produceBeta(mean=phg.mean, variance=phg.variance, bounds=[0,1])
        a,b = phg.betas
        print ("betas in class",a,b)
        #print ("betas produced now",betas)
        
#       mean, var, skew, kurt = beta.stats(a,b, moments='mvsk')
#       print("beta.stats,mean, sigma", mean, math.sqrt(var))
#       print("phg.test1")
#       phg.test1()
        print("\n==\n")
        phg.test1()
    
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
