// Direcciones
export interface Direccion {
	ID:number;
	Nombre: string;
	Calle: string;
	Ciudad: string;
	Estado: string;
	CodigoPostal: string;
	Referencias?: string;
  }
  
  // Empleados
  export interface Empleado {
	ID:number;
	Nombre: string;
	Direccion: string;
	Telefono: string;
	Email:string
	NombreConyuge?: string | null;
	TelefonoConyuge?: string | null;
	CURP: string;
	RFC: string;
	AptoMedico: string;
	Licencia: string;
	Tipo: string;
	SueldoSemanal: number;
  }
  
  // Unidades
  export interface Unidad {
	ID:number;
	NoEconomico: number;
	Placas: string;
	Marca: string;
	Modelo: string;
	Tipo: string;
	VerMecanica: string;
	VerContaminantes: string;
	VerUS: string;
	PolizaUS: string;
	PolizaMX: string;
  }
  
  // Usuarios
  export interface Usuario {
	ID:number;
	Nombre: string;
	Email: string;
	Accesos: string;
	Administrador: boolean;
	Estatus: string;
  }
  
  // Clientes
  export interface Cliente {
	ID:number;
	Nombre: string;
	Calle: string;
	Ciudad: string;
	Estado: string;
	CodigoPostal: string;
	RFC: string;
	RegimenFiscal: string;
  }
  
  export interface RegimenFiscal {
	ID: number;
	Nombre: string;
  }