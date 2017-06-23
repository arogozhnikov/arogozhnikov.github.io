---
layout: post
title:  "Occam razor vs. machine learning"
excerpt: "Gini is MSE, Entropy is LogLoss and other secrets of machine learning that textbooks don't write about"
date: 2016-07-12 12:00:00
author: Alex Rogozhnikov
tags: 
- teaching
- Machine Learning
- decision tree
- terminology

---

<div style='padding-left: 50%; margin-bottom: 50px;'>
<i>Whenever possible, substitute constructions out of known entities for inferences to unknown entities</i>
<br />
Occam's razor (Russell's version)
</div>


If Russell was studying Machine Learning our days, 
he'd probably throw out all of the textbooks.

The reason is that ML introduces too many terms with subtle or no difference.
It's hard understand the scale of the problem without a good example.
 
You can ask your ML-experienced friends how many of the **entities**
are there in this list of **terms**?

1. mean squared error (MSE)
1. logistic loss
1. cross-entropy
1. Kullback-Leibler (KL) divergence
1. logarithmic [scoring rule](https://en.wikipedia.org/wiki/Scoring_rule)
1. quadratic scoring rule
1. Brier scoring rule
1. Gini splitting criterion (Gini impurity) for decision tree 
   (not [Gini coefficient](https://en.wikipedia.org/wiki/Gini_coefficient))
1. entropy splitting criterion for decision tree
1. binomial / multinomial 
   [deviance](https://github.com/scikit-learn/scikit-learn/blob/51a765a/sklearn/ensemble/gradient_boosting.py#L465)
1. ordinary least squares
1. mutual information 
1. [logarithmic loss](https://www.kaggle.com/wiki/LogarithmicLoss)
1. [information gain](http://www.cs.cmu.edu/afs/cs.cmu.edu/project/theo-20/www/mlbook/ch3.pdf)
1. [softmax classifier](http://cs231n.github.io/linear-classify/#softmax)


Not to name some trivial things like sum of squared errors 
is the same **entity** as MSE.
 
<div style='height: 100px;'></div> 
 
The answer is: 2.

This is enough to say that terminology used in ML today is very unfriendly and requires some minimization. 

Group 1 contains different synonyms of MSE:

- mean squared error (MSE)
- quadratic scoring rule
- Brier scoring rule
- Gini splitting criterion (Gini impurity) 
- ordinary least squares

It is not obvious that **Gini is a particular version of MSE splitting**, but I demonstrate this below.

Group 2 contains different versions of cross-entropy:

1. logistic loss
1. cross-entropy
1. Kullback-Leibler (KL) divergence
1. logarithmic scoring rule
1. entropy splitting criterion for decision tree
1. binomial / multinomial deviance
1. mutual information 
1. logarithmic loss
1. information gain
1. softmax classifier

Entropy is cross-entropy of distribution with itself.
KL-divergence is difference of cross-entropy and entropy.

There are many other ways to define the same concept in particular cases:
 softmax classifier corresponds to optimization of log-likelihood for Bernoulli distribution (in case of two classes)
 or [categorical distribution](https://en.wikipedia.org/wiki/Categorical_distribution) (in case of more than two classes).
  
<!---
There are also some other things tightly knotted to these concepts like information criteria like bayesian information criterion (BIC). 
-->

Non-trivial thing here: **entropy splitting criterion is the same as logloss minimization**.

## Why Gini splitting = MSE?

Simplest case is binary classification: <span>$y\_i = 0 \text{ or } 1$</span>. 
Let's first revisit MSE splitting criterion. 

Suppose we split the feature space into leaves of a tree $ \text{leaf} = 1, 2, . . .  , L $.

In this case MSE is equal to:
$$
\text{MSE} = \sum_{i} (y_i - \hat{y}_i)^2
$$

We are going to group summands according to the leaf observations belong to.
Penalty for a single leaf depends only on the number
of samples $n_\text{leaf, 0}, n_\text{leaf, 1}$ from classes 0 and 1:

$$
    \text{MSE}_\text{leaf} = \sum_i (y_i - \hat{y})^2 = 
    n_{\text{leaf}, 0} \times \hat{y}^2 + n_{\text{leaf}, 1} \times (1 - \hat{y})^2 =
$$
$$
    = \{ \text{select optimal } \hat{y} \} =
    n_{leaf, 0}  \left[ \dfrac{n_{leaf, 0}}{n_{leaf, 0} + n_{leaf, 1}} \right]^2 
    + n_{leaf, 1}  \left[ \dfrac{n_{leaf, 1}}{n_{leaf, 0} + n_{leaf, 1}} \right]^2 =
$$
$$
    = \dfrac{n_{leaf, 0} \times n_{leaf, 1}}{n_{leaf, 0} + n_{leaf, 1}}
$$

So, while building decision tree, we greedily optimize the following global function 
(but each split optimizes only two terms in the sum):

<div>$$
    \text{MSE} = \sum_{\text{leaf}=1}^{L} \dfrac{n_{\text{leaf}, 0} \times n_{\text{leaf}, 1}}{n_{\text{leaf}, 0} + n_{\text{leaf}, 1}}
$$</div>

Let's also introduce $n_\text{leaf} = n_{\text{leaf}, 0}  + n_{\text{leaf}, 1} $ – number of all samples in the leaf
and portions of class 1 in leaf: 
$ p_{\text{leaf}, 1} = \dfrac{n_{\text{leaf}, 1}}{n_{\text{leaf}}} $. Using the new terms:
$$
    \text{MSE} = \sum_{\text{leaf}=1}^{L} n_\text{leaf} \times  p_{\text{leaf}, 1} (1 - p_{\text{leaf}, 1}) = \text{Gini impurity}
$$
... which is nothing but Gini impurity summed over leaves. 
It is easy to notice that in case of classification with multiple classes we need to first perform one-hot encoding and then minimize MSE 
to get the same splitting rule as provided by Gini.  

## Why Entropy splitting = LogLoss minimization?

Let's start from writing down the LogLoss for the decision tree:
<div>$$
\text{LogLoss} = \sum_{i} \sum_{c} y_{i,c} \log p_{i,c}
$$</div>

(where $y\_{i,c}$ is 1 if event $i$ belongs to class $c$ and 0 otherwise; 
$p\_{i,c}$ is predicted probability to belong to class $c$).

When selecting optimal predictions in the leaf, we optimize:
<div>$$
\text{LogLoss}_\text{leaf} = \sum_{i \in \text{leaf}} \sum_{c} y_{i,c} \log p_{\text{leaf}, c}
$$</div>

Easy to prove that optimal point is $p_{\text{leaf}, c} = \dfrac{n_{\text{leaf}, c}}{n_{\text{leaf}}} $

<div>$$
\text{LogLoss}_\text{leaf}
    = \sum_{c} n_{\text{leaf}, c} \log p_{\text{leaf}, c}
    = n_{\text{leaf}} \sum_{c} p_{\text{leaf}, c} \log p_{\text{leaf}, c}
$$</div>

... and we got entropy impurity. 

# See also

- my post about [ROC curve]({% post_url 2015-10-05-roc-curve %}) with tons of definitions for binary classification problem
- [Statistics vs. Machine Learning, fight!](https://brenocon.com/blog/2008/12/statistics-vs-machine-learning-fight/)
