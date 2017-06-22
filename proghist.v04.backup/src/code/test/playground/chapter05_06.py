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

class Chapter05_06(object):
    X=[]
    Y=[]
    
    def __init__(self):
        pass
    
    
    
    def draw_fig1(self):
        plt.plot(self.X)
        plt.plot(self.Y)
        
    
    
    def run(self):
        np.random.seed(13)
        self.X = np.linspace(1, 10, 100)
        self.Y = np.linspace(1, 10, 100)+np.sin(self.X)*0.5
        drawnow(self.draw_fig1, show_once=True, confirm=False)
        print (np.cov(self.X, self.Y))
        
def main():
    ch = Chapter05_06()
    ch.run()
    

if __name__ == "__main__": main()

