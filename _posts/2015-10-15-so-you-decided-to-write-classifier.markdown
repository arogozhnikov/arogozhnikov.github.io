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

So, you decided to write a brand new library of machine learning.
This one will be much better than everything you have seen before. 
It will be fast, easy-to-use, even-easier-to-extend, flexible, with support of multi-core computations and many more.
 
There are traditions which most of developers of ML libraries are trying to follow and
I decided to collect those together.

Most of the experience came from developing [yandex/REP](https://github.com/yandex/rep)
and browsing code / experimenting with different classifiers.

Treat this as 'awful advice collection'. 

<img src='/images/etc/bad_advice.jpg' style='margin: 20px 200px; width: 400px;' alt='bad advice ahead' />

0. __Your library is the start and end point in user's research.__
   That's the key point in doing everything bad.
   There is nothing else user should pay attention to.
   Following point is consequence of this simple rule.

1. __Never care about whether other libraries exist.__
   Why actually you shall worry that there are other libraries of machine learning and how many of them are already on the github?
   Definitely, the one written by you will be times better.
   Speed benchmarks? Forget.
   New algorithms? No, never.
   Building tests to compare accuracy on public data is also nothing but wasted time.

2. __Invent new interface.__
   Users expect the structure and examples of usage to be simple?
   Bad idea. You have studied OOP, so now you can complex APIs!
   
   Special class trainer. Special class dataset.
   Also you need class supervised dataset.
   And special class for sampling from supervised dataset. 
   
   Probably you'll never implement one more sampler, such organization of code is definitely needed for the sake of OOP.

3. __Use your own format.__ Any successful library has it's own format.
   Currently used formats are not universal. You need a new one.
   Binary formats (like HDF5, FITS and ROOT) are definitely bad, because you can't write a parser for those in 10 lines.

   There should be something special about your format.
   Like csv, but with custom separator.
   Also, you will not add column names there, since algorithm doesn't require it
   (also, I would recommend not to check number of columns at prediction time, this would allow user to make less obvious mistakes).


4. __Don't use random seed.__ At least don't do it in the way users expect. There are various options:

   1. simply never set seed, so debugging would be almost impossible. If algorithm didn't converge 10 times, that's because of a bad luck.
   2. set global random seed. Let reproducibility fail during multithreading
   3. finally, introduce a special parameter `random_seed` and ignore it. Haha!
     
   <!-- theanets, nolearn, pybrain, neurolab -->  


5. __Write in C++ or CUDA__. You heard there are other languages,
   but everyone knows that ML needs efficient implementations.
   Anything being written in C++ is the fastest possible.
   
   Don't use any vector language / tool. Code in C++ is very clear. Also ignore parallel primitives.
   
   Never use BLAS operations. Don't use numpy, theano, octave or fortran90+, otherwise other developers will be able to understand your code!
   
   <!-- PyBrain  --> 
   
   Also remember to create 'for the purposes of efficiency' a god-object and put all the data there.
   While reading your code, side programmer will not be able to get what information is used by each method.

   
6. __Write lots of logs to output!__.
   Remember the starting point? There is nothing else user shall remember of, only about your library?
   
   Every step of algorithm shall print some useless information (better if accompanied by ASCII art).
   Don't allow your algorithm to be run silently (so avoid verbosity parameter).
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
   Optimization of algorithm is an annoying process.
   It's better to use 100 machines and solve the same problem faster, right?
    
   Everyone (just everyone) today has a good cluster.
   Setting up distributed environment with same collection of libraries is very simple.
    
   Finally, there is always some user who wants 'distributed' option
   (but never will be able to use it for different reasons).

   <!-- early xgboost -->
 

10. Change interface all the time.  
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