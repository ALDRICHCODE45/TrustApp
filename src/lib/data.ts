// TEMPORARY DATA
export let role = "";

export enum Status {
  active = "Activo",
  inactive = "Inactivo",
}

export interface Userlogged {
  role: string;
  name: string;
  id: number;
  email: string;
  avatar: string;
}

export enum Role {
  reclutador = "reclutador",
  generadorLeads = "GL",
  admin = "Admin",
  marketing = "MK",
}

export let usuario_logeado: Userlogged = {
  role: Role.admin,
  name: "John Doe",
  id: 10,
  email: "salvador@topsales.expert",
  avatar:
    "https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200",
};

export enum Oficina {
  "uno" = "Oficina1",
  "dos" = "Oficina2",
  "tres" = "Oficina3",
}

export const UsersData: User[] = [
  {
    id: 10,
    oficina: Oficina.dos,
    UserId: "1234567890",
    age: 19,
    name: "Mike Geller",
    email: "mike@geller.com",
    photo:
      "https://images.pexels.com/photos/428328/pexels-photo-428328.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    rol: Role.generadorLeads,
    status: Status.active,
    clientes: 1,
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 11,
    oficina: Oficina.dos,
    UserId: "1234567890",
    name: "Jay French",
    age: 33,
    email: "jay@gmail.com",
    photo:
      "https://images.pexels.com/photos/1187765/pexels-photo-1187765.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    rol: Role.reclutador,
    status: Status.active,
    placements: 24,
    address: "123 Main St, Anytown, USA",
  },
  {
    oficina: Oficina.dos,
    id: 12,
    UserId: "1234567890",
    name: "Jane Smith",
    age: 55,
    email: "jane@gmail.com",
    photo:
      "https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    rol: Role.generadorLeads,
    status: Status.active,
    clientes: 34,
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 13,
    oficina: Oficina.dos,
    UserId: "1234567890",
    name: "Anna Santiago",
    email: "anna@gmail.com",
    age: 81,
    photo:
      "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    rol: Role.reclutador,
    status: Status.active,
    placements: 25,
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 14,
    oficina: Oficina.uno,
    UserId: "1234567890",
    name: "Allen Black",
    email: "allen@black.com",
    age: 27,
    photo:
      "https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    rol: Role.reclutador,
    status: Status.active,
    placements: 55,
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 15,
    oficina: Oficina.uno,
    UserId: "1234567890",
    name: "Ophelia Castro",
    email: "ophelia@castro.com",
    age: 43,
    photo:
      "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    rol: Role.generadorLeads,
    status: Status.active,
    clientes: 13,
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 16,
    oficina: Oficina.uno,
    UserId: "1234567890",
    name: "Derek Briggs",
    email: "derek@briggs.com",
    age: 33,
    photo:
      "https://images.pexels.com/photos/842980/pexels-photo-842980.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    rol: Role.admin,
    status: Status.active,
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 17,
    oficina: Oficina.uno,
    UserId: "1234567890",
    name: "John Glover",
    age: 28,
    email: "john@glover.com",
    photo:
      "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    rol: Role.reclutador,
    status: Status.active,
    placements: 29,
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 18,
    oficina: Oficina.dos,
    UserId: "1234567890",
    name: "Jonatan",
    email: "john@glover.com",
    age: 21,
    photo:
      "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    rol: Role.generadorLeads,
    clientes: 21,
    status: Status.inactive,
    address: "123 Main St, Anytown, USA",
  },
];

export interface Cuenta {
  fecha: string;
  concepto: string;
  detalle: string;
  subtotal: number;
  iva: number;
  total: number;
}

