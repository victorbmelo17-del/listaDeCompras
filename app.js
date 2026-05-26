/* ====================================================================
   LISTA DE COMPRAS - JavaScript
   
   Conceitos Utilizados:
   - localStorage (persistência de dados)
   - Manipulação do DOM (querySelector, createElement, etc)
   - Eventos (addEventListener, onchange, onclick)
   - Array methods (filter, map, sort, reduce)
   - String methods (trim, includes, toLowerCase)
   - JSON (stringify, parse)
   - FileReader API (import/export)
   ==================================================================== */

/* ===== CONSTANTES E VARIÁVEIS GLOBAIS ===== */

/* Chave para armazenar dados no localStorage */
const STORE = 'list_v1'

/* Array que armazena todos os itens da lista */
let items = []

/* ===== OBJETO DE REFERÊNCIA ($) ===== */
/*
  Atalho para acessar elementos HTML sem digitar sempre document.getElementById()
  Exemplo de uso: $.item() ao invés de document.getElementById('item')
*/
const $ = {
  item: () => document.getElementById('item'),
  cat: () => document.getElementById('cat'),
  qty: () => document.getElementById('qty'),
  price: () => document.getElementById('price'),
  list: () => document.getElementById('list'),
  search: () => document.getElementById('search'),
  filter: () => document.getElementById('filter'),
  sort: () => document.getElementById('sort'),
  tc: () => document.getElementById('tc'),    /* Total count */
  bc: () => document.getElementById('bc'),    /* Bought count */
  cost: () => document.getElementById('cost'),
  file: () => document.getElementById('file')
}

/* ===== FUNÇÕES UTILITÁRIAS ===== */

/**
 * SAVE - Salva array de itens no localStorage em formato JSON
 * localStorage: armazenamento local do navegador (sem servidor)
 * JSON.stringify: converte objeto JavaScript para texto JSON
 */
function save() {
  localStorage.setItem(STORE, JSON.stringify(items))
}

/**
 * LOAD - Carrega dados do localStorage e popula o array items
 * JSON.parse: converte texto JSON para objeto JavaScript
 * try/catch: trata erros se o JSON for inválido
 */
function load() {
  try {
    items = JSON.parse(localStorage.getItem(STORE)) || []
  } catch (e) {
    items = []
  }
}

/**
 * FMT - Formata número como moeda (2 casas decimais)
 * Exemplo: fmt(19.5) retorna "19.50"
 * Exemplo: fmt(null) retorna "0.00"
 */
function fmt(v) {
  return Number(v || 0).toFixed(2)
}

/* ===== FUNÇÃO PRINCIPAL: RENDER ===== */
/*
  RENDER é chamada toda vez que precisa atualizar a tela:
  - Quando adiciona um item
  - Quando marca como comprado
  - Quando filtra ou busca
  - Quando ordena
*/
function render() {
  /* Obter valores dos filtros */
  const q = $.search().value.toLowerCase()      /* Query de busca */
  const cf = $.filter().value                    /* Categoria filtro */
  const s = $.sort().value                       /* Tipo de ordenação */
  
  /* FILTRAR: começa com todos os itens */
  let v = items.filter(i =>
    (i.text.toLowerCase().includes(q) ||        /* Busca por nome */
     i.cat.includes(q)) &&                       /* Busca por categoria */
    (!cf || i.cat === cf)                        /* Filtra categoria */
  )
  
  /* ORDENAR: reorganiza o array filtrado */
  if (s === 'name') v.sort((a, b) => a.text.localeCompare(b.text))  /* A-Z */
  if (s === 'price') v.sort((a, b) => (a.price || 0) - (b.price || 0)) /* Menor preço */
  
  /* CALCULAR ESTATÍSTICAS */
  const t = items.length                              /* Total de itens */
  const b = items.filter(i => i.bought).length        /* Total comprados */
  const c = items.reduce((s, i) =>                    /* Custo total */
    s + (i.price ? i.price * (i.qty || 1) : 0), 0
  )
  
  /* ATUALIZAR BADGES DE ESTATÍSTICAS */
  $.tc().textContent = t
  $.bc().textContent = b
  $.cost().textContent = fmt(c)
  
  /* Limpar lista (remover todos os <li>) */
  $.list().innerHTML = ''
  
  /* Se não há itens visíveis, mostrar mensagem */
  if (!v.length) {
    const p = document.createElement('p')
    p.textContent = 'Nenhum item adicionado. Comece a criar sua lista!'
    $.list().appendChild(p)
    return
  }
  
  /* DEFINIR CORES POR CATEGORIA */
  const catColors = {
    'Alimentos': '#10b981',  /* Verde */
    'Limpeza': '#3b82f6',    /* Azul */
    'Higiene': '#f59e0b',    /* Laranja */
    'Outros': '#8b5cf6'      /* Roxo */
  }
  
  /* RENDERIZAR CADA ITEM */
  v.forEach(it => {
    /* Criar elementos HTML */
    const li = document.createElement('li')
    const chk = document.createElement('input')
    const text = document.createElement('div')
    const rm = document.createElement('button')
    
    /* CHECKBOX: marca item como comprado */
    chk.type = 'checkbox'
    chk.checked = it.bought
    chk.onchange = () => {
      it.bought = chk.checked
      save()
      render()
    }
    
    /* COR DA CATEGORIA */
    const catColor = catColors[it.cat] || '#6366f1'
    
    /* CONTEÚDO DO ITEM: HTML com dados formatados */
    text.innerHTML = `
      <span style="font-weight:700;color:#1f2937;font-size:1.05rem">${it.text}</span>
      <div style="display:flex;gap:10px;margin-top:8px;align-items:center;flex-wrap:wrap;font-size:0.9rem">
        ${it.qty ? `<span style="color:#6b7280"><strong>Qtd:</strong> ${it.qty}</span>` : ''}
        ${it.price ? `<span style="color:#f59e0b;font-weight:700">R$ ${fmt(it.price)}</span>` : ''}
        <span style="background:${catColor}15;color:${catColor};padding:4px 10px;border-radius:8px;font-weight:600;font-size:0.85rem;border-left:3px solid ${catColor};white-space:nowrap">${it.cat}</span>
      </div>
    `
    
    /* Se comprado, reduzir opacidade */
    if (it.bought) {
      text.style.opacity = '0.6'
    }
    
    /* BOTÃO REMOVER */
    rm.textContent = '🗑️ Remover'
    rm.onclick = () => {
      if (confirm('Remover este item?')) {
        /* Filter: cria novo array sem o item */
        items = items.filter(x => x.id !== it.id)
        save()
        render()
      }
    }
    
    /* MONTAR ELEMENTO <li> */
    li.appendChild(chk)
    li.appendChild(text)
    li.appendChild(rm)
    $.list().appendChild(li)
  })
}

