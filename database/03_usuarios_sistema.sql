-- =====================================================================
-- OPCIONAL: tabla de credenciales para el inicio de sesión validado en Oracle.
-- Si existe, el backend (POST /api/login) valida contra ella; si no existe,
-- valida contra los usuarios de demostración del servidor.
-- Las contraseñas se guardan como hash scrypt + salt (nunca en texto plano).
-- =====================================================================
CREATE TABLE UsuarioSistema
    (
     usuario                   VARCHAR2 (30)  NOT NULL ,
     claveHash                 VARCHAR2 (64)  NOT NULL ,
     salt                      VARCHAR2 (32)  NOT NULL ,
     rol                       VARCHAR2 (20)  NOT NULL ,
     nombreVisible             VARCHAR2 (60) ,
     Restaurante_idRestaurante INTEGER ,
     Cliente_numeroDocumento   VARCHAR2 (100) ,
     activo                    NUMBER (1) DEFAULT 1 NOT NULL ,
     fechaCreacion             DATE DEFAULT SYSDATE NOT NULL ,
     CONSTRAINT UsuarioSistema_PK PRIMARY KEY ( usuario ) ,
     CONSTRAINT UsuarioSistema_rol_CK CHECK ( rol IN ('Administrador', 'Gerente', 'Turista') ) ,
     CONSTRAINT UsuarioSistema_activo_CK CHECK ( activo IN (0, 1) ) ,
     CONSTRAINT UsuarioSistema_Restaurante_FK FOREIGN KEY ( Restaurante_idRestaurante ) REFERENCES Restaurante ( idRestaurante ) ,
     CONSTRAINT UsuarioSistema_Cliente_FK FOREIGN KEY ( Cliente_numeroDocumento ) REFERENCES Cliente ( numeroDocumento )
    )
;

INSERT INTO UsuarioSistema (usuario, claveHash, salt, rol, nombreVisible, Restaurante_idRestaurante, Cliente_numeroDocumento, activo, fechaCreacion)
VALUES ('admin', '6b1f9607fd5848f7af5c75c187c8bd8ca190032f7e9656269528dfbf3762c356', 'df92daddf82a25da9587bbc455b40919', 'Administrador', 'Administrador General', NULL, NULL, 1, SYSDATE);
INSERT INTO UsuarioSistema (usuario, claveHash, salt, rol, nombreVisible, Restaurante_idRestaurante, Cliente_numeroDocumento, activo, fechaCreacion)
VALUES ('gerente.salento', 'ac2248855945fee7dcdb9d35a456b580f9df384e0dc6328df5eb65efd7cff387', '9240fd9a7b9eeade4d3c9663295dd016', 'Gerente', 'Carlos Ramírez', 1, NULL, 1, SYSDATE);
INSERT INTO UsuarioSistema (usuario, claveHash, salt, rol, nombreVisible, Restaurante_idRestaurante, Cliente_numeroDocumento, activo, fechaCreacion)
VALUES ('gerente.cartagena', 'e194c378b909535dd1dd23788c03517976e0ba5beba13c918fae05b11379668c', 'b55d00f4da2a6d1370c251d3d8666ae1', 'Gerente', 'Mariana Pérez', 2, NULL, 1, SYSDATE);
INSERT INTO UsuarioSistema (usuario, claveHash, salt, rol, nombreVisible, Restaurante_idRestaurante, Cliente_numeroDocumento, activo, fechaCreacion)
VALUES ('turista.carlos', '6fe3781a04c46bc2e8ba5873a39715b658da9c65ecf97bb03e0b0fed464f0885', '6de63916ea6c6609872448f0c41a0a3d', 'Turista', 'Carlos Mendoza', NULL, 'PE4587123', 1, SYSDATE);

COMMIT;
