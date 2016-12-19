---
layout: post
title:  "Miswritten t-SNE"
excerpt: " I investigate into t-SNE derivation and
 show the mistakes in original article during computing gradients. 
Also I'll demonstrate why using differentials is convenient for this problem 
and how one can write his own SNE version without tedious computations.  "
date: 2016-10-19 12:00:00
author: Alex Rogozhnikov
tags: 
- teaching
- Machine Learning
- t-SNE
- SNE

---

_**Brief summary:** in this article I investigate into t-SNE derivation and
 show the mistakes in original article during computing gradients. 
Also I'll demonstrate why using differentials is convenient for this problem 
and how one can write his own SNE version without tedious computations._     
 

Recently, there was much fuzz about t-SNE visualization algorithm 
mostly due to the [Misread t-SNE (How to Use t-SNE Effectively) ](http://distill.pub/2016/misread-tsne/) 
post by Google team.
You're welcome to read that interactive post and play with the demos 
to get some idea about algorithm. 

t-SNE algorithm is used to visualize high-dimensional data. 
And it is responsible for generating such nice plots from scientific papers: 
 
<img src='/images/tsne/mapping_games.jpg' 
    title='t-SNE mapping for atari games' height='300' />
<img src='/images/tsne/mapping_mnist.jpg' 
    title='t-SNE mapping for digits' height='300' />
    
    
<img src='/images/tsne/mapping_names.jpg' 
    title='t-SNE mapping for names' height='300' />
 

## Idea behind SNE

The ideas of most mappings are quite simple, and t-SNE is not the exception.
t-SNE has some mathematical tweaks compared to its predecessor SNE 
(stochastic neighbour embedding). We start from examining SNE.

Quite approximately, the idea behind both is:
<blockquote>
    we want to have the same order of neighbours in original and target spaces.
    // TODO пример соседства
</blockquote>
 

However, mathematically this is a bad way to put a problem, because
we should have some figure of merit to measure and to optimize 
(and it is always much better when measure is differentiable).

And we come up (actually, that's Hinton to come up) with the following 
 notion: $p_{j|i}$ and $q_{j|i}$ are "probabilities" 
 that $j$th item is a neighbour of $i$th item.
  
These "probabilities" sum up to 1:
$$
    \sum_j p_{j|i} = 1, \qquad \sum_j q_{j|i} = 1
$$
and larger for the items closer 
($|x_i - x_j|$ is distance between points in original high-dimensional space, 
$|y_i - y_j|$ is distance in the target space, which is usually 2d or 3d) 
: 
$$
    p_{j|i} \propto e^{||x_i - x_j||^2 / 2 \sigma_i^2}, \qquad
    q_{j|i} \propto e^{||y_i - y_j||^2 / 2 }
$$

With $\sigma_i$ computed individually using a simple rule, 
which I don't want to dwell upon.

Assuming that $p_{j|i} \sim q_{j|i}$, we are sure that order of neighbours is preserved.
So we can optimize something like:
$$
    \mathcal{L} = \sum_{i,j} (p_{j|i} - q_{j|i})^2 \to \min
$$

But this isn't super convenient, because doesn't reflect well our expectations
about the price of error. 

If we analyze the data in very high dimensions, it turns out, that
almost all the points are far from each other. 
You can prove this by inspecting random points in unit cube in N dimensions! 


It is ok for use to ... but when it comes down to ...

So, instead we minimize Kullback-Leibler divergence between distributions.
Or, another way to say it, we select positions of mapping $\vec{y}_j$ by using: 
`$$
    \mathcal{L} = \sum_{i,j} p_{j|i} \log q_{j|i}  \to \max \limits_{ y_i }
$$`
when $q_{j|i}$ are free parameters, optimal point is `$ p_{j|i} = q_{j|i} $`. 


## SNE optimization 

So, when we compute gradients of SNE (Hinton says that it is 'tedious', but we'll find out later it is not), we find that:

TODO проверить про 

`$$ 
    \dfrac{\partial L}{ \partial \vec{y}_i) } = 
    4 \sum_j ( \dfrac{ p_{j|i} + p_{i|j} }{2} - \dfrac{ q_{j|i} + q_{i|j} }{2} )
    ( \vec{y}_i - \vec{y}_j )
$$`

This formula has a nice interpretation:

- $ p'_{ij} = \dfrac{ p_{j|i} + p_{i|j} }{2} $ is a similarity of points in original space (notice – it is symmetric)
- $ q'_{ij} = \dfrac{ q_{j|i} + q_{i|j} }{2} $ is a similarity in the target space
- Gradient now look even simpler
   `$$ 
    \dfrac{\partial L}{ \partial \vec{y}_i) } = 4 \sum_j ( p'_{ij} - q'_{ij} ) ( \vec{y}_i - \vec{y}_j )
   $$`
- we can increase similarity of items' pair in the target space by moving points closer  
- each pair of items is analyzed, and there is a force: 
  it's pulling items closer if similarity in target space smaller compared to the original space, 
  and pushing items away from each other in the opposite case.
  
That simple.
 
## t-SNE improvements
 
There is an obvious problem with SNE, once we interpreted it's gradient.
This term grows linearly with the distance between points
$$
    ( \vec{y}_i - \vec{y}_j )
$$


The further points from each other, the larger force pulling them together.
Sounds quite mad, and this indeed drives to problems – points tend to make a crowd somewhere in the plot
without organizing in clusters.

Can we do better? Without diving into math, it is obvious that we can scale the force using
`$$ 
    \dfrac{\partial L}{ \partial \vec{y}_i) } = 4 \sum_j ( p'_{ij} - q'_{ij} ) 
    \dfrac{ \vec{y}_i - \vec{y}_j } { || \vec{y}_i - \vec{y}_j ||^p } 
$$`
 
On the other hand, doing so produces infinite gradients when points are close.
A very simple trick is to add 1 in the denominator, thus preventing it from exploding for close points:
`$$ 
    \dfrac{\partial L}{ \partial \vec{y}_i) } = 4 \sum_j ( p'_{ij} - q'_{ij} ) 
    \dfrac{ \vec{y}_i - \vec{y}_j } {1 + || \vec{y}_i - \vec{y}_j ||^p } 
$$`

To achieve this gradient, we can use the following function:

TODO check that it is symmetric and the function exists

TODO function


## Deriving the formulas

Finally, let's see how one can perform this derivation.
I think this worth doing, because in SNE paper this derivation wasn't done,
  and in t-SNE paper it was done in Appendix A with serious mistakes.
  
Mistake 1.
$$
    \dfrac{\partial}{ \partial d} \dfrac{1}{1 + d^2} = TODO
$$
TODO plo1

Mistake 2.
TODO plot2

### SNE case

p_ij = ..
q_ij = ..

p'_ij = ...
q'_ij = ...

L = ... 


d \mathcal{L} 
 = \sum_ij p_ij d log q_ij 
 = \sum_ij p_ij / q_ij d q_ij

### t-SNE case