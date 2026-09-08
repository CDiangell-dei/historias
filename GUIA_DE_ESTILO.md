# 📜 Guia de Estilo e Padronização Editorial

Este guia define as regras oficiais de formatação, tipografia e estrutura para todas as histórias, fanfictions e capítulos mantidos neste repositório.

---

## 1. 💬 Diálogos e Tipografia de Voz

* **Falas Normais (Voz Alta):** Utilizar sempre o travessão verdadeiro de diálogo (`—`, *em-dash*) com espaçamento correto:
  > *— Kenichi... você realmente acha que vamos encontrar nosso filho? — a voz dela saiu embargada.*

* **Pensamentos Internos:** Destacados em *itálico* com aspas simples:
  > *‘O Subaru realmente merece alguns tapinhas na cabeça por ser um garoto inteligente...’*

* **Comunicação Telepática, Entidades ou Vozes Sobrenaturais:** Destacadas em *itálico* com aspas angulares (`«...»`):
  > *«Ele vai tentar, é claro. A pequena espírito tem o conhecimento necessário...»*  
  > *«Não. O meu Subaru já passou por sofrimento demais.»*

---

## 2. ✨ Magias, Autoridades e Técnicas de Combate

Para transmitir o peso e a solenidade típicos de *Re:Zero*, termos mágicos, autoridades e estilos de luta recebem destaque com aspas angulares em negrito:
* **Magias e Feitiços:** **«Al Kettan»**, **«Al Shamac»**, **«Al Minya»**, **«Murak»**, **«Shamac»**
* **Autoridades e Pecados:** **«Autoridade da Inveja»**, **«Mãos Ocultas»**, **«Cor Leonis»**
* **Estilos e Técnicas:** **«Estilo Astrea»**

---

## 3. 📍 Marcadores de Cena e Ponto de Vista (POV)

Sempre que houver troca de local, salto temporal ou mudança de ponto de vista, utilizar a linha horizontal completa (`---`) seguida pelo identificador em negrito entre colchetes:

```markdown
---

**[Localização — Subdivisão ou Foco da Cena]**
```

*Exemplos:*
* `**[Chiba, Japão — Residência da Família Natsuki]**`
* `**[Lugunica — Mansão Miload / Pátio Externo]**`
* `**[O Selo da Bruxa — Dimensão das Sombras]**`
* `**[Lugunica — Clareira da Floresta de Elior]**`

---

## 4. 📜 Citações, Cartas e Pactos

Para cartas, pergaminhos de pacto, livros sagrados ou reflexões metafísicas profundas, utilizar o bloco de citação do Markdown (`>`):
> *“Aquele que tenta barganhar com todas acaba sem alma para oferecer a nenhuma.”*

---

## 5. 📂 Estrutura de Arquivos

* Cada história possui sua pasta própria.
* Capítulos individuais recebem nomes numerados e com títulos temáticos:
  * Exemplo: `1 - Mudança Térmica.md`
  * Exemplo: `2 - O Doce Despertar das Estrelas.md`
* O topo de cada capítulo deve conter o cabeçalho padronizado:

```markdown
# [Nome da História]

**Autor:** CDiangell  
**Universo:** Re:Zero Starting Life in Another World  
**Personagens:** [Lista de Personagens]  

---

## Capítulo [X]: [Título do Capítulo]

---
```
---

## 6. 🌐 Exportação Automática para AO3 (Archive of Our Own)

Para postar capítulos no AO3 com formatação perfeita e sem erros de espaçamento:
* O script [`recursos/export_ao3.py`](recursos/export_ao3.py) converte o capítulo `.md` diretamente para um arquivo `.html` limpo.
* **Transformações aplicadas:**
  * Remove o cabeçalho inicial de rascunho (pois o AO3 já possui campos dedicados de título, autor e fandom).
  * `---` vira `<hr />`.
  * `**[...]**` vira `<h4>[...]</h4>` (título de cena oficial do AO3).
  * `>` vira `<blockquote><p>...</p></blockquote>`.
  * Negritos e itálicos viram `<strong>` e `<em>`.
  * Parágrafos são envolvidos em `<p>...</p>`.
* **Como usar:** Basta copiar todo o conteúdo do arquivo `(AO3).html` gerado e colar diretamente na aba **HTML** do editor do AO3.
