import code.book_plots as bp
import code.gh_internal as gh
import matplotlib.pyplot as plt
import numpy as np;
import time 
from pylab import *
from drawnow import drawnow, figure
from filterpy.discrete_bayes import normalize
from filterpy.discrete_bayes import predict
from filterpy.discrete_bayes import update
from scipy.ndimage import measurements
import filterpy.stats as stats
from code.test.playground.chapter04_10 import Chapter04_10
from code.test.playground.chapter04_04 import Chapter04_04
from code.proghist.BetaParamProducer import BetaParamProducer

class SlidePlots(object):
    

    def __init__(self):
        pass
    
    
    
    
    def draw_fig_prior(self):
        bp.bar_plot(self.prior,title="prior-"+str(self.loopIdx), ylim=(0,.4))
    
    def draw_fig_posterior(self):
        bp.bar_plot(self.posterior,title="posterior-"+str(self.loopIdx), ylim=(0,.4))
    
        
    def gauss(self):
        mu = 0
        variance = 5
        sigma = math.sqrt(variance)
        x = np.linspace(-10, 10, 100)
        plt.plot(x,mlab.normpdf(x, mu, sigma))
        plt.show()


    def gaussProduct(self):
        c0410 = Chapter04_10()
        c0410.run()
        
    def barPlotAndGauss(self):
        c0404 = Chapter04_04()
        c0404.run()
        
    def run(self):
        #stats.plot_gaussian_pdf(mean=10, variance=1, mean_line=True, xlim=(4,16), ylim=(0,0.5), xlabel="nums", ylabel="ys", label="Gaussian PDF example")
        #self.gauss()
        #self.gaussProduct()
        self.barPlotAndGauss()
        self.binsAndGauss()
    
    
    
    #proof of how rvs generated correctly
    def start(self):
        
        bpp = BetaParamProducer()
        bins = bpp.betaBernoulli3BinsRvs(datacount=100000, heightFactors=[[1,0,2]])
        binMembers = [ int(bins[i] * 100) for i in range(len(bins)) ]
        binMembers = np.array(binMembers)
        binMembers_y = np.bincount(binMembers)
        binMembers_ii = np.nonzero(binMembers_y)[0]
        z = zip(binMembers_ii,binMembers_y[binMembers_ii])
        z_l = list(z)
        x,y = zip(*z_l)
        print(z_l)
        plt.scatter(x,y)
        plt.show() 
    
    
    def binsAndGauss(self):
        pass
        seed(15)
        xs07 = np.arange(-2,2 , 0.001)
        ys07 = np.array([stats.gaussian(x, 0.7, (0.6/3)**2) for x in xs07])
        
        ys04 = np.array([stats.gaussian(x, 0.15, (0.4/3)**2) for x in xs07])
        
        ys_m = np.array([stats.gaussian(x, 0.32, (0.1)**2) for x in xs07])
        
        #np.set_printoptions(formatter={'float': '{: 0.2f}'.format})
        #print(xs)
        #print(ys)
        #bar_ys = abs(ys + randn(len(xs)) * stats.gaussian(xs-10, 0, 10)/2)
        
        #plt.gca().bar(xs[::5]-.25, bar_ys[::5], width=0.5, color='g')
        plt.bar([0.4], [2], 0.8, color="yellow")
        plt.bar([0.7], [4], 0.8, color="gray")
        plt.plot(xs07, ys04, lw=3, color='k')
        plt.plot(xs07, ys07, lw=3, color='k')
        plt.plot(xs07, ys_m, lw=3, color='red')
        plt.xlim(-2, +2)
        plt.show()
        return plt
    
def main():
    ch = SlidePlots()
    ch.run()
    

if __name__ == "__main__": main()