export const clientesData: Cliente[] = [
  {
    id: 5,
    clienteId: "4455667788",
    origen: "Cold Call",
    usuario: UsersData[11],
    cuenta: "Energy",
    asignadas: 35,
    perdidas: 8,
    canceladas: 12,
    placements: 9,
    tp_placement: 180.25,
    contactos: [
      {
        celular: "55 1111 2222",
        correo: "elena.ruiz@tesla.com",
        nombre: "Elena",
        puesto: "Directora de Energía",
      },
      {
        celular: "55 3333 4444",
        correo: "javier.hernandez@tesla.com",
        nombre: "Javier",
        puesto: "Ingeniero de Proyectos",
      },
    ],
    modalidad: "Anticipo",
    fee: 16,
    dias_credito: 45,
    tipo_factura: "PPD",
    razon_social: "Tesla Energy",
    regimen: "S.A.B. DE C.V.",
    tipo: "Moral",
    rfc: "TES987654321",
    cp: "11310",
    como_factura: "Correo electrónico",
    comentarios: [
      {
        id: 1,
        texto: "Las vacantes que este cliente da son muy dificiles",
        fecha: "12/23/25",
        hora: "9:40am",
        autor: UsersData[0],
        tipo: "Comentario",
      },
      {
        id: 2,
        texto: "Mandar correo al CEO",
        fecha: "12/22/25",
        hora: "2:15pm",
        autor: UsersData[0],
        tipo: "Tarea",
        fechaEntrega: "Vie 26/12/25",
      },
      {
        id: 3,
        texto: "No seguir con este cliente",
        fecha: "12/21/25",
        hora: "11:25am",
        autor: UsersData[0],
        tipo: "Comentario",
      },
    ],
  },
  {
    id: 6,
    clienteId: "6677889900",
    origen: "Evento",
    usuario: UsersData[11],
    cuenta: "Cloud",
    asignadas: 45,
    perdidas: 6,
    canceladas: 10,
    placements: 14,
    tp_placement: 220.0,
    contactos: [
      {
        celular: "55 4444 5555",
        correo: "daniel.sanchez@oracle.com",
        nombre: "Daniel",
        puesto: "Gerente de TI",
      },
      {
        celular: "55 6666 7777",
        correo: "isabel.flores@oracle.com",
        nombre: "Isabel",
        puesto: "Asistente Ejecutiva",
      },
    ],
    modalidad: "Exito",
    fee: 19,
    dias_credito: 60,
    tipo_factura: "PUE",
    razon_social: "Oracle Cloud",
    regimen: "S.A. DE C.V.",
    tipo: "Moral",
    rfc: "ORA010101DEF",
    cp: "06100",
    como_factura: "Portal de proveedores",
    comentarios: [
      {
        id: 1,
        texto: "Las vacantes que este cliente da son muy dificiles",
        fecha: "12/23/25",
        hora: "9:40am",
        autor: UsersData[0],
        tipo: "Comentario",
      },
      {
        id: 2,
        texto: "Mandar correo al CEO",
        fecha: "12/22/25",
        hora: "2:15pm",
        autor: UsersData[0],
        tipo: "Tarea",
        fechaEntrega: "Vie 26/12/25",
      },
      {
        id: 3,
        texto: "No seguir con este cliente",
        fecha: "12/21/25",
        hora: "11:25am",
        autor: UsersData[0],
        tipo: "Comentario",
      },
    ],
  },
];

export const cuentaData: Cuenta[] = [
  {
    fecha: "2023-10-12",
    concepto: "Compra de herramientas",
    detalle: "Martillos y destornilladores",
    subtotal: 800,
    iva: 128,
    total: 928,
  },
  {
    fecha: "2023-10-13",
    concepto: "Clases de música",
    detalle: "Guitarra básica",
    subtotal: 300,
    iva: 48,
    total: 348,
  },
  {
    fecha: "2023-10-14",
    concepto: "Venta de alimentos",
    detalle: "Frutas y verduras",
    subtotal: 200,
    iva: 32,
    total: 232,
  },
  {
    fecha: "2023-10-15",
    concepto: "Reparación de electrodomésticos",
    detalle: "Lavadora",
    subtotal: 400,
    iva: 64,
    total: 464,
  },
  {
    fecha: "2023-10-16",
    concepto: "Compra de calzado",
    detalle: "Zapatos deportivos",
    subtotal: 500,
    iva: 80,
    total: 580,
  },
  {
    fecha: "2023-10-17",
    concepto: "Servicio de catering",
    detalle: "Evento corporativo",
    subtotal: 1000,
    iva: 160,
    total: 1160,
  },
  {
    fecha: "2023-10-18",
    concepto: "Venta de juguetes",
    detalle: "Muñecas y carros",
    subtotal: 600,
    iva: 96,
    total: 696,
  },
  {
    fecha: "2023-10-19",
    concepto: "Consulta veterinaria",
    detalle: "Revisión de mascota",
    subtotal: 250,
    iva: 40,
    total: 290,
  },
  {
    fecha: "2023-10-20",
    concepto: "Compra de muebles de jardín",
    detalle: "Sillones y mesas",
    subtotal: 900,
    iva: 144,
    total: 1044,
  },
  {
    fecha: "2023-10-21",
    concepto: "Clases de baile",
    detalle: "Curso de salsa",
    subtotal: 200,
    iva: 32,
    total: 232,
  },
  {
    fecha: "2023-10-22",
    concepto: "Venta de artesanías",
    detalle: "Collares y pulseras",
    subtotal: 300,
    iva: 48,
    total: 348,
  },
  {
    fecha: "2023-10-23",
    concepto: "Reparación de bicicletas",
    detalle: "Cambio de llantas",
    subtotal: 150,
    iva: 24,
    total: 174,
  },
  {
    fecha: "2023-10-24",
    concepto: "Compra de productos de limpieza",
    detalle: "Detergentes y desinfectantes",
    subtotal: 250,
    iva: 40,
    total: 290,
  },
  {
    fecha: "2023-10-25",
    concepto: "Venta de tecnología",
    detalle: "Tablet y accesorios",
    subtotal: 1100,
    iva: 176,
    total: 1276,
  },
];

