---
layout: post
title: Soviet computer "Сетунь"
date: '2013-08-10T01:07:00.003-07:00'
author: Alex Rogozhnikov
tags:
- Ternary system
- Numeral systems
- P-adic numbers
modified_time: '2013-08-12T10:09:07.333-07:00'
blogger_id: tag:blogger.com,1999:blog-307916792578626510.post-1896284940006213721
blogger_orig_url: http://brilliantlywrong.blogspot.com/2013/08/soviet-computer.html
---

P-adic numbers and numeric systems turned out to be very fruitful theme, and this post continues developing the ideas touched in the previous [two]({% post_url 2013-07-21-real-numbers-and-naturalness-part-1 %}) [articles]({% post_url 2013-07-22-numbers-and-naturalness-part-2 %}).

It's a common knowledge that all computers have a binary representation of numbers inside in accordance with [von Neumann principles](http://en.wikipedia.org/wiki/Von_Neumann_architecture). Right?

Nope. There was computer that had inside ternary representation, this computer was developed in the USSR in 1958 at my alma mater faculty under the lead of Nikolay Petrovich Brusentsov. The computer was named „Setun” (Сетунь). Unfortunately all of the innovative ideas it was based on were buried, and computer industry followed the way we know today. But the history keeps these ideas for us, and some people (including me) believe that once these ideas would be used in industry again.

Let us start from ternary representation. The integer in radix-3 is represented as a finite sequence of digits from 0 to 2. Something like

```
21201
-1220
0
111012
```

Right?

Nope. Well, that what we are so accustomed to, but that is not the only way. And definitely not the best one. I mentioned the 2-complement representation of negative integers that is used in modern computers. Now compare it with the trick. Let us use not digits 0,1,2 but 0, 1 and -1. This is called balanced ternary system. This would give the following representation for numbers (hereinafter I will write ! to denote -1, because blogger fails to represent usual $\overline{1}$)

```
1!1 = 9-3+1=7
11 = 4
10 = 3
1! = 2
01 = 1
00 = 0
0! = 1
!1 = -2
!0 = -3
!! = -4
```

Each number has the only representation, as usual. Note the symmetry of representation under negation (isn't it awesome?). Moreover, there is no global sign 'minus', all integer numbers are represented in some universal form!

There is one minor drawback: addition rules are a bit more complicated. For instance

```
  1
+ 1
---
 1!
```

It doesn't play any role when implementing in microchip. But let's now take a look at multiplication. Usual binary representation has a great advantage in multiplication that all results in multiplication table are of one digit. Compare it with 'usual' radix-3 multiplication table.

```
  | 0  1  2
--------------
0 | 0  0  0
1 | 0  1  2
2 | 0  2 11
```

The 11 in the last row gives us unwanted curry we would have to take in account while implementing it in microchip.  
BUT the numeral system implemented in „Сетунь” doesn't have this drawback. Seems that it is the only non-binary system that doesn't have curry in multiplication:

```
  | 0  1  !
----------------
0 | 0  0  0
1 | 0  1  !
! | 0  !  1
```

What about other advantages? First is we need less digits to hold the same numbers. The ternary system is considered to be the most effective numeral system in the the sense of coding density (derivation of this fact can be found in Russian [here](http://trinary.ru/kb/04b1e68c-7add-426d-bed3-a0dab0ec452d/%D0%AD%D0%BA%D0%BE%D0%BD%D0%BE%D0%BC%D0%B8%D1%87%D0%BD%D0%BE%D1%81%D1%82%D1%8C%20%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%20%D1%81%D1%87%D0%B8%D1%81%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F), but to tell the truth I don't consider this assertion to be right at all, the term „effective” is very disputable. The same information can be found on [wikipedia](http://en.wikipedia.org/wiki/Radix_economy), but still no answer for the question: why do we think that digit costs proportionally to the numeral system base?).

The negation in this system is extremely simple, moreover it is always correct.

Yes, the negation is incorrect operation sometimes in usual binary system. If you take $x = -2^{31}$ (assuming x is 32-bit integer), I think you would be surprised find out that $x == -x$. This is due to the asymmetry of the interval of possible values.

Some disadvantage is you can't distinguish whether the number is negative or not by simply looking at the first bit. Comparison procedure is more complex, but multiplication operation doesn't need some workarounds to work with negative numbers.

### Back to p-adic numbers

One of the most important properties of real numbers is that they are ordered, that is we have comparison operation. There is much interesting connected with ordering if real numbers, once I will return to this topic.  
Before reading further, I want you to think on the following problem: is there some natural ordering of p-adic numbers?

Think.

Well, the first idea is of course to use lexicographical ordering, but the numbers should be compared from the rightest digits.

For instance the following 7-adic numbers are ordered by ascending

```
...3515400.0
...0050250.0
...6425443.0
...6625443.0
...0000543.0
...0000000.01
```

Until this moment everything looks fine, but we forgot that the ordering by itself isn't needed (remember that we can order any set?) until it is not connected somehow with other operations. For instance, for real numbers we have

a > b iff a+c > b+c for every a,b,c.

**Exercise#1.** Show that this doesn't hold for p-adic numbers, even for p-adic integers, with such ordering.

Let's now talk about another way to believe that there is no simple ordering rule.

I wrote about understanding p-adic integers as the inverse limit of residues. As we know already the group of residues modulo 3 may be represented not only by 0,1 and 2, but also by the set -1, 0, 1. This fact gives rise to another representation of 3-adic integers as infinite sequences of these three digits.

I'd rather start from some examples with integers

```
Decimal  Ternary     Balanced ternary
0        ...00000.0  ...00000.0
2/3      ...00000.2  ...00001.!
2        ...00002.0  ...0001!.0
-1       ...22222.0  ...0000!.0
-5       ...22211.0  ...001!!.0
```

Note that all integer numbers, including negative, have the infinite number of zero digits to the left. Looks much better, to my mind.

Of course, every 3-adic integer should have the corresponding representation in balanced ternary system and visa versa.

**Exercise#2.** Find out the conversion rules between these two 3-adic systems. Rigorify the answer by using the inverse limit of residues. Hint: look at the third and fourth lines of conversion table.

All the p-adic numbers are obtained by multiplying p-adic integers by $p^{-k}$, that is by shifting the sequences, thus we got the representation for all 3-adic numbers, not only integer ones.

Pros of symmetrization for 3-adic numbers are just the same: simplicity of negation, no curries at multiplication table.

But let's return to the point we started from — we wanted to order p-adic numbers. The non uniqueness of the representation which seems very natural for 3-adic numbers, makes me believe that there is no appropriate lexicographical ordering or other simple way to order them. Just take a look again at the conversion table.
