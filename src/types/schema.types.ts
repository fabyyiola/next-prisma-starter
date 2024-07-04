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
	NombreConyuge?: string;
	TelefonoConyuge?: string;
	CURP: string;
	RFC: string;
	AptoMedico: Date;
	Licencia: Date;
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
	VerMecanica: Date;
	VerContaminantes: Date;
	VerUS: Date;
	PolizaUS: Date;
	PolizaMX: Date;
  }
  
  // Usuarios
  export interface Usuario {
	ID:number;
	Nombre: string;
	Email: string;
	Accesos: string;
	Administrador: boolean;
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
  