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

class Chapter02_21(object):
    

    prior = np.array([.1,.1,.1,.1,.1,.1,.1,.1,.1,.1])
    hallway = np.array([1, 1, 0, 0, 0, 0, 0, 0, 1, 0])

   
    
    def lh_hallway(self, hall, z, prob):
        try:
            scale_ = prob/(1-prob)
        except:
            scale_=1e8
        likelihood  = np.ones(len(hall))
        likelihood[hall==z] *= scale_
        return likelihood
    
    def draw_fig(self):
        bp.bar_plot(self.prior, ylim=(0,0.6))
        #show()
    
    def run(self):
        likelihood = self.lh_hallway(self.hallway, z=1, prob=.75)
        self.prior = update(likelihood, self.prior)
        drawnow(self.draw_fig, show_once=True, confirm=False)

def main():
    ch = Chapter02_21()
    ch.run()
    

if __name__ == "__main__": main()

