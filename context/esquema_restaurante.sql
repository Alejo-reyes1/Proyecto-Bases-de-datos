-- Generado por Oracle SQL Developer Data Modeler 24.3.1.351.0831
--   en:        2026-11-05 16:35:01 COT
--   sitio:      Oracle Database 21c
--   tipo:      Oracle Database 21c



-- predefined type, no DDL - MDSYS.SDO_GEOMETRY

-- predefined type, no DDL - XMLTYPE

CREATE TABLE Administrador 
    ( 
     Personal_numeroDocumento VARCHAR2 (100)  NOT NULL , 
     aniosExperiencia         INTEGER 
    ) 
;

ALTER TABLE Administrador 
    ADD CONSTRAINT Administrador_PK PRIMARY KEY ( Personal_numeroDocumento ) ;

CREATE TABLE CartaMenu 
    ( 
     idCategoria               INTEGER  NOT NULL , 
     nombrecategoria           VARCHAR2 (20) , 
     Restaurante_idRestaurante INTEGER  NOT NULL 
    ) 
;

ALTER TABLE CartaMenu 
    ADD CONSTRAINT CategoriaMenu_PK PRIMARY KEY ( idCategoria ) ;

CREATE TABLE Chef 
    ( 
     Personal_numeroDocumento VARCHAR2 (100)  NOT NULL , 
     especialidad             VARCHAR2 (50) 
    ) 
;

ALTER TABLE Chef 
    ADD CONSTRAINT Chef_PK PRIMARY KEY ( Personal_numeroDocumento ) ;

CREATE TABLE Ciudad 
    ( 
     idCiudad                    INTEGER  NOT NULL , 
     nombre                      VARCHAR2 (100) , 
     Departamento_idDepartamento INTEGER  NOT NULL 
    ) 
;

ALTER TABLE Ciudad 
    ADD CONSTRAINT Ciudad_PK PRIMARY KEY ( idCiudad ) ;

CREATE TABLE Cliente 
    ( 
     numeroDocumento               VARCHAR2 (100)  NOT NULL , 
     Nombre                        VARCHAR2 (20) , 
     apellido                      VARCHAR2 (20) , 
     email                         VARCHAR2 (50) , 
     telefono                      VARCHAR2 (20) , 
     paisOrigen                    VARCHAR2 (20) , 
     TipoDocumento_idTipoDocumento INTEGER  NOT NULL 
    ) 
;

ALTER TABLE Cliente 
    ADD CONSTRAINT Cliente_PK PRIMARY KEY ( numeroDocumento ) ;

CREATE TABLE Departamento 
    ( 
     idDepartamento INTEGER  NOT NULL , 
     nombre         VARCHAR2 (100) , 
     Pais_idPais    INTEGER  NOT NULL 
    ) 
;

ALTER TABLE Departamento 
    ADD CONSTRAINT Departamento_PK PRIMARY KEY ( idDepartamento ) ;

CREATE TABLE DetalleExperienciaOrden 
    ( 
     subtotal                           NUMBER , 
     asistentes                         INTEGER , 
--  ERROR: Column name length exceeds maximum allowed length(30) 
     ExperienciaTuristica_idExperiencia INTEGER  NOT NULL , 
     Orden_idOrden                      INTEGER  NOT NULL , 
     fechaProgramada                    DATE 
    ) 
;

ALTER TABLE DetalleExperienciaOrden 
    ADD CONSTRAINT DetalleExperienciaOrden_PK PRIMARY KEY ( Orden_idOrden, ExperienciaTuristica_idExperiencia ) ;

CREATE TABLE DetalleOrden 
    ( 
     ItemMenu_idItem INTEGER  NOT NULL , 
     Orden_idOrden   INTEGER  NOT NULL , 
     cantidad        INTEGER , 
     subTotal        NUMBER 
    ) 
;

ALTER TABLE DetalleOrden 
    ADD CONSTRAINT DetalleOrden_PK PRIMARY KEY ( ItemMenu_idItem, Orden_idOrden ) ;

CREATE TABLE Estado 
    ( 
     idEstado    INTEGER  NOT NULL , 
     nombre      VARCHAR2 (100) , 
     descripcion VARCHAR2 (200) 
    ) 
;

ALTER TABLE Estado 
    ADD CONSTRAINT Estado_PK PRIMARY KEY ( idEstado ) ;

