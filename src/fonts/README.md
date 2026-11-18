Variable fonts (latin subset) from Fontsource, then instanced down to the
axes this site actually renders. Both licences permit modification and
neither font declares a Reserved Font Name, so the families keep their
names.

| file | axes kept | why |
| --- | --- | --- |
| `Fraunces.woff2` | `opsz 9-144` | Set at one weight (400) everywhere, so `wght` was pinned. `opsz` stays variable: the browser feeds it the rendered size, and the headline runs 36-60px. Pinning it saves 16KB and costs a 4% wider headline at 60px with visibly different letterforms. 67,304 -> 34,696 B. |
| `LibreFranklin.woff2` | `wght 400-600` | The page sets 400, 500 and 600. Narrowing beats shipping two statics (26.9KB against ~31.7KB). 29,292 -> 26,936 B. |
| `JetBrainsMono.woff2` | `wght 100-800` | Untouched. It is `preload: false` and nothing on the one-page site renders mono, so it never downloads. |

To regenerate after changing which weights the CSS uses:

```python
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
f = instancer.instantiateVariableFont(TTFont(src), {'wght': 400}, inplace=False)
f.flavor = 'woff2'; f.save(out)
```

`layout.tsx` declares the surviving range per face. If that declaration is
wider than the file, browsers synthesise the missing weights, so the two
move together.

Sources:

- Libre Franklin: SIL Open Font License 1.1 (https://github.com/impallari/Libre-Franklin)
- Fraunces: SIL Open Font License 1.1 (https://github.com/undercasetype/Fraunces)
- JetBrains Mono: SIL Open Font License 1.1 (https://github.com/JetBrains/JetBrainsMono)
