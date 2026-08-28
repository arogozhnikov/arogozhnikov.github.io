---
layout: post
title: Legendre transformation without Legendre transformation
date: '2013-08-12T08:42:00.002-07:00'
author: Alex Rogozhnikov
tags:
- Lagrange multipliers
- Theoretical physics
modified_time: '2013-09-05T09:44:56.778-07:00'
blogger_id: tag:blogger.com,1999:blog-307916792578626510.post-2889994042685023519
blogger_orig_url: http://brilliantlywrong.blogspot.com/2013/08/legendre-transformation-without.html
---

If you heard something of theoretical mechanics, you definitely know that the most important transition in mechanics is one from [Lagrangian Mechanics](http://en.wikipedia.org/wiki/Lagrangian_mechanics) to [Hamiltonian](http://en.wikipedia.org/wiki/Hamiltonian_mechanics). And its name is Legendre transform.

This transition is like a magic trick with all cards open, when you know secret recipe, but still don't grasp what just happened. The recipe is

- take the momenta: $p_i=\frac{\partial L}{\partial \dot{q_i}}$.
- prove that Hamilton equations hold: $$\frac{\partial H}{\partial q_j}=-\dot{p}_j,\qquad\frac{\partial H}{\partial p_j}=\dot{q}_j$$ where
  $$ H\left(q,\;p,\;t\right)=\sum_i\dot{q}_i p_i-L(q,\;\dot{q},\;t)$$

And that's the idea. But *why* should I take this Hamiltonian not some other function? *Why* should I consider Lagrangian derivatives as new variables instead of $q_i$? I didn't meet the answers in mechanics courses, though there is a simple intuitive justification. Thanks to Pasha Gavrilenko who revealed this secret.

What do we have initially? An action on some interval of time, i.e. the integral

$$ S = \min_{q(\cdot)} \int_{t_1}^{t_2} L(q, \dot{q}, t) dt$$

which should be minimized (locally), that's what Hamilton's principle states. (There are conditions at the endpoints which I will omit)

Ok, the only trouble is $q$ and $\dot{q}$ aren't independent, otherwise the Lagrange equations would be much simpler: $ \frac{\partial L}{\partial q} = \frac{\partial L}{\partial \dot{q}} = 0 $

Let us try to replace $\dot{q}$ with $v$, assuming they are equal:

$$ S = \min_{q(\cdot)} \int_{t_1}^{t_2} L(q, v, t)\bigg|_{v=\dot q} dt $$

Hmhmhm. Seems nothing changed. Now the trick! Let's add a summand

$$\delta(\dot{q},v) = \begin{cases} 0 & \dot{q} = v \\ +\infty & \text{otherwise} \end{cases}$$

and now we can minimize over all possible trajectories of $q$ and of $v$.

$$ S = \min_{q(\cdot), v(\cdot)} \left[ \int_{t_1}^{t_2} L(q, v, t) dt + \delta[q,v] \right] $$

See? We have now $q$ and $v$ independent at the cost of an additional summand. Now we can write $\delta$ in the following form (make sure you understand it):

$$\delta[q,v] = \max_{p(\cdot)} \int_{t_1}^{t_2} p(t) (\dot{q}(t) - v(t)) dt $$

After substitution we have the problem on finding a saddle point of the function:

$$ S = \min_{q(\cdot), v(\cdot)} \max_{p(\cdot)} \int_{t_1}^{t_2} p(t) (\dot{q}(t) - v(t)) + L(q, v, t) dt $$

Pay attention that all variables $p,q,v$ are independent now. The solution we need is a trajectory $q(\cdot)$, but it has corresponding trajectories $v(\cdot)$ and $p(\cdot)$ which form a saddle point together with $q(\cdot)$.

As we know, at the saddle point all the partial derivatives are zero (assuming the function is differentiable). Calculating variational derivatives with respect to $p,v,q$ gives respectively

$$ \begin{aligned}
    \dot{q} &= v \\
    p &= \frac{\partial L}{\partial \dot{q}} \\
    \dot{p} &= \frac{\partial L}{\partial q}
\end{aligned}
$$

Note that energy function $H(q,v,t)$ also appeared in a natural way as well as the Hamiltonian version of the principle of least action

$$ \begin{aligned}
    p(t) (\dot{q}(t) - v(t)) + L(q, v, t) = p(t) \dot{q}(t) - \left[ p(t)v(t) - L(q,v,t) \right] = \\
    = \{\text{changing the variables} \} = p(t) \dot{q}(t) - H(p,q,t)
\end{aligned} $$

You may have noticed that the thing I did is just added [Lagrange multiplier](http://en.wikipedia.org/wiki/Lagrange_multiplier) ho make the condition $\dot{q} = v$ hold.

This way Legendre transformation looks more accessible to my mind.
