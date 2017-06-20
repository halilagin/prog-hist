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
class BetaParamProducer():
    
    def __init__(self):
        #self.b1n = [.1, (0.1/3.)**2]
        #self.b2n = [.25, (0.2/3.)**2]
        
        self.b1n = [.4, (0.2/3.)**2]
        self.b2n = [.70, (0.2/3.)**2]
        self.bm = self.gaussian_multiply(self.b1n, self.b2n)
        
        self.ranges=[]
        self.ranges.append([self.b1n[0] - 3 * math.sqrt(self.b1n[1]), self.b1n[0] + 3 * math.sqrt(self.b1n[1]) ])
        self.ranges.append([self.bm[0] - 3 * math.sqrt(self.bm[1]), self.bm[0] + 3 * math.sqrt(self.bm[1]) ])
        self.ranges.append([self.b2n[0] - 3 * math.sqrt(self.b2n[1]), self.b2n[0] + 3 * math.sqrt(self.b2n[1]) ])
        print ("ranges", self.ranges)
        self.norms = []
        self.norms.append(stats.norm(self.b1n[0], self.b1n[1]))
        self.norms.append(stats.norm(self.bm[0], self.bm[1]))
        self.norms.append(stats.norm(self.b2n[0], self.b2n[1]))
        
        self.betas = []
        self.betas.append(self.produceBeta(self.b1n[0],self.b1n[1], [0,1]))
        self.betas.append(self.produceBeta(self.bm[0],self.bm[1], [0,1]))
        self.betas.append(self.produceBeta(self.b2n[0],self.b2n[1], [0,1]))
            
    def read(self, datacount=1, betas=[(10,9)], yspeedcorr=[[1,2]]):
        bins = []
        i=0
        for a,b in betas:
            bin_ = beta.rvs(a, b, size=datacount*yspeedcorr[0][i])   
            bins.append(bin_)
            i=i+1
        return bins
    
    
    def betaBernoulli3BinsRvs(self,datacount=1, heightFactors=[[1,0,2]]):
        bins = []
        for i,h in enumerate(heightFactors[0]):
            #h==0 means that the data is in the intersection of two bins. it is a hidden bin discard it. it is for resting purpose.
            if h==0:
                continue
            a,b = self.betas[i]
            bin_ = beta.rvs(a, b, size=datacount*heightFactors[0][i])  
            bins = bins + bin_.tolist()
        return bins
    
    # produce 0,1,2 categorical values which can be represented by beta-bernoulli testas.
    def betaBernoulli3BinsRead(self,datacount=1, heightFactors=[[1,0,2]]):
        bins = self.betaBernoulli3BinsRvs(datacount, heightFactors)
        random.shuffle(bins)
        bernoulliCats = []
        for x in bins:
            tetas = [self.norms[i].pdf(x) for i in range(len(heightFactors[0]))]
            bernoulliCats.append( np.argmax(tetas))
        print ("bin sizes", [bernoulliCats.count(i) for i in range(3)])
        return [bins,bernoulliCats];
        
    
    def betaBernoulli3BinsReadTest(self):
        streamedBinData = self.betaBernoulli3BinsRead(datacount=1000, heightFactors=[[1,0,2]])
        for arr in streamedBinData:
            print (arr)
        
    def betaBernoulliPredict(self):
        
        # theta is the vector of candidate values for the parameter theta.
        # n_theta_vals is the number of candidate theta values.
        # To produce the examples in the book, set n_theta_vals to either 3 or 63.
        n_theta_vals = 3.
        # Now make the vector of theta values:
        theta = np.linspace(1/(n_theta_vals +1), n_theta_vals /(n_theta_vals +1), n_theta_vals )
        print ("theta",theta)
        # p_theta is the vector of prior probabilities on the theta values.
        p_theta = np.minimum(theta, 1-theta)  # Makes a triangular belief distribution.
        print ("p_theta1",p_theta)
        p_theta = p_theta / np.sum(p_theta)     # Makes sure that beliefs sum to 1.
        print ("p_theta2",p_theta)
        
        
        # Specify the data. To produce the examples in the book, use either
        # data = np.repeat([1,0], [3, 9]) or data = np.repeat([1,0], [1, 11])
        #data = np.repeat([0,1,2], [1, 4, 1])
        data = self.betaBernoulli3BinsRead(datacount=1000, heigtFactors=[[1,0,2]])
        n_bin1 = data.count(0)
        n_bin2 = data.count(1)
        n_bin3 = len(data) - (n_bin1+n_bin2)
        
        
        # Compute the likelihood of the data for each value of theta:
        p_data_given_theta = [] #theta[0]**n_bin1 * (1-theta)**n_tails

        # Compute the posterior:
        p_data = np.sum(p_data_given_theta * p_theta)
        p_theta_given_data = p_data_given_theta * p_theta / p_data   # This is Bayes' rule!
        print ("p_theta_given_data")
        for i in p_theta_given_data:
            print ("{:2.3f}".format(i)) 
    
    def transform(self, y, params=[2,2], bounds=[3,4]):
        a,b = params
        p,q = bounds
        #print ("y,p,a",y,p,a)
        #print ("yp",(y-p)**(a-1))
        #return 1
        return ( ( abs(y-p)**(a-1) ) * ( abs(q - y)**(b-1) ) ) / ( ( abs(q - p)**(a+b+1) ) * special.beta(a,b) )
    
    def produceBeta(self, mean=0, variance=1, bounds=[-3,3]):
        lower = bounds[0]
        upper = bounds[1]
        ro= (1.0 * (mean-lower) * (upper-mean) / variance) -1
        alfa = 1.0 * ro * (mean-lower)/ (upper-lower)
        beta = 1.0 * ro * (upper-mean)/ (upper-lower)
        return [alfa, beta]
    
    #test0 passed the test with validating values from here: https://www.youtube.com/watch?v=G_UFHE93uXs
    def test0(self):
        params = self.produceBeta(mean=0.260, variance = 0.04**2, bounds=[0,1])
        a,b = params
        print ("params", params )
        mean, var, skew, kurt = beta.stats(a, b, moments='mvsk')
        print (mean, var, skew, kurt)
        return params

    
    def test1(self):
        variance =  (5.0/3.0)**2
        bounds = [5,15]
        params = self.produceBeta(mean=10, variance = variance, bounds=bounds)
        a,b = params
        print ("params", params )
        
        beta_rvs = beta.rvs(a,b,size=10)
        for y in beta_rvs:
            print ("y",y)
            t = self.transform(y, params = params, bounds = bounds)
            print (t)
        #mean, var, skew, kurt = beta.stats(a, b, moments='mvsk')
        #print (mean, var, skew, kurt)
        #print (beta.rvs(a,b,size=10))
    
    def test2(self):
        fig, ax = plt.subplots(1, 1)
        a,b=[2.31, 0.627]
        x = np.linspace(beta.ppf(0.01, a, b, loc=10, scale=1), beta.ppf(0.99, a, b), 100)
        #print(x)
        #ax.plot(x, beta.pdf(x, a, b),'r-', lw=5, alpha=0.6, label='beta pdf')
        #plt.show()
        a,b = self.test0()
        rv = beta.rvs( a,b, loc=10, scale=1, size=1000)
        rv = np.array(rv)
        m = np.std(rv)
        print (m)
        
        #ax.show()
        #beta.pdf(x)
        
    #this test works for my POC. we have two bins with N(0.1, 0.001) and N(0.25, 0.004). it generates random values according to the gaussians.   
    def testB01B025(self):
        
        self.b1beta = self.produceBeta(self.b1n[0],self.b1n[1], [0,1])
        self.b2beta = self.produceBeta(self.b2n[0],self.b2n[1], [0,1])
        b1rvs_props = beta.stats(self.b1beta[0], self.b1beta[1], moments='mvsk')
        b2rvs_props = beta.stats(self.b2beta[0], self.b2beta[1], moments='mvsk')
        print ("b1rvs_props", b1rvs_props)
        print ("b1rvs_props",b2rvs_props)
        
        b1_rvs = beta.rvs(self.b1beta[0], self.b1beta[1], size=1000)        
        print("b1_rvs.m,s",np.mean(b1_rvs), np.std(b1_rvs))

        self.bmbeta = self.produceBeta(self.bm[0],self.bm[1], [0,1])

        bm_rvs = beta.rvs(self.bmbeta[0], self.bmbeta[1], size=1000)      
        print("bm_rvs.m,s",np.mean(bm_rvs), np.std(bm_rvs))
        #print(b1params, b2params)
        
        
    #argmax test. it pick up the highest teta, that is more likely according to the data given x (  argmax P(teta | D) ), among distribution 
    def argmaxInBinsTest(self):
        tetas=[]
        #test1 they are peak at their mean.
        tetas.append( stats.norm(self.b1n[0], self.b1n[1]).pdf(self.b1n[0]) )
        tetas.append( stats.norm(self.bm[0], self.bm[1]).pdf(self.bm[0]) )
        tetas.append( stats.norm(self.b2n[0], self.b2n[1]).pdf(self.b2n[0]) )
        print (tetas)
        
        #mean of b1n has highest teta value in b1n.
        tetas=[]
        tetas.append( stats.norm(self.b1n[0], self.b1n[1]).pdf(self.b1n[0]) )
        tetas.append( stats.norm(self.bm[0], self.bm[1]).pdf(self.b1n[0]) )
        tetas.append( stats.norm(self.b2n[0], self.b2n[1]).pdf(self.b1n[0]) )
        print (tetas)
        
    
    def gaussian_multiply(self, g1, g2):
        mu1, var1 = g1
        mu2, var2 = g2
        mean = (var1*mu2 + var2*mu1) / (var1 + var2)
        variance = (var1 * var2) / (var1 + var2)
        return [mean, variance]
    
    def start(self):
        
        #self.testB01B025()
        #self.argmaxInBinsTest()
        self.betaBernoulli3BinsReadTest()
        
bpp = BetaParamProducer()
bpp.start()