CREATE TABLE ExperienciaTuristica 
    ( 
     idExperiencia             INTEGER  NOT NULL , 
     nombreExperiencia         VARCHAR2 (50) , 
     descripcion               VARCHAR2 (100) , 
     precioPorPersona          NUMBER , 
     duracion                  NUMBER , 
     Restaurante_idRestaurante INTEGER  NOT NULL 
    ) 
;

ALTER TABLE ExperienciaTuristica 
    ADD CONSTRAINT ExperienciaTuristica_PK PRIMARY KEY ( idExperiencia ) ;

CREATE TABLE Idioma 
    ( 
     idIdioma     INTEGER  NOT NULL , 
     nombreIdioma VARCHAR2 (20) 
    ) 
;

ALTER TABLE Idioma 
    ADD CONSTRAINT Idioma_PK PRIMARY KEY ( idIdioma ) ;

CREATE TABLE ItemMenu 
    ( 
     idItem                    INTEGER  NOT NULL , 
     nombrItem                 VARCHAR2 (50) , 
     descripcionItem           VARCHAR2 (200) , 
     vegetariano               NUMBER , 
     CategoriaMenu_idCategoria INTEGER  NOT NULL , 
     precio                    NUMBER 
    ) 
;

ALTER TABLE ItemMenu 
    ADD CONSTRAINT ItemMenu_PK PRIMARY KEY ( idItem ) ;

CREATE TABLE Mesa 
    ( 
     numeroMesa                INTEGER , 
     idMesa                    INTEGER  NOT NULL , 
     capacidad                 INTEGER , 
     Restaurante_idRestaurante INTEGER  NOT NULL , 
     disponibilidad            NUMBER 
    ) 
;

ALTER TABLE Mesa 
    ADD CONSTRAINT Mesa_PK PRIMARY KEY ( idMesa ) ;

CREATE TABLE Mesero 
    ( 
     Personal_numeroDocumento VARCHAR2 (100)  NOT NULL , 
     turno                    VARCHAR2 (20) 
    ) 
;

ALTER TABLE Mesero 
    ADD CONSTRAINT Mesero_PK PRIMARY KEY ( Personal_numeroDocumento ) ;

CREATE TABLE MeseroIdioma 
    ( 
--  ERROR: Column name length exceeds maximum allowed length(30) 
     Mesero_Personal_numeroDocumento VARCHAR2 (100)  NOT NULL , 
     Idioma_idIdioma                 INTEGER  NOT NULL 
    ) 
;

ALTER TABLE MeseroIdioma 
    ADD CONSTRAINT MeseroIdioma_PK PRIMARY KEY ( Mesero_Personal_numeroDocumento, Idioma_idIdioma ) ;

CREATE TABLE MetodoPago 
    ( 
     idMetodoPago INTEGER  NOT NULL , 
     nombre       VARCHAR2 (100) 
    ) 
;

ALTER TABLE MetodoPago 
    ADD CONSTRAINT MetodoPago_PK PRIMARY KEY ( idMetodoPago ) ;

CREATE TABLE Orden 
    ( 
     idOrden                 INTEGER  NOT NULL , 
     Cliente_numeroDocumento VARCHAR2 (100)  NOT NULL , 
     total                   NUMBER , 
     fecha                   DATE , 
     Estado_idEstado         INTEGER  NOT NULL 
    ) 
;

ALTER TABLE Orden 
    ADD CONSTRAINT Orden_PK PRIMARY KEY ( idOrden ) ;

CREATE TABLE OrdenDomicilio 
    ( 
     direccionEntrega                    VARCHAR2 (100) , 
     Orden_idOrden                       INTEGER  NOT NULL , 
     costoDomicilio                      NUMBER , 
--  ERROR: Column name length exceeds maximum allowed length(30) 
     Repartidor_Personal_numeroDocumento VARCHAR2 (100)  NOT NULL 
    ) 
;

ALTER TABLE OrdenDomicilio 
    ADD CONSTRAINT OrdenDelivery_PK PRIMARY KEY ( Orden_idOrden ) ;

CREATE TABLE OrdenRestaurante 
    ( 
     Orden_idOrden                   INTEGER  NOT NULL , 
--  ERROR: Column name length exceeds maximum allowed length(30) 
     Mesero_Personal_numeroDocumento VARCHAR2 (100)  NOT NULL , 
     Mesa_idMesa                     INTEGER  NOT NULL 
    ) 
;

