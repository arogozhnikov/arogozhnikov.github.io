---
layout: post
title:  ".new_item for python lists"
date: 2016-05-22 12:00:00
author: Alex Rogozhnikov
excerpt: an enhancement proposal for python lists
tags: 
- Python
- AppendableList
- next_value
---

Simple but neat python class `AppendableList` is introduced 
and explained in this post.

First, let me describe the situation when I need it.
 For example, take [a Lasagne tutorial](https://github.com/Lasagne/Lasagne/blob/5a009f98cb479c6c39157027de830a83462dabc0/examples/mnist.py).
 It is quite long (which pushes researchers from lasagne), but mostly filled with fairly trivial operations that make it hard to grasp everything fast.
 
Expressiveness ( = ability to write what you want to do without spending time on introducing additional entities) 
is considered to be a strong side of python.
 
But in this example it seems to me that newcomer may be lost in the jungles of computing validation quality:  

{% highlight python %}
# And a full pass over the validation data:
val_err = 0
val_acc = 0
val_batches = 0
for batch in iterate_minibatches(X_val, y_val, 500, shuffle=False):
    inputs, targets = batch
    err, acc = val_fn(inputs, targets)
    val_err += err
    val_acc += acc
    val_batches += 1

# Then we print the results for this epoch:

# < I've deleted some lines not important here >

print("  validation loss:\t\t{:.6f}".format(val_err / val_batches))
print("  validation accuracy:\t\t{:.2f} %".format(val_acc / val_batches * 100))
{% endhighlight %}


It is better to inspect original code, here I give a minor part of a function.  
Basically, we compute two measures of quality (loss value, which is called `err` here, and accuracy) 
on minibatches and average those over minibatches.

Now, how this would be done in python if there was only one metric of quality?

{% highlight python %}
validation_accuracies = [val_fn(inputs, targets) for inputs, targets
                         in iterate_minibatches(X_val, y_val, 500, shuffle=False)]
print("  validation accuracy:\t\t{:.2f} %".format(numpy.mean(validation_accuracies) * 100))
{% endhighlight %}

Less code, easier to grasp, the same amount of operations.
In particular the last line explicitly says: print averaged validation accuracies.
 
When I try to follow "pythonic way" to write this for original case with two metrics of quality, 
  I get something like:
  
{% highlight python %}
validation_losses_and_accuracies = [val_fn(inputs, targets) for inputs, targets
                                    in iterate_minibatches(X_val, y_val, 500, shuffle=False)]
validation_losses, validation_accuracies = zip(*validation_losses_and_accuracies)

print("  validation loss:\t\t{:.6f}".format(numpy.mean(validation_losses)))
print("  validation accuracy:\t\t{:.2f} %".format(numpy.mean(validation_accuracies) * 100.))
{% endhighlight %}

This code is not that bad, but required some kung-fu and may look even more scary for a python novice. 

Now let's imagine that during tuple unpacking we can append values 
to lists without storing those in intermediate variable.   
 
{% highlight python %}
validation_losses = AppendableList()
validation_accuracies = AppendableList()

for inputs, targets in iterate_minibatches(X_val, y_val, 500, shuffle=False):
    validation_losses.new_item, validation_accuracies.new_item = val_fn(inputs, targets)
    
print("  validation loss:\t\t{:.6f}".format(numpy.mean(validation_losses)))
print("  validation accuracy:\t\t{:.2f} %".format(numpy.mean(validation_accuracies) * 100.))
{% endhighlight %}

In my opinion, this solution is quite beneficial: it is quite readable and does what it is expected to do.
Also this trick interplays well with other python features. 
 

## Implementation of __AppendableList__

{% highlight python %}
class AppendableList(list):
    """
    Python list with additional property '.new_item', which supports only setting, not getting.
    
    Example: 
    >>> x = AppendableList()
    >>> x.new_item = 4
    >>> x.new_item = 2
    >>> x
    Out: [4, 2]
    
    Intended to be used during unpacking tuples.
    >>> weights, heights = AppendableList(), AppendableList()
    >>> for person in some_people_base():
    >>>     weights.new_item, heights.new_item = person.get_weight_and_height()    
    """
    
    def __setattr__(self, name, value):
        """Handling setting new_item. Pay attention, that this is only a readable property """
        if name == 'new_item':
            # appending new item to the end of list
            self.append(value)
        super(AppendableList, self).__setattr__(name, value)
        
    def __dir__(self):
        """Method to list available fields. Adding new_item"""
        return dir(list) + ['new_item']
{% endhighlight %}


## Why not split computing metrics in two different methods?
 
Splitting into separate functions should be avoided, because this will result in doubling the amount of computations.
It is crucial in the case of neural networks, since the amount of computations may be huge. 
 

## Links for python developers

1. [Beyond PEP 8 -- Best practices for beautiful intelligible code](https://www.youtube.com/watch?v=wf-BqAjZb8M)
2. [An intro to itertools](http://www.blog.pythonlibrary.org/2016/04/20/python-201-an-intro-to-itertools/)
3. Also check [an awesome page about formatting in python](https://pyformat.info/)  