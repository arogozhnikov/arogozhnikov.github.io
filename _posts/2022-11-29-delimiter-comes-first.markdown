---
layout: post
title: Delimiter-first code
excerpt: 
date: 2022-11-29 01:00:00
author: Alex Rogozhnikov
tags: 
- delimiter
- separator

---

<style>
.alex-boxes {
    display: flex;
    justify-content: space-around;
}
.lvl1 {
    color: darkred;
}
.lvl2 {
    color: darkgreen;
}
.lvl3 {
    color: darkblue;
}
.lvl1, .lvl2, .lvl3 {
    padding-right: 2px;
}
.lvl1:before, .lvl2:before, .lvl3:before {
    content: "<lvl";
}
.lvl1:after, .lvl2:after, .lvl3:after {
    content: ">";
}
cmnt {
    /* comments */
    display: inline;
    color: #7f9f7f;
}
strn {
    /* string literals */
    display: inline;
    color: #cc9393;
}
pnct { 
    /* punctuation */
    display: inline;
    color: #41706f;
}
kwrg {
    /* kwarg */
    display: inline;
    color: #eee;
}
hngr {
    /* hanging elements - bracket / parenthesis / start of multiline */
    display: inline;
    color: #d8f;
}
caret {
    display: inline;
}
caret:after {
    content: "Ꮖ";
    color: #AAA;
}

.precode {
    background-color: #2b2b2b; 
    color: #dcdccc;
    overflow-x: visible;
}

caret:after {
    animation: blink-animation 1.5s infinite;
}
@keyframes blink-animation {
    0%  { opacity: 0.8; }
    10% { opacity: 0.4; }
    40% { opacity: 0.4; }
    50% { opacity: 0.8; }
}
</style>

## Summary

I argue for wider usage of delimiter-first in the code
  - `three friends [tic, tac, toe]` becomes `three friends ・tic ・tac ・toe`.

A new top-level syntax for programming languages is proposed to show advantages of this method.
New syntax is arguably as simple, but more consistent, better preserves visual structure and solves some issues in code formatting.


## Related: comma-first formatting

A well-known proposal is to write commas first in languages like javascript, JSON or SQL, which don't have trailing commas (JS has these days, but not the other two):

<div class="alex-boxes" markdown="1">
```sql
    -- trailing commas              
    SELECT employee_name,
      company_name,
      salary,
      state_code,
      city
    FROM `employees`
```
```sql
    -- leading commas               
    SELECT employee_name
         , company_name
         , salary
         , state_code
         , city
    FROM `employees`
```
</div>

While it is **not what I am discussing here**, there is a large overlap.
This style wasn't widely adopted, and it is interesting why.

All criticism essentially comes down to: 
1) tools can solve common issues solved by this notation
2) it is not natural / you don't write text like this.

Argument 1) is irrelevant since tools can handle any notation, even completely non-readable for human. 
Argument 2) is weak, however similarity to known things drastically simplifies adoption.

Over time, however, code culture diverged in multiple ways from 'usual writing': 
we enumerate from zero, write identifiers with underscores, don't follow usual rules for quotes, and indent code instead of writing in paragraphs.
When some tools have shown that the alternative way works, further adoption happens more easily.

More importantly, argument 2) is really broken:

<div class="alex-boxes" markdown="1">
```
    ・this version          
    ・is far more 
    ・natural
```
```
    than this version・          
    with a delimiter・
    after
```
</div>

so when it came to enumerating in a visually distinctive way, 
'usual writing' uses delimiter-first.

I want to point the source of this controversy with one more example:

<pre>
You need eggs, cheese, bread.               <span style="color: #484"># ok</span>  
You need ,eggs ,cheese ,bread.              <span style="color: #844"># sucks</span>
You need a) eggs b) cheese c) bread.        <span style="color: #484"># ok</span>
You need 1. eggs 2. cheese 3. bread.        <span style="color: #484"># ok</span>
You need ・eggs ・cheese ・bread.            <span style="color: #484"># ok</span>   
</pre>

So complains are not because delimiter-first looks wrong - in fact, it is common.
It is about commas being used as *leading* elements, not trailing - a lesson to remember.

