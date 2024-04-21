import puppeteer from "puppeteer";
import sqlite3 from 'sqlite3';

/**
 * Función para extraer información de cada fintech y guardarla en la base de datos SQLite.
 * @param {Object} fintechData - Objeto con los datos de la fintech.
 * @param {sqlite3.Database} db - Conexión a la base de datos SQLite.
 */
async function scrapeAndSaveData() {
    // Iniciar navegador Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navegar a la página de fintechs de Colombia Fintech
    await page.goto('https://www.colombiafintech.co/fintechs');

    // Extraer datos de cada fintech
    const fintechsData = await page.evaluate(() => {
        const fintechs = Array.from(document.querySelectorAll('body > div.fdirectory > div.fdirectory__members > div > div.fcompany__info'));

        // Mapear los datos de cada fintech
        return fintechs.map(fintech => {
            const nameElement = fintech.querySelector('p.info__name');
            const sectorElement = fintech.querySelector('p.info__sector');
            const urlElement = fintech.querySelector('a');

            // Comprobaciones para asegurar que los elementos existen
            const name = nameElement ? nameElement.innerText : '';
            const sector = sectorElement ? sectorElement.innerText : '';
            const url = urlElement ? urlElement.getAttribute('href') : '';

            return { name, sector, url };
        });
    });

    // Cerrar el navegador Puppeteer
    await browser.close();

    // Conectar a la base de datos SQLite
    const db = new sqlite3.Database('fintechs.db');

    // Crear tabla si no existe
    db.serialize(() => {
        db.run('CREATE TABLE IF NOT EXISTS fintechs (name TEXT, sector TEXT, url TEXT)');
    });

    // Guardar datos de cada fintech en la base de datos
    fintechsData.forEach(fintech => {
        // Llamada a la función saveFintechData corregida
        saveFintechData(fintech, db);
    });

    // Cerrar la conexión a la base de datos
    db.close();
}

/**
 * Función para guardar datos de una fintech en la base de datos SQLite.
 * @param {Object} fintechData - Objeto con los datos de la fintech.
 * @param {sqlite3.Database} db - Conexión a la base de datos SQLite.
 */
function saveFintechData(fintechData, db) {
    const { name, sector, url } = fintechData;
    db.run('INSERT INTO fintechs (name, sector, url) VALUES (?, ?, ?)', [name, sector, url], (err) => {
        if (err) {
            console.error('Error al guardar datos:', err);
        } else {
            console.log('Datos guardados correctamente:', name);
        }
    });
}

// Ejecutar la función principal
scrapeAndSaveData().then(() => console.log('Datos guardados en la base de datos SQLite.')).catch(err => console.error('Error al ejecutar la función principal:', err));