ALTER TABLE OrdenRestaurante 
    ADD CONSTRAINT OrdenRestaurante_PK PRIMARY KEY ( Orden_idOrden ) ;

CREATE TABLE Pago 
    ( 
     idPago        INTEGER  NOT NULL , 
     monedaPago    VARCHAR2 (10) , 
     totalPagado   NUMBER , 
     propina       NUMBER , 
     fechaPago     DATE , 
     Orden_idOrden INTEGER  NOT NULL 
    ) 
;

ALTER TABLE Pago 
    ADD CONSTRAINT Pago_PK PRIMARY KEY ( idPago ) ;

CREATE TABLE PagoMetodoPago 
    ( 
     Pago_idPago             INTEGER  NOT NULL , 
     MetodoPago_idMetodoPago INTEGER  NOT NULL 
    ) 
;

ALTER TABLE PagoMetodoPago 
    ADD CONSTRAINT PagoMetodoPago_PK PRIMARY KEY ( Pago_idPago, MetodoPago_idMetodoPago ) ;

CREATE TABLE Pais 
    ( 
     idPais INTEGER  NOT NULL , 
     nombre VARCHAR2 (100) 
    ) 
;

ALTER TABLE Pais 
    ADD CONSTRAINT Pais_PK PRIMARY KEY ( idPais ) ;

CREATE TABLE Personal 
    ( 
     numeroDocumento               VARCHAR2 (100)  NOT NULL , 
     Nombre                        VARCHAR2 (20) , 
     apellido                      VARCHAR2 (20) , 
     telefono                      VARCHAR2 (20) , 
     direccion                     VARCHAR2 (100) , 
     email                         VARCHAR2 (50) , 
     fechaContratacion             DATE , 
     Restaurante_idRestaurante     INTEGER  NOT NULL , 
     TipoDocumento_idTipoDocumento INTEGER  NOT NULL 
    ) 
;

ALTER TABLE Personal 
    ADD CONSTRAINT Personal_PK PRIMARY KEY ( numeroDocumento ) ;

CREATE TABLE PeticionEspecial 
    ( 
     idPeticion  INTEGER  NOT NULL , 
     nombre      VARCHAR2 (50) , 
     descripcion VARCHAR2 (200) 
    ) 
;

ALTER TABLE PeticionEspecial 
    ADD CONSTRAINT PeticionEspecial_PK PRIMARY KEY ( idPeticion ) ;

CREATE TABLE Repartidor 
    ( 
     Personal_numeroDocumento VARCHAR2 (100)  NOT NULL , 
     medioTransporte          VARCHAR2 (50) 
    ) 
;

ALTER TABLE Repartidor 
    ADD CONSTRAINT Repartidor_PK PRIMARY KEY ( Personal_numeroDocumento ) ;

CREATE TABLE Resena 
    ( 
     idResena                  INTEGER  NOT NULL , 
     puntuacionComida          NUMBER , 
     puntuacionServicio        NUMBER , 
     comentario                VARCHAR2 (100) , 
     fechaPublicacion          DATE , 
     Restaurante_idRestaurante INTEGER  NOT NULL , 
     Cliente_numeroDocumento   VARCHAR2 (100)  NOT NULL 
    ) 
;

ALTER TABLE Resena 
    ADD CONSTRAINT Resena_PK PRIMARY KEY ( idResena ) ;

CREATE TABLE Reserva 
    ( 
     idReserva                 INTEGER  NOT NULL , 
     fechaReserva              DATE , 
     cantidadPersonas          INTEGER , 
     Cliente_numeroDocumento   VARCHAR2 (100)  NOT NULL , 
     Restaurante_idRestaurante INTEGER  NOT NULL , 
     Estado_idEstado           INTEGER  NOT NULL 
    ) 
;

ALTER TABLE Reserva 
    ADD CONSTRAINT Reserva_PK PRIMARY KEY ( idReserva ) ;

CREATE TABLE ReservaPeticionesEsp 
    ( 
     Reserva_idReserva           INTEGER  NOT NULL , 
     PeticionEspecial_idPeticion INTEGER  NOT NULL 
    ) 
;

ALTER TABLE ReservaPeticionesEsp 
    ADD CONSTRAINT ReservaPeticionesEsp_PK PRIMARY KEY ( Reserva_idReserva, PeticionEspecial_idPeticion ) ;

