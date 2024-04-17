import puppeteer from "puppeteer";
import sqlite3 from 'sqlite3';

/**
 * Función para extraer información de cada fintech y guardarla en la base de datos SQLite.
 * @param {Object} fintechData - Objeto con los datos de la fintech.
 * @param {sqlite3.Database} db - Conexión a la base de datos SQLite.
 */
async function saveFintechData(fintechData, db) {
    // Insertar los datos en la tabla de la base de datos
    const stmt = db.prepare('INSERT INTO fintechs (name, sector, url, profile) VALUES (?, ?, ?, ?)');
    stmt.run(fintechData.name, fintechData.sector, fintechData.url, fintechData.profile);
    stmt.finalize();
}

/**
 * Función principal para realizar web scraping en Colombia Fintech y guardar los datos en SQLite.
 */
async function scrapeAndSaveData() {
    // Iniciar navegador Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navegar a la página de fintechs de Colombia Fintech
    await page.goto('https://www.colombiafintech.co/fintechs');

    // Extraer datos de cada fintech
    const fintechsData = await page.evaluate(() => {
        const fintechs = Array.from(document.querySelectorAll('div.fcompany_info'));

        // Mapear los datos de cada fintech
        return fintechs.map(fintech => {
            const name = fintech.querySelector('p.info_name').innerText;
            const sector = fintech.querySelector('p.info_sector').innerText;
            const url = fintech.querySelector('a').getAttribute('href');
            const profile = fintech.querySelector('a.info_profile').getAttribute('href');

            return { name, sector, url, profile };
        });
    });

    // Cerrar el navegador Puppeteer
    await browser.close();

    // Conectar a la base de datos SQLite
    const db = new sqlite3.Database('fintechs.db');

    // Crear tabla si no existe
    db.serialize(() => {
        db.run('CREATE TABLE IF NOT EXISTS fintechs (name TEXT, sector TEXT, url TEXT, profile TEXT)');
    });

    // Guardar datos de cada fintech en la base de datos
    fintechsData.forEach(fintech => {
        saveFintechData(fintech, db);
    });

    // Cerrar la conexión a la base de datos
    db.close();
}

// Ejecutar la función principal
scrapeAndSaveData().then(() => console.log('Datos guardados en la base de datos SQLite.'));
