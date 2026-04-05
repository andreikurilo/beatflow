create table users
(
    id            uuid primary key,
    email         varchar(255) unique not null,
    password_hash varchar(255)        not null,
    created_at    timestamp           not null
);

create table roles
(
    id   serial primary key,
    name varchar(50) unique not null
);

create table user_roles
(
    user_id uuid references users (id),
    role_id int references roles (id),
    primary key (user_id, role_id)
);

create table refresh_tokens
(
    id         uuid primary key,
    user_id    uuid references users (id),
    token_hash varchar(255) not null,
    expires_at timestamp    not null,
    revoked    boolean default false
);

insert into roles(name)
values ('USER'),
       ('ADMIN');