export enum Action {
  eliminar = "Eliminar",
  actualizar = "Actualizar",
  Publicar = "Publicar",
}

export interface Log {
  action: Action;
  userId: number;
  username: string;
  fileName: string;
  fecha: string;
  hora: string;
}

export const logs: Log[] = [
  {
    action: Action.Publicar,
    userId: 123,
    username: "carlos.rodriguez",
    fileName: "presentacion_proyecto.pptx",
    fecha: "2023-02-14",
    hora: "4:32:pm",
  },
  {
    action: Action.Publicar,
    userId: 1223,
    username: "raul.mendoza",
    fileName: "manual_usuario_v2.pdf",
    fecha: "2023-02-14",
    hora: "4:32:pm",
  },
  {
    action: Action.eliminar,
    userId: 133,
    username: "isabel.castro",
    fileName: "registro_asistencia.csv",
    fecha: "2023-02-14",
    hora: "4:32:pm",
  },
  {
    action: Action.actualizar,
    userId: 333,
    username: "pedro.ramirez",
    fileName: "propuesta_negocio_nuevo.docx",
    fecha: "2023-02-14",
    hora: "4:32:pm",
  },
  {
    action: Action.Publicar,
    userId: 133,
    username: "camila.vargas",
    fileName: "resultados_encuesta_2023.xlsx",
    fecha: "2023-02-14",
    hora: "4:32:pm",
  },
  {
    action: Action.eliminar,
    userId: 134,
    username: "fernando.gutierrez",
    fileName: "backup_datos.zip",
    fecha: "2023-02-14",
    hora: "4:32:pm",
  },
  {
    action: Action.actualizar,
    userId: 4332,
    username: "valentina.sanchez",
    fileName: "calendario_eventos_actualizado.ics",
    fecha: "2023-02-14",
    hora: "4:32:pm",
  },
  {
    action: Action.Publicar,
    userId: 3432,
    username: "andres.diaz",
    fileName: "politicas_empresa_v3.pdf",
    fecha: "2023-02-14",
    hora: "4:32:pm",
  },
];

export interface Candidato {
  nombre: string;
  telefono: string;
  correo: string;
  foto: string;
  cv: string; // Archivo representado como string por ahora
}

type TipoComentario = "Tarea" | "Comentario";

// Interface del comentario

export interface Comentario {
  id: number;
  texto: string;
  fecha: string; // formato: dd/mm/yy
  hora: string; // formato: h:mma
  autor: User;
  tipo: TipoComentario;
  fechaEntrega?: string; // Opcional, solo para tareas - formato: "Lun dd/mm/yy"
}

export interface Vacante {
  id: number;
  fechaAsignacion: Date;
  reclutador: User;
  tipo: "Nueva" | "Garantia";
  estado: "Hunting" | "Cancelada" | "Entrevistas" | "Perdida" | "Placement";
  puesto: string;
  comentarios: Comentario[]; // Múltiples comentarios por vacante
  tiempoTranscurrido: number; // Días transcurridos
  prioridad: "Alta" | "Media" | "Baja";
  fechaEntrega: string;
  fechaUltimaTerna: Date | null;
  duracionTotal: number; // Tiempo total en días
  fechaOferta: Date | null;
  candidatoContratado?: {
    nombre: string;
    cv: string; // Archivo representado como string
  } | null;
  salario: number;
  fechaComision: Date | null;
  monto: number;
  valorFactura: number;
  fee: number;
  cliente: Cliente;
  checklist: string; // Archivo representado como string
  muestraPerfil: string; // Archivo representado como string
  ternaFinal: Candidato[]; // Lista de 3 candidatos con su información
}

