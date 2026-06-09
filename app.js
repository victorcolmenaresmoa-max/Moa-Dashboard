// Inicializar los íconos de Lucide
lucide.createIcons();

// Configuración de SheetDB (Reemplaza la URL con tu API de SheetDB)
const SHEETDB_URL = 'https://sheetdb.io/api/v1/TU_ID_AQUI'; 

// Data Semilla (Seed Data) proporcionada
const seedData = [
    {
        "Tipo de trabajo": "PERPETUAL",
        "TASKS": "Evaluaciones",
        "Vertical": "School",
        "Brief Description": "Creación de los instrumentos de evaluación para todo el ecosistema MOA.",
        "Specialists": "Ailil Coutinho, MOA - Victor Colmenares",
        "Fecha de Inicio y Fin": "",
        "Estado": "In progress",
        "Calidad": "",
        "Ailil": "Pruebas Externas Colegios, últi",
        "Victor": "Mis To-Dos * Mis fechas de ent",
        "Asdrubal": "",
        "Melisa": ""
    },
    {
        "Tipo de trabajo": "PERPETUAL",
        "TASKS": "English For Teachers (EFT)",
        "Vertical": "School",
        "Brief Description": "Enseña inglés al equipo docente de MOA School. Cada docente recibe una sesión sincrónica semanal y, cada dos semanas, un paquete de actividades para trabajar de forma autónoma.",
        "Specialists": "MrAsdrubal",
        "Fecha de Inicio y Fin": "",
        "Estado": "In progress",
        "Calidad": "",
        "Ailil": "",
        "Victor": "",
        "Asdrubal": "Mis To-Dos * Mis fechas de ent",
        "Melisa": ""
    },
    {
        "Tipo de trabajo": "ON-DEMAND",
        "TASKS": "Corrección de workbooks impresos para el año escolar 2026-2027",
        "Vertical": "School",
        "Brief Description": "Revisión y corrección rápida de workbooks MOA School. Errores...",
        "Specialists": "MELISA MOA, Dirección Académica",
        "Fecha de Inicio y Fin": "May 5, 2026 – May 22, 2026",
        "Estado": "In progress",
        "Calidad": "En revisión por especialistas",
        "Ailil": "",
        "Victor": "",
        "Asdrubal": "",
        "Melisa": "Mis To-Dos * Mis fechas de ent"
    }
];

// --- FUNCIONES DE DICCIONARIO DE COLORES (Estilo Notion) ---

const getWorkTypeBadge = (type) => {
    const styles = {
        'PROJECT': 'bg-[#e2f6ea] text-[#245e3f]',
        'PERPETUAL': 'bg-[#e3f2fd] text-[#0d47a1]',
        'ON-DEMAND': 'bg-[#ffebee] text-[#c62828]'
    };
    const style = styles[type] || 'bg-gray-100 text-gray-700';
    return type ? `<span class="px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${style}">${type}</span>` : '';
};

const getVerticalBadge = (vertical) => {
    const styles = {
        'Academy': 'bg-blue-100 text-blue-800',
        'School': 'bg-green-100 text-green-800',
        'E-MOA': 'bg-purple-100 text-purple-800',
        'Afterschool': 'bg-orange-100 text-orange-800',
        'In-Company': 'bg-pink-100 text-pink-800'
    };
    const style = styles[vertical] || 'bg-gray-100 text-gray-800';
    return vertical ? `<span class="px-2 py-1 rounded text-xs font-medium ${style}">${vertical}</span>` : '';
};

const getStatusBadge = (status) => {
    const configs = {
        'Not started': { color: 'text-gray-500', dot: 'bg-gray-400' },
        'In progress': { color: 'text-blue-700', dot: 'bg-blue-500' },
        'Stand By': { color: 'text-yellow-700', dot: 'bg-yellow-500' },
        'Blocked': { color: 'text-red-700', dot: 'bg-red-500' },
        'Done': { color: 'text-green-700', dot: 'bg-green-500' },
        'Delayed Done': { color: 'text-purple-700', dot: 'bg-purple-500' }
    };
    const config = configs[status];
    return config 
        ? `<div class="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer w-max"><div class="w-2 h-2 rounded-full ${config.dot}"></div><span class="text-xs ${config.color}">${status}</span></div>` 
        : '';
};

