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
from filterpy.kalman import KalmanFilter
from filterpy.common import Q_discrete_white_noise
from code.mkf_internal import plot_track
from scipy.linalg import block_diag


class PosSensor1(object):
    def __init__(self, pos=(0, 0), vel=(0, 0), noise_std=1.):
        self.vel = vel
        self.noise_std = noise_std
        self.pos = [pos[0], pos[1]]
        
    def read(self):
        self.pos[0] += self.vel[0]
        self.pos[1] += self.vel[1]
        
        return [self.pos[0] + randn() * self.noise_std,
                self.pos[1] + randn() * self.noise_std]


class Chapter08_10(object):
    R_std = 0.35
    Q_std = 0.04
    
   
    def __init__(self):
        pass
    
    def tracker1(self):
        tracker = KalmanFilter(dim_x=4, dim_z=2)
        dt = 1.0   # time step
    
        tracker.F = np.array([[1, dt, 0,  0],
                              [0,  1, 0,  0],
                              [0,  0, 1, dt],
                              [0,  0, 0,  1]])
        tracker.u = 0.
        tracker.H = np.array([[1, 0, 0, 0],
                              [0, 0, 1, 0]])
    
        tracker.R = np.eye(2) * self.R_std**2
        q = Q_discrete_white_noise(dim=2, dt=dt, var=self.Q_std**2)
        tracker.Q = block_diag(q, q)
        tracker.x = np.array([[0, 0, 0, 0]]).T
        tracker.P = np.eye(4) * 500.
        return tracker
    
    def produceData(self):
        # simulate robot movement
        N = 30
        sensor = PosSensor1((0, 0), (2, .2), noise_std=self.R_std)
        
        zs = np.array([np.array([sensor.read()]).T for _ in range(N)])
        # run filter
        robot_tracker = self.tracker1()
        mu, cov, _, _ = robot_tracker.batch_filter(zs)

        for x, P in zip(mu, cov):
            # covariance of x and y
            cov = np.array([[P[0, 0], P[2, 0]], 
                            [P[0, 2], P[2, 2]]])
            mean = (x[0, 0], x[2, 0])
            #print(mean)

            #plot_covariance_ellipse(mean, cov=cov, fc='g', std=3, alpha=0.5)
            
        #plot results
        #zs *= .3048 # convert to meters
        return mu, zs
    
    def start(self):
        mu, zs = self.produceData()
        plt.figure()
        
        bp.plot_filter(mu[:, 0], mu[:, 2])
        bp.plot_measurements(zs[:, 0], zs[:, 1])
        plt.legend(loc=2)
        plt.xlim((0, 70));
        plt.show()
        
def main():
    ch = Chapter08_10()
    ch.start()
    

if __name__ == "__main__": main()

