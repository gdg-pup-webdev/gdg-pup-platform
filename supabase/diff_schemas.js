const fs = require('fs');

try {
    const dev = fs.readFileSync('dev_schema_utf8.sql', 'utf8');
    const prod = fs.readFileSync('prod_schema_utf8.sql', 'utf8');

    function getTables(sql) {
        const tables = {};
        const parts = sql.split(/CREATE TABLE (?:IF NOT EXISTS )?(?:"public"|public)\.(?:"?([a-zA-Z0-9_]+)"?)\s*\(/g);
        for (let i = 1; i < parts.length; i += 2) {
            const tableName = parts[i];
            let body = parts[i+1];
            const closeMatch = body.match(/^\);/m);
            if (closeMatch) {
                body = body.substring(0, closeMatch.index);
            }
            tables[tableName] = body;
        }
        return tables;
    }

    const devTables = getTables(dev);
    const prodTables = getTables(prod);

    let output = '';

    output += '-- NEW TABLES --\n\n';
    for (const table in devTables) {
        if (!prodTables[table]) {
            output += `CREATE TABLE public.${table} (\n${devTables[table]}\n);\n\n`;
        }
    }

    output += '-- NEW COLUMNS --\n\n';
    for (const table in devTables) {
        if (prodTables[table]) {
            const getCols = (body) => {
                const cols = {};
                const lines = body.split('\n');
                for (let line of lines) {
                    line = line.trim();
                    const match = line.match(/^"([a-zA-Z0-9_]+)"\s+([^,]+)/) || line.match(/^([a-zA-Z0-9_]+)\s+([^,]+)/);
                    if (match && match[1].toLowerCase() !== 'constraint') {
                        cols[match[1]] = match[2].trim();
                    }
                }
                return cols;
            };
            
            const devCols = getCols(devTables[table]);
            const prodCols = getCols(prodTables[table]);
            
            for (const col in devCols) {
                if (!prodCols[col]) {
                    output += `ALTER TABLE public.${table} ADD COLUMN "${col}" ${devCols[col]};\n`;
                }
            }
        }
    }

    output += '\n-- REMOVED TABLES --\n\n';
    for (const table in prodTables) {
        if (!devTables[table]) {
            output += `DROP TABLE public.${table} CASCADE;\n`;
        }
    }

    output += '\n-- REMOVED COLUMNS --\n\n';
    for (const table in prodTables) {
        if (devTables[table]) {
            const getCols = (body) => {
                const cols = {};
                const lines = body.split('\n');
                for (let line of lines) {
                    line = line.trim();
                    const match = line.match(/^"([a-zA-Z0-9_]+)"\s+([^,]+)/) || line.match(/^([a-zA-Z0-9_]+)\s+([^,]+)/);
                    if (match && match[1].toLowerCase() !== 'constraint') {
                        cols[match[1]] = match[2].trim();
                    }
                }
                return cols;
            };
            
            const devCols = getCols(devTables[table]);
            const prodCols = getCols(prodTables[table]);
            
            for (const col in prodCols) {
                if (!devCols[col]) {
                    output += `ALTER TABLE public.${table} DROP COLUMN IF EXISTS "${col}";\n`;
                }
            }
        }
    }

    fs.writeFileSync('sync_dev_to_prod.sql', output);
    console.log('Successfully generated sync_dev_to_prod.sql!');
} catch (err) {
    console.error(err);
}