Both argument 1) and 2) pinpoint reasons *why things the way they are*: habit and tools.
But different code examples ([SQL examples](https://hoffa.medium.com/winning-arguments-with-data-leading-with-commas-in-sql-672b3b81eac9) by Felipe Hopfa and [JS examples](https://gist.github.com/isaacs/357981) by Isaac Z. Schlueter) show benefits of delimiter-first. 

I expected to find in discussions some code examples where delimiter-last is better, but I didn't.

*Later addition:* haskell community [adopted](https://github.com/tibbe/haskell-style-guide/blob/master/haskell-style.md) leading commas in many projects, because trailing commas were not supported at first.
Later haskell got support for trailing, but now majority [votes](https://www.reddit.com/r/haskell/comments/hr5c2n/comment/fy25hpm/?utm_source=share&utm_medium=web2x&context=3) for advantages of leading commas.


## Is 'delimiter' a right word?

Delimiter (just as separator) separates items. Though there is [no consensus](https://stackoverflow.com/questions/9118769/when-to-use-the-terms-delimiter-terminator-and-separator) about it.

E.g. in `[ 1, 2, 3 ]` we have a sequence of tokens: 
```
start  item delimiter  item  delimiter   item   end
  [     1       ,        2        ,       3      ]
```

So what I'm arguing for is having a start-of-item token. 
Like this: `・1 ・2 ・3`.
Do we need to point an end of last token? As we'll see next, that's usually not the case.

We have a special word for end-of-item token: terminator, but no startinator or any similar word.
I see some irony in this *(update: find some interesting thoughts I received about this in the comments section).*

Meanwhile, I keep using the word 'delimiter' (albeit it's maybe incorrect)

## Collections in HTML

Different markup languages give some food for thought, as they commonly deal with collections.

E.g. html allows using start-of-item (`<li>`) and skipping end-of-item (`</li>`) 
```html
<ul>
    <li> first item
    <li> second item
</ul>
```

## Collections in YAML

Yaml, which focuses on a hierarchy of collections, also uses a delimiter-first approach.

```yaml
- point 1
  - point 1.1
  - point 1.2
    - point 1.2.1
    - point 1.2.2
  - point 1.3
- point 2 
```

Let me reinterpret this example. **This reinterpretation is important in further discussion**.

There are 3 delimiters: `\n-`, `\n__-` and `\n____-` (underscore = whitespace).
All three delimiters are distinct, and the whole structure now reads as


<pre>
<span class="lvl1">1</span>point 1
<span class="lvl2">2</span>point 1.1
<span class="lvl2">2</span>point 1.2
<span class="lvl3">3</span>point 1.2.1
<span class="lvl3">3</span>point 1.2.2
<span class="lvl2">2</span>point 1.3
<span class="lvl1">1</span>point 2 
</pre>

No end token needed in yaml: the last item ends when a collection ends, i.e. at a delimiter of higher level.
There is no need to know or parse anything about an internal structure between two <lvl1> tokens.

Correspondingly, the only expectation we have from contents enclosed between `<lvl2>` is 
that there are no tokens `<lvl1>` or `<lvl2>` and that's it.


Intermediate conclusion: delimiter-first is very common, 
and in markup languages it is even standard (but not in programing languages!)



## Line should start from `\n`, not end with it

This sounds mad (after many years of programming it just should), but see for yourself:

```html
Let's assume I've had some very long text ending here.

Chapter 2.
Let's learn about belonging of indentation elements to logical elements.
```

Pay attention to the blank line between last line of previous chapter and a header of new line.
Undoubtedly, blank line is a part of 'Chapter 2' logical element, 
because empty line focuses our attention on 'Chapter 2' label. 
It is not because we need to end the paragraph.

For the same reason, in html additional margins 'belong' to headers, not preceding elements.

Same for lines: *we highlight a beginning of a new line*, not an end of previous one.
Ironically, that's in the name: it is newline, not endline.


When we turn to code, the same thought is seen with this small snippet, 
where I compare normal `print` with a hypothetical `print` that outputs newline before the output:

<div class="alex-boxes" markdown="1">
<div markdown="1">
```python
print('step1. downloading', end='')
for chunk in download(...):
    print(end='.')
print() # to keep steps on separate lines

print('step2. processing', end='')
for chunk in process(...):
    print(end='.')
print() # to keep steps on separate lines
```
<center>
Code with \n auto-printed after the arguments
</center>
</div>
<div markdown="1">
```python
print('step1. downloading')              
for chunk in download(...):
    print(start='.')

print('step2. processing')
for chunk in process(...):
    print(start='.')
    
    
```
<center>
Code with \n auto-printed before the arguments
</center>
</div>
</div>



result:
```text
step1. downloading.........
step2. processing.........
```

Version of code with leading `\n` is more straightforward.

If things were the opposite way:
```text
.......step1. downloaded
.......step2. processed
```
then `\n` in the end would be more optimal, but this order is not natural.
Normally we first describe the collection, then enumerate items, not vice versa.


## Unix's newline in the end of line

Unix does not use `\n` as a delimiter of lines.
Instead, it is more of line-terminator, because file with text *should* end with `\n`.
Not doing so would break simplicity of unix tools and simplicity of definitions, see [this SO thread](https://stackoverflow.com/questions/729692/why-should-text-files-end-with-a-newline).

For layman, why newline is required in unix:
```bash
$ echo -n 'good file with newline in the end\n' && echo -n 'another good file with newline in the end\n'
good file with newline in the end
another good file with newline in the end
```

Missed newline in the first file:
```bash
$ echo -n 'bad file without newline in the end' && echo -n 'another good file with newline in the end\n'
bad file without  newline in the endanother good file with newline in the end
```
problem is in the first file, but it is the second one to get printed the wrong way.
No such misattrbution issue with newline-first. 


If it is ok to end each file with `\n`, then it is ok to start it with `\n`.

Having lines start with `\n` maintains the simplicity of unix utilities, but is a bit simpler to visualize in editor.

Imagine that in parallel universe text and binary files are different in the very first character. What a science finction we could live in!

**Do I really want to change all files to newline-first?** 
Of course not.
But I have to point that if in the course of history files were newline-first from the start, that would be a better system.

I hypothesize, that newline-last comes from unix mainframes:
when line in shell is entered, it can be passed to a mainframe for processing.
I can't confirm this, but it sounds plausible. 
If so, time has shown that to be a wrong choice: 
all the messengers these days make distinction between new line (enter) and sending messages (shift+enter).
Jupyter knows that, IDEs know that, messengers know that. Terminals still don't know that.


## Using indentation to structure code

Code indentation is available in all major languages, 
but python (and scala, F#, haskell, ...) relies on indentation to define logical structure.

And that works very well. Let's see how we can re-interpret the python code the way we did with yaml

```python
class MyClass:
    def __init__(self):
        pass
    
    def some_method(self):
        pass
```

now we reinterpret the structure with `<lvl1>=\n`,  `<lvl2>=\n____`,  `<lvl3>=\n________`.

<pre>
<span class='lvl1'>1</span>class MyClass
<span class='lvl2'>2</span>def __init__(self)
<span class='lvl3'>3</span>pass
<span class='lvl2'>2</span>
<span class='lvl2'>2</span>def some_method(self):
<span class='lvl3'>3</span>pass
</pre>

so, we see very basic organization of code is available just by looking at sequence of start tokens (which just mirrors indentation).


## Some problems with multiline strings

There are places where python allows code to 'escape' indentation:
continuation of previous line (explicit with \ or implicit with different brackets)
and multiline strings. 

Continuations are 'solvable' with code formatting tools, but not multiline literals:

```python
if True:
    print("""
    This is python's
    multiline string
    """)
```

Output (###### just shows where the line ends):

<pre class='precode'>
<cmnt>######</cmnt>
    This is python's<cmnt>######</cmnt>
    multiline string<cmnt>######</cmnt>
    <cmnt>######</cmnt>    
</pre>

To get proper output we need to break visual alignment:
```python
if True:
    print("""This is python's
multiline string
""")
    # takes effort to realize that the same block of code continues here
    return False
```

There are problems with multiline: first line, last line and indentation.
Multilines in javascript/go face all the same issues, so it is a generic problem.

I think there is a way to solve this issue too, and it will be discussed.

## Delimiter-first pseudo-python

To better demostrate how all these ideas come together, I'll imagine a new language (pseudo-python).
To focus only on syntax changes, I'll keep all other aspects of the language the same.

I will consider an artificially complicated example. It includes different arguments, list, empty list, string, multiline string, method chaining, multiline logical arithmetics, few or no arguments

Goal is to demonstrate that any wild mix is representable and does not produce mess.

<div class='alex-boxes' markdown='1'>
```python
prepare_message(
    title="Hey {}, ready for Christmas?".format(user_name),
    email=email,
    body=f"""Reminder: please clean your chimneys!

Oh, and prepare "Santa Landing Spot" on your roof

Thank you {user_name} for cooperation,\nSanta Corp.
""",
    additional_sections=[
        get_current_promotions(n_promotions=4),
        get_recent_news(),
    ],
    unsubscribe_link=generate_unsubscribe_link(
        email, 
        message=message,
        **unsubscribe_settings,
    ),
    attachments = [],
).schedule_for_submission(
    holidays_queue,
    important=user_is_santa |  user_is_deer \
     | user_previously_had_issues_with_christmas_delivery,
)

```
<pre class='precode'>
prepare_message<hngr>(</hngr>
    <pnct>,</pnct> <kwrg>title=</kwrg><strn>"Hey {}, ready for Christmas?"</strn>.format(user_name)
    <pnct>,</pnct> <kwrg>email=</kwrg>email
    <pnct>,</pnct> <kwrg>body=</kwrg><hngr>f"""</hngr>
        <strn>"Reminder: please clean your chimneys!              </strn>
        <strn>"                                                   </strn>
        <strn>"Oh, and prepare "Santa Landing Spot" on your roof  </strn>
        <strn>"                                                   </strn>
        <strn>"Thank you {<kwrg>user_name</kwrg>} for cooperation,\nSanta Corp.</strn>
    <pnct>,</pnct> additional_sections=<hngr>[</hngr>
        <pnct>,</pnct> get_current_promotions(n_promotions=4)
        <pnct>,</pnct> get_recent_news()
    <hngr>]</hngr>
    <pnct>,</pnct> unsubscribe_link=generate_unsubscribe_link<hngr>(</hngr>
        <pnct>,</pnct> email
        <pnct>,</pnct> message=message
        <pnct>,</pnct> **unsubscribe_settings
    <hngr>)</hngr>
    <pnct>,</pnct> attachments = []
<hngr>)</hngr>
<pnct>\</pnct>.schedule_for_submission<hngr>(</hngr>
    <pnct>,</pnct> holidays_queue
    <pnct>,</pnct> important=user_is_santa | user_is_deer 
      \| user_previously_had_issues_with_christmas_delivery
<hngr>)</hngr>
</pre>
</div>

I welcome you to study this example for a minute.
Structure overall did not change much. Note differences in line breaks `\` and multiline strings.


An important distinction:
leading commas get the same role as hyphens in yaml: they define structure, their position is not arbitrary. 


<div class="alex-boxes" markdown="1">
```python
# normal python
# this is legal code            
print(
    1, 
        2,
)
```
```python
# proposed
# this is incorrect code        
print(
    , 1
        , 2
)
```
</div>

In new code there is no need in closing brackets (see that yourself by staring at the code more!). <br />
So let's remove closing elements:


<div class='alex-boxes' markdown='1'>
```python
prepare_message(
    title="Hey {}, ready for Christmas?".format(user_name),
    email=email,
    body=f"""Reminder: please clean your chimneys!

Oh, and prepare "Santa Landing Spot" on your roof

Thank you {user_name} for cooperation,\nSanta Corp.
""",
    additional_sections=[
        get_current_promotions(n_promotions=4),
        get_recent_news(),
    ],
    unsubscribe_link=generate_unsubscribe_link(
        email, 
        message=message,
        **unsubscribe_settings,
    ),
    attachments = [],
).schedule_for_submission(
    holidays_queue,
    important=user_is_santa |  user_is_deer \
     | user_previously_had_issues_with_christmas_delivery,
)
```
<pre class='precode'>
prepare_message<hngr>(</hngr>
    <pnct>,</pnct> <kwrg>title=</kwrg><strn>"Hey {}, ready for Christmas?"</strn>.format(user_name)
    <pnct>,</pnct> <kwrg>email=</kwrg>email
    <pnct>,</pnct> <kwrg>body=</kwrg><hngr>f"""</hngr>
        <strn>"Reminder: please clean your chimneys!                </strn>
        <strn>"                                                     </strn>
        <strn>"Oh, and prepare "Santa Landing Spot" on your roof    </strn>
        <strn>"                                                     </strn>
        <strn>"Thank you {<kwrg>user_name</kwrg>} for cooperation,\nSanta Corp.  </strn>
    <pnct>,</pnct> additional_sections=<hngr>[</hngr>
        <pnct>,</pnct> get_current_promotions(n_promotions=4)
        <pnct>,</pnct> get_recent_news()
    <pnct>,</pnct> unsubscribe_link=generate_unsubscribe_link<hngr>(</hngr>
        <pnct>,</pnct> email
        <pnct>,</pnct> message=message
        <pnct>,</pnct> **unsubscribe_settings
    <pnct>,</pnct> attachments = []
<pnct>\</pnct>.schedule_for_submission<hngr>(</hngr>
    <pnct>,</pnct> holidays_queue
    <pnct>,</pnct> important=user_is_santa | user_is_deer 
      \| user_previously_had_issues_with_christmas_delivery
</pre>
</div>

Don't pay much attention to number of lines - denser code is a byproduct, not a goal.

Further I'll discuss several advantages of this syntax.

## New multiline strings

<pre class='precode' style='overflow-x: scroll;'>
print<hngr>(f"""</hngr>
    <strn>"This is new</strn>
    <strn>"multiline string</strn>
</pre>
output:
```
This is new
multiline string
```


Everything looks perfect, multiple issues are solved in one shot. But ... with a minor catch: that's how output looks like in raw form:
<code><cmnt>\n</cmnt>This is new<cmnt>\n</cmnt>multiline string</code> 
(i.e. it is newline-first).
Technically, one can produce newline-last outputs, but that's artificial.
See the elegance of match between delimiter-first and newline-first approach: delimiter just gets replaced with newline. That's an operation that one can visually imagine by shifting all lines to the left.

One more example:
<pre class='precode'>
print<hngr>(f"""</hngr>
    <strn>"you can place anything here: ' '' ''' " "" """ f""" etc etc.</strn>
    <cmnt># and you can put comments in the middle of multiline</cmnt>
    <strn>"multiline string can't be broken or terminated by any sequence within a line </strn>
</pre>

Now, python literals do not work like that.
```python
'''
""" and ''' should be escaped (otherwise interpreted as literal terminator)
'''


'''''
'''  # this trick (available in markdown) does not work in python
'''''
```


## New parsing

In contrast to normal python, line alone does not inform if the instruction is complete, or it should be continued on the next line. 
Parsing one more line is required to confirm that current code section is complete 
(only prefix of next line should be parsed, to be more precise).


In this approach top-level parsing is quite ignorant to language details, and it relies on the same visual cues as we humans do: parser does not need to analyze line in detail to figure out if the instruction continues or not.

Let me 'parse' this example:

```xml
Delimiter   Token class    Rest of line
            <lvl1-instr   >prepare_message(
    ,       <lvl2-item    >title="Hey {}, ready for Christmas?".format(user_name)
    ,       <lvl2-item    >email=email
    ,       <lvl2-item    >body= f"""
        "   <lvl3-literal >Reminder: please clean your chimneys!
        "   <lvl3-literal >
        "   <lvl3-literal >Oh, and prepare "Santa Landing Spot" on your roof
        "   <lvl3-literal >
        "   <lvl3-literal >Thank you {user_name} for cooperation,\nSanta Corp.
    ,       <lvl2-item    >additional_sections=[
        ,   <lvl3-item    >get_current_promotions(n_promotions=4)
        ,   <lvl3-item    >get_recent_news()
    ,       <lvl2-item    >unsubscribe_link=generate_unsubscribe_link(
        ,   <lvl3-item    >email
        ,   <lvl3-item    >message=message
        ,   <lvl3-item    >**unsubscribe_settings
    ,       <lvl2-item    >attachments = []
\           <lvl1-continue>.schedule_for_submission(
    ,       <lvl2-item    >holidays_queue
    ,       <lvl2-item    >important=user_is_santa | user_is_deer 
      \|    <lvl2-continue>| user_previously_had_issues_with_christmas_delivery
```


By looking only at the sequence of delimiters (there are several subtypes of them), 
one can deduct limits of every code block / call / literal, i.e. derive top-level structure of the program.
Parser now deals with a simpler task of checking that elements fit this pre-defined structure,
and can point places where 'structure' does not match 'content'.

Good bye old times when one deleted bracket caused complete rebuild of AST and numerous errors.



## New editing 

<div class='alex-boxes'>
<div markdown='1'>
Normal python. <br />
suppose you want to start a list of arguments
<pre class='precode'>
print(<caret></caret>)
</pre>
after you hit enter in IDE:
<pre class='precode'>
print(
    <caret></caret>
)
</pre>
then you type argument and comma. <br />
Ready to proceed
<pre class='precode'>
print(
    42,
    <caret></caret>
)
</pre>
Done? Arrow down + enter
<pre class='precode'>
print(
    42,
    43,
)
<caret></caret>
</pre>
Forgot something? <br />
Double arrow up, <br />
move cursor to end of line,<br />
enter
<pre class='precode'>
print(
    42,
    43,
    <caret></caret>
)
</pre>
</div>
&nbsp;
<div markdown='1'>
Delimiter-first pseudo-python. <br />
suppose you want to start a list of arguments
<pre class='precode'>
print(<caret></caret>)
</pre>
after you hit enter in IDE comma is auto-added:
<pre class='precode'>
print(
    , <caret></caret>

</pre>
you type only argument. <br />
Ready to preceed
<pre class='precode'>
print(
    , 42
    , <caret></caret>
</pre>
Done? Enter + shift-tab
<pre class='precode'>
print(
    , 42
    , 43 
<caret></caret>
</pre>
Forgot something?
Tab
<pre class='precode'>
print(
    , 42
    , 43 
    , <caret></caret>
</pre>
</div>
</div>


The process of editing such structures was polished with hierarchical lists in word and other text processors.

Below is an animated example from workflowy (taken from [post](https://www.process.st/take-better-notes/) by B. Brandall):
<img src='https://www.process.st/wp-content/uploads/2016/01/ezgif.com-crop-1.gif' />

Even minimalist note-taking apps these days recognize the importance of hierarchical organization. 
Their interface focuses on effectively traversing and modifying this structure.

But with code - this extremely structured and standardized pieces of linked information - we continue the game of imitation: 'hey, that's just text files, you can use notepad here!'.


## New versioning

Missing trailing commas make diffs a bit annoying because of including an additional line.

New syntax has this solved. In other aspects versioning should work the same.


## New formatting

The goal of formatting is to produce a visual code structure that is easy to read,
as if you already see all main components without reading anything.

New syntax enforces this, and leaves fewer degrees of freedom.
Writing something non-readable would be challenging... I suppose.

Role of formatters thus would be minor, or they can be skipped.


## Limitations

First, I did not try to solve following perceptual problems: 

- commas are leading, and I've mentioned that this was a problem for comma-first formatting
- open brackets without a matching pair create visual discomfort. Also my eyes already trained to focus on closing brackets, but proper color scheme seems to solve this

This post is already long, and leaving things closer to python simplifies example.
I think both points can be improved, and feel free to post your ideas on this.

Second, I intentionally focused only on improving multi-line constructs, but single-line collections were left untouched. That does not mean delimiter-first does not work there, but scale of necessary changes is just too high to justify gains. At least for now.


## If you made it this far

Wow, thank you!

I hope an adventure was interesting and slightly mind blowing.

Don't be too surprised if this proposal evokes "hey this looks wrong, just plain wrong" reaction. <br />
After all, ideas we enjoy these days: enumeration from zero, using registers in names, structural programming, mandatory formatting, 
and even python's approach to defining code blocks with indentation &mdash; 
every single one of them were met with a storm of criticism.



<br />
<br />
<br />
<br />

### Comments


- Isaac Z. Schlueter advised there is a term 'initiator', used in *"... specification discussion threads, where it's common to dig deep into the particulars of parsing semantics.  Very much a 'deep in the weeds' kind of technical term."* 
    <br /><br />
    In the context of parsing I found the word 'initiator' in several papers, and only one mention on stackoverflow, so I'll stick to using word 'delimiter'.

- Peter Hilton noticed that *"... startinators in prose usually called bullets. Some English-language style guides even treat the following punctuation as equivalent.*
    
    Brilliantly Wrong — Alex Rogozhnikov's blog about math, machine learning, programming, physics and biology.*

    Brilliantly Wrong — Alex Rogozhnikov's blog about:
    - math
    - machine learning
    - programming
    - physics
    - biology.

    *Note the bullet list’s trailing full stop (period). It’s still one punctuated sentence."*

    Indeed, name 'bullet' sounds very appropriate when discussing code written in delimiter-first style.
    From parsing side, I don't feel it's a good partner to word 'terminator'.
    <br /><br />

- Thanks to Alexander Molchanov for proofreading, improving text, and leaving comments.

