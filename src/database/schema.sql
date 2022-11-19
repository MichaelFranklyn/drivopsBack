drop table if exists manager;

create table manager (
	id serial primary key,
  	nome text NOT NULL unique,
  	senha text NOT NULL unique
);

drop table if exists cars;

create table cars (
	id serial primary key,
  	nome text NOT NULL unique,
  	marca text NOT NULL,
  	quantidade text NOT NULL,
	valor text NOT NULL
);

drop table if exists sellers;

create table sellers (
	id serial primary key,
  	nome text NOT NULL unique,
  	email text NOT NULL unique
);

drop table if exists sales;

create table sales (
	id serial primary key,
	id_car integer not null references cars(id),
	id_seller integer not null references sellers(id),
	valor_carro text not null,
	desconto text not null,
  	valor_venda text not Null,
  	data_venda timestamp not null
);