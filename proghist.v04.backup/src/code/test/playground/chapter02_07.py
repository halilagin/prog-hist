import code.book_plots as bp
import code.gh_internal as gh
import matplotlib.pyplot as plt
import matplotlib.pyplot as plt
import numpy as np;

belief = np.array([0.1]*10)
hallway = np.array([1, 1, 0, 0, 0, 0, 0, 0, 1, 0])
reading = 1

def update_belief (hall, belief, z, scale_):
    for i,h in enumerate(hall):
        if (h==z):
            belief[i] *= scale_
    
update_belief(hallway, belief, reading, 3.0)

belief /= sum(belief);
print("belief:", belief)
print ("sum = ", sum(belief))

plt.figure()
bp.bar_plot(belief).show()



