import requests
from bs4 import BeautifulSoup
import pandas as pd
from .models import ListaDeseo

class scraping():
    def scrapingMercadolibre(termino):
        listaDeseo = ListaDeseo.objects.all()
        termino = termino.strip()
        termino = termino.replace("  ", "")
        termino = termino.replace(" ", "-")
        url = "https://listado.mercadolibre.com.co/{}_Desde_0_NoIndex_True".format(termino)
        page = requests.get(url)
        contents = page.content

        soup = BeautifulSoup(contents, "html.parser")
        validate = True

        if soup.find('h3', {'class': 'ui-search-rescue__title'}):
            validate = soup.find('h3', {'class': 'ui-search-rescue__title'}).text

        products = []
        contador = 0

        while validate:
            try:
                allDivs = soup.find_all('div', {'class': 'andes-card'})

                if not allDivs or not allDivs[0].find('h2', {'class': 'poly-component__title'}):
                    allDivs = soup.find_all('div', {'class': 'poly-card'})

                for items in allDivs:
                    contador += 1
                    data ={}
                    data["id"] = contador
                    titulo = ""
                    urlProducto = "#"
                    precio = 0
                    descuento = 0

                    if items.find('h2', {'class': 'poly-component__title'}):
                        titulo = items.find('h2', {'class': 'poly-component__title'})
                        if titulo:
                            urlProducto = titulo.find('a')['href']
                            titulo = titulo.find('a').get_text().strip()
                        else:
                            titulo = ""
                            urlProducto= '#'
                            
                    data["titulo"] = titulo
                    data["link-producto"] = urlProducto

                    if items.find('div', {'class': 'poly-price__current'}):
                        precio = items.find('div', {'class': 'poly-price__current'})
                        if precio.find('span', {'class': 'andes-money-amount__fraction'}):
                            precio = int(precio.find('span', {'class': 'andes-money-amount__fraction'}).get_text().replace(".", ""))

                    data["precio"] = precio

                    if items.find('s', {'class': 'andes-money-amount--previous'}):
                        descuento = items.find('s', {'class': 'andes-money-amount--previous'})
                        if descuento.find('span', {'class': 'andes-money-amount__fraction'}):
                            descuento = int(descuento.find('span', {'class': 'andes-money-amount__fraction'}).get_text().replace(".", ""))

                    data["descuento"] = descuento

                    if items.find('span', {'class': 'poly-reviews__rating'}):
                        data["calificacion"] = float(items.find('span', {'class': 'poly-reviews__rating'}).get_text())
                    else:
                        data["calificacion"] = 0
                    
                    if data["descuento"] != 0:
                        data["descuento"] = data["descuento"] - data["precio"]
                    else:
                        data["descuento"] = 0

                    data["link-imagen"] = '#'

                    if items.find('img', {'class': 'poly-component__picture'}):
                        allImg = items.find_all('img', {'class': 'poly-component__picture'})

                        for img in allImg:
                            
                            if img and img['src'] == "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7":
                                data["link-imagen"] = img['data-src']
                                break
                            else:
                                if img:
                                    data["link-imagen"] = img['src']
                                    break

                    if listaDeseo.filter(titulo = data['titulo']):
                        data['deseo'] = True
                    else:
                        data['deseo'] = False

                    products.append(data)

                url = "https://listado.mercadolibre.com.co/{}_Desde_{}_NoIndex_True".format(termino, contador + 1)
                page = requests.get(url)
                contents = page.content
                soup = BeautifulSoup(contents, "html.parser")

                if not allDivs:
                    validate = False

            except Exception as e:
                return
        return products
    
    def FiltroArticulo(termino):
        data = scraping.scrapingMercadolibre(termino)
        result = {}

        if data != []:
            try:
                dataPd = pd.DataFrame.from_dict(data)
                dataPd.set_index('id', inplace=True)
                dataPd.dropna(inplace=True)
                dataPd = dataPd[dataPd['titulo'].str.len() > 0]
                
                dataPd["precio"] = dataPd["precio"].apply(scraping.addZero)
                dataPd["descuento"] = dataPd["descuento"].apply(scraping.addZero)
                dataPd["calificacion"] = dataPd["calificacion"].apply(scraping.addZero)
                dataPd["precio"] = dataPd["precio"].astype(int)
                dataPd["descuento"] = dataPd["descuento"].astype(int)
                dataPd = dataPd.drop_duplicates()

                precioMin=dataPd.loc[dataPd['precio'].idxmin()]
                precioMax=dataPd.loc[dataPd['precio'].idxmax()]
                descuentoMax=dataPd.loc[dataPd['descuento'].idxmax()]
                calificacionMax=dataPd.loc[dataPd['calificacion'].idxmax()]
                promedio = dataPd["precio"].mean()

                result["precioMin"] = precioMin
                result["precioMax"] = precioMax
                result["descuentoMax"] = descuentoMax
                result["calificacionMax"] = calificacionMax
                result["promedio"] = promedio
                result["datos"] = data

                return result
            
            except Exception as a:
                return ""
        
        return ""
    
    def addZero(x):
        if x == '' or not x:
            return 0
        else:
            return x