/* ===== FUNÇÃO ADD: ADICIONAR NOVO ITEM ===== */
function add() {
  /* Obter e validar texto do input */
  const t = $.item().value.trim()
  if (!t) return /* Se vazio, não faz nada */
  
  /* CRIAR NOVO OBJETO DE ITEM */
  const it = {
    id: Date.now(),                      /* ID único (timestamp) */
    text: t,                             /* Nome do produto */
    cat: $.cat().value || 'Outros',      /* Categoria */
    qty: $.qty().value ? Number($.qty().value) : null,  /* Quantidade */
    price: $.price().value ? Number($.price().value) : null, /* Preço */
    bought: false                        /* Inicialment não comprado */
  }
  
  /* Adicionar ao array */
  items.push(it)
  
  /* Salvar e renderizar */
  save()
  render()
  
  /* Limpar formulário e focar no input */
  $.item().value = ''
  $.qty().value = ''
  $.price().value = ''
  $.cat().value = ''
  $.item().focus()
}

/* ===== FUNÇÃO EXPORT: SALVAR LISTA EM ARQUIVO JSON ===== */
function exp() {
  /* Converter array para texto JSON com formatação (null, 2) */
  const d = JSON.stringify(items, null, 2)
  
  /* Criar Blob (arquivo em memória) */
  const b = new Blob([d], { type: 'application/json' })
  
  /* Criar URL temporária para o blob */
  const u = URL.createObjectURL(b)
  
  /* Criar elemento <a> invisível para download */
  const a = document.createElement('a')
  a.href = u
  a.download = 'lista-' + new Date().toISOString().split('T')[0] + '.json'
  
  /* Adicionar ao DOM, clicar e remover */
  document.body.appendChild(a)
  a.click()
  a.remove()
  
  /* Liberar memória da URL */
  URL.revokeObjectURL(u)
}

/* ===== FUNÇÃO IMPORT: CARREGAR LISTA DE ARQUIVO JSON ===== */
function imp(f) {
  /* FileReader: ler arquivo do disco */
  const r = new FileReader()
  
  /* Quando arquivo termina de carregar */
  r.onload = e => {
    try {
      /* Converter JSON para objeto JavaScript */
      const p = JSON.parse(e.target.result)
      
      /* Verificar se é um array válido */
      if (Array.isArray(p)) {
        /* Obter IDs já existentes para evitar duplicatas */
        const ids = new Set(items.map(x => x.id))
        
        /* Adicionar apenas itens novos */
        p.forEach(x => {
          if (!ids.has(x.id)) items.push(x)
        })
        
        save()
        render()
        alert('Lista importada com sucesso!')
      }
    } catch (err) {
      alert('Erro ao importar: ' + err.message)
    }
  }
  
  /* Ler arquivo como texto */
  r.readAsText(f)
}

/* ===== INICIALIZAÇÃO: QUANDO PÁGINA CARREGA ===== */
/*
  DOMContentLoaded: evento que dispara quando HTML foi totalmente carregado
  (antes de imagens e stylesheets, mais rápido que "load")
*/
document.addEventListener('DOMContentLoaded', () => {
  /* Carregar dados salvos e renderizar lista inicial */
  load()
  render()
  
  /* ===== ADICIONAR ITEM: SUBMIT DO FORMULÁRIO ===== */
  document.getElementById('add-form').onsubmit = e => {
    e.preventDefault() /* Evita recarregar página */
    add()
  }
  
  /* ===== FILTRAR/BUSCAR: EVENTOS DE MUDANÇA ===== */
  $.search().oninput = render    /* Busca: renderiza ao digitar */
  $.filter().onchange = render   /* Filtro categoria: renderiza ao mudar */
  $.sort().onchange = render     /* Ordenação: renderiza ao mudar */
  
  /* ===== EXPORTAR: CLIQUE NO BOTÃO ===== */
  document.getElementById('export').onclick = exp
  
  /* ===== LIMPAR: CLIQUE NO BOTÃO ===== */
  document.getElementById('clear').onclick = () => {
    if (confirm('Limpar todos os itens?')) {
      items = []      /* Esvaziar array */
      save()          /* Salvar estado vazio */
      render()        /* Renderizar lista vazia */
    }
  }
  
  /* ===== IMPORTAR: CLIQUE NO BOTÃO (file input) ===== */
  document.getElementById('file').onchange = e => {
    if (e.target.files[0]) imp(e.target.files[0])
    e.target.value = '' /* Limpar input para permitir re-import */
  }
})
