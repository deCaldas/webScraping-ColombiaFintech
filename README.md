# Proyecto de Scraping de Datos para el Ecosistema Fintech en Colombia

Este proyecto está diseñado para extraer datos relevantes del ecosistema fintech en Colombia desde el sitio web de [Colombia Fintech](https://colombiafintech.co/). La información extraída incluye el nombre de la empresa fintech, su sector, URL y ciudad.

## Desarrollador

- **Nombre:** Diego Whiskey
- **Perfil:** Desarrollador Web JavaScript Full-stack
- **[Perfil en LinkedIn](https://www.linkedin.com/in/diegowhiskey/)**
- **[Perfil en GitHub](https://github.com/decaldas/)**

> El código está desarrollado en Node.js utilizando Puppeteer para el scraping de datos de la web mencionada. Incluye funciones para obtener y visualizar los datos tanto en la consola como a través de un servidor local.

## Objetivo

El propósito principal de este proyecto es la **conección con las startups fintech de Colombia**.

## Uso

### Instalación

#### Dependencias

Para ejecutar este proyecto, necesitas tener instaladas las siguientes dependencias:

- Puppeteer
- SQLite3
- Express

Para instalar las dependencias, ejecuta el siguiente comando:

```bash
npm install
```

### Ejecución

Para ejecutar el scraping de datos desde la consola, puedes utilizar el siguiente comando:

```bash
node index.js
```

Esto iniciará el proceso de web scraping en el sitio web de Colombia Fintech y guardará los datos en la base de datos SQLite `fintechs.db`.

Para acceder a los resultados a través del servidor local, ejecuta:

```bash
npm start
```

Luego, visita `http://localhost:3000/fintechs/` en tu navegador.

## Contribución

¡Tienes esta invitación a contribuir al desarrollo de este proyecto! Si encuentras errores o deseas añadir nuevas funcionalidades, no dudes en enviar un pull request.

## Contacto

Si estás interesado en colaborar en este proyecto o tienes alguna pregunta, no dudes en contactarme a través de [mi perfil en GitHub](https://github.com/deCaldas/).
