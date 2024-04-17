import sqlite3 from 'sqlite3';

// Abrir la conexión a la base de datos
const db = new sqlite3.Database('fintechs.db');

// Consulta para obtener todas las fintechs
db.all('SELECT * FROM fintechs', (err, rows) => {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log('Todas las fintechs:');
  rows.forEach(row => {
    console.log(row);
  });
});

/* 
// Consulta para obtener una fintech específica por nombre
const fintechName = 'Nombre de la fintech';
db.get('SELECT * FROM fintechs WHERE name = ?', [fintechName], (err, row) => {
  if (err) {
    console.error(err.message);
    return;
  }
  console.log(`Fintech ${fintechName}:`);
  console.log(row);
});

// Cerrar la conexión a la base de datos
db.close();
 */