USE calculator;

CREATE TABLE role(
	id INT(11) PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    status CHAR(1) default 1
);

INSERT INTO role (name) VALUES ('Chofer'), ('Cargador'), ('Auxiliar');
-- SELECT * FROM role;

CREATE TABLE typeEmployer(
	id INT(11) PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    status CHAR(1) default 1
);

INSERT INTO typeEmployer (name) VALUES ('Interno'), ('Externo');

CREATE TABLE employer(
	id INT(11) PRIMARY KEY AUTO_INCREMENT,
    name varchar(60) NOT NULL,
    lastName varchar(60) NOT NULL,
    roleId INT(11) NOT NULL,
    typeEmployerId INT(11) NOT NULL,
    createdAt DATETIME DEFAULT NOW(),
    updatedAt DATETIME,
    status CHAR(1) default 1,
	FOREIGN KEY(roleId) REFERENCES role(id),
    FOREIGN KEY(typeEmployerId) REFERENCES typeEmployer(id)
);

CREATE TABLE movements(
	id INT(11) PRIMARY KEY AUTO_INCREMENT,
    employerId	INT(11) NOT NULL,
    dateMovement DATE NOT NULL,
	quantityDeliveries INT NOT NULL,
    coverShifts CHAR(1) DEFAULT 0,
    daysCovered INT(2),
    roleCoveredId INT,
    amountByMonth DECIMAL(16,4),
    amountByDelivery DECIMAL(16,4),
    bonus DECIMAL(16,4),
    amountToPayment DECIMAL(16,4),
    sumAmounts DECIMAL(16,4),
    amountVouchers DECIMAL(16,4),
    total DECIMAL(16,4),
    createdAt DATETIME DEFAULT NOW(),
    FOREIGN KEY (employerId) REFERENCES employer(id),
    FOREIGN KEY (roleCoveredId) REFERENCES Role(id)
);
-- DROP TABLE movements;

