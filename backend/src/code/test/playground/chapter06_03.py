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
from filterpy.stats import gaussian, multivariate_gaussian
from numpy.random import randn,seed
from code.DogSimulation import DogSimulation
from code import kf_internal
from filterpy.kalman import predict, update

class Chapter06_03(object):
    
    z_var=2
    process_var=2
    count=10
    dt=1;
   
   
    def __init__(self):
        pass
    
    
    
    def compute_dog_data(self, z_var, process_var, count=1, dt=1.):
        "returns track, measurements 1D ndarrays"
        x, vel = 0., 1.
        z_std = math.sqrt(z_var) 
        p_std = math.sqrt(process_var)
        xs, zs = [], []
        for _ in range(count):
            v = vel + (randn() * p_std * dt)
            x += v*dt        
            xs.append(x)
            zs.append(x + randn() * z_std)        
        return np.array(xs), np.array(zs)
    
    
    def draw_fig1(self):
        plt.scatter(self.sc1X, self.sc1Y)
        plt.scatter(self.sc2X,self.sc2Y)
        
    
    
    def run(self):
        np.random.seed(13)
        
        data= self.compute_dog_data(self.z_var, self.process_var, self.count, self.dt)
        print (["{:.3f}".format(x)  for x in data[0]])
        print("\n\n")
        print (["{:.3f}".format(x)  for x in data[1]])
        
def main():
    ch = Chapter06_03()
    ch.run()
    

if __name__ == "__main__": main()

