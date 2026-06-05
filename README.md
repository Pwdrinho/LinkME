# LinkFólio ✦

Uma página de links pessoal estática inspirada no Linktree — pronta para hospedar no **GitHub Pages** gratuitamente.

## ✨ Funcionalidades

- Foto de perfil personalizada (upload local salvo no navegador)
- Nome e descrição editáveis
- Adicionar, editar, remover e **reordenar** links com drag & drop
- 40+ ícones (redes sociais, portfólio, comunicação...)
- 4 temas visuais: Dark Neon, Light Clay, Warm Dusk, Ocean Depth
- Botão de compartilhar (Web Share API + fallback copiar link)
- Validação de URL em tempo real
- 100% responsivo (mobile, tablet, desktop)
- Dados salvos no `localStorage` do navegador

## 🚀 Como hospedar no GitHub Pages

### 1. Crie um repositório no GitHub

```bash
# Na sua máquina
git init
git add .
git commit -m "feat: LinkFólio inicial"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPO.git
git push -u origin main
```

### 2. Ative o GitHub Pages

1. Acesse o repositório no GitHub
2. Clique em **Settings** → **Pages**
3. Em *Source*, selecione **Deploy from a branch**
4. Branch: `main` | Folder: `/ (root)`
5. Clique em **Save**

Após ~1 minuto, seu site estará em:
```
https://SEU_USUARIO.github.io/NOME_DO_REPO/
```

### 3. (Opcional) Domínio personalizado

Em *Settings → Pages → Custom domain*, insira seu domínio e adicione um registro CNAME no seu DNS apontando para `SEU_USUARIO.github.io`.

## 📁 Estrutura de arquivos

```
/
├── index.html   # Estrutura HTML
├── style.css    # Estilos e temas
├── app.js       # Lógica e persistência
└── README.md    # Este arquivo
```

## 💡 Dicas

- Os dados ficam salvos no **localStorage** do seu navegador. Para compartilhar configurações entre dispositivos, edite os valores `DEFAULT_PROFILE` e `DEFAULT_LINKS` em `app.js`.
- Para adicionar novos ícones, insira entradas no array `ICONS` em `app.js` usando classes do [Font Awesome 6](https://fontawesome.com/icons).

## 📄 Licença

MIT — use, adapte e distribua livremente.
