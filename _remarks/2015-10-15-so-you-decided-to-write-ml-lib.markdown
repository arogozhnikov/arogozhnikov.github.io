---
layout: post
title:  "So you decided to write a machine learning library (bad advice)"
date: 2015-10-15 12:00:00
author: Alex Rogozhnikov
tags: 
- writing classifier
- Machine learning
- Python
---

(this post was written in those days when everyone tried to develop his own library for deep learning
or machine learning, kept for history)

So, you decided to write a brand new machine learning library.
This one will be so much better than everything you have seen before. 
It will be fast, easy-to-use, even-easier-to-extend, flexible, with support of multi-core computations and many more.
 
There are traditions which most of developers of ML libraries are trying to follow, 
so I decided to collect those together.

Most of the experience written below came from developing [yandex/REP](https://github.com/yandex/rep)
and browsing code/experimenting with different classifiers.

Treat this as a "collection of awful advices". 

<img src='/images/etc/bad_advice.jpg' style='margin: 20px 200px; width: 400px;' alt='bad advice ahead' />

0. __Your library is the start and the end point in user's research.__
   That's the key point in doing everything bad.
   There is nothing else user should pay attention to.
   Following points are a consequence of this simple rule.

1. __Never care about whether other libraries exist.__
   Why actually you shall worry that there are other libraries of machine learning and how many of them are already on the github?
   Definitely, the one written by you will be times better.
   Speed benchmarks? Forget.
   New algorithms? No, never.
   Building tests to compare accuracy on public data is also nothing but wasted time.

2. __Invent new interface(s).__
   Users expect the structure and examples of usage to be simple?
   Bad idea. You have studied OOP, so now you can write complex APIs!
   
   You will introduce a class `Trainer`and a `Dataset` class.
   Also you need `SupervisedDataset`class.
   And a special class for sampling from supervised datasets. 
   
   Probably you'll never implement one more sampler, such code organization is definitely needed for the sake of OOP.

3. __Introduce your own data format.__ Any successful library has it's own format.
   Currently used formats are not universal. You need a new one.
   Binary formats (like HDF5, FITS and ROOT) are definitely bad, because you can't write a parser for those in 10 lines.

   There should be something special about your format.
   Like csv, but with custom separator.
   Also, you will not add column names there, since algorithm doesn't require it
   (additionally, I would recommend not to check number of columns at prediction time, 
   this would allow user to make mistakes that are hard to find).


4. __Don't use random seed.__ At least don't do it in the way users expect. There are various interesting options:

   1. simply never set seed, so debugging would be almost impossible. If algorithm didn't converge 10 times in a row, that's because of a bad luck (or karma).
   2. set global random seed. Let reproducibility fail during multi-threading
   3. finally, introduce a special parameter `random_seed` and ignore it. Haha!
     
   <!-- theanets, nolearn, pybrain, neurolab -->  


5. __Write in C++ or CUDA__. You heard there are other languages,
   but everyone knows that ML needs efficient implementations.
   Anything being written in C++ is the fastest possible.
   
   Don't use any vector language / tool. Code in C++ is very clear. Also ignore parallel primitives.
   
   Never use BLAS operations. Don't use numpy, theano, octave or fortran90+, otherwise other developers will be able to understand your code!
   
   <!-- PyBrain, leaf  --> 
   
   Also remember to create 'for the purposes of efficiency' a god-object and put all the data there.
   While reading your code, side programmer will not be able to get what information is used by each method.

   
6. __Write lots of logs to the output!__.
   Remember the starting point? There is nothing else user shall care of, only about your library?
   
   Every step of your algorithm shall print some useless information (better if accompanied by ASCII art).
   Don't allow your algorithm to be run silently (avoid verbosity parameter, user should not be distracted from your output).
   It should always return code 0 (whatever happens) ans print errors in stdout (not stderr!).
   
   Never use verbose parameter.
    
   <!-- LibFM as well as many nnets -->

7. There are definitely very few __libraries of neural networks and deep learning!__
   We need more!
   You'll write a new and a better one (though start from simple things, of course).
   
   Did I say that you should ignore theano?

8. __SGD is a fresh idea!__ Adaptive SGD is even better. Online learning is the new mainstream. 
   That's the way to go. Learning representation? Use SGD! Logistic regression? SGD! Factorization? SGD! Using Rprop? SGD! 
   
   <!-- theanets -->

9. Write __your own map-reduce system.__
   Optimization of an algorithm is an annoying process.
   It's better to use 100 machines and solve the same problem faster, right?
    
   Everyone (just everyone) today has a good cluster.
   Setting up distributed environment with same collection of libraries is very simple.
    
   Finally, there is always some user who wants 'distributed' option
   (but never will be able to use it for different reasons).

   <!-- early xgboost -->
 

10. Change an interface (API) all the time.  
    Drop the support as soon as someone starts using your library.
    <!-- pybrain, nolearn.dbn -->
    
    You'll find a new area to write your-next-best-open-library.
    
    <!-- theanets, lasagne -->

Ok, I think it's enough.
If I convinced you that there is no need in new libraries, but you still wish to do something useful in ML,
there are projects which you can help.

Firstly, those are:

* theano (looks there are ~3-4 active contributors)
* numpy (parallel operations in numpy are very needed there, as well as optimization of existing code)
* scikit-learn (which in some cases lacks multi-threading)

Even minor contribution to those projects is of more help, because lots of software relies on them.
Writing wrappers to projects you're using is also a good idea.

If you still feel that you want to write a new library, spend much time with scikit-learn first.
Understand it's interface, how Bagging/AdaBoost work as meta-estimators.
How grid-search for such meta-algorithms is done.
Probably, read the sources.

Then start writing. Leave least dependencies and write simple code (using numpy or so). 
If it is required, you'll rewrite it to optimize for speed. Make sure your library is installed via package manager
(pip for python, most languages today also have their package managers).