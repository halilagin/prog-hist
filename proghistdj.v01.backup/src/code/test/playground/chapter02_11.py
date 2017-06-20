import code.book_plots as bp
import code.gh_internal as gh
import matplotlib.pyplot as plt
import matplotlib.pyplot as plt
import numpy as np;
from filterpy.discrete_bayes import normalize



def scaled_update (hall, belief, z, prob):
    scale_ = prob/(1-prob)
    belief[hall==1] *=scale_
    normalize(belief)
    
    
belief = np.array([0.1]*10)
hallway = np.array([1, 1, 0, 0, 0, 0, 0, 0, 1, 0])
reading = 1
scaled_update(hallway, belief, reading, prob=0.75)

belief /= sum(belief);
print("belief:", belief)
print ("sum = ", sum(belief))

plt.figure()
bp.bar_plot(belief).show()
