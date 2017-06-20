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
from numpy.random import randn,seed

class Chapter04_04(object):
    

    def __init__(self):
        pass
    
    
    
    def draw_fig_prior(self):
        bp.bar_plot(self.prior,title="prior-"+str(self.loopIdx), ylim=(0,.4))
    
    def draw_fig_posterior(self):
        bp.bar_plot(self.posterior,title="posterior-"+str(self.loopIdx), ylim=(0,.4))
    
    def gauss(self, mean, var, ticks):
        std = math.sqrt(var)
        xs = np.linspace(mean-std*5, mean+std*5, ticks)
        ys = mlab.normpdf(xs, mean, std)
        plt.xlim(mean-std*10, mean+std*10)
        plt.plot(xs,ys)
        return plt;
    
    def mygausshist(self, mean, var, ticks):
        std = math.sqrt(var)
        xs = np.linspace(mean-std*5, mean+std*5, ticks)
        ys = mlab.normpdf(xs, mean, std)
        bar_ys = abs(ys + randn(len(xs)) * mlab.normpdf(xs, mean, std)/8)
        plt.gca().bar(xs[::5]-.25, bar_ys[::5], width=0.5, color='g')
        plt.xlim(mean-std*10, mean+std*10)
        plt.plot(xs,ys,lw=3, color='k')
        return plt

    
    def barplot(self, mean, var, ticks):
        std = math.sqrt(var)
        xs = np.linspace(mean-std*5, mean+std*5, ticks)
        pdf_ = mlab.normpdf(xs, mean, std)
        plt.xlim(mean-std*10, mean+std*10)
        plt.plot(xs,pdf_)
        return plt;
    
    def randex(self):
        ys = randn(20)*1+10
        xs = range(20)
        plt.plot(xs,ys)
        plt.show()

    
    def gausshist(self):
        seed(15)
        xs = np.arange(0, 20, 0.1)
        ys = np.array([stats.gaussian(x-10, 0, 2) for x in xs])
        np.set_printoptions(formatter={'float': '{: 0.2f}'.format})
        print(xs)
        print(ys)
        bar_ys = abs(ys + randn(len(xs)) * stats.gaussian(xs-10, 0, 10)/2)
        plt.gca().bar(xs[::5]-.25, bar_ys[::5], width=0.5, color='g')
        plt.plot(xs, ys, lw=3, color='k')
        plt.xlim(-20, +20)
        return plt
        
    def run(self):
        #stats.plot_gaussian_pdf(mean=10, variance=1, mean_line=True, xlim=(4,16), ylim=(0,0.5), xlabel="nums", ylabel="ys", label="Gaussian PDF example")
        #self.randex()
        #self.gauss(100,10,100).show()
        #self.gausshist().show()
        self.mygausshist(100, 10, 200).show()
        
        
def main():
    ch = Chapter04_04()
    ch.run()
    

if __name__ == "__main__": main()

