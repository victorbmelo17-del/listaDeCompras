# 🛒 Lista de Compras - App Web

Aplicativo simples e rápido em HTML/CSS/JavaScript que usa localStorage do navegador.

## 📋 Como Usar - Passo a Passo

### 1. **Divida por Categorias (Corredores)**
Organize seus itens por seções lógicas para otimizar o trajeto no mercado:
- **Alimentos**: frutas, verduras, bebidas
- **Limpeza**: desinfetantes, detergentes
- **Higiene**: sabonete, shampoo, papel
- **Outros**: produtos variados

### 2. **Defina os Detalhes**
Para uma lista mais elaborada, preencha:
- **Item**: nome do produto
- **Categoria**: setor do mercado
- **Qtd**: quantidade desejada
- **R$**: preço estimado (opcional)

### 3. **Organize e Acompanhe**
- Marque ✓ ao comprar
- Busque por nome ou categoria
- Ordene por nome ou preço
- Veja o total gasto em tempo real

### 4. **Guarde Seu Histórico**
- Clique **Exportar** para salvar como JSON
- Clique **Importar** para carregar uma lista anterior
- Todos os dados ficam salvos automaticamente no navegador

## 🚀 Como Abrir

```bash
# Linux/Mac - abrir direto
open index.html  # Mac
xdg-open index.html  # Linux

# Ou servir via HTTP (recomendado)
python3 -m http.server 8000
# Acessar: http://localhost:8000
```

## ✨ Funcionalidades

- Adicionar/editar/remover itens
- Marcar como comprado
- Filtrar e buscar
- Ordenar itens
- Resumo com total e gasto estimado
- Exportar/importar listas em JSON
- Armazenamento local (sem servidor)

## 💻 Tecnologias

- HTML5
- CSS3 (responsivo)
- JavaScript vanilla (sem dependências)
- localStorage API

## 📝 Notas

- A lista é salva automaticamente no navegador
- Funciona offline completamente
- Ideal para compras no mercado, supermercado ou farmácia
- Código compacto e bem documentado para aprender


Repositório do aplicativo Lista de Compras
