---
layout: post
title: Delimiter-first code, part 2
excerpt: 
date: 2023-01-10 12:00:00
author: Alex Rogozhnikov
tags: 
- delimiter
- separator

---

<!--- styles are copied from previous post --->

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



## Question that I try to cover here:

- reiterate benefits of delimiter-first code
- why I don't expect existing languages to adopt it 
- what would be the practical guide for a new language?
  

## Let's reiterate some points:

- structure of delimiter-first code is *strictly* determined by indentation (i.e. visual structure maps to syntax tree). 
  In most languages there is no correspondence by default, which is later partially enforced by formatters.
  In python, it is mostly determined, but not completely: different ways to escape indentation rules and multiline strings.
  I've demonstrated these cases are solvable by proposing a syntax with delimiter-first code.


- putting delimiter *in the end* introduces zig-zag reading:
  indentation is on the left, but commas or semicolons are on the right.
  In practice we usually just follow indentation and don't pay much attention to the right side.
  Delimiter-first has this solved by design.

- better editing, better code analysis, and better code completion.
  These parts that seem logical to me, but to really prove the point, we need to create such a system.


## Different faces of delimiter-first code

- haskell, elm, ocaml
  elm https://elm-lang.org/docs/style-guide
  ocaml https://github.com/ocaml-ppx/ocamlformat/blob/main/test/failing/gen/gen.ml

- coffeescript and civet - just mention, maybe some screenshots

- formulas in latex (leslie lamport and formulas https://www.hpl.hp.com/techreports/Compaq-DEC/SRC-RR-119.pdf)

- mention Knuth quote. https://jeremyhylton.blogspot.com/2006/06/using-indentation-to-represent-program.html

## So why I am so skeptical of introducing this into existing languages

Lisp community is a perfect example to see why this won't work.

There are several suggestions for introducing indentation, but neither were successful.
lisp proposals, more (Via Nikishkin) 
    https://srfi.schemers.org/srfi-49/
    https://srfi.schemers.org/srfi-110/
one more version of lisp:
    http://calcit-lang.org/

Farther of lisp himself tried and dropped the ball. 
Some suggestions are very well-designed, but neither got any traction.

For the outsider, this looks much friendlier and simpler to read.
After all, neither was really adopted.

https://shaunlebron.github.io/parinfer/

Parinfer worth looking at for its neat demonstration of how parenthesizing and indentation are basically parallel,
and there is no difference for what you edit, however...

It is really hard to push some society into changing habits (like goto in fortran coding practice was present for decades).

also: https://en.wikipedia.org/wiki/Structure_editor

Another example: comma-first in node repo, after all they switched to comma-last because of conflict of styles with v8.


## Why YAML isn't a good example for languages?

YAML looks originally simple, but under the hood it is much messier than it may sound.

https://www.arp242.net/yaml-config.html

However, an important part of YAML story for me is their grammar rules.


## Lack of tools to work with delimiter-first code

We write tools, but then tools shape our work.
Current set of tools (e.g. yacc/lex) was written for grammars.
Grammars were developed as a mathematical tool to describe syntax, and used to generate parsers.

For example, previously mentioned civet and coffeescript lack real tooling support.
Transpilation is simplest part, but many other components needed for developer experience
- as that's an easier part of language design, 
while hard part is 
1) autosuggestion
2) syntax highlight and informative highlighting oof errors with the helpful error description  

However, notation and tools were originally developed to deal with the on-the-line syntax that we 
derived from usual writing. I.e. how to parse something like this:

```
let variable = f(a + b * c[index + 1])
```

So we're locked in self-reinforcing loop to create more tools based on these grammars:
existing tools -> students learn them -> later use them to define languages -> more students learn the grammar.


- grammar tools are created to work with nesting brackets, code, constructs.
  But there is no tool to deal with delimiter of n-th level in common language constructs.

- how python deals with the problem: mostly sweeps under the rug and introduces operations indent/dedent, 
  effectively putting everything into normal grammars (reference to the formal grammar of python).
  Also, line-continuations are also ignored and just considered 'merged'. 
  Unavoidably, this approach runs into problems with multiline strings that I discussed in previous post.

  So let me get to this one last time: grammars do not talk in indentation or structure, 
  and thus don't provide a tool to create reader-friendly languages.

- YAML went down the rabbit hole and extended grammar to be parametrized.
  Main parameters are c, n (context and indentation)
  Example from documentation.

- solution is to completely separate tree parsing from low-level parsing. 
  Maybe allow parsing to partial tree or partial tree with 'broken' tag.

- grammars are not gone, as on-the-line syntax is likely to stay the same

- minor part: visually verbalize multi-line constructs.


There is no formal grammar to describe this:

lvl-n block for comment 
lvl-n block for multiline string
lvl-n block for instructions
lvl-n block for sequence
lvl-n block for dict
lvl-n block for function arguments


constructs:

do
while
match

lvl-n instruction = delim n + one of cases

list = inline list | [ <multiline block of expressions n+1> $




```

treenode = (line | children)+

Children = treenode+


def parse_to_tree_with_lines(text) -> Tree:

def communicate_types_down(Tree) -> TypedTree:

def parse_to_expressions(list[treenode]) -> :


How changes appear in this model?

- node is added, propagation starts from this node
- node is deleted, in this case propagation starts from the parent
- node is moved.

A valuable part could be cache from the previous run for every node.
Basically, we can just have a number of flags to invalidate results. 
And to claim "these properties have changed and thus need to trigger recomputation".


```

# TODO 

- top-level delimiters like file, chapter, subchapter - like ones in TOML

- allow different visual representations for the same structure. Basically online <> multiline.