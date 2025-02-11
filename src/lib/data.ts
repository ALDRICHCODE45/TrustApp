import { type Event } from "react-big-calendar";

// TEMPORARY DATA
export let role = "admin";

export let usuario_logeado = {
  role: "admin",
  name: "Salvador Perea",
  id: 9,
};

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
}

export const logs: Log[] = [
  {
    action: Action.eliminar,
    userId: 123,
    username: "juan.perez",
    fileName: "reporte_enero.pdf",
  },
  {
    action: Action.actualizar,
    userId: 123,
    username: "maria.gomez",
    fileName: "presupuesto_febrero.xlsx",
  },
  {
    action: Action.Publicar,
    userId: 123,
    username: "carlos.rodriguez",
    fileName: "presentacion_proyecto.pptx",
  },
  {
    action: Action.eliminar,
    userId: 123,
    username: "ana.martinez",
    fileName: "contrato_cliente.docx",
  },
  {
    action: Action.actualizar,
    userId: 123,
    username: "luis.torres",
    fileName: "plan_marketing_marzo.pdf",
  },
  {
    action: Action.Publicar,
    userId: 123,
    username: "sofia.lopez",
    fileName: "informe_trimestral_final.docx",
  },
  {
    action: Action.eliminar,
    userId: 123,
    username: "javier.hernandez",
    fileName: "factura_12345.pdf",
  },
  {
    action: Action.actualizar,
    userId: 123,
    username: "diana.flores",
    fileName: "hoja_vida_empleado.xlsx",
  },
  {
    action: Action.Publicar,
    userId: 1223,
    username: "raul.mendoza",
    fileName: "manual_usuario_v2.pdf",
  },
  {
    action: Action.eliminar,
    userId: 133,
    username: "isabel.castro",
    fileName: "registro_asistencia.csv",
  },
  {
    action: Action.actualizar,
    userId: 333,
    username: "pedro.ramirez",
    fileName: "propuesta_negocio_nuevo.docx",
  },
  {
    action: Action.Publicar,
    userId: 133,
    username: "camila.vargas",
    fileName: "resultados_encuesta_2023.xlsx",
  },
  {
    action: Action.eliminar,
    userId: 134,
    username: "fernando.gutierrez",
    fileName: "backup_datos.zip",
  },
  {
    action: Action.actualizar,
    userId: 4332,
    username: "valentina.sanchez",
    fileName: "calendario_eventos_actualizado.ics",
  },
  {
    action: Action.Publicar,
    userId: 3432,
    username: "andres.diaz",
    fileName: "politicas_empresa_v3.pdf",
  },
];

export interface Candidato {
  nombre: string;
  telefono: string;
  correo: string;
  foto: string;
  cv: string; // Archivo representado como string por ahora
}

export interface Vacante {
  año: number;
  reclutador: string;
  tipo: "Nueva" | "Recompra";
  estado: "Hunting" | "Cancelada" | "Entrevistas" | "Perdida" | "Placement";
  puesto: string;
  comentarios: string[]; // Múltiples comentarios por vacante
  tiempoTranscurrido: number; // Días transcurridos
  prioridad: "Alta" | "Media" | "Baja";
  mesAsignado: string;
  fechaEntrega: string;
  fechaUltimaTerna: string;
  duracionTotal: number; // Tiempo total en días
  fechaOferta: string | null;
  candidatoContratado?: {
    nombre: string;
    cv: string; // Archivo representado como string
  } | null;
  salario: number;
  fechaComision: string | null;
  monto: number;
  valorFactura: number;
  fee: number;
  checklist: string; // Archivo representado como string
  muestraPerfil: string; // Archivo representado como string
  ternaFinal: Candidato[]; // Lista de 3 candidatos con su información
}

