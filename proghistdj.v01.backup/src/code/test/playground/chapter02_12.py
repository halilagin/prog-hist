import code.book_plots as bp
import code.gh_internal as gh
import matplotlib.pyplot as plt
import matplotlib.pyplot as plt
import numpy as np;
from filterpy.discrete_bayes import normalize


def update(likelihood, belief):
    return normalize( likelihood * belief)

def lh_hallway(hall, belief, z, prob):
    try:
        scale = prob / (1. - prob)
    except ZeroDivisionError:
        scale = 1e8

    likelihood = np.ones(len(hall))
    likelihood[hall==z] *= scale
    return likelihood
    
    
belief = np.array([0.1]*10)
hallway = np.array([1, 1, 0, 0, 0, 0, 0, 0, 1, 0])
reading = 1
likelihood = lh_hallway(hallway, belief, reading, prob=0.75)
postreiorBelief = update(likelihood,belief)

print("belief:", postreiorBelief)
print ("sum = ", sum(postreiorBelief))

plt.figure()
bp.bar_plot(postreiorBelief).show()
