import puppeteer from "puppeteer";
import sqlite3 from 'sqlite3';

/**
 * Función principal para extraer información de cada fintech y guardarla en la base de datos SQLite.
 */
async function scrapeAndSaveData() {
    try {
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
                const cityElement = fintech.querySelector('p.info__item:nth-child(2)');

                // Comprobaciones para asegurar que los elementos existen
                const name = nameElement ? nameElement.innerText : '';
                const sector = sectorElement ? sectorElement.innerText : '';
                const url = urlElement ? urlElement.getAttribute('href') : '';
                const city = cityElement ? cityElement.textContent.trim() : '';


                return { name, sector, url, city };
            });
        });

        // Cerrar el navegador Puppeteer
        await browser.close();

        // Conectar a la base de datos SQLite
        const db = new sqlite3.Database('fintechs.db');

        // Crear tabla si no existe
        await createFintechsTable(db); // Esperar a que la tabla se cree correctamente

        // Guardar datos de cada fintech en la base de datos
        await Promise.all(fintechsData.map(fintech => saveFintechData(fintech, db)));

        // Cerrar la conexión a la base de datos
        db.close();

        console.log('Datos guardados en la base de datos SQLite.');
    } catch (error) {
        console.error('Error al ejecutar la función principal:', error);
    }
}

/**
 * Función para crear la tabla de fintechs en la base de datos SQLite si no existe.
 * @param {sqlite3.Database} db - Conexión a la base de datos SQLite.
 */
function createFintechsTable(db) {
    return new Promise((resolve, reject) => {
        // Crear tabla si no existe
        db.serialize(() => {
            db.run('CREATE TABLE IF NOT EXISTS fintechs (name TEXT, sector TEXT, url TEXT, city TEXT)', (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    });
}

/**
 * Función para guardar datos de una fintech en la base de datos SQLite.
 * @param {Object} fintechData - Objeto con los datos de la fintech.
 * @param {sqlite3.Database} db - Conexión a la base de datos SQLite.
 */
function saveFintechData(fintechData, db) {
    return new Promise((resolve, reject) => {
        const { name, sector, url, city } = fintechData;
        db.serialize(() => {
            // Eliminar datos existentes antes de insertar nuevos
            db.run('DELETE FROM fintechs', (err) => {
                if (err) {
                    reject(err);
                } else {
                    // Insertar nuevos datos
                    db.run('INSERT INTO fintechs (name, sector, url, city) VALUES (?, ?, ?, ?)', [name, sector, url, city], (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            console.log('Datos guardados correctamente:', name);
                            resolve();
                        }
                    });
                }
            });
        });
    });
}

// Ejecutar la función principal
scrapeAndSaveData();
