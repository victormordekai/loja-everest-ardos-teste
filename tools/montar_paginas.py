"""Monta as páginas da loja a partir de tools/fontes/ e tools/parciais/.

Uso (na raiz do projeto):  python3 tools/montar_paginas.py

O que faz: troca {{CABECA}}, {{TOPO}} e {{RODAPE}} pelos parciais, ajusta o caminho
até a raiz ({{R}}) e marca o item atual do menu. Grava index.html e pages/*.html.
O que não faz: não minifica, não baixa nada, não altera imagens.
Para mudar cabeçalho ou rodapé, edite o parcial e rode de novo.
"""
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
PARCIAIS = RAIZ / "tools" / "parciais"
FONTES = RAIZ / "tools" / "fontes"

# página -> (destino, caminho até a raiz, item atual do menu)
PAGINAS = {
    "index.html": ("index.html", "", "PRODUTOS"),
    "produto.html": ("pages/produto.html", "../", "PRODUTOS"),
    "coletiva.html": ("pages/coletiva.html", "../", "COLETIVA"),
    "carrinho.html": ("pages/carrinho.html", "../", "CARRINHO"),
    "privacidade.html": ("pages/privacidade.html", "../", None),
}
MARCAS_MENU = ("PRODUTOS", "COLETIVA", "CARRINHO")


def ler(caminho: Path) -> str:
    return caminho.read_text(encoding="utf-8")


def montar(nome: str) -> None:
    destino, raiz, atual = PAGINAS[nome]
    texto = ler(FONTES / nome)
    for marcador, parcial in (("{{CABECA}}", "cabeca.html"), ("{{TOPO}}", "topo.html"), ("{{RODAPE}}", "rodape.html")):
        texto = texto.replace(marcador, ler(PARCIAIS / parcial).rstrip("\n"))
    for marca in MARCAS_MENU:
        texto = texto.replace("{{ATUAL_" + marca + "}}", ' aria-current="page"' if marca == atual and nome != "index.html" else "")
    texto = texto.replace("{{R}}", raiz)
    if "{{" in texto:
        raise SystemExit(f"{nome}: marcador sem substituição")
    saida = RAIZ / destino
    saida.parent.mkdir(parents=True, exist_ok=True)
    saida.write_text(texto, encoding="utf-8")
    print("montada:", destino)


if __name__ == "__main__":
    for pagina in PAGINAS:
        montar(pagina)
