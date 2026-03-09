/* eslint-disable */
const TRAMITES = [
  { id:'ine',         name:'INE / Credencial para Votar', cat:'Identidad',      icon:'🪪', color:'#e8e0c8',
    desc:'Obtén o renueva tu credencial para votar del INE.',
    costo:'Gratuito', tiempo:'30–45 días',
    reqs:['Acta de nacimiento original','CURP vigente','Comprobante de domicilio','Fotografía reciente'],
    donde:'Módulo del INE más cercano o en tramites.ine.mx' },

  { id:'licencia',    name:'Licencia de conducir',        cat:'Transporte',     icon:'🚗', color:'#f0e8d8',
    desc:'Tramita o renueva tu licencia de conducir tipo automovilista.',
    costo:'$450 MXN', tiempo:'1–3 días hábiles',
    reqs:['INE vigente','Examen médico oficial','Comprobante de domicilio','Pago de derechos'],
    donde:'Oficinas de Movilidad, Av. Morelos Norte 802, Cuernavaca.' },

  { id:'acta',        name:'Acta de nacimiento',          cat:'Registro Civil', icon:'📜', color:'#e8f0e8',
    desc:'Solicita copias certificadas de tu acta de nacimiento.',
    costo:'$85 MXN', tiempo:'1 día hábil',
    reqs:['Identificación oficial','CURP vigente','Pago de derechos'],
    donde:'Registro Civil Municipal o registrocivil.gob.mx' },

  { id:'predial',     name:'Pago de predial',             cat:'Hacienda',       icon:'🏠', color:'#f0e8f0',
    desc:'Realiza el pago del impuesto predial de tu propiedad.',
    costo:'Variable', tiempo:'Inmediato',
    reqs:['Número de cuenta catastral','Identificación oficial'],
    donde:'Tesorería Municipal, en línea o bancos autorizados.' },

  { id:'pasaporte',   name:'Pasaporte mexicano',          cat:'Identidad',      icon:'📘', color:'#e8e8f8',
    desc:'Tramita o renueva tu pasaporte en la SRE.',
    costo:'$1,515 MXN adulto', tiempo:'3–5 días hábiles',
    reqs:['Acta de nacimiento','CURP','Comprobante de domicilio','Foto pasaporte','Pago'],
    donde:'SRE delegación Morelos, Cuernavaca.' },

  { id:'curp',        name:'CURP',                        cat:'Identidad',      icon:'🆔', color:'#f0f8e8',
    desc:'Consulta, descarga o actualiza tu CURP.',
    costo:'Gratuito', tiempo:'Inmediato',
    reqs:['Acta de nacimiento','Identificación con foto'],
    donde:'gob.mx/curp o módulos de atención ciudadana.' },

  { id:'rfc',         name:'RFC / Registro SAT',          cat:'Fiscal',         icon:'💼', color:'#fff0e0',
    desc:'Obtén o actualiza tu Registro Federal de Contribuyentes.',
    costo:'Gratuito', tiempo:'Inmediato',
    reqs:['CURP vigente','Correo electrónico','Identificación oficial'],
    donde:'sat.gob.mx o módulos del SAT en Cuernavaca.' },

  { id:'agua',        name:'Pago de agua / CAPAMA',       cat:'Servicios',      icon:'💧', color:'#e0f0f8',
    desc:'Paga tu recibo de agua o solicita reconexión.',
    costo:'Según consumo', tiempo:'1–2 días',
    reqs:['Número de cuenta de servicio','Identificación oficial'],
    donde:'Oficinas CAPAMA o capama.gob.mx' },

  { id:'matrimonio',  name:'Acta de matrimonio',          cat:'Registro Civil', icon:'💍', color:'#fce8f0',
    desc:'Solicita copia certificada de tu acta de matrimonio.',
    costo:'$120 MXN', tiempo:'1 día hábil',
    reqs:['ID oficial de ambos cónyuges','Fecha y lugar del matrimonio'],
    donde:'Registro Civil Municipal, Palacio de Gobierno.' },

  { id:'discapacidad',name:'Tarjeta de discapacidad',     cat:'Social',         icon:'♿', color:'#f0f0e8',
    desc:'Solicita o renueva la tarjeta nacional de discapacidad.',
    costo:'Gratuito', tiempo:'15–20 días',
    reqs:['Dictamen médico','INE o ID','CURP','Comprobante de domicilio'],
    donde:'DIF Municipal de Cuernavaca o delegaciones IMSS.' },

  { id:'permiso',     name:'Permiso de construcción',     cat:'Obras',          icon:'🏗️', color:'#f8f0e0',
    desc:'Tramita permisos para construir, ampliar o remodelar.',
    costo:'Según proyecto', tiempo:'10–30 días hábiles',
    reqs:['Planos arquitectónicos','Escrituras del predio','Dictamen de uso de suelo','INE del propietario'],
    donde:'Dirección de Obras Públicas, H. Ayuntamiento de Cuernavaca.' },

  { id:'defuncion',   name:'Acta de defunción',           cat:'Registro Civil', icon:'📋', color:'#e8e8e8',
    desc:'Solicita copia certificada de acta de defunción.',
    costo:'$85 MXN', tiempo:'1 día hábil',
    reqs:['Identificación oficial del solicitante','Nombre, fecha y lugar del fallecido'],
    donde:'Registro Civil Municipal de Cuernavaca.' },
];

const CATS = [
  { label:'Identidad',      icon:'🪪', color:'#e8e0c8' },
  { label:'Transporte',     icon:'🚗', color:'#f0e8d8' },
  { label:'Registro Civil', icon:'📜', color:'#e8f0e8' },
  { label:'Hacienda',       icon:'🏠', color:'#f0e8f0' },
  { label:'Fiscal',         icon:'💼', color:'#fff0e0' },
  { label:'Servicios',      icon:'💧', color:'#e0f0f8' },
  { label:'Social',         icon:'♿', color:'#f0f0e8' },
  { label:'Obras',          icon:'🏗️', color:'#f8f0e0' },
];