export const vacantes: Vacante[] = [
  {
    id: 10,
    fechaAsignacion: new Date(),
    reclutador: UsersData[0],
    tipo: "Nueva",
    estado: "Hunting",
    puesto: "Project Manager",
    comentarios: [
      {
        id: 1,
        texto:
          "Reemplazo por salida a competencia. Buscamos PMP certificado con experiencia en proyectos digitales.",
        fecha: "2023-12-10",
        autor: UsersData[0],
        hora: "11:15am",
        fechaEntrega: "Mar 09/01/24",
        tipo: "Tarea",
      },
      {
        id: 2,
        texto:
          "Candidato seleccionado: Héctor Ramírez. Negociando condiciones finales de contratación.",
        fecha: "2024-01-20",
        autor: UsersData[0],
        hora: "3:30pm",
        fechaEntrega: "Vie 26/01/24",
        tipo: "Tarea",
      },
    ],
    tiempoTranscurrido: 41,
    prioridad: "Alta",
    fechaEntrega: "2024-01-31",
    fechaUltimaTerna: new Date(),
    duracionTotal: 41,
    fechaOferta: new Date(),
    salario: 72000,
    fechaComision: null,
    monto: 12960,
    valorFactura: 0,
    fee: 18,
    cliente: clientesData[0],
    checklist: "checklist_10.pdf",
    muestraPerfil: "perfil_10.pdf",
    ternaFinal: [],
  },
  {
    id: 11,
    fechaAsignacion: new Date(),
    reclutador: UsersData[1],
    tipo: "Nueva",
    estado: "Hunting",
    puesto: "Machine Learning Engineer",
    comentarios: [
      {
        id: 1,
        texto:
          "Nueva posición para equipo de IA. Experiencia con TensorFlow, PyTorch y modelos de NLP requerida.",
        fecha: "2024-02-05",
        autor: UsersData[1],
        hora: "10:00am",
        fechaEntrega: "Lun 26/02/24",
        tipo: "Tarea",
      },
    ],
    tiempoTranscurrido: 1,
    prioridad: "Alta",
    fechaEntrega: "2024-03-20",
    fechaUltimaTerna: new Date(),
    duracionTotal: 0,
    fechaOferta: null,
    salario: 85000,
    fechaComision: null,
    monto: 0,
    valorFactura: 0,
    fee: 20,
    cliente: clientesData[0],
    checklist: "checklist_11.pdf",
    muestraPerfil: "perfil_11.pdf",
    ternaFinal: [],
  },
  {
    id: 12,
    fechaAsignacion: new Date(),
    reclutador: UsersData[2],
    tipo: "Garantia",
    estado: "Entrevistas",
    puesto: "UX Researcher",
    comentarios: [
      {
        id: 1,
        texto:
          "Reemplazo por promoción interna. Buscamos perfil con experiencia en investigación cualitativa y cuantitativa.",
        fecha: "2024-01-12",
        autor: UsersData[2],
        hora: "1:20pm",
        fechaEntrega: "Vie 02/02/24",
        tipo: "Comentario",
      },
      {
        id: 2,
        texto:
          "Preseleccionados 4 candidatos. Programando entrevistas con equipo de diseño.",
        fecha: "2024-01-29",
        autor: UsersData[2],
        hora: "11:45am",
        fechaEntrega: "Jue 08/02/24",
        tipo: "Tarea",
      },
    ],
    tiempoTranscurrido: 25,
    prioridad: "Media",
    fechaEntrega: "2024-02-25",
    fechaUltimaTerna: null,
    duracionTotal: 0,
    fechaOferta: null,
    salario: 60000,
    fechaComision: null,
    monto: 0,
    valorFactura: 0,
    fee: 17,
    cliente: clientesData[1],
    checklist: "checklist_12.pdf",
    muestraPerfil: "perfil_12.pdf",
    ternaFinal: [],
  },
  {
    id: 13,
    fechaAsignacion: new Date(),
    reclutador: UsersData[0],
    tipo: "Nueva",
    estado: "Entrevistas",
    puesto: "Mobile Developer (iOS)",
    comentarios: [
      {
        id: 1,
        texto:
          "Nueva posición para desarrollo de app nativa iOS. Swift y experiencia con ARKit requeridos.",
        fecha: "2023-11-20",
        autor: UsersData[0],
        hora: "9:55am",
        fechaEntrega: "Mié 20/12/23",
        tipo: "Tarea",
      },
      {
        id: 2,
        texto:
          "Candidato seleccionado: Manuel Torres. Aceptó oferta e inicia en enero.",
        fecha: "2023-12-15",
        autor: UsersData[0],
        hora: "2:10pm",
        fechaEntrega: "Vie 29/12/23",
        tipo: "Tarea",
      },
    ],
    tiempoTranscurrido: 25,
    prioridad: "Alta",
    fechaEntrega: "2023-12-31",
    fechaUltimaTerna: new Date(),
    duracionTotal: 40,
    fechaOferta: new Date(),
    salario: 65000,
    fechaComision: new Date(),
    monto: 11700,
    valorFactura: 14040,
    fee: 18,
    cliente: clientesData[2],
    checklist: "checklist_13.pdf",
    muestraPerfil: "perfil_13.pdf",
    ternaFinal: [],
  },
  {
    id: 14,
    fechaAsignacion: new Date(),
    reclutador: UsersData[1],
    tipo: "Garantia",
    estado: "Placement",
    puesto: "Cloud Architect",
    comentarios: [
      {
        id: 1,
        texto:
          "Reemplazo urgente para posición estratégica. Experiencia con AWS, Azure y arquitecturas serverless.",
        fecha: "2024-01-05",
        autor: UsersData[1],
        hora: "10:30am",
        fechaEntrega: "Lun 29/01/24",
        tipo: "Tarea",
      },
      {
        id: 2,
        texto:
          "Presentada terna de candidatos senior al CTO. Esperando feedback para avanzar.",
        fecha: "2024-01-28",
        autor: UsersData[1],
        hora: "4:25pm",
        fechaEntrega: "Vie 02/02/24",
        tipo: "Tarea",
      },
    ],
    tiempoTranscurrido: 32,
    prioridad: "Alta",
    fechaEntrega: "2024-02-15",
    fechaUltimaTerna: new Date(),
    duracionTotal: 23,
    fechaOferta: null,
    salario: 90000,
    fechaComision: null,
    monto: 0,
    valorFactura: 0,
    fee: 20,
    cliente: clientesData[0],
    checklist: "checklist_14.pdf",
    muestraPerfil: "perfil_14.pdf",
    ternaFinal: [],
  },
  {
    id: 15,
    fechaAsignacion: new Date(),
    reclutador: UsersData[2],
    tipo: "Nueva",
    estado: "Entrevistas",
    puesto: "Business Intelligence Analyst",
    comentarios: [
      {
        id: 1,
        texto:
          "Nueva posición para equipo de datos. Experiencia con PowerBI, SQL y modelado de datos necesaria.",
        fecha: "2023-12-12",
        autor: UsersData[2],
        hora: "11:40am",
        fechaEntrega: "Vie 12/01/24",
        tipo: "Tarea",
      },
      {
        id: 2,
        texto:
          "Candidata finalista: Adriana Vega. Preparando propuesta económica para aprobación.",
        fecha: "2024-01-15",
        autor: UsersData[2],
        hora: "3:05pm",
        fechaEntrega: "Mié 24/01/24",
        tipo: "Tarea",
      },
    ],
    tiempoTranscurrido: 53,
    prioridad: "Media",
    fechaEntrega: "2024-01-31",
    fechaUltimaTerna: new Date(),
    duracionTotal: 53,
    fechaOferta: new Date(),
    salario: 62000,
    fechaComision: null,
    monto: 9920,
    valorFactura: 0,
    fee: 16,
    cliente: clientesData[2],
    checklist: "checklist_15.pdf",
    muestraPerfil: "perfil_15.pdf",
    ternaFinal: [],
  },
  {
    id: 16,
    fechaAsignacion: new Date(),
    reclutador: UsersData[0],
    tipo: "Nueva",
    estado: "Hunting",
    puesto: "Systems Administrator",
    comentarios: [
      {
        id: 1,
        texto:
          "Reemplazo por jubilación. Perfil con experiencia en Linux, Windows Server y virtualización.",
        fecha: "2024-02-01",
        autor: UsersData[0],
        hora: "9:10am",
        fechaEntrega: "Lun 19/02/24",
        tipo: "Tarea",
      },
    ],
    tiempoTranscurrido: 5,
    prioridad: "Media",
    fechaEntrega: "2024-03-10",
    fechaUltimaTerna: null,
    duracionTotal: 0,
    fechaOferta: null,
    salario: 55000,
    fechaComision: null,
    monto: 0,
    valorFactura: 0,
    fee: 15,
    cliente: clientesData[1],
    checklist: "checklist_16.pdf",
    muestraPerfil: "perfil_16.pdf",
    ternaFinal: [],
  },
  {
    id: 17,
    fechaAsignacion: new Date(),
    reclutador: UsersData[1],
    tipo: "Nueva",
    estado: "Entrevistas",
    puesto: "SEO Specialist",
    comentarios: [
      {
        id: 1,
        texto:
          "Nueva posición para equipo de marketing digital. Experiencia en posicionamiento y analítica web.",
        fecha: "2024-01-10",
        autor: UsersData[1],
        hora: "2:30pm",
        fechaEntrega: "Mar 06/02/24",
        tipo: "Tarea",
      },
      {
        id: 2,
        texto:
          "Realizando entrevistas a 5 candidatos preseleccionados. Interesante perfil de Sara Martín.",
        fecha: "2024-01-28",
        autor: UsersData[1],
        hora: "10:50am",
        fechaEntrega: "Jue 08/02/24",
        tipo: "Tarea",
      },
    ],
    tiempoTranscurrido: 25,
    prioridad: "Media",
    fechaEntrega: "2024-02-25",
    fechaUltimaTerna: null,
    duracionTotal: 0,
    fechaOferta: null,
    salario: 48000,
    fechaComision: null,
    monto: 0,
    valorFactura: 0,
    fee: 15,
    cliente: clientesData[2],
    checklist: "checklist_17.pdf",
    muestraPerfil: "perfil_17.pdf",
    ternaFinal: [],
  },
  {
    id: 18,
    fechaAsignacion: new Date(),
    reclutador: UsersData[2],
    tipo: "Nueva",
    estado: "Hunting",
    puesto: "HR Business Partner",
    comentarios: [
      {
        id: 1,
        texto:
          "Reemplazo por baja voluntaria. Experiencia en gestión de talento en empresas tecnológicas.",
        fecha: "2023-10-20",
        autor: UsersData[2],
        hora: "9:25am",
        fechaEntrega: "Vie 17/11/23",
        tipo: "Comentario",
      },
      {
        id: 2,
        texto:
          "Proceso finalizado exitosamente. Incorporada: Lucía Domínguez. Feedback muy positivo.",
        fecha: "2023-11-25",
        autor: UsersData[2],
        hora: "1:15pm",
        fechaEntrega: "Mié 06/12/23",
        tipo: "Tarea",
      },
    ],
    tiempoTranscurrido: 36,
    prioridad: "Alta",
    fechaEntrega: "2023-11-30",
    fechaUltimaTerna: new Date(),
    duracionTotal: 41,
    fechaOferta: new Date(),
    salario: 58000,
    fechaComision: new Date(),
    monto: 9280,
    valorFactura: 11136,
    fee: 16,
    cliente: clientesData[0],
    checklist: "checklist_18.pdf",
    muestraPerfil: "perfil_18.pdf",
    ternaFinal: [],
  },
  {
    id: 1,
    fechaAsignacion: new Date(),
    reclutador: UsersData[0],
    tipo: "Nueva",
    estado: "Hunting",
    puesto: "UI/UX Designer",
    comentarios: [
      {
        id: 1,
        texto:
          "Iniciando búsqueda de candidatos con experiencia en diseño de interfaces para aplicaciones móviles.",
        fecha: "2024-01-15",
        autor: UsersData[0],
        hora: "9:40pm",
        fechaEntrega: "Vie 26/12/25",
        tipo: "Tarea",
      },
    ],
    tiempoTranscurrido: 5,
    prioridad: "Alta",
    fechaEntrega: "2024-02-15",
    fechaUltimaTerna: null,
    duracionTotal: 0,
    fechaOferta: null,
    salario: 45000,
    fechaComision: null,
    monto: 0,
    valorFactura: 0,
    fee: 15,
    cliente: clientesData[0],
    checklist: "checklist_1.pdf",
    muestraPerfil: "perfil_1.pdf",
    ternaFinal: [],
  },
  {
    id: 1,
    fechaAsignacion: new Date(),
    reclutador: UsersData[2],
    tipo: "Nueva",
    cliente: clientesData[2],
    estado: "Hunting",
    puesto: "Frontend",
    comentarios: [
      {
        id: 1,
        texto:
          "Candidato confirmó disponibilidad para entrevista la próxima semana. Pendiente de confirmar horario específico.",
        fecha: "12/23/25",
        hora: "9:40am",
        autor: UsersData[0],
        tipo: "Comentario",
      },
      {
        id: 2,
        texto:
          "Preparar presentación de la vacante para el cliente. Incluir perfiles preseleccionados y timeline estimado.",
        fecha: "12/22/25",
        hora: "2:15pm",
        autor: UsersData[1],
        tipo: "Tarea",
        fechaEntrega: "Vie 26/12/25",
      },
      {
        id: 3,
        texto:
          "Cliente solicitó modificar el perfil de la posición. Requieren mayor experiencia en React y conocimientos de AWS.",
        fecha: "12/21/25",
        hora: "11:25am",
        autor: UsersData[1],
        tipo: "Comentario",
      },
    ],
    tiempoTranscurrido: 10,
    prioridad: "Alta",
    fechaEntrega: "2023-02-15",
    fechaUltimaTerna: new Date(),
    duracionTotal: 30,
    fechaOferta: null,
    candidatoContratado: {
      nombre: "Francisco Javier",
      cv: "cv.pdf",
    },
    salario: 50000,
    fechaComision: null,
    monto: 10000,
    valorFactura: 12000,
    fee: 20,
    checklist: "checklist.pdf",
    muestraPerfil: "perfil.pdf",
    ternaFinal: [
      {
        nombre: "Ana López",
        telefono: "555-1234",
        correo: "ana.lopez@example.com",
        foto: "ana.jpg",
        cv: "ana_cv.pdf",
      },
      {
        nombre: "Carlos Ruiz",
        telefono: "555-5678",
        correo: "carlos.ruiz@example.com",
        foto: "carlos.jpg",
        cv: "carlos_cv.pdf",
      },
      {
        nombre: "María González",
        telefono: "555-8765",
        correo: "maria.gonzalez@example.com",
        foto: "maria.jpg",
        cv: "maria_cv.pdf",
      },
    ],
  },
  {
    id: 2,
    fechaAsignacion: new Date(),
    reclutador: UsersData[2],
    tipo: "Garantia",
    cliente: clientesData[0],
    estado: "Entrevistas",
    puesto: "Backend",
    comentarios: [
      {
        id: 4,
        texto:
          "Coordinar entrevistas técnicas con el equipo de desarrollo. Necesitamos al menos 3 entrevistadores disponibles.",
        fecha: "12/20/25",
        hora: "4:50pm",
        autor: UsersData[0],
        tipo: "Tarea",
        fechaEntrega: "Mar 24/12/25",
      },
      {
        id: 5,
        texto:
          "Entrevista con María González cancelada. Reprogramar para la próxima semana y confirmar disponibilidad.",
        fecha: "12/19/25",
        hora: "10:05am",
        autor: UsersData[0],
        tipo: "Tarea",
        fechaEntrega: "Lun 23/12/25",
      },
      {
        id: 6,
        texto:
          "Feedback positivo del equipo técnico sobre el candidato Juan Pérez. Avanzan a la siguiente fase del proceso.",
        fecha: "12/18/25",
        hora: "3:30pm",
        autor: UsersData[1],
        tipo: "Comentario",
      },
      {
        id: 7,
        texto:
          "Actualizar estado de la vacante en el dashboard principal y enviar reporte semanal al cliente.",
        fecha: "12/17/25",
        hora: "8:55am",
        autor: UsersData[1],
        tipo: "Tarea",
        fechaEntrega: "Jue 19/12/25",
      },
    ],
    tiempoTranscurrido: 20,
    prioridad: "Media",
    fechaEntrega: "2023-03-01",
    fechaUltimaTerna: new Date(),
    duracionTotal: 45,
    fechaOferta: new Date(),
    candidatoContratado: {
      nombre: "Pedro Sánchez",
      cv: "pedro_cv.pdf",
    },
    salario: 60000,
    fechaComision: new Date(),
    monto: 12000,
    valorFactura: 14400,
    fee: 20,
    checklist: "checklist.pdf",
    muestraPerfil: "perfil.pdf",
    ternaFinal: [
      {
        nombre: "Pedro Sánchez",
        telefono: "555-4321",
        correo: "pedro.sanchez@example.com",
        foto: "pedro.jpg",
        cv: "pedro_cv.pdf",
      },
      {
        nombre: "Lucía Fernández",
        telefono: "555-6543",
        correo: "lucia.fernandez@example.com",
        foto: "lucia.jpg",
        cv: "lucia_cv.pdf",
      },
      {
        nombre: "Jorge Díaz",
        telefono: "555-9876",
        correo: "jorge.diaz@example.com",
        foto: "jorge.jpg",
        cv: "jorge_cv.pdf",
      },
    ],
  },
];

