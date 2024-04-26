MWF.xApplication = MWF.xApplication || {};
MWF.xApplication.query = MWF.xApplication.query || {};
MWF.xApplication.query.ImporterDesigner = MWF.xApplication.query.ImporterDesigner || {};
MWF.xApplication.query.ImporterDesigner.LP={
	"title": "Edición de modelo de importación",
	"newView": "Crear nuevo modelo de importación",
	"property": "Propiedad",
	"item": "Elemento",
	"type": "Tipo",
	"value": "Valor",
	"importer": "Modelo de importación",
	"unnamed": "Sin título",
	"unCategory": "Sin categoría",
	"id": "Identificación",
	"name": "Nombre",
	"alias": "Alias",
	"description": "Descripción",
	"saveViewNotice": "¡Primero guarde el modelo de importación!",
	"application": "Aplicación de datos",
	"newImporter": "Nuevo modelo de importación",
	"newViewName": "Nombre del nuevo modelo de importación",
	"copy": "Copia",
	"ok": "Aceptar",
	"cancel": "Cancelar",
	"columnField": "Campo correspondiente a la columna de Excel",
	"calculateField": "Campo de cálculo",
	"action": {
		"move": "Mover",
		"delete": "Eliminar",
		"add": "Agregar"
	},
	"notice": {
		"save_success": "¡Modelo de importación guardado con éxito!",
		"saveAs_success": "¡Modelo de importación guardado exitosamente como, puede abrir el nuevo modelo en la configuración del modelo de importación!",
		"deleteColumnTitle": "Confirmar",
		"deleteColumn": "¿Está seguro de eliminar la columna actual?",
		"deleteFieldTitle": "Confirmar",
		"deleteField": "¿Está seguro de eliminar el campo actual?",
		"inputTypeError": "El tipo de datos que ha ingresado es incorrecto, ingrese nuevamente.",
		"sameKey": "El nombre del elemento que ha ingresado ya existe en el objeto, ingrese uno nuevo.",
		"emptyKey": "El nombre del elemento no puede estar vacío, ingrese uno nuevo.",
		"numberKey": "El nombre del elemento no puede ser numérico, ingrese uno nuevo.",
		"inputName": "Ingrese el nombre del modelo de importación",
		"noModifyName": "No se puede modificar el nombre o alias",
		"inputType": "Seleccione el objetivo de importación",
		"inputProcess": "Seleccione el proceso",
		"inputCategory": "Seleccione una categoría",
		"inputTable": "Seleccione una tabla personalizada",
		"deleteEventTitle": "Confirmar",
		"deleteEvent": "¿Está seguro de eliminar el evento actual?",
		"cmsNoPublisherOrNoTitleTitle": "Confirmar",
		"cmsNoPublisherOrNoTitle": "¿No se ha establecido el título o el editor, desea guardar?",
		"processNoPublisherOrNoTitleTitle": "Confirmar",
		"processNoPublisherOrNoTitle": "¿No se ha establecido el título o el iniciador, desea guardar?",
		"saveNotice": "Aviso de guardado",
		"someFieldIsEmpty": "No se ha seleccionado {text}, ¿desea continuar guardando?"
	},
	"mastInputPath": "Ingrese la ruta de datos",
	"mastInputTitle": "Ingrese el título",
	"propertyTemplate": {
		"base": "Básico",
		"event": "Evento",
		"html": "HTML",
		"json": "JSON",
		"action": "Acción",
		"select": "Seleccionar",
		"alias": "Alias",
		"id": "Identificación",
		"name": "Nombre",
		"description": "Descripción",
		"style": "Estilo",
		"attribute": "Atributo",
		"hidden": "Oculto",
		"orderNumber": "Número de ordenamiento",
		"target": "Objetivo",
		"importTarget": "Objetivo de importación",
		"cmsData": "Datos de gestión de contenido",
		"tableData": "Datos de tabla personalizados",
		"processPlatformData": "Datos de plataforma de proceso",
		"selectCategory": "Seleccionar categoría",
		"selectTable": "Seleccionar tabla personalizada",
		"selectProcess": "Seleccionar proceso",
		"processStatus": "Estado del proceso",
		"draftActivity": "Actividad de borrador (primer nodo humano)",
		"endActivity": "Actividad final",
		"enableValidation": "Habilitar validación",
		"yes": "Sí",
		"no": "No",
		"ececuter": "Ejecutor",
		"ececutablePerson": "Persona ejecutable",
		"ececutableUnit": "Organización ejecutable",
		"fieldTitle": "Título del campo",
		"data": "Datos",
		"fieldPath": "Ruta del campo",
		"valueScript": "Script de valor",
		"cmsProperty": "Propiedad de documento CMS",
		"isTitle": "¿Es un título (único)?",
		"isSummary": "¿Es un resumen (único)?",
		"isPublisher": "¿Es el creador (único)?",
		"isAuthor": "¿Es el autor?",
		"isReader": "¿Es el lector?",
		"workProperty": "Propiedad de trabajo del proceso",
		"isProcessDrafter": "¿Es el iniciador del proceso (único)?",
		"isName": "Objeto de organización",
		"fieldType": "Tipo de campo",
		"validation": "Validación",
		"allowEmpty": "Permitir valores vacíos",
		"validFieldType": "Tipo de campo validado",
		"documentType": "Tipo de documento",
		"information": "Información",
		"data1": "Datos",
		"processDrafter": "Iniciador del proceso",
		"publisher": "Creador del documento",
		"selectField": "Seleccionar columna/campo",
		"importerAsDrafter": "Identidad del usuario que realiza la importación",
		"setDrafterInField": "Establecer en la columna/campo",
		"note": "Nota:",
		"selectOrg": "Seleccione un objeto de organización",
		"selectDate": "Seleccione un tipo de fecha",
		"selectText": "Seleccione un tipo de texto",
		"publishTime": "Fecha de publicación",
		"importeTimeAsPublishTime": "El tiempo de importación es la hora de publicación",
		"titleField": "Título",
		"summaryField": "Resumen",
		"selectForm": "Especificar formulario",
		"serialField": "Número/Serie de documento",
		"startTimeField": "Fecha de inicio",
		"completeTimeField": "Fecha de finalización",
		"selectProcess1": "Seleccione un proceso primero",
		"lineBreak": "Salto de línea",
		"valueScriptNote": "Es necesario devolver el valor del campo en 'Script de valor' mediante return. Puede obtener los datos de la fila actual a importar mediante this.target; como se muestra a continuación:",
		"valueScriptImportedDataNote": "Datos brutos importados",
		"valueScriptDataNote": "Datos empresariales generados por el sistema según la configuración",
		"valueScriptDocumentNote": "Si importa documentos CMS, se generarán los datos del documento por el sistema",
		"valueScriptWorkNote": "Si importa trabajos de proceso, se generarán los datos de trabajo por el sistema",
		"idPathNote": "Al importar los datos de la tabla autoconstruida, la ruta de campo 'id' significa actualizar el registro original.",
		"excelSelectedOption": "Guión opcional",
		"checkInOption": "Verificar si está en opciones"
	},
	"formToolbar": {
		"save": "Guardar",
		"saveAs": "Guardar como",
		"autoSave": "Guardar automáticamente",
		"preview": "vista previa",
		"help": "ayuda"
	},
	"autoAddColumns": "Generar columnas a partir de la tabla de datos"
}
MWF.xApplication.query.ImporterDesigner["lp."+o2.language] = MWF.xApplication.query.ImporterDesigner.LP