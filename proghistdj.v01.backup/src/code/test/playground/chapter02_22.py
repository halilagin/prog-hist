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

class Chapter02_22(object):
    

    prior = np.array([])
    hallway = np.array([])
    posterior = np.array([])
    prior2 = np.array([])
    
    
    def __init__(self):
        self.prior = np.array([.1]*10)
        self.hallway = np.array([1, 1, 0, 0, 0, 0, 0, 0, 1, 0])
        
    def lh_hallway(self, hall, z, prob):
        try:
            scale_ = prob/(1-prob)
        except:
            scale_=1e8
        likelihood  = np.ones(len(hall))
        likelihood[hall==z] *= scale_
        return likelihood
    
    def draw_fig(self):
          
        plt.figure(1)
        
        plt.subplot(131)
        bp.bar_plot(self.prior,title="prior", ylim=(0,.4))
        
        plt.subplot(132)
        bp.bar_plot(self.posterior,title="posterior", ylim=(0,.4))
        
        plt.subplot(133)
        bp.bar_plot(self.prior2,title="prior2", ylim=(0,.4))
        
        plt.show()

        
    def run(self):
        likelihood = self.lh_hallway(self.hallway, z=1, prob=.75)
        self.posterior = update(likelihood, self.prior)
        self.prior2 = predict(self.posterior, 1, [.1, .8, .1])
        self.draw_fig()
        
def main():
    ch = Chapter02_22()
    ch.run()
    

if __name__ == "__main__": main()