export interface Factura {
  id: number;
  folio: string;
  clientId: number;
  vacanteId: number;
  tipo: string;
  fecha_emision: string;
  fecha_pago: string;
  status: string;
  complemento: boolean;
  anticipo: number;
  banco: string;
}

export const dataFactura: Factura[] = [
  {
    id: 1,
    folio: "FAC-001",
    clientId: 1,
    vacanteId: 1,
    tipo: "Full",
    fecha_emision: "2023-10-01",
    fecha_pago: "2023-10-10",
    status: "Pagada",
    complemento: false,
    anticipo: 0,
    banco: "Banco A",
  },
  {
    id: 2,
    folio: "FAC-002",
    clientId: 2,
    vacanteId: 2,
    tipo: "LIQ",
    fecha_emision: "2023-10-02",
    fecha_pago: "2023-10-11",
    status: "Pendiente",
    complemento: true,
    anticipo: 100,
    banco: "Banco B",
  },
];

export enum LeadStatus {
  Contacto = "Contacto",
  SocialSelling = "S.S",
  ContactoCalido = "C.C",
  Prospecto = "Prospecto",
  CitaAgendada = "C.A",
  CitaValidada = "C.V",
  Cliente = "Cliente",
}

interface ContactoLead {
  name: string;
  posicion: string;
}

