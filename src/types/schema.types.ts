// Direcciones
export interface Direccion {
	Nombre: string;
	Calle: string;
	Ciudad: string;
	Estado: string;
	CodigoPostal: string;
	Referencias?: string;
  }
  
  // Empleados
  export interface Empleado {
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
	Nombre: string;
	Email: string;
	Accesos: string;
	Administrador: boolean;
  }
  
  // Clientes
  export interface Cliente {
	Nombre: string;
	Calle: string;
	Ciudad: string;
	Estado: string;
	CodigoPostal: string;
	RFC: string;
	RegimenFiscal: string;
  }
  