CREATE TABLE Restaurante 
    ( 
     idRestaurante   INTEGER  NOT NULL , 
     nit             VARCHAR2 (20) , 
     nombre          VARCHAR2 (50) , 
     direccion       VARCHAR2 (100) , 
     categoriaCocina VARCHAR2 (100) , 
     horaApertura    DATE , 
     horaCierre      DATE , 
     Ciudad_idCiudad INTEGER  NOT NULL 
    ) 
;

ALTER TABLE Restaurante 
    ADD CONSTRAINT Restaurante_PK PRIMARY KEY ( idRestaurante ) ;

CREATE TABLE TipoDocumento 
    ( 
     idTipoDocumento INTEGER  NOT NULL , 
     nombre          VARCHAR2 (100) 
    ) 
;

ALTER TABLE TipoDocumento 
    ADD CONSTRAINT TipoDocumento_PK PRIMARY KEY ( idTipoDocumento ) ;

ALTER TABLE Administrador 
    ADD CONSTRAINT Administrador_Personal_FK FOREIGN KEY 
    ( 
     Personal_numeroDocumento
    ) 
    REFERENCES Personal 
    ( 
     numeroDocumento
    ) 
;

ALTER TABLE CartaMenu 
    ADD CONSTRAINT CategoriaMenu_Restaurante_FK FOREIGN KEY 
    ( 
     Restaurante_idRestaurante
    ) 
    REFERENCES Restaurante 
    ( 
     idRestaurante
    ) 
;

ALTER TABLE Chef 
    ADD CONSTRAINT Chef_Personal_FK FOREIGN KEY 
    ( 
     Personal_numeroDocumento
    ) 
    REFERENCES Personal 
    ( 
     numeroDocumento
    ) 
;

ALTER TABLE Ciudad 
    ADD CONSTRAINT Ciudad_Departamento_FK FOREIGN KEY 
    ( 
     Departamento_idDepartamento
    ) 
    REFERENCES Departamento 
    ( 
     idDepartamento
    ) 
;

ALTER TABLE Cliente 
    ADD CONSTRAINT Cliente_TipoDocumento_FK FOREIGN KEY 
    ( 
     TipoDocumento_idTipoDocumento
    ) 
    REFERENCES TipoDocumento 
    ( 
     idTipoDocumento
    ) 
;

ALTER TABLE Departamento 
    ADD CONSTRAINT Departamento_Pais_FK FOREIGN KEY 
    ( 
     Pais_idPais
    ) 
    REFERENCES Pais 
    ( 
     idPais
    ) 
;

--  ERROR: FK name length exceeds maximum allowed length(30) 
ALTER TABLE DetalleExperienciaOrden 
    ADD CONSTRAINT DetalleExperienciaOrden_ExperienciaTuristica_FK FOREIGN KEY 
    ( 
     ExperienciaTuristica_idExperiencia
    ) 
    REFERENCES ExperienciaTuristica 
    ( 
     idExperiencia
    ) 
;

--  ERROR: FK name length exceeds maximum allowed length(30) 
ALTER TABLE DetalleExperienciaOrden 
    ADD CONSTRAINT DetalleExperienciaOrden_Orden_FK FOREIGN KEY 
    ( 
     Orden_idOrden
    ) 
    REFERENCES Orden 
    ( 
     idOrden
    ) 
;

ALTER TABLE DetalleOrden 
    ADD CONSTRAINT DetalleOrden_ItemMenu_FK FOREIGN KEY 
    ( 
     ItemMenu_idItem
    ) 
    REFERENCES ItemMenu 
    ( 
     idItem
    ) 
;

ALTER TABLE DetalleOrden 
    ADD CONSTRAINT DetalleOrden_Orden_FK FOREIGN KEY 
    ( 
     Orden_idOrden
    ) 
    REFERENCES Orden 
    ( 
     idOrden
    ) 
;

--  ERROR: FK name length exceeds maximum allowed length(30) 
ALTER TABLE ExperienciaTuristica 
    ADD CONSTRAINT ExperienciaTuristica_Restaurante_FK FOREIGN KEY 
    ( 
     Restaurante_idRestaurante
    ) 
    REFERENCES Restaurante 
    ( 
     idRestaurante
    ) 
;

ALTER TABLE ItemMenu 
    ADD CONSTRAINT ItemMenu_CategoriaMenu_FK FOREIGN KEY 
    ( 
     CategoriaMenu_idCategoria
    ) 
    REFERENCES CartaMenu 
    ( 
     idCategoria
    ) 
