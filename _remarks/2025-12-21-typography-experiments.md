---
layout: post
title:  "Some explorations in non-conventional typography"
date: 2025-12-20 12:00:00
author: Alex Rogozhnikov
---

Recent trip to Japan left me with many positive impressions: 
unseen politeness and thankfulness, fantastic attention to details. 

Great organization on multiple levels: from super-small rooms to huge transport hubs. 
I had very few problems navigating their (rather complicated) transport system. 

There is just one thing kept bothering me &mdash; every time I saw text. Do you see this too?

シアーミュージック 京都駅前校

A bit of context: there are 3 different types of scripts used.
One, historical, is *kanji*; two others are phonetic. 
All three can be used in one sentence, sometimes along with latin and letters.

That's probably a lot to learn, but my concern was graphic representation. I am accustomed to flow of similarly-looking letters, and niceties: kerning and ligatures.
These are absent in Japanese writings &mdash; characters are all square and take up the same amount of space. 
That's ... great actually (ha-ha you probably think differently). 
D. Knuth would never need to develop latex/metafont if his writings were Japanese.

Characters look incoherent &mdash; but that's an explicit decision to make scripts visually distinct, not an overlook. Unavoidably, this choice restricts easy font variations that one can apply to many other languages. And of course developing new Japanese font is a tough job.

So what's bothering me if not kerning and styles? Well, this:

<span style='font-size: 0.72em;'> シアーミュージック 京都駅前校 </span> <br />
<span style='font-size: 0.50em;'> シアーミュージック 京都駅前校 </span> <br />
<span style='font-size: 0.35em;'> シアーミュージック 京都駅前校 </span> <br />

Kanji has a different amount of details in it, and while other characters are always easy to distinguish, kanji *requires* using a larger font. So potential benefit of newer scripts can't be realized because of "compatibility" with historical one.
Kind of migration stories I hate, because they never end.
If, on the other hand, someone designed character sets so that kanji was ~2x wider than other characters, this step would create a tiny but consistent pressure to prefer phonetic scripts.
<!-- omitting here problems of all options with latin and letters -->

Letter `ë` in modern Russian in the process of disappearance because its position on keyboard is inconsistent. 
Slow but steady, this pressure of inconvenience drives to replacement of letter by similarly-looking `е`, which looks similar but phonetically different.

### Success story: Hangul

Japan's neighbor Korea is praised by linguists for reforming
their language: they made it more "compositional" and consistent.
Letters' shapes correspond to tongue position and letters are grouped into syllables.

Hangul chart reminds a multiplication table, with every symbol composing vowel and consonant:

![Hangul syllables](/images/etc/fonts/Hangul_Chart_2.jpg)

