---
layout: post
title:  "Numbers that lie to you"
excerpt: "Either you don't understand what they mean or how those were cooked."
date: 2020-02-01 12:00:00
author: Alex Rogozhnikov
tags: 
- Stats
- Life
- Analysis
---

Either you don't understand what they mean or how those were cooked.

- Scientists achieved 92% quality in the problem of ...
- Our system filters out 99% of spam ...
- New vaccine/technique is N% more efficient than ...
- (updated) COVID-19 mortality rate is X - this perfect example appeared after the post was written

This post-informational world is complicated. 
We desperately need ways to receive and analyze less information to make judgements, 
and here they are &mdash; simple numbers that help us with decisions.

However, **connecting numbers and real things is surprisingly hard**.
And producing just *some* numbers is times easier. 
Most shocking numbers are spread ny media but almost never checked.

Let's talk in examples.

### Example: surveys

Surveys are perfect tool for newsmakers:
- 76% of people are not aware that ...
- 82% support new initiative ...

Ok, first question. After these claims were announced in media, *do numbers stay the same*? 
Paradox: this fact after being declared in news is already wrong (even if it was correct before), 
because people tend to agree with majority (while considering themselves smarter than majority).

But how do you measure that percent? Surveys/polls are extremely tough to conduct well. 

- many people refuse participating (and that's correlated to life setting and choices)
- people frequently don't answer what they think (even if there is no pressure on them, they may answer 'the way that sounds right')
  - if you ask in poll about salary, you'll get significantly higher average compared to national stats bureau `¯\_(ツ)_/¯`
- do you encounter that opinion on current affairs can change after each news episode?
- children are counted? seniors? imprisoned? expats? immigrants? 
- what is the way you posed the question? Question itself already biases the answer.
  - For example, let's take [a funny survey about chemophobia](https://www.nature.com/articles/s41557-019-0377-8) that was published in nature chemistry (???).
    - 30% of Europeans report being "scared" of chemicals
    - about 40% try to "avoid contact with chemical substances" and want to "live in a world where chemical substances don't exist."
  - Now, what if you don't mention chemicals, and ask people what kind of stuff society needs to get rid off, very few will mention chemicals
    - but shitty media will be in the list ;)
- not only question matters, but the whole context of discussion is important
  - there is a simple way to artificially raise someone's ratings. Say, politician X puts topic Y at the center of his program and speeches. He is known for this (and only for this).
    So if you ask interviewee first about topic Y, that will probably remind about politician X. Right after that interviewee is asked: "which politicians you're ...", and chances of X being mentioned increase significantly.  
- how polling base was collected? (Typically, many ways combined) How misrepresentation was compensated? What is the reference distribution (e.g. of age)?
- how do you detect interviewer's mistakes? fake data? 

Have you ever heard media to discuss the way a particular number from poll was received? 
Many years ago I heard frequently remarks like 'people in age from X to Y were surveyed in regions ...', but no mentions nowadays. Only endless percentages.

Companies that run surveys publish their protocol, but that's only a part of the story. <br/>
Common benchmark for such companies are elections. How often elections' results coincide with polls? Why?  

### Example: face recognition system

Suppose you simply want reliable face recognition system, and don't care about money and speed. 

Sounds simple. Independent benchmark says the system of your choice has an accuracy of 99.9%. Impressive, right? Wait.

- what does 'accuracy' mean? Is it verification (e.g. of device owner) or recognition (finding correct person in the database)?
- if second, how many people are there in the database? 100? 1'000? 1'000'000?
  - do we assume that person we are recognizing is picked during tests uniformly from the database?  
- if we know size of the database, which photos are there? On the street? At home? What's light conditions? 
  - these questions apply both to images in the database and to images you will recognize from.
  - oh, and don't forget about image/camera quality 
- quality drops when person does not look straight at the camera. How significant is this drop in quality depending on angle?
- what ethnicities are there in the database? Do they cover all your cases of interest?
- how much data do you need to identify a person?
- glasses? makeup? should I update images in the database each year? Twins are considered the same person or not? 

Reports of some [professional independent comparisons](https://www.nist.gov/programs-projects/face-recognition-vendor-test-frvt) 
of face recognition systems include dozens of plots.  

... hey, do you want to talk about speech recognition? That's not simpler

Cases when everything sounds quantifiable turn out to be already quite complicated.


### Another example: spam detection system

"Our spam detection system correctly classifies 99% of messages!" - sales person says.

Consider this as a practice for your scepticism. Or keep reading. But better first try to collect questions about this number.

- Does it mean there are 99% of spam and 1% of ham, and everything put into spam folder?
  - or maybe it is only 1% percent of spam ond everything lands in your inbox?
  - so, we need to start from [TPR, FRP, curves](http://arogozhnikov.github.io/2015/10/05/roc-curve.html) and relative rates of spam?
  - do you think those rates will be the same in your case? Some people/companies get lots of spam, some don't
- False negatives are messages from your relatives or maybe from your colleagues? Or some newsletters you don't mind to receive?
- Languages the system supports. 'English' is not an answer, there are many dialects on this planet.
- Hey, you know, those sites I left by mistake my address three years ago, they keep sending me stuff, do I you consider that spam?
- What is spam after all?
  - Think about this question. To claim numbers you need definition
- How do you get ground truth for what is spam?
  - user's labels would be so dirty you will never get high numbers there. But those can be useful for training anyway
  - spammers can also be among users of your system and label things intentionally wrong
  - is it representative at all?
- Spam sent next month will be targeted to trick current systems. Why good results in the past can be a justification for good results in future?

There are more in-depth questions, that require diving deeper, but you already got it. 

## Reacting to numbers

<img src="/images/etc/pile_of_numbers.jpg"  width="600"> 

<small>Image source: <a href="https://pixabay.com/illustrations/pay-digit-number-fill-count-mass-1036470/">pixabay.com</a></small>

News shoot numbers at you. Ads claim more numbers. Presentations bury you in numbers. 

- Soap X kills 99% of bacteria
- Two doses of X is more than 90% effective at preventing disease ...
- Batteries X work up to 10 times longer
- Average income increased by N%
- X is clinically shown to improve attentiveness by nearly 20%.
- Our support resolves N% of issues within 12 hours
- Average price on the market is ...
- New display can show N billion colors!
- X fights disease symptoms 50% faster then other medications
- University rankings, school rankings &mdash; what's this they compare? Why formulae are readjusted each year?
- etc.

Do you really understand what those mean and how useful they are? Can you connect number with an effect or reason in real world?

## Conclusion

Numbers sound like facts. <br />
Numbers make presentations sound convincing. <br />
Numbers give us impression of general insight into situation. <br />
<!-- Insight drives decisions. -->

That's only an illusion.

Numbers have story and context, discovering those breaks an illusion of simplicity but gives number a meaning.

## More

- Darrell Huff, How to lie with statistics