;

ALTER TABLE Mesa 
    ADD CONSTRAINT Mesa_Restaurante_FK FOREIGN KEY 
    ( 
     Restaurante_idRestaurante
    ) 
    REFERENCES Restaurante 
    ( 
     idRestaurante
    ) 
;

ALTER TABLE Mesero 
    ADD CONSTRAINT Mesero_Personal_FK FOREIGN KEY 
    ( 
     Personal_numeroDocumento
    ) 
    REFERENCES Personal 
    ( 
     numeroDocumento
    ) 
;

ALTER TABLE MeseroIdioma 
    ADD CONSTRAINT MeseroIdioma_Idioma_FK FOREIGN KEY 
    ( 
     Idioma_idIdioma
    ) 
    REFERENCES Idioma 
    ( 
     idIdioma
    ) 
;

ALTER TABLE MeseroIdioma 
    ADD CONSTRAINT MeseroIdioma_Mesero_FK FOREIGN KEY 
    ( 
     Mesero_Personal_numeroDocumento
    ) 
    REFERENCES Mesero 
    ( 
     Personal_numeroDocumento
    ) 
;

ALTER TABLE Orden 
    ADD CONSTRAINT Orden_Cliente_FK FOREIGN KEY 
    ( 
     Cliente_numeroDocumento
    ) 
    REFERENCES Cliente 
    ( 
     numeroDocumento
    ) 
;

ALTER TABLE Orden 
    ADD CONSTRAINT Orden_Estado_FK FOREIGN KEY 
    ( 
     Estado_idEstado
    ) 
    REFERENCES Estado 
    ( 
     idEstado
    ) 
;

ALTER TABLE OrdenDomicilio 
    ADD CONSTRAINT OrdenDelivery_Orden_FK FOREIGN KEY 
    ( 
     Orden_idOrden
    ) 
    REFERENCES Orden 
    ( 
     idOrden
    ) 
;

ALTER TABLE OrdenDomicilio 
    ADD CONSTRAINT OrdenDelivery_Repartidor_FK FOREIGN KEY 
    ( 
     Repartidor_Personal_numeroDocumento
    ) 
    REFERENCES Repartidor 
    ( 
     Personal_numeroDocumento
    ) 
;

ALTER TABLE OrdenRestaurante 
    ADD CONSTRAINT OrdenRestaurante_Mesa_FK FOREIGN KEY 
    ( 
     Mesa_idMesa
    ) 
    REFERENCES Mesa 
    ( 
     idMesa
    ) 
;

ALTER TABLE OrdenRestaurante 
    ADD CONSTRAINT OrdenRestaurante_Mesero_FK FOREIGN KEY 
    ( 
     Mesero_Personal_numeroDocumento
    ) 
    REFERENCES Mesero 
    ( 
     Personal_numeroDocumento
    ) 
;

ALTER TABLE OrdenRestaurante 
    ADD CONSTRAINT OrdenRestaurante_Orden_FK FOREIGN KEY 
    ( 
     Orden_idOrden
    ) 
    REFERENCES Orden 
    ( 
     idOrden
    ) 
;

ALTER TABLE Pago 
    ADD CONSTRAINT Pago_Orden_FK FOREIGN KEY 
    ( 
     Orden_idOrden
    ) 
    REFERENCES Orden 
    ( 
     idOrden
    ) 
;

ALTER TABLE PagoMetodoPago 
    ADD CONSTRAINT PagoMetodoPago_MetodoPago_FK FOREIGN KEY 
    ( 
     MetodoPago_idMetodoPago
    ) 
    REFERENCES MetodoPago 
    ( 
     idMetodoPago
    ) 
;

ALTER TABLE PagoMetodoPago 
    ADD CONSTRAINT PagoMetodoPago_Pago_FK FOREIGN KEY 
    ( 
     Pago_idPago
    ) 
    REFERENCES Pago 
    ( 
     idPago
    ) 
;

ALTER TABLE Personal 
    ADD CONSTRAINT Personal_Restaurante_FK FOREIGN KEY 
    ( 
     Restaurante_idRestaurante
    ) 
    REFERENCES Restaurante 
    ( 
     idRestaurante
    ) 
;

ALTER TABLE Personal 
    ADD CONSTRAINT Personal_TipoDocumento_FK FOREIGN KEY 
    ( 
     TipoDocumento_idTipoDocumento
    ) 
    REFERENCES TipoDocumento 
    ( 
     idTipoDocumento
    ) 
