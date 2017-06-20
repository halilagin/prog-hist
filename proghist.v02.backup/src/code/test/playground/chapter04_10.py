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

class Chapter04_10(object):
    

    def __init__(self):
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
       
        prior, z = (8.5, 1.5), (10.2, 0.5)
        self.plot_products(prior[0], prior[1], z[0], z[1], True)
        prior, z = (8.5, 0.5), (10.2, 1.5)
        self.plot_products(prior[0], prior[1], z[0], z[1], True).show()
        
        
def main():
    ch = Chapter04_10()
    ch.run()
    

if __name__ == "__main__": main()