const getQualityBadge = (quality) => {
    const styles = {
        'Revisado y aprobado': 'bg-[#e2f6ea] text-[#245e3f]',
        'En revisión por especialistas': 'bg-[#e3f2fd] text-[#0d47a1]',
        'Sin revisión de otros especialistas...': 'bg-[#fef0c7] text-[#93370d]',
        'Pendiente de revisión': 'bg-[#ffebee] text-[#c62828]'
    };
    const style = styles[quality] || 'bg-gray-100 text-gray-700';
    return quality ? `<span class="px-2 py-1 rounded text-xs font-medium block w-max ${style}">${quality}</span>` : '';
};

// Generador de Avatares a partir de iniciales
const renderSpecialists = (specialistsString) => {
    if (!specialistsString) return '';
    const specialists = specialistsString.split(',').map(s => s.trim());
    
    let html = '<div class="flex flex-wrap gap-1">';
    specialists.forEach(sp => {
        // Extraer iniciales de manera limpia
        const initials = sp.replace('MOA -', '').replace('Dirección Académica', '').trim().substring(0, 2).toUpperCase();
        html += `
            <div class="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded text-xs text-gray-700 w-max">
                <div class="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center text-[8px] font-bold text-white overflow-hidden">
                    ${initials}
                </div>
                ${sp}
            </div>
        `;
    });
    html += '</div>';
    return html;
};


// --- LÓGICA DE RENDERIZADO DE LA TABLA ---

const renderTable = (data) => {
    const tbody = document.getElementById('table-body');
    tbody.innerHTML = ''; // Limpiar

    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.className = 'group bg-white'; // group para hover states si es necesario

        tr.innerHTML = `
            <td>${getWorkTypeBadge(row['Tipo de trabajo'])}</td>
            <td class="font-bold text-[#37352f] sticky-col group-hover:bg-[#f9f9f8] transition-colors">
                ${row['TASKS'] || ''}
            </td>
            <td>${getVerticalBadge(row['Vertical'])}</td>
            <td class="max-w-[250px]">
                <p class="truncate text-gray-600 text-sm" title="${row['Brief Description'] || ''}">
                    ${row['Brief Description'] || ''}
                </p>
            </td>
            <td>${renderSpecialists(row['Specialists'])}</td>
            <td class="text-gray-600 text-xs">${row['Fecha de Inicio y Fin'] || ''}</td>
            <td>${getStatusBadge(row['Estado'])}</td>
            <td>${getQualityBadge(row['Calidad'])}</td>
            <td class="text-gray-500 text-sm whitespace-pre-line">${row['Ailil'] || ''}</td>
            <td class="text-gray-500 text-sm whitespace-pre-line">${row['Victor'] || ''}</td>
            <td class="text-gray-500 text-sm whitespace-pre-line">${row['Asdrubal'] || ''}</td>
            <td class="text-gray-500 text-sm whitespace-pre-line">${row['Melisa'] || ''}</td>
        `;
        tbody.appendChild(tr);
    });
};

// --- FETCH DATA ---

const loadData = async () => {
    const loader = document.getElementById('loading');
    
    try {
        loader.style.display = 'flex';
        
        // Simulación de fetch a SheetDB (Descomenta esto y elimina la data semilla cuando pongas tu URL real)
        /*
        const response = await fetch(SHEETDB_URL);
        if (!response.ok) throw new Error('Error al conectar con SheetDB');
        const sheetData = await response.json();
        renderTable(sheetData);
        */

        // Usando Seed Data para prueba inicial
        setTimeout(() => {
            renderTable(seedData);
            loader.style.display = 'none';
        }, 800); // Pequeño delay para apreciar el spinner de carga

    } catch (error) {
        console.error("Error cargando los datos:", error);
        loader.innerHTML = '<span class="text-red-500 text-sm">Error cargando la base de datos</span>';
    }
};

// Iniciar
document.addEventListener('DOMContentLoaded', loadData);