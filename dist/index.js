import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
const DATA_PATH = join(process.cwd(), 'data', 'services.json');
const OUTPUT_DIR = join(process.cwd(), 'output');
const OUTPUT_PATH = join(OUTPUT_DIR, 'report.json');
function getCategoryFromArgs() {
    const args = process.argv.slice(2);
    const index = args.indexOf('--category');
    if (index !== -1 && args[index + 1]) {
        return args[index + 1];
    }
    const inlineArg = args.find((arg) => arg.startsWith('--category='));
    if (inlineArg) {
        return inlineArg.split('=')[1];
    }
    return null;
}
async function loadServices() {
    try {
        const rawData = await readFile(DATA_PATH, 'utf-8');
        return JSON.parse(rawData);
    }
    catch (error) {
        const err = error;
        if (err.code === 'ENOENT') {
            console.error(`❌ Error crítico: El archivo de datos no se encontró en "${DATA_PATH}".`);
        }
        else {
            console.error(`❌ Error al leer o parsear el archivo JSON:`, err.message);
        }
        process.exit(1);
    }
}
function calculateSummary(services) {
    if (services.length === 0) {
        return {
            totalServices: 0,
            activeServices: 0,
            inactiveServices: 0,
            averagePrice: 0,
            mostExpensive: null,
            cheapest: null,
        };
    }
    const totalServices = services.length;
    const activeServices = services.filter((s) => s.available).length;
    const inactiveServices = totalServices - activeServices;
    const totalPrice = services.reduce((acc, s) => acc + s.price, 0);
    const averagePrice = Number((totalPrice / totalServices).toFixed(2));
    const mostExpensive = services.reduce((max, s) => (s.price > max.price ? s : max), services[0]);
    const cheapest = services.reduce((min, s) => (s.price < min.price ? s : min), services[0]);
    return {
        totalServices,
        activeServices,
        inactiveServices,
        averagePrice,
        mostExpensive,
        cheapest,
    };
}
async function main() {
    console.log('🧺 Procesador de Servicios de Lavandería y Tintorería\n');
    const allServices = await loadServices();
    const requestedCategory = getCategoryFromArgs();
    const availableCategories = Array.from(new Set(allServices.map((s) => s.category)));
    let filteredServices = allServices;
    if (requestedCategory) {
        const categoryExists = availableCategories.some((cat) => cat.toLowerCase() === requestedCategory.toLowerCase());
        if (!categoryExists) {
            console.warn(`⚠️  Aviso: La categoría "${requestedCategory}" no existe.`);
            console.log('📋 Categorías disponibles en el catálogo:');
            availableCategories.forEach((cat) => console.log(`   - ${cat}`));
            console.log('\nGenerando reporte completo sin filtrar...\n');
        }
        else {
            filteredServices = allServices.filter((s) => s.category.toLowerCase() === requestedCategory.toLowerCase());
            console.log(`🔍 Filtro aplicado: Categoría "${requestedCategory}"\n`);
        }
    }
    const summary = calculateSummary(filteredServices);
    console.log('📊 Resumen del Catálogo:');
    console.log(`- Total de servicios: ${summary.totalServices}`);
    console.log(`- Activos: ${summary.activeServices} | Inactivos: ${summary.inactiveServices}`);
    console.log(`- Precio promedio: $${summary.averagePrice}`);
    if (summary.mostExpensive) {
        console.log(`- Servicio más caro: ${summary.mostExpensive.name} ($${summary.mostExpensive.price})`);
    }
    if (summary.cheapest) {
        console.log(`- Servicio más barato: ${summary.cheapest.name} ($${summary.cheapest.price})`);
    }
    const report = {
        generatedAt: new Date().toISOString(),
        appliedFilter: requestedCategory,
        summary,
        items: filteredServices,
    };
    try {
        await mkdir(OUTPUT_DIR, { recursive: true });
        await writeFile(OUTPUT_PATH, JSON.stringify(report, null, 2), 'utf-8');
        console.log(`\n✅ Reporte generado exitosamente en: "${OUTPUT_PATH}"`);
    }
    catch (error) {
        console.error('❌ Error al escribir el archivo de reporte:', error);
        process.exit(1);
    }
}
main();
