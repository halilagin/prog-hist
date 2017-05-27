import code.book_plots as bp
import code.gh_internal as gh
import matplotlib.pyplot as plt
import matplotlib.pyplot as plt
import numpy as np;
import time 
from pylab import *
from drawnow import drawnow, figure
from filterpy.discrete_bayes import normalize
from filterpy.discrete_bayes import predict
from filterpy.discrete_bayes import update
from scipy.ndimage import measurements

class Chapter02_27(object):
    

    prior = np.array([])
    hallway = np.array([])
    posterior = np.array([])
    kernel = (.1, .8, .1)
    z_prob = 1.0
    measurements = []
    loopIdx=0
    
    def __init__(self):
        self.hallway = np.array([1, 1, 0, 0, 0, 0, 0, 0, 1, 0])
        self.measurements = [self.hallway[i % len(self.hallway)] for i in range(25)]
        self.posterior = np.array([.1]*10)

    def lh_hallway(self, hall, z, prob):
        try:
            scale_ = prob/(1-prob)
        except:
            scale_=1e8
        likelihood  = np.ones(len(hall))
        likelihood[hall==z] *= scale_
        return likelihood
    
    def draw_fig_prior(self):
        bp.bar_plot(self.prior,title="prior-"+str(self.loopIdx), ylim=(0,.4))
    
    def draw_fig_posterior(self):
        bp.bar_plot(self.posterior,title="posterior-"+str(self.loopIdx), ylim=(0,.4))
    
        
        
    def discrete_bayes_sim(self, kernel, zs, z_prob_correct, sleep=0.25):
        N = len(self.hallway)
        for i, z in enumerate(zs):
            self.loopIdx = i
            self.prior = predict(self.posterior, 1, kernel)
            drawnow(self.draw_fig_prior, show_once=False, confirm=False)
            
            time.sleep(sleep)
            
            likelihood = self.lh_hallway(self.hallway, z, z_prob_correct)
            print(self.hallway)
            print(likelihood)
            self.posterior  = update(likelihood, self.prior)
            drawnow(self.draw_fig_posterior, show_once=False, confirm=False)
            time.sleep(sleep)


        
    def run(self):
        #self.discrete_bayes_sim(self.kernel, self.measurements, 1.0, 1)
        #print(self.posterior)
        likelihood = self.lh_hallway(self.hallway, 0, 1)
        print(likelihood)
        
        
def main():
    ch = Chapter02_27()
    ch.run()
    

if __name__ == "__main__": main()

