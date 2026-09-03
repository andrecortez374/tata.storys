# Tata Storys

Site autoral em HTML, CSS e JavaScript puro, preparado para GitHub Pages.

## Configuração principal

Abra `script.js` e edite somente o objeto `TATA_CONFIG`:

```js
const TATA_CONFIG = {
  brand: "Tata Storys",
  owner: "Thamires Santos",
  whatsapp: "",
  instagram: "",
  tiktok: ""
};
```

O WhatsApp deve ser informado com DDI + DDD + número, sem espaços ou símbolos.

## Produtos

Cadastre somente produtos reais no array `PRODUCTS` em `script.js`.

Não invente preços, tamanhos, materiais, estoque ou benefícios.

## Imagens

- `assets/images/`: fotos reais/autorizadas de produtos, portfólio e comparações.
- `assets/icons/`: SVGs e ícones próprios/licenciados.

Prefira WebP ou AVIF para manter o carregamento leve.

## Calculadora

A calculadora está propositalmente desativada até existir uma regra comercial real. Configure `CALCULATOR_CONFIG` somente quando houver fórmula e dados reais.

## GitHub Pages

Em GitHub: `Settings` → `Pages` → `Deploy from a branch` → branch `main` → `/ (root)` → `Save`.

A URL esperada, quando o Pages estiver ativo, é:

`https://andrecortez374.github.io/tata.storys/`

## Segurança e conteúdo

Não inserir chaves privadas, senhas ou tokens no JavaScript. O site não faz alegações médicas, não inventa resultados corporais e não utiliza depoimentos fictícios.
