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

class Chapter05_09(object):
    sc1X=[]
    sc1Y=[]
    sc2X=[]
    sc2Y=[]
    
    def __init__(self):
        pass
    
    
    
    def draw_fig1(self):
        plt.scatter(self.sc1X, self.sc1Y)
        plt.scatter(self.sc2X,self.sc2Y)
        
    
    
    def run(self):
        np.random.seed(13)
        mean = (2, 17)
        cov = [[10., 0], 
               [0, 4.]]
        
        drawnow(self.draw_fig1, show_once=True, confirm=False)
        print (np.cov([self.sc1X,self.sc1Y], [self.sc2X,self.sc2Y]))
        
def main():
    ch = Chapter05_09()
    ch.run()
    

if __name__ == "__main__": main()

