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

class Chapter04_12(object):
    
    process_var = 1. # variance in the dog's movement
    sensor_var = 2 # variance in the sensor
    
    x = (0., 20**2)  # dog's position, N(0, 20**2)
    velocity = 1
    dt = 1. # time step in seconds

    def __init__(self):
        self.process_model = (self.velocity*self.dt, self.process_var) 

        pass
    
    
    
    def draw_fig_prior(self):
        bp.bar_plot(self.prior,title="prior-"+str(self.loopIdx), ylim=(0,.4))
    
    def draw_fig_posterior(self):
        bp.bar_plot(self.posterior,title="posterior-"+str(self.loopIdx), ylim=(0,.4))
        
    def predict(self, pos, movement):
        return (pos[0] + movement[0], pos[1] + movement[1])


    def update_dog(self, dog_pos, dog_var, measurement, measurement_var):
        estimated_pos = self.gaussian_multiply(
                (dog_pos, dog_var), 
                (measurement, measurement_var))
        return estimated_pos

    def update(self, likelihood, prior):
        posterior = self.gaussian_multiply(likelihood, prior)
        return posterior
    
    def plot_products(self, m1, v1, m2, v2, legend=True): 
        plt.figure()
        product = self.gaussian_multiply((m1, v1), (m2, v2))
    
        xs = np.arange(5, 15, 0.1)
        ys = [stats.gaussian(x, m1, v1) for x in xs]
        plt.plot(xs, ys, label='$\mathcal{N}$'+'$({},{})$'.format(m1, v1))
    
        ys = [stats.gaussian(x, m2, v2) for x in xs]
        plt.plot(xs, ys, label='$\mathcal{N}$'+'$({},{})$'.format(m2, v2))
    
        ys = [stats.gaussian(x, *product) for x in xs]
        plt.plot(xs, ys, label='product', ls='--')
        if legend:
            plt.legend();
        return plt
    
    def gaussian_multiply(self, g1, g2):
        mu1, var1 = g1
        mu2, var2 = g2
        mean = (var1*mu2 + var2*mu1) / (var1 + var2)
        variance = (var1 * var2) / (var1 + var2)
        return (mean, variance)

    def run(self):
        np.random.seed(13)

        # simulate dog and get measurements
        dog = DogSimulation(
            x0=self.x[0], 
            velocity=self.process_model[0], 
            measurement_var=self.sensor_var, 
            process_var=self.process_model[1])

        # create list of measurements
        zs = [dog.move_and_sense() for _ in range(10)]
        
        print('PREDICT\t\t\tUPDATE')
        print('     x      var\t\t  z\t    x      var')
        
        # run the filter
        xs, predictions = [], []
        for z in zs:
            # perform Kalman filter on measurement z
            prior = self.predict(self.x, self.process_model)
            likelihood = (z[0], self.sensor_var)
            print (likelihood)
            #likelihood = z
            self.x = self.update(prior, likelihood)
        
            # save results
            predictions.append(prior[0])
            xs.append(self.x[0])
            kf_internal.print_gh(prior, self.x, z[0])
        
        print()
        print('final estimate:        {:10.3f}'.format(self.x[0]))
        print('actual final position: {:10.3f}'.format(dog.x))
                
        
def main():
    ch = Chapter04_12()
    ch.run()
    

if __name__ == "__main__": main()

