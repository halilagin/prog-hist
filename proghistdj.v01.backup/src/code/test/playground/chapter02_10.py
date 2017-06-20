import code.book_plots as bp
import code.gh_internal as gh
import matplotlib.pyplot as plt
import matplotlib.pyplot as plt
import numpy as np;
from filterpy.discrete_bayes import normalize



def scaled_update (hall, belief, z, prob):
    scale_ = prob/(1.-prob)
    likelihood = np.ones(len(hall))
    print("su.likelihood:",likelihood)
    likelihood[hall==z] *=scale_
    print("su.likelihood:",likelihood)
    print("su.belief:",belief)
    newhyp = likelihood * belief
    print("su.lik*bel:",newhyp)
    n = normalize(newhyp)
    print("su.posterior:",n)
    return n
    
    
belief = np.array([0.1]*10)
hallway = np.array([1, 1, 0, 0, 0, 0, 0, 0, 1, 0])
reading = 1
newhyp = scaled_update(hallway, belief, reading, prob=0.75)


plt.figure()
bp.bar_plot(newhyp).show()