export const vacantes: Vacante[] = [
  {
    año: 2023,
    reclutador: "Juan Pérez",
    tipo: "Nueva",
    estado: "Hunting",
    puesto: "Desarrollador Frontend",
    comentarios: [
      "Buscando candidatos con experiencia en React",
      "Prioridad alta",
    ],
    tiempoTranscurrido: 10,
    prioridad: "Alta",
    mesAsignado: "Enero",
    fechaEntrega: "2023-02-15",
    fechaUltimaTerna: "2023-02-10",
    duracionTotal: 30,
    fechaOferta: null,
    candidatoContratado: null,
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
    año: 2023,
    reclutador: "Laura Martínez",
    tipo: "Recompra",
    estado: "Entrevistas",
    puesto: "Desarrollador Backend",
    comentarios: [
      "Segunda ronda de entrevistas",
      "Candidato fuerte en Node.js",
    ],
    tiempoTranscurrido: 20,
    prioridad: "Media",
    mesAsignado: "Febrero",
    fechaEntrega: "2023-03-01",
    fechaUltimaTerna: "2023-02-25",
    duracionTotal: 45,
    fechaOferta: "2023-02-28",
    candidatoContratado: {
      nombre: "Pedro Sánchez",
      cv: "pedro_cv.pdf",
    },
    salario: 60000,
    fechaComision: "2023-03-15",
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
  // ... (38 items más)
];

// Nota: Puedes continuar agregando más items siguiendo el mismo formato.

export enum LeadStatus {
  Contacto = "Contacto",
  SocialSelling = "S.S",
  ContactoCalido = "C.C",
  Prospecto = "Prospecto",
  CitaAgendada = "C.A",
  CitaValidada = "C.V",
  Cliente = "Cliente",
}

// Actualizamos la interfaz para usar el enum en el campo status
export interface Lead {
  empresa: string;
  sector: string;
  generadorLeads: string;
  link: string;
  fechaProspeccion: string;
  contacto: string;
  posicion: string;
  fechaAConectar: string;
  status: LeadStatus; // Usamos el enum aquí
}

export const leadsData: Lead[] = [
  {
    empresa: "Innovatech Solutions",
    sector: "Tecnología",
    generadorLeads: "Carlos Mendoza",
    link: "https://innovatechsolutions.com",
    fechaProspeccion: "2023-09-25",
    contacto: "Laura González",
    posicion: "Gerente de Producto",
    fechaAConectar: "2023-10-02",
    status: LeadStatus.Contacto,
  },
  {
    empresa: "PowerGrid Energy",
    sector: "Energía",
    generadorLeads: "María Fernández",
    link: "https://powergridenergy.com",
    fechaProspeccion: "2023-09-26",
    contacto: "Javier Torres",
    posicion: "Director de Energías Renovables",
    fechaAConectar: "2023-10-03",
    status: LeadStatus.SocialSelling,
  },
  {
    empresa: "MedLife Clinics",
    sector: "Salud",
    generadorLeads: "Ricardo López",
    link: "https://medlifeclinics.com",
    fechaProspeccion: "2023-09-27",
    contacto: "Ana Ramírez",
    posicion: "Coordinadora Médica",
    fechaAConectar: "2023-10-04",
    status: LeadStatus.ContactoCalido,
  },
  {
    empresa: "FreshBites Foods",
    sector: "Alimentos",
    generadorLeads: "Sofía Morales",
    link: "https://freshbitesfoods.com",
    fechaProspeccion: "2023-09-28",
    contacto: "Diego Sánchez",
    posicion: "Gerente de Desarrollo de Productos",
    fechaAConectar: "2023-10-05",
    status: LeadStatus.Prospecto,
  },
  {
    empresa: "SwiftLogistics",
    sector: "Logística",
    generadorLeads: "Luisa Castro",
    link: "https://swiftlogistics.com",
    fechaProspeccion: "2023-09-29",
    contacto: "Miguel Díaz",
    posicion: "Director de Operaciones Logísticas",
    fechaAConectar: "2023-10-06",
    status: LeadStatus.CitaAgendada,
  },
  {
    empresa: "LearnSmart Education",
    sector: "Educación",
    generadorLeads: "Patricia Vargas",
    link: "https://learnsmarteducation.com",
    fechaProspeccion: "2023-09-30",
    contacto: "Raúl Martínez",
    posicion: "Director Académico",
    fechaAConectar: "2023-10-07",
    status: LeadStatus.CitaValidada,
  },
  {
    empresa: "StyleVogue Fashion",
    sector: "Moda",
    generadorLeads: "Gabriel Hernández",
    link: "https://stylevoguefashion.com",
    fechaProspeccion: "2023-10-01",
    contacto: "Isabel Pérez",
    posicion: "Diseñadora Principal",
    fechaAConectar: "2023-10-08",
    status: LeadStatus.Contacto,
  },
  {
    empresa: "CloudTech Innovations",
    sector: "Tecnología",
    generadorLeads: "Fernando Gómez",
    link: "https://cloudtechinnovations.com",
    fechaProspeccion: "2023-10-02",
    contacto: "Carolina López",
    posicion: "Gerente de Soluciones en la Nube",
    fechaAConectar: "2023-10-09",
    status: LeadStatus.SocialSelling,
  },
  {
    empresa: "SolarWave Energy",
    sector: "Energía",
    generadorLeads: "Daniela Ramírez",
    link: "https://solarwaveenergy.com",
    fechaProspeccion: "2023-10-03",
    contacto: "Alejandro Torres",
    posicion: "Ingeniero de Proyectos Solares",
    fechaAConectar: "2023-10-10",
    status: LeadStatus.ContactoCalido,
  },
  {
    empresa: "CarePlus Health",
    sector: "Salud",
    generadorLeads: "Martín Sánchez",
    link: "https://careplushealth.com",
    fechaProspeccion: "2023-10-04",
    contacto: "Valeria Díaz",
    posicion: "Directora de Servicios de Salud",
    fechaAConectar: "2023-10-11",
    status: LeadStatus.Prospecto,
  },
  {
    empresa: "TastyDelight Foods",
    sector: "Alimentos",
    generadorLeads: "Camila Morales",
    link: "https://tastydelightfoods.com",
    fechaProspeccion: "2023-10-05",
    contacto: "Roberto Castro",
    posicion: "Gerente de Marketing Alimenticio",
    fechaAConectar: "2023-10-12",
    status: LeadStatus.CitaAgendada,
  },
  {
    empresa: "GlobalLogistics Hub",
    sector: "Logística",
    generadorLeads: "Javier Vargas",
    link: "https://globallogisticshub.com",
    fechaProspeccion: "2023-10-06",
    contacto: "Natalia López",
    posicion: "Directora de Estrategia Logística",
    fechaAConectar: "2023-10-13",
    status: LeadStatus.CitaValidada,
  },
  {
    empresa: "BrightFuture Education",
    sector: "Educación",
    generadorLeads: "Sandra Hernández",
    link: "https://brightfutureeducation.com",
    fechaProspeccion: "2023-10-07",
    contacto: "Oscar Martínez",
    posicion: "Director de Innovación Educativa",
    fechaAConectar: "2023-10-14",
    status: LeadStatus.Contacto,
  },
  {
    empresa: "ChicStyle Fashion",
    sector: "Moda",
    generadorLeads: "Rafael Gómez",
    link: "https://chicstylefashion.com",
    fechaProspeccion: "2023-10-08",
    contacto: "Lucía Ramírez",
    posicion: "Diseñadora Creativa",
    fechaAConectar: "2023-10-15",
    status: LeadStatus.SocialSelling,
  },
  {
    empresa: "QuantumTech Labs",
    sector: "Tecnología",
    generadorLeads: "Verónica Torres",
    link: "https://quantumtechlabs.com",
    fechaProspeccion: "2023-10-09",
    contacto: "Daniel Sánchez",
    posicion: "Gerente de Investigación Tecnológica",
    fechaAConectar: "2023-10-16",
    status: LeadStatus.ContactoCalido,
  },
  {
    empresa: "GreenWave Energy",
    sector: "Energía",
    generadorLeads: "Andrés López",
    link: "https://greenwaveenergy.com",
    fechaProspeccion: "2023-10-10",
    contacto: "Elena Díaz",
    posicion: "Directora de Energías Limpias",
    fechaAConectar: "2023-10-17",
    status: LeadStatus.Prospecto,
  },
  {
    empresa: "WellnessCare Health",
    sector: "Salud",
    generadorLeads: "Carmen Castro",
    link: "https://wellnesscarehealth.com",
    fechaProspeccion: "2023-10-11",
    contacto: "Héctor Martínez",
    posicion: "Coordinador de Bienestar Corporativo",
    fechaAConectar: "2023-10-18",
    status: LeadStatus.CitaAgendada,
  },
  {
    empresa: "GourmetDelight Foods",
    sector: "Alimentos",
    generadorLeads: "Mario Morales",
    link: "https://gourmetdelightfoods.com",
    fechaProspeccion: "2023-10-12",
    contacto: "Paula Hernández",
    posicion: "Gerente de Experiencia Gastronómica",
    fechaAConectar: "2023-10-19",
    status: LeadStatus.CitaValidada,
  },
  {
    empresa: "PrimeLogistics Group",
    sector: "Logística",
    generadorLeads: "Lorena Vargas",
    link: "https://primelogisticsgroup.com",
    fechaProspeccion: "2023-10-13",
    contacto: "Fernando López",
    posicion: "Director de Optimización Logística",
    fechaAConectar: "2023-10-20",
    status: LeadStatus.Contacto,
  },
  {
    empresa: "FutureGen Education",
    sector: "Educación",
    generadorLeads: "Juan Carlos Ramírez",
    link: "https://futuregeneducation.com",
    fechaProspeccion: "2023-10-14",
    contacto: "Adriana Díaz",
    posicion: "Directora de Educación Futura",
    fechaAConectar: "2023-10-21",
    status: LeadStatus.SocialSelling,
  },
];

export interface Parent {
  id: number;
  name: string;
  students: string[];
  email: string;
  phone: string;
  address: string;
}

export enum Role {
  reclutador = "Reclutador",
  generadorLeads = "GL",
  admin = "Admin",
}
export enum Status {
  active = "Activo",
  inactive = "Inactivo",
}

export interface User {
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

export const UsersData: User[] = [
  {
    id: 1,
    UserId: "1234567890",
    age: 33,
    name: "John Doe",
    email: "john@doe.com",
    photo:
      "https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    rol: Role.reclutador,
    status: Status.active,
    placements: 3,
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 2,
    age: 23,
    UserId: "1234567890",
    name: "Jane Doe",
    email: "jane@doe.com",
    photo:
      "https://images.pexels.com/photos/936126/pexels-photo-936126.jpeg?auto=compress&cs=tinysrgb&w=1200",
    phone: "1234567890",
    rol: Role.reclutador,
    status: Status.active,
    placements: 43,
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 3,
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
    id: 4,
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
    id: 5,
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
    id: 6,
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
    id: 7,
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
    id: 8,
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
    id: 9,
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
    id: 10,
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
    id: 11,
    UserId: "1234567890",
    name: "John Glover",
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
  nombre: string;
  cuenta: string;
  asignadas: number;
  perdidas: number;
  canceladas: number;
  placements: number;
  tp_placement: number;
  cliente: string;
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
  comentarios: string[];
}

export const clientesData: Cliente[] = [
  {
    id: 1,
    clienteId: "1234567890",
    origen: "Referido",
    nombre: "Takeda",
    cuenta: "Zendesk",
    cliente: "Zendesk",
    asignadas: 30,
    perdidas: 9,
    canceladas: 14,
    placements: 7,
    tp_placement: 155.88,
    contactos: [
      {
        celular: "55 2247 2270",
        correo: "amairy.correa@zendesk.com",
        nombre: "Amalia",
        puesto: "Dr General",
      },
      {
        celular: "55 2247 2270",
        correo: "amairy.correa@zendesk.com",
        nombre: "Amalia",
        puesto: "Dr General",
      },
    ],
    modalidad: "Anticipo",
    fee: 17,
    dias_credito: 30,
    tipo_factura: "PPD",
    razon_social: "Zendesk",
    regimen: "S. DE R.L. DE C.V.",
    tipo: "Persona Moral ",
    rfc: "ZEN1704209I4",
    cp: "11560",
    como_factura: "Mail a CXP",
    comentarios: ["todo bien"],
  },
  {
    id: 2,
    clienteId: "0987654321",
    origen: "Linkedin",
    nombre: "Amazon",
    cuenta: "AWS",
    cliente: "AWS",
    asignadas: 50,
    perdidas: 5,
    canceladas: 8,
    placements: 12,
    tp_placement: 250.5,
    contactos: [
      {
        celular: "55 1234 5678",
        correo: "juan.perez@amazon.com",
        nombre: "Juan",
        puesto: "Gerente de Operaciones",
      },
      {
        celular: "55 8765 4321",
        correo: "maria.gomez@amazon.com",
        nombre: "María",
        puesto: "Especialista en Facturación",
      },
    ],
    modalidad: "Anticipo",
    fee: 15,
    dias_credito: 45,
    tipo_factura: "PUE",
    razon_social: "Amazon Web Services",
    regimen: "S.A. DE C.V.",
    tipo: "Persona Moral",
    rfc: "AMZ010101ABC",
    cp: "06600",
    como_factura: "Portal en línea",
    comentarios: ["Excelente comunicación", "Siempre paga a tiempo"],
  },
  {
    id: 3,
    clienteId: "1122334455",
    origen: "Publicidad",
    nombre: "Google",
    cuenta: "GCP",
    cliente: "Google Cloud ",
    asignadas: 40,
    perdidas: 10,
    canceladas: 5,
    placements: 15,
    tp_placement: 300.0,
    contactos: [
      {
        celular: "55 9876 5432",
        correo: "carlos.rodriguez@google.com",
        nombre: "Carlos",
        puesto: "Director de Proyectos",
      },
      {
        celular: "55 3333 4444",
        correo: "ana.martinez@google.com",
        nombre: "Ana",
        puesto: "Coordinadora de Ventas",
      },
    ],
    modalidad: "Crédito",
    fee: 20,
    dias_credito: 60,
    tipo_factura: "PPD",
    razon_social: "Google Cloud ",
    regimen: "S.A.B. DE C.V.",
    tipo: "Persona Moral",
    rfc: "GOO987654321",
    cp: "11590",
    como_factura: "XML por correo",
    comentarios: [
      "Gran oportunidad de crecimiento",
      "Requiere seguimiento constante",
    ],
  },
  {
    id: 4,
    clienteId: "9988776655",
    origen: "Referido",
    nombre: "Microsoft",
    cuenta: "Azure",
    cliente: "Microsoft Azure",
    asignadas: 25,
    perdidas: 3,
    canceladas: 7,
    placements: 10,
    tp_placement: 200.75,
    contactos: [
      {
        celular: "55 5555 6666",
        correo: "luis.torres@microsoft.com",
        nombre: "Luis",
        puesto: "Arquitecto de Soluciones",
      },
      {
        celular: "55 7777 8888",
        correo: "sofia.lopez@microsoft.com",
        nombre: "Sofía",
        puesto: "Analista Financiero",
      },
    ],
    modalidad: "Anticipo",
    fee: 18,
    dias_credito: 30,
    tipo_factura: "PUE",
    razon_social: "Microsoft Azure",
    regimen: "S.A. DE C.V.",
    tipo: "Persona Moral",
    rfc: "MIC010101XYZ",
    cp: "03810",
    como_factura: "Facturación electrónica",
    comentarios: ["Muy profesional", "Cumple con los plazos acordados"],
  },
  {
    id: 5,
    clienteId: "4455667788",
    origen: "Cold Call",
    nombre: "Tesla",
    cuenta: "Energy",
    cliente: "Tesla Energy",
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
    tipo: "Persona Moral",
    rfc: "TES987654321",
    cp: "11310",
    como_factura: "Correo electrónico",
    comentarios: [
      "Innovadores en su campo",
      "Necesita mejor estructura contractual",
    ],
  },
  {
    id: 6,
    clienteId: "6677889900",
    origen: "Evento",
    nombre: "Oracle",
    cuenta: "Cloud",
    cliente: "Oracle Cloud",
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
    tipo: "Persona Moral",
    rfc: "ORA010101DEF",
    cp: "06100",
    como_factura: "Portal de proveedores",
    comentarios: ["Cliente estratégico", "Demanda atención personalizada"],
  },
];

export const parentsData: Parent[] = [
  {
    id: 1,
    name: "John Doe",
    students: ["Sarah Brewer"],
    email: "john@doe.com",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 2,
    name: "Jane Doe",
    students: ["Cecilia Bradley"],
    email: "jane@doe.com",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 3,
    name: "Mike Geller",
    students: ["Fanny Caldwell"],
    email: "mike@geller.com",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 4,
    name: "Jay French",
    students: ["Mollie Fitzgerald", "Ian Bryant"],
    email: "mike@geller.com",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 5,
    name: "Jane Smith",
    students: ["Mable Harvey"],
    email: "mike@geller.com",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 6,
    name: "Anna Santiago",
    students: ["Joel Lambert"],
    email: "mike@geller.com",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 7,
    name: "Allen Black",
    students: ["Carrie Tucker", "Lilly Underwood"],
    email: "mike@geller.com",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 8,
    name: "Ophelia Castro",
    students: ["Alexander Blair"],
    email: "mike@geller.com",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 9,
    name: "Derek Briggs",
    students: ["Susan Webster", "Maude Stone"],
    email: "mike@geller.com",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
  },
  {
    id: 10,
    name: "John Glover",
    students: ["Stella Scott"],
    email: "mike@geller.com",
    phone: "1234567890",
    address: "123 Main St, Anytown, USA",
  },
];

export const subjectsData = [
  {
    id: 1,
    name: "Math",
    teachers: ["Alice Phelps", "Russell Davidson"],
  },
  {
    id: 2,
    name: "English",
    teachers: ["Manuel Becker", "Eddie Chavez"],
  },
  {
    id: 3,
    name: "Physics",
    teachers: ["Lola Newman", "Darrell Delgado"],
  },
  {
    id: 4,
    name: "Chemistry",
    teachers: ["Nathan Kelly", "Benjamin Snyder"],
  },
  {
    id: 5,
    name: "Biology",
    teachers: ["Alma Benson", "Lina Collier"],
  },
  {
    id: 6,
    name: "History",
    teachers: ["Hannah Bowman", "Betty Obrien"],
  },
  {
    id: 7,
    name: "Geography",
    teachers: ["Lora French", "Sue Brady"],
  },
  {
    id: 8,
    name: "Art",
    teachers: ["Harriet Alvarado", "Mayme Keller"],
  },
  {
    id: 9,
    name: "Music",
    teachers: ["Gertrude Roy", "Rosa Singleton"],
  },
  {
    id: 10,
    name: "Literature",
    teachers: ["Effie Lynch", "Brett Flowers"],
  },
];

export const classesData = [
  {
    id: 1,
    name: "1A",
    capacity: 20,
    grade: 1,
    supervisor: "Joseph Padilla",
  },
  {
    id: 2,
    name: "2B",
    capacity: 22,
    grade: 2,
    supervisor: "Blake Joseph",
  },
  {
    id: 3,
    name: "3C",
    capacity: 20,
    grade: 3,
    supervisor: "Tom Bennett",
  },
  {
    id: 4,
    name: "4B",
    capacity: 18,
    grade: 4,
    supervisor: "Aaron Collins",
  },
  {
    id: 5,
    name: "5A",
    capacity: 16,
    grade: 5,
    supervisor: "Iva Frank",
  },
  {
    id: 5,
    name: "5B",
    capacity: 20,
    grade: 5,
    supervisor: "Leila Santos",
  },
  {
    id: 7,
    name: "7A",
    capacity: 18,
    grade: 7,
    supervisor: "Carrie Walton",
  },
  {
    id: 8,
    name: "6B",
    capacity: 22,
    grade: 6,
    supervisor: "Christopher Butler",
  },
  {
    id: 9,
    name: "6C",
    capacity: 18,
    grade: 6,
    supervisor: "Marc Miller",
  },
  {
    id: 10,
    name: "6D",
    capacity: 20,
    grade: 6,
    supervisor: "Ophelia Marsh",
  },
];

export const lessonsData = [
  {
    id: 1,
    subject: "Math",
    class: "1A",
    teacher: "Tommy Wise",
  },
  {
    id: 2,
    subject: "English",
    class: "2A",
    teacher: "Rhoda Frank",
  },
  {
    id: 3,
    subject: "Science",
    class: "3A",
    teacher: "Della Dunn",
  },
  {
    id: 4,
    subject: "Social Studies",
    class: "1B",
    teacher: "Bruce Rodriguez",
  },
  {
    id: 5,
    subject: "Art",
    class: "4A",
    teacher: "Birdie Butler",
  },
  {
    id: 6,
    subject: "Music",
    class: "5A",
    teacher: "Bettie Oliver",
  },
  {
    id: 7,
    subject: "History",
    class: "6A",
    teacher: "Herman Howard",
  },
  {
    id: 8,
    subject: "Geography",
    class: "6B",
    teacher: "Lucinda Thomas",
  },
  {
    id: 9,
    subject: "Physics",
    class: "6C",
    teacher: "Ronald Roberts",
  },
  {
    id: 10,
    subject: "Chemistry",
    class: "4B",
    teacher: "Julia Pittman",
  },
];

export const examsData = [
  {
    id: 1,
    subject: "Math",
    class: "1A",
    teacher: "Martha Morris",
    date: "2025-01-01",
  },
  {
    id: 2,
    subject: "English",
    class: "2A",
    teacher: "Randall Garcia",
    date: "2025-01-01",
  },
  {
    id: 3,
    subject: "Science",
    class: "3A",
    teacher: "Myrtie Scott",
    date: "2025-01-01",
  },
  {
    id: 4,
    subject: "Social Studies",
    class: "1B",
    teacher: "Alvin Swanson",
    date: "2025-01-01",
  },
  {
    id: 5,
    subject: "Art",
    class: "4A",
    teacher: "Mabelle Wallace",
    date: "2025-01-01",
  },
  {
    id: 6,
    subject: "Music",
    class: "5A",
    teacher: "Dale Thompson",
    date: "2025-01-01",
  },
  {
    id: 7,
    subject: "History",
    class: "6A",
    teacher: "Allie Conner",
    date: "2025-01-01",
  },
  {
    id: 8,
    subject: "Geography",
    class: "6B",
    teacher: "Hunter Fuller",
    date: "2025-01-01",
  },
  {
    id: 9,
    subject: "Physics",
    class: "7A",
    teacher: "Lois Lindsey",
    date: "2025-01-01",
  },
  {
    id: 10,
    subject: "Chemistry",
    class: "8A",
    teacher: "Vera Soto",
    date: "2025-01-01",
  },
];

export const assignmentsData = [
  {
    id: 1,
    subject: "Math",
    class: "1A",
    teacher: "Anthony Boone",
    dueDate: "2025-01-01",
  },
  {
    id: 2,
    subject: "English",
    class: "2A",
    teacher: "Clifford Bowen",
    dueDate: "2025-01-01",
  },
  {
    id: 3,
    subject: "Science",
    class: "3A",
    teacher: "Catherine Malone",
    dueDate: "2025-01-01",
  },
  {
    id: 4,
    subject: "Social Studies",
    class: "1B",
    teacher: "Willie Medina",
    dueDate: "2025-01-01",
  },
  {
    id: 5,
    subject: "Art",
    class: "4A",
    teacher: "Jose Ruiz",
    dueDate: "2025-01-01",
  },
  {
    id: 6,
    subject: "Music",
    class: "5A",
    teacher: "Katharine Owens",
    dueDate: "2025-01-01",
  },
  {
    id: 7,
    subject: "History",
    class: "6A",
    teacher: "Shawn Norman",
    dueDate: "2025-01-01",
  },
  {
    id: 8,
    subject: "Geography",
    class: "6B",
    teacher: "Don Holloway",
    dueDate: "2025-01-01",
  },
  {
    id: 9,
    subject: "Physics",
    class: "7A",
    teacher: "Franklin Gregory",
    dueDate: "2025-01-01",
  },
  {
    id: 10,
    subject: "Chemistry",
    class: "8A",
    teacher: "Danny Nguyen",
    dueDate: "2025-01-01",
  },
];

export const resultsData = [
  {
    id: 1,
    subject: "Math",
    class: "1A",
    teacher: "John Doe",
    student: "John Doe",
    date: "2025-01-01",
    type: "exam",
    score: 90,
  },
  {
    id: 2,
    subject: "English",
    class: "2A",
    teacher: "John Doe",
    student: "John Doe",
    date: "2025-01-01",
    type: "exam",
    score: 90,
  },
  {
    id: 3,
    subject: "Science",
    class: "3A",
    teacher: "John Doe",
    student: "John Doe",
    date: "2025-01-01",
    type: "exam",
    score: 90,
  },
  {
    id: 4,
    subject: "Social Studies",
    class: "1B",
    teacher: "John Doe",
    student: "John Doe",
    date: "2025-01-01",
    type: "exam",
    score: 90,
  },
  {
    id: 5,
    subject: "Art",
    class: "4A",
    teacher: "John Doe",
    student: "John Doe",
    date: "2025-01-01",
    type: "exam",
    score: 90,
  },
  {
    id: 6,
    subject: "Music",
    class: "5A",
    teacher: "John Doe",
    student: "John Doe",
    date: "2025-01-01",
    type: "exam",
    score: 90,
  },
  {
    id: 7,
    subject: "History",
    class: "6A",
    teacher: "John Doe",
    student: "John Doe",
    date: "2025-01-01",
    type: "exam",
    score: 90,
  },
  {
    id: 8,
    subject: "Geography",
    class: "6B",
    teacher: "John Doe",
    student: "John Doe",
    date: "2025-01-01",
    type: "exam",
    score: 90,
  },
  {
    id: 9,
    subject: "Physics",
    class: "7A",
    teacher: "John Doe",
    student: "John Doe",
    date: "2025-01-01",
    type: "exam",
    score: 90,
  },
  {
    id: 10,
    subject: "Chemistry",
    class: "8A",
    teacher: "John Doe",
    student: "John Doe",
    date: "2025-01-01",
    type: "exam",
    score: 90,
  },
];

export const eventsData = [
  {
    id: 1,
    title: "Lake Trip",
    class: "1A",
    date: "2025-01-01",
    startTime: "10:00",
    endTime: "11:00",
  },
  {
    id: 2,
    title: "Picnic",
    class: "2A",
    date: "2025-01-01",
    startTime: "10:00",
    endTime: "11:00",
  },
  {
    id: 3,
    title: "Beach Trip",
    class: "3A",
    date: "2025-01-01",
    startTime: "10:00",
    endTime: "11:00",
  },
  {
    id: 4,
    title: "Museum Trip",
    class: "4A",
    date: "2025-01-01",
    startTime: "10:00",
    endTime: "11:00",
  },
  {
    id: 5,
    title: "Music Concert",
    class: "5A",
    date: "2025-01-01",
    startTime: "10:00",
    endTime: "11:00",
  },
  {
    id: 6,
    title: "Magician Show",
    class: "1B",
    date: "2025-01-01",
    startTime: "10:00",
    endTime: "11:00",
  },
  {
    id: 7,
    title: "Lake Trip",
    class: "2B",
    date: "2025-01-01",
    startTime: "10:00",
    endTime: "11:00",
  },
  {
    id: 8,
    title: "Cycling Race",
    class: "3B",
    date: "2025-01-01",
    startTime: "10:00",
    endTime: "11:00",
  },
  {
    id: 9,
    title: "Art Exhibition",
    class: "4B",
    date: "2025-01-01",
    startTime: "10:00",
    endTime: "11:00",
  },
  {
    id: 10,
    title: "Sports Tournament",
    class: "5B",
    date: "2025-01-01",
    startTime: "10:00",
    endTime: "11:00",
  },
];

export const announcementsData = [
  {
    id: 1,
    title: "About 4A Math Test",
    class: "4A",
    date: "2025-01-01",
  },
  {
    id: 2,
    title: "About 3A Math Test",
    class: "3A",
    date: "2025-01-01",
  },
  {
    id: 3,
    title: "About 3B Math Test",
    class: "3B",
    date: "2025-01-01",
  },
  {
    id: 4,
    title: "About 6A Math Test",
    class: "6A",
    date: "2025-01-01",
  },
  {
    id: 5,
    title: "About 8C Math Test",
    class: "8C",
    date: "2025-01-01",
  },
  {
    id: 6,
    title: "About 2A Math Test",
    class: "2A",
    date: "2025-01-01",
  },
  {
    id: 7,
    title: "About 4C Math Test",
    class: "4C",
    date: "2025-01-01",
  },
  {
    id: 8,
    title: "About 4B Math Test",
    class: "4B",
    date: "2025-01-01",
  },
  {
    id: 9,
    title: "About 3C Math Test",
    class: "3C",
    date: "2025-01-01",
  },
  {
    id: 10,
    title: "About 1C Math Test",
    class: "1C",
    date: "2025-01-01",
  },
];

// YOU SHOULD CHANGE THE DATES OF THE EVENTS TO THE CURRENT DATE TO SEE THE EVENTS ON THE CALENDAR
export const calendarEvents: Event[] = [
  {
    title: "Math",
    allDay: false,
    start: new Date(2025, 0, 30, 8, 0),
    end: new Date(2025, 0, 30, 8, 45),
  },
  {
    title: "English",
    allDay: false,
    start: new Date(2025, 0, 30, 9, 0),
    end: new Date(2025, 0, 30, 9, 45),
  },
  {
    title: "Biology",
    allDay: false,
    start: new Date(2025, 0, 30, 10, 0),
    end: new Date(2025, 0, 30, 10, 45),
  },
  {
    title: "Physics",
    allDay: false,
    start: new Date(2025, 0, 30, 11, 0),
    end: new Date(2025, 0, 30, 11, 45),
  },
  {
    title: "Chemistry",
    allDay: false,
    start: new Date(2025, 1, 12, 13, 0),
    end: new Date(2025, 1, 12, 13, 45),
  },
  {
    title: "History",
    allDay: false,
    start: new Date(2025, 1, 12, 14, 0),
    end: new Date(2025, 1, 12, 14, 45),
  },
  {
    title: "English",
    allDay: false,
    start: new Date(2025, 1, 13, 9, 0),
    end: new Date(2025, 1, 13, 9, 45),
  },
  {
    title: "Biology",
    allDay: false,
    start: new Date(2025, 1, 13, 10, 0),
    end: new Date(2025, 1, 13, 10, 45),
  },
  {
    title: "Physics",
    allDay: false,
    start: new Date(2025, 1, 13, 11, 0),
    end: new Date(2025, 1, 13, 11, 45),
  },

  {
    title: "History",
    allDay: false,
    start: new Date(2025, 1, 13, 14, 0),
    end: new Date(2025, 1, 13, 14, 45),
  },
  {
    title: "Math",
    allDay: false,
    start: new Date(2025, 1, 14, 8, 0),
    end: new Date(2025, 1, 14, 8, 45),
  },
  {
    title: "Biology",
    allDay: false,
    start: new Date(2025, 1, 14, 10, 0),
    end: new Date(2025, 1, 14, 10, 45),
  },

  {
    title: "Chemistry",
    allDay: false,
    start: new Date(2025, 1, 14, 13, 0),
    end: new Date(2025, 1, 14, 13, 45),
  },
  {
    title: "History",
    allDay: false,
    start: new Date(2025, 1, 14, 14, 0),
    end: new Date(2025, 1, 13, 14, 45),
  },
  {
    title: "English",
    allDay: false,
    start: new Date(2025, 1, 15, 9, 0),
    end: new Date(2025, 1, 15, 9, 45),
  },
  {
    title: "Biology",
    allDay: false,
    start: new Date(2025, 1, 15, 10, 0),
    end: new Date(2025, 1, 15, 10, 45),
  },
  {
    title: "Physics",
    allDay: false,
    start: new Date(2025, 1, 15, 11, 0),
    end: new Date(2025, 1, 15, 11, 45),
  },
  {
    title: "History",
    allDay: false,
    start: new Date(2025, 1, 15, 14, 0),
    end: new Date(2025, 1, 15, 14, 45),
  },
  {
    title: "Math",
    allDay: false,
    start: new Date(2025, 1, 16, 8, 0),
    end: new Date(2025, 1, 16, 8, 45),
  },
  {
    title: "English",
    allDay: false,
    start: new Date(2025, 1, 16, 9, 0),
    end: new Date(2025, 1, 16, 9, 45),
  },
  {
    title: "Physics",
    allDay: false,
    start: new Date(2025, 1, 16, 11, 0),
    end: new Date(2025, 1, 16, 11, 45),
  },
  {
    title: "Chemistry",
    allDay: false,
    start: new Date(2025, 1, 31, 13, 0),
    end: new Date(2025, 1, 31, 13, 45),
  },
  {
    title: "History",
    allDay: false,
    start: new Date(2025, 1, 31, 14, 0),
    end: new Date(2025, 1, 31, 14, 45),
  },
];
