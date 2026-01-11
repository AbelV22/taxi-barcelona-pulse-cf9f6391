import sys
import os
import time
import re
import json
import pandas as pd
import undetected_chromedriver as uc
from datetime import datetime

# =============================================================================
# 1. SETUP INTELIGENTE (Detecta si es Colab o GitHub/Local)
# =============================================================================
if 'google.colab' in sys.modules:
    print("🛠️ Entorno Colab detectado. Instalando dependencias...")
    if not os.path.exists("/usr/bin/google-chrome"):
        os.system('apt-get update -q')
        os.system('apt-get remove chromium-chromedriver chromium-browser -q -y > /dev/null 2>&1')
        os.system('wget -q https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb')
        os.system('apt-get install -y ./google-chrome-stable_current_amd64.deb > /dev/null 2>&1')
        os.system('pip install selenium webdriver-manager -q')

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys

def iniciar_driver():
    print("🚀 Iniciando Chrome en modo INDETECTABLE...")
    
    options = uc.ChromeOptions()
    # headless=new es mucho más difícil de detectar que el headless antiguo
    options.add_argument('--headless=new') 
    options.add_argument('--no-sandbox')
    options.add_argument('--window-size=1920,1080')
    options.add_argument("--lang=es-ES")
    
    # Esto evita errores de memoria en entornos Docker/Linux limitados
    options.add_argument('--disable-dev-shm-usage') 

    # Iniciar el driver parcheado. 
    # version_main=None hace que busque la versión correcta automáticamente
    driver = uc.Chrome(options=options, version_main=None)
    
    return driver

# =============================================================================
# 2. MOTORES DE EXTRACCIÓN
# =============================================================================

# --- A. MILANUNCIOS (LÓGICA NUEVA: SCROLL PROGRESIVO + JS) ---
def scrape_milanuncios(driver):

    # --- 🕵️ BLOQUE DE DEPURACIÓN FORENSE ---
        titulo = driver.title
        print(f"   🔎 Título detectado: '{titulo}'")
        
        if "Interruption" in titulo or "Access Denied" in titulo or "Robot" in titulo:
            print("   🚨 BLOQUEO DETECTADO. Generando pruebas...")
            
            # 1. Guardar HTML del bloqueo (para ver si pide Captcha o es IP ban)
            with open("error_milanuncios.html", "w", encoding="utf-8") as f:
                f.write(driver.page_source)
            
            # 2. Guardar FOTO del bloqueo
            driver.save_screenshot("error_milanuncios.png")
            
            print("   📸 Captura guardada como 'error_milanuncios.png'")
            print("   📄 HTML guardado como 'error_milanuncios.html'")
            
            # Intentamos leer el mensaje de error en pantalla
            try:
                mensaje = driver.find_element(By.TAG_NAME, "h1").text
                print(f"   ⚠️ Mensaje en pantalla: {mensaje}")
            except: pass
            
            return [] # Cortamos aquí, no tiene sentido seguir
        # ----------------------------------------
        datos = []
        print(f"\n🌍 [1/4] MILANUNCIOS (Modo Stealth GitHub)...")
        try:
            # 1. Ir directo
            driver.get("https://www.milanuncios.com/anuncios/?s=Licencia%20taxi%20barcelona")
            time.sleep(5) # Un segundo extra para GitHub Actions
    
            # 2. ATAQUE AL POPUP (Visto en tu imagen: "Agree and close")
            print("   -> Intentando cerrar cookies...")
            try:
                # Tu imagen muestra 'Agree and close', buscamos 'Agree' específicamente
                # Usamos un selector CSS genérico para el botón verde si el texto falla
                boton = WebDriverWait(driver, 5).until(
                    EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Agree') or contains(., 'Aceptar') or contains(., 'Consentir')]"))
                )
                driver.execute_script("arguments[0].click();", boton) # Click vía JS es más seguro
                print("   ✅ Cookies cerradas.")
                time.sleep(3)
            except:
                # PLAN B: Si no encuentra el botón por texto, busca por clase común de botones de consentimiento
                print("   ⚠️ Botón de texto no encontrado, intentando fuerza bruta en el centro...")
                try:
                    # A veces un click en el body cierra modales mal hechos, o enviamos ESCAPE
                    webdriver.ActionChains(driver).send_keys(Keys.ESCAPE).perform()
                except: pass
    
            # 3. SCROLL (Igual que antes)
            print("   -> Bajando para cargar ofertas...")
            viewport_height = driver.execute_script("return window.innerHeight")
            for _ in range(40): 
                driver.execute_script(f"window.scrollBy(0, {viewport_height});")
                time.sleep(1) 
                
                # Chequeo rápido de final
                new_height = driver.execute_script("return document.body.scrollHeight")
                current_scroll = driver.execute_script("return window.pageYOffset + window.innerHeight")
                if current_scroll >= new_height - 100:
                    break
    
            # 4. EXTRACCIÓN
            anuncios = driver.find_elements(By.TAG_NAME, "article")
            print(f"   -> Elementos visualizados: {len(anuncios)}")
    
            # SI FALLA AQUÍ (0 elementos), IMPRIMIMOS EL HTML PARA VER QUÉ PASA
            if len(anuncios) == 0:
                print("   ⚠️ ALERTA: 0 anuncios. Posible bloqueo antibot.")
                # Opcional: Imprimir título de la página para ver si nos redirigieron
                print(f"   Título de la página: {driver.title}")
    
            for anuncio in anuncios:
                try:
                    raw = driver.execute_script("return arguments[0].textContent;", anuncio).strip()
                    raw = re.sub(r'\s+', ' ', raw)
    
                    if len(raw) > 20 and ("TAXI" in raw.upper() or "LICENCIA" in raw.upper()):
                        datos.append({"fuente": "MILANUNCIOS", "raw": raw})
                except: continue
                
        except Exception as e: 
            print(f"   ⚠️ Error en Milanuncios: {e}")
            pass
            
        print(f"   -> {len(datos)} ofertas válidas extraídas.")
        return datos
