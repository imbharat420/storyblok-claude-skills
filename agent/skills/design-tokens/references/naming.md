# Token naming and shadcn compatibility
| Role | Use | shadcn name |
| --- | --- | --- |
| background / foreground | page | background / foreground |
| primary / primary-foreground | main CTA, links | primary |
| secondary | secondary CTA | secondary |
| muted / muted-foreground | subdued surfaces and text | muted |
| accent | highlights, badges | accent |
| border | dividers, input borders | border |
| ring | focus ring | ring |
| destructive / success / warning | feedback | destructive (+ custom) |
Rule: never name a token after its colour (`blue-500`); name it after its role. Editors never see these names; they see `tone: default | muted | accent | inverse`.
