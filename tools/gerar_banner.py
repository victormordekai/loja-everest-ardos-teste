"""Gera o banner de compartilhamento (1200 × 630) a partir de tools/banner/banner.html.

Uso (na raiz do projeto, com Playwright e Chrome instalados):
    python3 tools/gerar_banner.py
Saída: assets/img/compartilhar/banner_1200x630.jpg (JPEG, abaixo de 300 KB para o WhatsApp).
O banner é referenciado com endereço completo (og:image) nas páginas; ver tools/montar_paginas.py.
"""
import io
from pathlib import Path
from playwright.sync_api import sync_playwright
from PIL import Image

RAIZ = Path(__file__).resolve().parent.parent
FONTE = RAIZ / "tools" / "banner" / "banner.html"
SAIDA = RAIZ / "assets" / "img" / "compartilhar" / "banner_1200x630.jpg"
CHROME = "/usr/bin/google-chrome"


def main() -> None:
    SAIDA.parent.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        navegador = p.chromium.launch(executable_path=CHROME, args=["--no-sandbox", "--allow-file-access-from-files"])
        pagina = navegador.new_page(viewport={"width": 1200, "height": 630})
        pagina.goto(FONTE.as_uri())
        pagina.wait_for_timeout(600)
        png = pagina.locator(".banner").screenshot()
        navegador.close()
    imagem = Image.open(io.BytesIO(png)).convert("RGB")
    imagem.save(SAIDA, "JPEG", quality=86, optimize=True, progressive=True)
    print("banner:", SAIDA.relative_to(RAIZ), imagem.size, SAIDA.stat().st_size, "bytes")


if __name__ == "__main__":
    main()
