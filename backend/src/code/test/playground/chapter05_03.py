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
from code.DogSimulation import DogSimulation
from code import kf_internal

class Chapter05_03(object):
    
    def __init__(self):
        pass
    
    
    
    def draw_fig_prior(self):
        bp.bar_plot(self.prior,title="prior-"+str(self.loopIdx), ylim=(0,.4))
    
    def draw_fig_posterior(self):
        bp.bar_plot(self.posterior,title="posterior-"+str(self.loopIdx), ylim=(0,.4))
        
    
    def run(self):
        np.random.seed(13)
        W = [70.1, 91.2, 59.5, 93.2, 53.5]
        H = [1.8, 2.0, 1.7, 1.9, 1.6]
        np.set_printoptions(formatter={'float': '{: 0.3f}'.format})
        cov_ = np.cov(H, W, bias=1)
        print(cov_)
        
def main():
    ch = Chapter05_03()
    ch.run()
    

if __name__ == "__main__": main()