// Actualizamos la interfaz para usar el enum en el campo status
export interface Lead {
  empresa: string;
  sector: string;
  generadorLeads: User;
  link: string;
  fechaProspeccion: string;
  contactos: ContactoLead[];
  fechaAConectar: string;
  status: LeadStatus; // Usamos el enum aquí
  origen: string;
}

export const leadsData: Lead[] = [
  {
    empresa: "TastyDelight Foods",
    sector: "Alimentos",
    generadorLeads: UsersData.find((lead) => lead.id === 18)!,
    link: "https://tastydelightfoods.com",
    fechaProspeccion: "2023-10-05",
    contactos: [{ name: "Laura Gomez", posicion: "Gerente Producto" }],
    fechaAConectar: "2023-10-12",
    status: LeadStatus.CitaAgendada,
    origen: "Pagina web",
  },
  {
    empresa: "GlobalLogistics Hub",
    sector: "Logística",
    generadorLeads: UsersData.find((lead) => lead.id === 18)!,
    link: "https://globallogisticshub.com",
    fechaProspeccion: "2023-10-06",
    contactos: [{ name: "Laura Gomez", posicion: "Gerente Producto" }],
    fechaAConectar: "2023-10-13",
    status: LeadStatus.CitaValidada,
    origen: "GL",
  },
  {
    empresa: "BrightFuture Education",
    sector: "Educación",
    generadorLeads: UsersData.find((lead) => lead.id === 18)!,
    link: "https://brightfutureeducation.com",
    fechaProspeccion: "2023-10-07",
    contactos: [{ name: "Laura Gomez", posicion: "Gerente Producto" }],
    fechaAConectar: "2023-10-14",
    status: LeadStatus.Contacto,
    origen: "Linkedin",
  },
  {
    empresa: "ChicStyle Fashion",
    sector: "Moda",
    generadorLeads: UsersData.find((lead) => lead.id === 15)!,
    link: "https://chicstylefashion.com",
    fechaProspeccion: "2023-10-08",
    contactos: [{ name: "Laura Gomez", posicion: "Gerente Producto" }],
    fechaAConectar: "2023-10-15",
    status: LeadStatus.SocialSelling,
    origen: "Linkedin",
  },
  {
    empresa: "QuantumTech Labs",
    sector: "Tecnología",
    generadorLeads: UsersData.find((lead) => lead.id === 15)!,
    link: "https://quantumtechlabs.com",
    fechaProspeccion: "2023-10-09",
    contactos: [{ name: "Laura Gomez", posicion: "Gerente Producto" }],
    fechaAConectar: "2023-10-16",
    status: LeadStatus.ContactoCalido,
    origen: "Linkedin",
  },
  {
    empresa: "GreenWave Energy",
    sector: "Energía",
    generadorLeads: UsersData.find((lead) => lead.id === 15)!,
    link: "https://greenwaveenergy.com",
    fechaProspeccion: "2023-10-10",
    contactos: [{ name: "Laura Gomez", posicion: "Gerente Producto" }],
    fechaAConectar: "2023-10-17",
    status: LeadStatus.Prospecto,
    origen: "Linkedin",
  },
  {
    empresa: "WellnessCare Health",
    sector: "Salud",
    generadorLeads: UsersData.find((lead) => lead.id === 12)!,
    link: "https://wellnesscarehealth.com",
    fechaProspeccion: "2023-10-11",
    contactos: [{ name: "Laura Gomez", posicion: "Gerente Producto" }],
    fechaAConectar: "2023-10-18",
    status: LeadStatus.CitaAgendada,
    origen: "Linkedin",
  },
  {
    empresa: "GourmetDelight Foods",
    sector: "Alimentos",
    generadorLeads: UsersData.find((lead) => lead.id === 12)!,
    link: "https://gourmetdelightfoods.com",
    fechaProspeccion: "2023-10-12",
    contactos: [{ name: "Laura Gomez", posicion: "Gerente Producto" }],
    fechaAConectar: "2023-10-19",
    status: LeadStatus.CitaValidada,
    origen: "Linkedin",
  },
];

export interface User {
  oficina: Oficina;
  id: number;
  UserId: string;
  age: number;
  name: string;
  email: string;
  photo: string;
  phone: string;
  rol: Role;
  status: Status;
  clientes?: number;
  placements?: number;
  address: string;
}

interface Contacto {
  nombre: string;
  puesto: string;
  correo: string;
  celular: string;
}

export interface Cliente {
  id: number;
  clienteId: string;
  origen: string;
  usuario: User;
  cuenta: string;
  asignadas: number;
  perdidas: number;
  canceladas: number;
  placements: number;
  tp_placement: number;
  contactos: Contacto[];
  modalidad: string;
  fee: number;
  dias_credito: number;
  tipo_factura: string;
  razon_social: string;
  regimen: string;
  tipo: string;
  rfc: string;
  cp: string;
  como_factura: string;
  portal_site?: string;
  comentarios: Comentario[];
}
