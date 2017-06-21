import code.book_plots as bp
import code.gh_internal as gh
import matplotlib.pyplot as plt


weights = [158.0, 164.2, 160.3, 159.9, 162.1, 164.6, 
           169.6, 167.4, 166.4, 171.0, 171.2, 172.6]

time_step = 1 # day
scale_factor = 4/10

def predict_using_gain_guess(weight, gain_rate, do_print=True, sim_rate=0): 
    bp.set_figsize(y=4)

    # store the filtered results
    estimates, predictions = [weight], []

    # most filter literature uses 'z' for measurements
    
    for z in weights:
        # prediction step
        weight = weight + gain_rate*time_step
        gain_rate = gain_rate
        predictions.append(weight)
        
        # update step    
        residual = z - weight
        print(residual)
        gain_rate = gain_rate + gain_scale   * (residual/time_step)
        weight    = weight    + weight_scale * residual
      
        estimates.append(weight)

    # plot results
    #gh.plot_gh_results(weights, estimates, predictions, sim_rate)

weight = 160  # initial guess
gain_rate = -1.0 # initial guess

time_step = 1
weight_scale = 4/10
gain_scale = 1/3
estimates = [weight]
predictions = []
predict_using_gain_guess(weight=weight, gain_rate=1, do_print=False, sim_rate=.4)    