;

ALTER TABLE Repartidor 
    ADD CONSTRAINT Repartidor_Personal_FK FOREIGN KEY 
    ( 
     Personal_numeroDocumento
    ) 
    REFERENCES Personal 
    ( 
     numeroDocumento
    ) 
;

ALTER TABLE Resena 
    ADD CONSTRAINT Resena_Cliente_FK FOREIGN KEY 
    ( 
     Cliente_numeroDocumento
    ) 
    REFERENCES Cliente 
    ( 
     numeroDocumento
    ) 
;

ALTER TABLE Resena 
    ADD CONSTRAINT Resena_Restaurante_FK FOREIGN KEY 
    ( 
     Restaurante_idRestaurante
    ) 
    REFERENCES Restaurante 
    ( 
     idRestaurante
    ) 
;

ALTER TABLE Reserva 
    ADD CONSTRAINT Reserva_Cliente_FK FOREIGN KEY 
    ( 
     Cliente_numeroDocumento
    ) 
    REFERENCES Cliente 
    ( 
     numeroDocumento
    ) 
;

ALTER TABLE Reserva 
    ADD CONSTRAINT Reserva_Estado_FK FOREIGN KEY 
    ( 
     Estado_idEstado
    ) 
    REFERENCES Estado 
    ( 
     idEstado
    ) 
;

ALTER TABLE Reserva 
    ADD CONSTRAINT Reserva_Restaurante_FK FOREIGN KEY 
    ( 
     Restaurante_idRestaurante
    ) 
    REFERENCES Restaurante 
    ( 
     idRestaurante
    ) 
;

--  ERROR: FK name length exceeds maximum allowed length(30) 
ALTER TABLE ReservaPeticionesEsp 
    ADD CONSTRAINT ReservaPeticionesEsp_PeticionEspecial_FK FOREIGN KEY 
    ( 
     PeticionEspecial_idPeticion
    ) 
    REFERENCES PeticionEspecial 
    ( 
     idPeticion
    ) 
;

--  ERROR: FK name length exceeds maximum allowed length(30) 
ALTER TABLE ReservaPeticionesEsp 
    ADD CONSTRAINT ReservaPeticionesEsp_Reserva_FK FOREIGN KEY 
    ( 
     Reserva_idReserva
    ) 
    REFERENCES Reserva 
    ( 
     idReserva
    ) 
;

ALTER TABLE Restaurante 
    ADD CONSTRAINT Restaurante_Ciudad_FK FOREIGN KEY 
    ( 
     Ciudad_idCiudad
    ) 
    REFERENCES Ciudad 
    ( 
     idCiudad
    ) 
;



-- Informe de Resumen de Oracle SQL Developer Data Modeler: 
-- 
-- CREATE TABLE                            30
-- CREATE INDEX                             0
-- ALTER TABLE                             67
-- CREATE VIEW                              0
-- ALTER VIEW                               0
-- CREATE PACKAGE                           0
-- CREATE PACKAGE BODY                      0
-- CREATE PROCEDURE                         0
-- CREATE FUNCTION                          0
-- CREATE TRIGGER                           0
-- ALTER TRIGGER                            0
-- CREATE COLLECTION TYPE                   0
-- CREATE STRUCTURED TYPE                   0
-- CREATE STRUCTURED TYPE BODY              0
-- CREATE CLUSTER                           0
-- CREATE CONTEXT                           0
-- CREATE DATABASE                          0
-- CREATE DIMENSION                         0
-- CREATE DIRECTORY                         0
-- CREATE DISK GROUP                        0
-- CREATE ROLE                              0
-- CREATE ROLLBACK SEGMENT                  0
-- CREATE SEQUENCE                          0
-- CREATE MATERIALIZED VIEW                 0
-- CREATE MATERIALIZED VIEW LOG             0
-- CREATE SYNONYM                           0
-- CREATE TABLESPACE                        0
-- CREATE USER                              0
-- 
-- DROP TABLESPACE                          0
-- DROP DATABASE                            0
-- 
-- REDACTION POLICY                         0
-- 
-- ORDS DROP SCHEMA                         0
-- ORDS ENABLE SCHEMA                       0
-- ORDS ENABLE OBJECT                       0
-- 
-- ERRORS                                   9
-- WARNINGS                                 0
