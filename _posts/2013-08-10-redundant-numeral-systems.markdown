---
layout: post
title: Redundant numeral systems
date: '2013-08-10T03:48:00.002-07:00'
author: Alex Rogozhnikov
tags:
- Ternary system
- Numeral systems
modified_time: '2013-08-10T08:51:10.135-07:00'
blogger_id: tag:blogger.com,1999:blog-307916792578626510.post-9218234649432151124
blogger_orig_url: http://brilliantlywrong.blogspot.com/2013/08/redundant-numeral-systems.html
---

This post is tightly connected to the [previous]({% post_url 2013-08-10-soviet-computer %}) about number representation in "Сетунь" computer.

As I stressed, the integer number can be represented in the unique way in most numeral systems, including such specific like that used in computer "Сетунь". But there are such systems called redundant where representation is non-unique and in fact this can be very helpful for computations.

Let us start from classical example - Fibonacci redundant numeral system. The number is represented as

$$ x = a_0 F_0 + a_1 F_1 + a_2 F_2 + ... + a_n F_n$$

Where $F_0 = 1, F_1 = 2, F_n = F_{n-1} + F_{n-2}$ are Fibbonacci numbers which I am sure you heard of many times. It is quite easy to prove that each natural number can be represented as a sum of several different Fibonacci numbers.

**Exercise#1**. Prove it.

This fact gives the following knowledge: each natural number can be written in the Fibonacci System with coefficients $a_i$ equal to 0 or 1.

As you can see, most numbers can be written in several ways. Here is a table of values for the first sequences.

```
a3 a2 a1 a0    result
 0  0  0  0    0
 0  0  0  1    1
 0  0  1  0    2
 0  0  1  1    3
 0  1  0  0    3
 0  1  0  1    4
 0  1  1  0    5
 0  1  1  1    6
 1  0  0  0    5
 1  0  0  1    6
 1  0  1  0    7
 1  0  1  1    8
 1  1  0  0    8
 1  1  0  1    9
 1  1  1  0   10
 1  1  1  1   11
```

The interesting question is can we name the only representation - the best one for each number? For the Fibonacci systems the answer is known - yes. One can prove that there is the only representation of each number without successive ones. At least, you can prove there exists one (this is the solution of first exercise). Proving the uniqueness is bit more tricky.

There is a simple article about redundant systems [in english](http://pi.314159.ru/butler1.pdf) (and here you can find its translation [into russian](http://pi.314159.ru/butler1.htm))

### What about advantages of redundant systems?

There is one of fundamental ideas in algorithmics courses, which doesn't have some special name, but many structures inspired by it. Balancing trees, many different heaps, B-trees, hash arrays and so on.

The idea is very simple: instead of having the only possible state the structure may have several different possible states and that would make many operations *much* faster by the cost of slowing the other operations.

The main operations we are interested in when dealing with integers are addition and multiplication. Addition in standard binary system is **slow**.

For instance, you want to compute the following sum

```
  11010010100101
+ 00101101011011
----------------
 X??????????????
```

Obviously you can't compute the first digit (I denoted it by X) until you looked at all the digits in both numbers, thus the time you spend can't be less then $\log (n)$, where $n$ is the number of digits in summands.

The problem is curry. It can propagate along many digits like in the example given ahead. Redundant systems can fight this problem, let me show how.

Now I want to tell a bit about the thing I occasionally invented while writing about Setun computer. As usual it [was invented](http://www.csee.umbc.edu/~phatak/publications/hsdtrc.pdf) in good time before me, but the idea is still interesting. Well, the idea is to use the digits -1, 0 and 1 in binary numeral system, i.e.

$$ x = a_0 + 2 a_1 + 4 a_2 + ... + 2^n a_n$$

where $a_i$ is 1, 0 or ! (which is my notion for -1, that's due to blogger's editor :\, usually $\overline{1}$ is used). This system is of course redundant, because (check this!)

$$ 1 = 1! = 1!! = 1!!! = ... $$

The first advantage of this system you should have already guessed. Negative integers are written in the same way as positive ones, without 2-complement representation and thus no workarounds for multiplication is needed. The second benefit we obtained is simplicity of negation.

Another frequently used operation is comparison, the comparison of two numbers can't be done simply by comparing digits one-by-one. But in practice only comparison with zero is usually used. To compare $a$ and $b$, their difference $a-b$ is computed and the last one compared to zero. Comparison with zero can be performed very easy: the sign of the whole number in this system is equal to the sign of the first nonzero digit, if there is such.  
**Exercise#2**. Prove this assertion

The most important moment. Addition and subtraction. Subtraction $a-b$ is just the same as $a+(-b)$, thus it is implemented using negation which is fast and addition. Addition in the redundant system under consideration is *both simple and fast*. It takes constant time no matter how long summands are. Just think of it. **Adding arbitrary long numbers in a constant time**.

How it works. First try to add some numbers for practice

```
  1011!
+ 01!1!
```

Now you understand the curry can be 1, 0 or -1. Look at the situation below:

```
  ..10..
+ ..01..
```

What is the curry that will come from the red digits? There are two possible cases: 0 and 1, but not -1. If we write 1+0=1

```
  ..10..
+ ..01..
------------
  ..1...
```

and the curry would be 1, we will get the curry propagation, we will have to add once again. Instead, we would write 1+0 = 1!, 1 in the curry and -1 in the sum. After adding -1 and the curry from red digits we wouldn't obtain new curry and the process will stop.

So an addition contains of two steps. On the first for each digit we compute sum and curry, on the second step we just add curries. Due to the way we summed on the first step we wouldn't have new curries.

There are several assertions (more or less obvious) that make the reasoning rigorous:  
Knowing only previous digits of summands, one can predict the curry, one of the cases 1 or -1 will be impossible. To be more precise, there are three cases.

1. Curry can be only 0.
2. Curry is 0 or 1.
3. Curry is 0 or -1.

Knowing that the curry can't be -1, we can add two digits so that sum will be X! or X0 (X is some curry).  
Knowing that the curry can't be 1, we can add two digits so that sum will be X1 or X0 (X is some curry).

That's all. Each half-adder should know the current digits and the previous ones to predict the curry. Just some examples

```
        1001011
      + 0110101
      ---------
curry  1111111
sum     !!!!!!0
      ---------
result 10000000
```

```
        1001011
      + 0110100
      ---------
curry  1111110
sum     !!!!!!1
      ---------
result 100000!1
```

```
        00!0!11!0!!01
      + 1!0!11!00!0!1
       --------------
curry  0!!001000!!01
sum     111!000!001!0
       --------------
result 0001!100!!!100
```

Note that addition adding curry and sum is performed digit-by-digit, which is very fast and simple. I hope you enjoyed how simple it was, but there is one detail I intentionally hidden. You can get overflow when computing 1+1 :) for instance, you have 8-digit arithmetic. As you remember, 1 = 1!!!!!!!

```
   1!!!!!!!
+  1!!!!!!!
-----------
  1!!!!!!!0
```

This problem can be solved rather easy, try to invent the solution on your own.