# --- B. ASESORÍA SOLANO ---
def scrape_solano(driver):
    datos = []
    print(f"\n🌍 [2/4] SOLANO...")
    try:
        driver.get("https://asesoriasolano.es/comprar-licencias/")
        time.sleep(4)
        full_text = driver.find_element(By.TAG_NAME, "body").text

        patron = r"(Ref:.*?ESTOY INTERESADO)"
        matches = re.findall(patron, full_text, re.DOTALL | re.IGNORECASE)

        if matches:
            for m in matches:
                datos.append({"fuente": "SOLANO", "raw": m.replace("\n", " | ")})
        else:
            bloques = full_text.split('\n\n')
            for b in bloques:
                if "PRECIO" in b.upper() and "€" in b:
                    datos.append({"fuente": "SOLANO (Bloque)", "raw": b.replace("\n", " | ")})
    except: pass
    print(f"   -> {len(datos)} ofertas.")
    return datos

# --- C. GARCÍA BCN ---
def scrape_garcia(driver):
    datos = []
    print(f"\n🌍 [3/4] GARCÍA BCN...")
    try:
        driver.get("https://asesoriagarciabcn.com/compra-y-venta-de-licencias-de-taxi-en-barcelona/")
        time.sleep(4)
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)

        items = driver.find_elements(By.TAG_NAME, "li") + driver.find_elements(By.TAG_NAME, "p")
        for item in items:
            texto = item.text
            if "€" in texto and len(texto) > 20:
                datos.append({"fuente": "GARCIA_BCN", "raw": texto.replace("\n", " | ")})
    except: pass
    print(f"   -> {len(datos)} ofertas.")
    return datos

# --- D. STAC ---
def scrape_stac(driver):
    datos = []
    print(f"\n🌍 [4/4] STAC...")
    try:
        driver.get("https://bolsadelicenciasstac.cat")
        time.sleep(5)

        articles = driver.find_elements(By.TAG_NAME, "article")
        if len(articles) > 0:
            for art in articles:
                texto = art.text
                if "Precio" in texto or "€" in texto:
                    datos.append({"fuente": "STAC", "raw": texto.replace("\n", " | ")})
        else:
            # Fallback
            precios = driver.find_elements(By.XPATH, "//*[contains(text(), 'Precio:')]")
            seen = set()
            for p in precios:
                try:
                    contenedor = p.find_element(By.XPATH, "./ancestor::article")
                    txt = contenedor.text
                    if txt not in seen:
                        datos.append({"fuente": "STAC (Ancestro)", "raw": txt.replace("\n", " | ")})
                        seen.add(txt)
                except: pass

    except Exception as e:
        print(f"   ⚠️ Error STAC: {e}")
    print(f"   -> {len(datos)} ofertas.")
    return datos

# =============================================================================
# 3. EJECUCIÓN PRINCIPAL
# =============================================================================
if __name__ == "__main__":
    try:
        driver = iniciar_driver()
        resultados = []

        resultados.extend(scrape_milanuncios(driver))
        resultados.extend(scrape_solano(driver))
        resultados.extend(scrape_garcia(driver))
        resultados.extend(scrape_stac(driver))

        driver.quit()

        # Guardamos en la raíz del repositorio
        nombre_fichero = 'licencias_totales.json'
        
        with open(nombre_fichero, 'w', encoding='utf-8') as f:
            json.dump(resultados, f, ensure_ascii=False, indent=4)

        print(f"\n✅ PROCESO COMPLETADO: {len(resultados)} ofertas guardadas en '{nombre_fichero}'.")

        # INTENTO DE DESCARGA SEGURA (Solo funciona si es Colab)
        if 'google.colab' in sys.modules:
            try:
                from google.colab import files
                files.download(nombre_fichero)
            except: pass

    except Exception as e:
        print(f"\n❌ Error fatal en el script: {e}")
        exit(1)