<small> 
Source: [wikimedia](https://commons.wikimedia.org/wiki/File:Hangul_Chart_2.jpg), CC BY SA 3.0 
</small>

(it is more complicated, one "glyph" may contain 3 or 4 letters, and old writing in South Korea is not *completely* eliminated, but that's still by far the most systematic writing system).

All of this made me thinking: is there an easy way to make our writing better?

I don't have plans to change the way others write stuff, but if I can come up with a better way to read texts myself, that could be something valuable. 

**Monospace?** Consider idea of same-size letters, is there a problem with just using monospace fonts? 
I use them all the time for coding and rarely for writing, but for reading literature text they seem like wrong choice because of all problems with kerning and uneven visual density.
In Russian, specifically, those would be several wide letters: Ж, Ш, Щ. In English, there are M, W (and "I" is too narrow). 
As a solution, wide letters can be rotated 90 degrees to fit same "portrait-like" shape.

And after briefly evaluating [Martian Mono](https://github.com/evilmartians/mono) (latin + cyrillic), I found that rendering of monospace fonts actually handles well even tough cases.

I've tried reading some sci-fi texts in mono and didn't feel any discomfort. 
When testing several book reader apps, I couldn't choose any monospace font. Oh the irony!
Some blogs I'm reading (targeted for coders) use monospace fonts, and my eyes like this.

There should be some research to confirm I'm wrong... 
ChatGPT insisted on superiority of proportional fonts but could not find any non-ancient paper to confirm this.
Not-so-aged research (2010 and later) does not detect difference in *reading speed* for *small* sentences.

Undoubtedly, there *were* strong reasons to prefer proportional fonts 50 years ago.
But today, I work with monospaced text a lot, and outcomes of same tests for me are likely different.
This research worth revisiting instead of blindly relying on results from ~1930.

<!-- With modern fonts, not old typewriter systems. -->


### Can we introduce syllabic writing to Russian?


Russian language has a clear distinction between vowels and consonants &mdash; so it is 
more suitable to experiments. (vowel letter can't produce consonant sound and vice versa)


Additional observation is that in some cases seeing just consonants is (almost) enough to read contents if you know the context.
Let's move vowels out of main line so that one could read only when necessary. 
Here is an example fragment from Winnie the Pooh that uses this strange writing:

<pre id="pre-supped">
</pre>

usual text for comparison, the same fragment:
<pre id='pre-original'>
- Эй, Пух! - закричал Пятачок. - Здорово, Пух! Ты что там делаешь?  
- Охочусь! - сказал Пух.  
- Охотишься? На кого?  
- Выслеживаю кого-то! - таинственно ответил Пух.  
Пятачок подошел к нему поближе:  
- Выслеживаешь? Кого?  
- Вот как раз об этом я все время сам себя спрашиваю, - сказал Пух. - В этом весь
вопрос: кто это?  
- А как ты думаешь, что ты ответишь на этот вопрос?  
- Придется подождать, пока я с ним встречусь, - сказал Винни-Пух. - Погляди-ка
сюда. - Он показал на снег прямо перед собой. - Что ты тут видишь?  
- Следы, - сказал Пятачок. - Отпечатки лап! - Пятачок даже взвизгнул от волнения. -
Ой, Пух! Ты думаешь... это... это... страшный Бука?!  
- Может быть, - сказал Пух. - Иногда как будто он, а иногда как будто и не он. По
следам разве угадаешь?  
Он замолчал и решительно зашагал вперед по следу, а Пятачок, помедлив минутку-
другую, побежал за ним.  
Внезапно Винни-Пух остановился и нагнулся к земле.  
- В чем дело? - спросил Пятачок.  
- Очень странная вещь, - сказал медвежонок. - Теперь тут, кажется, стало два зверя.
Вот к этому — Неизвестно Кому — подошел другой — Неизвестно Кто, и они теперь
гуляют вдвоем. Знаешь чего, Пятачок? Может быть, ты пойдешь со мной, а то вдруг
это окажутся Злые Звери?  
Пятачок мужественно почесал за ухом и сказал, что до пятницы он совершенно
свободен и с большим удовольствием пойдет с Пухом, в особенности если там
Настоящий Бука.  
- Ты хочешь сказать, если там два Настоящих Буки, - уточнил Винни-Пух, а Пятачок
сказал, что это все равно, ведь до пятницы ему совершенно нечего делать.  
И они пошли дальше вместе.  
Следы шли вокруг маленькой ольховой рощицы... и, значит, два Буки, если это были
они, тоже шли вокруг рощицы, и, понятно, Пух и Пятачок тоже пошли вокруг рощицы.  
По пути Пятачок рассказывал Винни-Пуху интересные истории из жизни своего
дедушки Посторонним В. Например, как этот дедушка лечился от ревматизма после
охоты и как он на склоне лет начал страдать одышкой, и всякие другие занятные
вещи.  
А Пух все думал, как же этот дедушка выглядит. И ему пришло в голову, что вдруг они
сейчас охотятся как раз на двух дедушек, и интересно, если они поймают этих
дедушек, можно ли будет взять хоть одного домой и держать его у себя, и что,
интересно, скажет по этому поводу Кристофер Робин.  
А следы все шли и шли перед ними...  
Вдруг Винни-Пух снова остановился как вкопанный.  
- Смотри! - закричал он шепотом и показал на снег.  
- Куда? - тоже шепотом закричал Пятачок и подскочил от страха. Но, чтобы показать,
что он подскочил не от страха, а просто так, он тут же подпрыгнул еще разика два,
как будто ему просто захотелось попрыгать.  
- Следы, - сказал Пух. - Появился третий зверь!  
- Пух, - взвизгнул Пятачок, - ты думаешь, это еще один Бука?  
- Нет, не думаю, - сказал Пух, - потому что следы совсем другие... Это, может быть,
два Буки, а один, скажем... скажем, Бяка... Или же, наоборот, два Бяки, а один,
скажем... скажем, Бука... Надо идти за ними, ничего не поделаешь.  
И они пошли дальше, начиная немного волноваться, потому что ведь эти три
Неизвестных Зверя могли оказаться Очень Страшными Зверями. И Пятачку ужасно
хотелось, чтобы его милый Дедушка Посторонним В. был бы сейчас тут, а не где-то в
неизвестном месте... А Пух думал о том, как было бы хорошо, если бы они вдруг,
совсем-совсем случайно, встретили Кристофера Робина, — конечно, просто потому,
что он, Пух, так любит Кристофера Робина!..  
И тут совершенно неожиданно Пух остановился в третий раз и облизал кончик своего
носа, потому что ему вдруг стало страшно жарко. Перед ними были следы четырех
зверей!  
- Гляди, гляди, Пятачок! Видишь? Стало три Буки и один Бяка! Еще один Бука
прибавился!..  
Да, по-видимому, так и было! Следы, правда, немного путались и перекрещивались
друг с другом, но, совершенно несомненно, это были следы четырех комплектов лап.  
- Знаешь что? - сказал Пятачок, в свою очередь, облизав кончик носа и убедившись,
что это очень мало помогает. - Знаешь что? По-моему, я что-то вспомнил. Да, да! Я
вспомнил об одном деле, которое я забыл сделать вчера, а завтра уже не успею...
В общем, мне нужно скорее пойти домой и сделать это дело.  
- Давай сделаем это после обеда, - сказал Пух, - я тебе помогу.  
- Да, понимаешь, это не такое дело, которое можно сделать после обеда, - поскорее
сказал Пятачок. - Это такое специальное утреннее дело. Его обязательно надо сделать
утром, лучше всего часов в... Который час, ты говорил?  
- Часов двенадцать, - сказал Пух, посмотрев на солнце.  
- Вот, вот, как ты сам сказал, часов в двенадцать. Точнее, от двенадцати до пяти
минут первого! Так что ты уж на меня не обижайся, а я... Ой, мама! Кто там?  
Пух посмотрел на небо, а потом, снова услышав чей-то свист, взглянул на большой дуб
и увидел кого-то на ветке.  
- Да это же Кристофер Робин! - сказал он.  
- А-а, ну тогда все в порядке, - сказал Пятачок, - с ним тебя никто не тронет. До
свиданья!  
И он побежал домой что было духу, ужасно довольный тем, что скоро окажется в
полной безопасности.  
Кристофер Робин не спеша слез с дерева.  
- Глупенький мой мишка, - сказал он, - чем это ты там занимался? Я смотрю, сначала
ты один обошел два раза вокруг этой рощицы, потом Пятачок побежал за тобой, и вы
стали ходить вдвоем... Сейчас, по-моему, вы собирались обойти ее в четвертый раз по
своим собственным следам!..  
- Минутку, - сказал Пух, подняв лапу.  
Он присел на корточки и задумался — глубоко-глубоко. Потом он приложил свою лапу
к одному следу... Потом он два раза почесал за ухом и поднялся.  
- Н-да... - сказал он. - Теперь я понял, - добавил он. - Я даже не знал, что я такой
глупый простофиля! - сказал Винни-Пух. - Я самый бестолковый медвежонок на свете!  
- Что ты! Ты самый лучший медвежонок на свете! - утешил его Кристофер Робин.  
- Правда? - спросил Пух. Он заметно утешился. И вдруг он совсем просиял: - Что ни
говори, а уже пора обедать, - сказал он. И он пошел домой обедать.
</pre>

<script>
  function is_vowel(letter) {
      return "уеыаоэяиюъь".includes(letter);
  }
  const div_t = document.getElementById("pre-supped");
  const div_origin = document.getElementById("pre-original");
  let result = [];
  let src_text = div_origin.innerText;
  for (let i = 0; i < src_text.length; i++) {
      const letter = src_text[i];
      const should_sub = is_vowel(letter) && i > 0 && !is_vowel(src_text[i - 1]) && !' \n\t'.includes(src_text[i - 1]);

      result.push(
          should_sub
          ? `<span class="subbed">${letter}</span>`
          : letter
      );
  }
  div_t.innerHTML = result.join("");
</script>
<style>
  #pre-supped, #pre-original {
    line-height: 1.0em;
    max-height: 500px;
    overflow-y: scroll;
    font-family: helvetica;
    padding: 45px;
    width: 100%;
    /* scrollbar-gutter: stable; */
  }
  .subbed{
    font-size: 0.7em;
    opacity: 0.7;
    margin-left: -2.5px;
    margin-right: -1.5px;
    top: -7.5px;
    position: relative;
    
  }
</style>

This was best-working result after a couple of experiments. 
It requires 10-20 minutes to adjust yourself to this writing, but it is readable afterwards.

In this version, a combination consonant+vowel is replaced with consonant + vowel above. 
Vowel letter preceded by another vowel or space is not modified. 
A couple of sound-modifiers were also treated as vowels.

This version probably saves a tiny bit of space, and not too hard to switch to; 
its usefulness is limited because a number of vowels still should be kept on the main line.

Something should be done to vowels though &mdash; there should be a more compact form to encode 12 characters.
One option is diacritics-like modifications (above/below the consonant).
Other options is space-efficient vertical symbols. 
When tinkering about this, I was 'rediscovering' korean vowels &mdash; it is indeed natural to add a vertical line and 'attach' a branch at some position.




<!-- 
It would be nice though if I did not need to introduce a line, but used one that is already there - but alas, consonants have all kinds of shapes, and there is no good position that will work for all of them.


### Hawaiian alphabet

Hawaiian culture (as other 'isolated' cultures) has some interesting moments.
One of them is their alphabet &mdash; they didn't have one, and modern version is this:

5 vowels: `A E I O U` + 8 consonants `H K L M N P W ʻ` (last character is glottal stop) 
-->



<!-- 
Experiments with non-stroke letters. Didn't work well because those aren't strokes. Ruling out visual reasons. 
-->







<br />

<br />

<center>👋</center>

<br />

<br />
